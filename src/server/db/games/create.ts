import db from "../connection";

const CREATE_GAME_SQL = `
  INSERT INTO games (host_id, player_count)
  VALUES ($1, $2)
  RETURNING id
`;

export const ADD_PLAYER_SQL = `
  INSERT INTO game_users (game_id, user_id, turn_order, cards_placed_down)
  SELECT $1, $2, 0, 0
  WHERE NOT EXISTS (
    SELECT 1 FROM game_users WHERE game_id = $1 AND user_id = $2
  )
`;

export const createGame = async (
  host_id: string,
  player_count: string
) => {
  const { id: gameId } = await db.one<{ id: number }>(CREATE_GAME_SQL, [
    host_id,
    player_count,
  ]);

  // Add host as player
  await db.none(ADD_PLAYER_SQL, [gameId, host_id]);

  // Add system user (middle pile) to game_users with turn_order = -1
  await db.none(
    `
    INSERT INTO game_users (game_id, user_id, turn_order, cards_placed_down)
    VALUES ($1, 0, -1, 0)
    ON CONFLICT DO NOTHING
    `,
    [gameId]
  );

  return gameId;
};

