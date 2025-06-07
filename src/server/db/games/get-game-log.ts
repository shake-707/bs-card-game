import db from "../connection";

const SQL = 
`SELECT *
FROM game_logs
WHERE game_id = $1
ORDER BY created_at ASC`;

export const getGameLogs = async (gameId : number) => {
    return db.any(SQL, [gameId]); 
};