import db from "../connection";
import { GetGameInfoResponse } from "global";

const SQL = `
SELECT player_count, started AS has_started, (
  SELECT COUNT(*) FROM game_users WHERE game_id = $1
)::int AS player_count
FROM games
WHERE id = $1;
`;

export const getInfo = async (gameId: number): Promise<GetGameInfoResponse> => {
  return await db.one<GetGameInfoResponse>(SQL, [gameId]);
};
