import { Request, Response } from "express";
import db from "../../db/connection";

export const checkWinner = async (req: Request, res: Response) => {
  const { gameId } = req.params;
  // @ts-ignore
  const pontentialWinnerId = req.session.user.id;
  console.log('winner id:' , pontentialWinnerId);

  try {
    // Find a game_user with 0 cards who is not the system user (user_id ≠ 0)
    // const winner = await db.oneOrNone(
    //   `
    //   SELECT gu.user_id
    //   FROM game_users gu
    //   LEFT JOIN game_cards gc ON gc.owner_id = gu.id
    //   WHERE gu.game_id = $1 AND gu.user_id != 0
    //   GROUP BY gu.id, gu.user_id
    //   HAVING COUNT(gc.id) = 0
    //   LIMIT 1
    //   `,
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

    const checkPile: {cardId: number; value: number}[] = await db.any(
      `SELECT gc.card_id AS "cardId", c.value
       FROM game_cards gc
       JOIN cards c ON c.id = gc.card_id
       WHERE gc.game_id = $1
       AND gc.owner_id = (SELECT id FROM game_users WHERE game_id = $1 AND user_id = 0)
       ORDER BY gc.updated_at DESC`,
       [gameId]
    );

    const cheated = checkPile
      .slice(0, numCards)
      .some((c) => c.value !== claimedValue);
    
 

// ✅ Correct: get the game_users.id instead
    const { id: gameUserId } = await db.one(
      `SELECT id FROM game_users WHERE game_id = $1 AND user_id = $2`,
      [gameId, pontentialWinnerId]
    );



    if (cheated) {
      await db.none(
        `UPDATE game_cards
        SET owner_id = $1
        WHERE game_id = $2
          AND owner_id = (
            SELECT id FROM game_users WHERE game_id = $2 AND user_id = 0
          )`,
        [gameUserId, gameId]
      );


      await db.none(
        `INSERT INTO game_logs (game_id, user_id, action, cards_count, expected_value)
          VALUES ($1, $2, $3, $4, $5)`,
        [
          gameId,
          pontentialWinnerId,
          `caught cheating; pile moved to user ${pontentialWinnerId}`,
          checkPile.length,
          claimedValue,
        ]
      );
     
    } else {
      await db.tx(async (t) => {
        await t.none(`UPDATE games SET game_has_ended = TRUE WHERE id = $1`, [gameId]);

        await t.none(
          `UPDATE game_users SET game_user_won = TRUE WHERE game_id = $1 AND user_id = $2`,
          [gameId, pontentialWinnerId]
        );
      });

      return res.status(200).json({ winner: pontentialWinnerId });

    }



    // if (winner) {
    //   // Mark game as ended and set game_user_won = true for the winner
    //   await db.tx(async (t) => {
    //     await t.none(`UPDATE games SET game_has_ended = TRUE WHERE id = $1`, [gameId]);

    //     await t.none(
    //       `UPDATE game_users SET game_user_won = TRUE WHERE game_id = $1 AND user_id = $2`,
    //       [gameId, winner.user_id]
    //     );
    //   });

    //   return res.status(200).json({ winner: winner.user_id });
    //}

    return res.status(200).json({ winner: null });
  } catch (err) {
    console.error("Error checking winner:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
