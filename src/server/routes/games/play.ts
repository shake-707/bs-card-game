import { RequestHandler } from "express";
import db from "../../db/connection";
import { setCurrentPlayer } from "../../db/games/set-current-player";
import { broadcastGameState } from "./broadcast-game-state";

export const play: RequestHandler = async (req, res, next) => {
  const gameId = Number(req.params.gameId);
  // @ts-ignore
  const userId: number = req.session.user.id;
  const { selectedCardIds } = req.body as { selectedCardIds: number[] };
  try {
    const { current_value_index } = await db.one<{
      current_value_index: number;
    }>(`SELECT current_value_index FROM games WHERE id = $1`, [gameId]);
    const claimedRank = (current_value_index % 13) + 1;
    await db.none(
      `INSERT INTO game_logs
     (game_id, user_id, action, cards_count, expected_value)
   VALUES
     ($1,     $2,     $3,     $4,          $5)`,
      [
        gameId,
        userId,
        `played ${selectedCardIds.length} card(s) claiming rank ${claimedRank}`,
        selectedCardIds.length,
        claimedRank,
      ]
    );

    const { id: guId } = await db.one<{ id: number }>(
      `SELECT id FROM game_users
         WHERE game_id = $1 AND user_id = $2`,
      [gameId, userId]
    );

    const { id: systemGuId } = await db.one<{ id: number }>(
      `SELECT id FROM game_users
         WHERE game_id = $1 AND user_id = 0`,
      [gameId]
    );

    await db.none(
      `UPDATE game_cards
         SET owner_id = $(systemGuId)
       WHERE game_id = $(gameId)
         AND card_id = ANY($(selectedCardIds))
         AND owner_id = $(guId)`,
      { systemGuId, gameId, selectedCardIds, guId }
    );

    await db.none(
      `UPDATE game_users
         SET cards_placed_down = cards_placed_down + $(count)
       WHERE id = $(guId)`,
      { count: selectedCardIds.length, guId }
    );

    await db.none(
      `UPDATE games
         SET current_value_index = (current_value_index + $(count)) % 13
       WHERE id = $(gameId)`,
      { count: selectedCardIds.length, gameId }
    );

    const { next_user_id } = await db.one<{ next_user_id: number }>(
      `
      WITH me AS (
        SELECT turn_order
        FROM game_users
        WHERE game_id = $1 AND user_id = $2
      ),
      nxt AS (
        SELECT user_id
        FROM game_users
        WHERE game_id = $1
          AND user_id != 0
          AND turn_order > (SELECT turn_order FROM me)
        ORDER BY turn_order
        LIMIT 1
      ),
      firstp AS (
        SELECT user_id
        FROM game_users
        WHERE game_id = $1 AND user_id != 0
        ORDER BY turn_order
        LIMIT 1
      )
      SELECT coalesce((SELECT user_id FROM nxt),
                      (SELECT user_id FROM firstp)
                     ) AS next_user_id
      `,
      [gameId, userId]
    );

    await db.none(
      `UPDATE games
         SET current_turn = (
           SELECT turn_order - 1
           FROM game_users
           WHERE game_id = $1 AND user_id = $2
         )
       WHERE id = $1`,
      [gameId, next_user_id]
    );
    await setCurrentPlayer(gameId, next_user_id);

    await broadcastGameState(gameId, req.app.get("io"));

    res.sendStatus(200);
  } catch (err) {
    console.error("Error in play:", err);
    next(err);
  }
};
