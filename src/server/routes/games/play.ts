import { RequestHandler } from "express";
import db from "../../db/connection";
import { setCurrentPlayer } from "../../db/games/set-current-player";
import { broadcastGameState } from "./broadcast-game-state";

export const play: RequestHandler = async (req, res, next) => {
  const gameId = Number(req.params.gameId);
  // @ts-ignore
  const userId: number = req.session.user.id;
  const { selectedCardIds } = req.body as { selectedCardIds: number[] };
  console.log(selectedCardIds);

  const cards = await db.any(
  `SELECT *
   FROM cards
   WHERE id = ANY($(selectedCardIds))`,
    { selectedCardIds }
  );

 

  console.log(cards); // cards is now an array of card objects

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

    // await db.none(
    //   `UPDATE game_cards
    //      SET owner_id = $(systemGuId)
    //    WHERE game_id = $(gameId)
    //      AND card_id = ANY($(selectedCardIds))
    //      AND owner_id = $(guId)`,
    //   { systemGuId, gameId, selectedCardIds, guId }
    // );
    await db.none(
      `UPDATE game_cards
      SET owner_id = $(systemGuId),
          updated_at = NOW()
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
         SET current_value_index = (current_value_index + 1) % 13
       WHERE id = $(gameId)`,
      {  gameId }
    );

    // update turn in game
    await db.none(
      `UPDATE games
        SET current_turn = current_turn + 1
        WHERE id = $(gameId)`,
        { gameId }
    );

    const { current_turn } = await db.one<{ current_turn: number }>(
      `SELECT current_turn FROM games WHERE id = $1`,
      [gameId]
    );

    const { next_user_id } = await db.one<{ next_user_id: number }>(
      `SELECT user_id AS next_user_id
      FROM game_users
      WHERE game_id = $1
      AND turn_order = (($2 % 4) + 1)`,
      [gameId, current_turn]
    );


    console.log(`gameId = ${gameId}, next user = ${next_user_id}`);
    await setCurrentPlayer(gameId, next_user_id);

    await broadcastGameState(gameId, req.app.get("io"));

    res.sendStatus(200);
  } catch (err) {
    console.error("Error in play:", err);
    next(err);
  }
};
