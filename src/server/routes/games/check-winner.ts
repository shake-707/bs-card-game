import { Request, Response } from "express";
import db from "../../db/connection";

export const checkWinner = async (req: Request, res: Response) => {
  const { gameId } = req.params;

  try {
    // Find a game_user with 0 cards who is not the system user (user_id ≠ 0)
    const winner = await db.oneOrNone(
      `
      SELECT gu.user_id
      FROM game_users gu
      LEFT JOIN game_cards gc ON gc.owner_id = gu.id
      WHERE gu.game_id = $1 AND gu.user_id != 0
      GROUP BY gu.id, gu.user_id
      HAVING COUNT(gc.id) = 0
      LIMIT 1
      `,
      [gameId]
    );

    if (winner) {
      // Mark game as ended and set game_user_won = true for the winner
      await db.tx(async (t) => {
        await t.none(`UPDATE games SET game_has_ended = TRUE WHERE id = $1`, [gameId]);

        await t.none(
          `UPDATE game_users SET game_user_won = TRUE WHERE game_id = $1 AND user_id = $2`,
          [gameId, winner.user_id]
        );
      });

      return res.status(200).json({ winner: winner.user_id });
    }

    return res.status(200).json({ winner: null });
  } catch (err) {
    console.error("Error checking winner:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
