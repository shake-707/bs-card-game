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




export default {
  
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
