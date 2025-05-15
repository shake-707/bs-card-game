import db from "../connection";

const CREATE_GAME_SQL = `
  INSERT INTO games (host_id, player_count)
  VALUES ($1, $2)
  RETURNING id
`;

const ADD_PLAYER_SQL = `
  INSERT INTO game_users (
    game_id,
    user_id,
    turn_order,
    cards_placed_down
  ) VALUES (
    $1, $2, 1, 0
  )
`;

const create = async (hostId: number, playerCount: number) => {
  const { id: gameId } = await db.one(CREATE_GAME_SQL, [hostId, playerCount]);
  await db.none(ADD_PLAYER_SQL, [gameId, hostId]);
  return gameId;
};

const GET_ACTIVE_SQL = `
  SELECT
    g.id,
    g.host_id,
    g.player_count,
    u.user_name AS host_name
  FROM games g
  JOIN users u
    ON u.id = g.host_id
  ORDER BY g.created_at DESC
`;


export const getActive = async () => {
  return db.any(GET_ACTIVE_SQL);
};

const getPlayerCount = async (gameId: number) => {
  const result = await db.oneOrNone('SELECT COUNT(*) AS count FROM game_users WHERE game_id = $1', [gameId]);
  return result ? parseInt(result.count, 10) : 0;
};

const startGame = async (gameId: number) => {
  // Update the 'started' field in the games table
  await db.none('UPDATE games SET started = TRUE WHERE id = $1', [gameId]);
  return true;
};

export default { create, getActive, getPlayerCount, startGame };
