import db from "../connection";

const SQL = `
WITH insert_result AS (
  INSERT INTO game_users (game_id, user_id, turn_order, cards_placed_down, game_user_won)
  SELECT $(gameId), $(userId),
         (SELECT COUNT(*) FROM game_users WHERE game_id = $(gameId)), -- turn_order
         0, false
  WHERE NOT EXISTS (
    SELECT 1 FROM game_users WHERE game_id = $(gameId) AND user_id = $(userId)
  )
  RETURNING *
)
SELECT COUNT(*) AS playerCount FROM game_users WHERE game_id = $(gameId);
`;

export const join = async(
    userId: number,
    gameId: number
) => {
    const { playerCount } = await db.one<{ playerCount: number }>(SQL, {
        userId,
        gameId
    });

    return playerCount;
};