import db from "../connection";
import { createGame } from "./create";
import { getAvailableGames } from "./get-player-games";
import { getCurrentGames } from "./get-games-user-in";
import { getHost } from "./get-host";
import { join } from "./join";
import { getState } from "./get-state";
import { setCurrentPlayer } from "./set-current-player";
import {start} from "./start-game";
import { dealCards } from "./deal-cards";
import { getPlayers } from "./get-players";
import { getInfo } from "./get-info";
import { getGameLogs } from "./get-game-log";
import { getMessages } from "./get-messages";


// const CREATE_GAME_SQL = `
//   INSERT INTO games (host_id, player_count)
//   VALUES ($1, $2)
//   RETURNING id
// `;

// export const ADD_PLAYER_SQL = `
//   INSERT INTO game_users (game_id, user_id, turn_order, cards_placed_down)
//   SELECT $1, $2, 1, 0
//   WHERE NOT EXISTS (
//     SELECT 1 FROM game_users WHERE game_id = $1 AND user_id = $2
//   )
// `;

// const create = async (hostId: number, playerCount: number) => {
//   const { id: gameId } = await db.one(CREATE_GAME_SQL, [hostId, playerCount]);
//   await db.none(ADD_PLAYER_SQL, [gameId, hostId]);
//   return gameId;
// };

// const GET_ACTIVE_SQL = `
//   SELECT
//     g.id,
//     g.host_id,
//     g.player_count,
//     u.user_name AS host_name
//   FROM games g
//   JOIN users u
//     ON u.id = g.host_id
//   ORDER BY g.created_at DESC
// `;

// export const getActive = async () => {
//   return db.any(GET_ACTIVE_SQL);
// };

// const getPlayerCount = async (gameId: number) => {
//   const result = await db.oneOrNone(
//     'SELECT COUNT(*) AS count FROM game_users WHERE game_id = $1',
//     [gameId]
//   );
//   return result ? parseInt(result.count, 10) : 0;
// };

// const startGame = async (gameId: number) => {
//   await db.none('UPDATE games SET started = TRUE WHERE id = $1', [gameId]);
//   return true;
// };

export default {
  // create,
  // getActive,
  // getPlayerCount,
  // startGame,
  createGame,
  getAvailableGames,
  getCurrentGames,
  getHost,
  join,
  getState,
  start,
  getPlayers,
  dealCards,
  setCurrentPlayer,
  getInfo,
  getGameLogs,
  getMessages
};
