import db from "../connection";

const CREATE_SQL = `
   INSERT INTO games (host_id, player_count)
   VALUES ($1, $2)
   RETURNING id
 `;
const ADD_PLAYER = `INSERT INTO game_users (game_id, user_id) VALUES ($1, $2)`;

const create = async (hostId: number, playerCount: number) => {
  const { id: gameId } = await db.one(CREATE_SQL, [hostId, playerCount]);
  await db.none(ADD_PLAYER, [gameId, hostId]);
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

export default { create, getActive };
