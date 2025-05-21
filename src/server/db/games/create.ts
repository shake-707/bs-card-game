import db from "../connection";

const CREATE_GAME_SQL = `
  INSERT INTO games (host_id, player_count)
  VALUES ($1, $2)
  RETURNING id
`;

export const ADD_PLAYER_SQL = `
  INSERT INTO game_users (game_id, user_id, turn_order, cards_placed_down)
  SELECT $1, $2, 1, 0
  WHERE NOT EXISTS (
    SELECT 1 FROM game_users WHERE game_id = $1 AND user_id = $2
  )
`;

export const createGame = async(
    host_id: string,
    player_count: string,
  ) => {
    const { id: gameId } = await db.one<{id: number}>(CREATE_GAME_SQL, [
        host_id,
        player_count,
    ]);

    await db.none(ADD_PLAYER_SQL, [gameId, host_id]);

    return gameId;
}