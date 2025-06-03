import db from "../connection";

const SQL = `
SELECT g.*, 
  COUNT(CASE WHEN gu.user_id != 0 THEN 1 END)::int AS current_players
FROM games g
LEFT JOIN game_users gu ON gu.game_id = g.id
WHERE g.started = false
  AND g.game_has_ended = false
  AND g.id != 0
GROUP BY g.id
HAVING COUNT(CASE WHEN gu.user_id != 0 THEN 1 END) < g.player_count
  AND $1 NOT IN (
    SELECT user_id FROM game_users WHERE game_id = g.id AND user_id != 0
  )
`;


export const getAvailableGames = async (userId: number) => {
  return db.any(SQL, [userId]);
};
