import { RequestHandler } from "express";
import db from "../../db/connection";
import { broadcastGameState } from "./broadcast-game-state";
import { setCurrentPlayer } from "../../db/games/set-current-player";

export const callBs: RequestHandler = async (req, res, next) => {
  const gameId = Number(req.params.gameId);
  // @ts-ignore
  const challengerId: number = req.session.user.id;
  // @ts-ignore
  const userName = req.session.user.userName;
  console.log(`user:  ${userName}`);

  try {
// const { expected_value: claimedValue } = await db.one<{
//   expected_value: number;
// }>(
//   `SELECT expected_value
//      FROM game_logs
//     WHERE game_id = $1
//       AND action ILIKE 'played %'
//     ORDER BY created_at DESC
//     LIMIT 1`,
//   [gameId]
// );
  const { expected_value: claimedValue, cards_count: numCards} = await db.one<{
        expected_value: number;
        cards_count: number;
      }>(
        `SELECT expected_value, cards_count
        FROM game_logs
        WHERE game_id = $1
        AND action ILIKE 'played %'
        ORDER BY created_at DESC
        LIMIT 1`,
        [gameId]
      );

      console.log(`Claimed value: ${claimedValue}, card count: ${numCards}`);

    await db.none(
      `INSERT INTO game_logs
         (game_id, user_id, action, cards_count, expected_value)
       VALUES
         ($1,      $2,      $3,     $4,          $5)`,
      [
        gameId,
        challengerId,
        `called BS on last play`,
        0, 
        claimedValue, 
      ]
    );

    // const pileCards: { card_id: number; value: number }[] = await db.any(
    //   `SELECT gc.card_id, c.value
    //      FROM game_cards gc
    //      JOIN cards c   ON c.id = gc.card_id
    //     WHERE gc.game_id = $1
    //       AND gc.owner_id = (
    //         SELECT id FROM game_users WHERE game_id = $1 AND user_id = 0
    //       )`,
    //   [gameId]
    // );

    const checkPile: {cardId: number; value: number}[] = await db.any(
      `SELECT gc.card_id AS "cardId", c.value
       FROM game_cards gc
       JOIN cards c ON c.id = gc.card_id
       WHERE gc.game_id = $1
       AND gc.owner_id = (SELECT id FROM game_users WHERE game_id = $1 AND user_id = 0)
       ORDER BY gc.updated_at DESC`,
       [gameId]
    );
    console.log(checkPile);
    console.log(`checkPile length: ${checkPile.length}`);
    console.log(checkPile[0].value);
    // const cheated = pileCards.some((c) => c.value !== claimedValue);
    console.log(checkPile.slice(0,numCards));
    const cheated = checkPile
      .slice(0, numCards)
      .some((c) => c.value !== claimedValue);


    const loserUserId = cheated
      ? (
          await db.one<{ user_id: number }>(
            `SELECT user_id
               FROM game_logs
              WHERE game_id = $1
              ORDER BY created_at DESC
              LIMIT 1 OFFSET 1`,
            [gameId]
          )
        ).user_id
      : challengerId;

    const { id: loserGuId } = await db.one<{ id: number }>(
      `SELECT id FROM game_users WHERE game_id = $1 AND user_id = $2`,
      [gameId, loserUserId]
    );

    await db.none(
      `UPDATE game_cards
         SET owner_id = $1,
         updated_at = NOW()
       WHERE game_id = $2
         AND owner_id = (
           SELECT id FROM game_users WHERE game_id = $2 AND user_id = 0
         )`,
      [loserGuId, gameId]
    );

    await db.none(
      `UPDATE game_users
         SET cards_placed_down = 0
       WHERE game_id = $1`,
      [gameId]
    );

    //await setCurrentPlayer(gameId, loserUserId);

    const pileCount = checkPile.length;
    await db.none(
      `INSERT INTO game_logs (game_id, user_id, action, cards_count, expected_value)
         VALUES ($1, $2, $3, $4, $5)`,
      [
        gameId,
        loserUserId,
        cheated
          ? `caught cheating; pile moved to user ${loserUserId}`
          : `BS failed; challenger picks up pile`,
        pileCount,
        claimedValue,
      ]
    );


    //value shouldnt change on bs call
    // await db.none(
    //   `UPDATE games
    //      SET current_value_index = (current_value_index + 1) % 13
    //    WHERE id = $1`,
    //   [gameId]
    // );

    // turn should revert on bs call

    // await db.none(
    //   `UPDATE games
    //      SET current_turn = (
    //        SELECT turn_order - 1
    //        FROM game_users
    //        WHERE game_id = $1 AND user_id = $2
    //      )
    //    WHERE id = $1`,
    //   [gameId, loserUserId]
    // );

    await broadcastGameState(gameId, req.app.get("io"));
    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
};
