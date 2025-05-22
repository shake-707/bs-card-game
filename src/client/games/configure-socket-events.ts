import { PlayerGameState } from "global";
import UI from "../elements";
import { socket } from "../sockets";
import { getGameId, getUserId } from "../utils";
import { drawGameScreen } from "./create-game-screen";
import { currentPlayer, otherPlayer } from "./create-players";


export const configureSocketEvents = () => {
  

  const gameId = getGameId();
  console.log('in sockets');
  socket.on(`game:${gameId}:updated`, (gameState: PlayerGameState) => {
    console.log(" Game updated:", gameState);
    console.log('am i in here');
    // Clear the current play area
    UI.PLAY_AREA?.replaceChildren();
    
    // Render the full game screen with updated state
    drawGameScreen(gameState);
  });
  console.log('hello');
  socket.on(`game:${gameId}:error`, ({ error }: { error: string }) => {
    const errorDiv = document.createElement("div");
    errorDiv.className = "error message";
    errorDiv.textContent = error;
    UI.PLAY_AREA?.appendChild(errorDiv);
  });
};
