import { DbGameUser, User } from "global";
import db from "../connection";

const SQL = `
SELECT users.id, users.email, users.gravatar, users.user_name, game_users.*
FROM users
JOIN game_users ON users.id = game_users.user_id
WHERE game_users.game_id = $1 AND game_users.user_id != 0
ORDER BY turn_order
`;

export const getPlayers = async (
  gameId: number,
): Promise<(User & DbGameUser)[]> => {
  return await db.many(SQL, [gameId]);
};
