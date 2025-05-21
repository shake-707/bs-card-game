import db from "../connection";

const SQL = `
SELECT g.*, 
  COUNT(gu.id)::int AS current_players
FROM games g
LEFT JOIN game_users gu ON gu.game_id = g.id
WHERE g.started = false
  AND g.game_has_ended = false
GROUP BY g.id
HAVING COUNT(gu.id) < g.player_count
  AND $1 NOT IN (
    SELECT user_id FROM game_users WHERE game_id = g.id
  )
`;

export const getAvailableGames = async (userId: number) => {
  return db.any(SQL, [userId]);
};
