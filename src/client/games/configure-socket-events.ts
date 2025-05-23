import { PlayerGameState } from "global";
import UI from "../elements";
import { socket } from "../sockets";
import { getGameId, getUserId } from "../utils";
import { drawGameScreen } from "./create-game-screen";
import { currentPlayer, otherPlayer } from "./create-players";
import { configurePlayAndBsButtons } from "./create-play-and-bs-buttons";

export const configureSocketEvents = () => {
  
  
  const gameId = getGameId();
  console.log(gameId);
  console.log('in sockets');
  socket.on(`game:${gameId}:updated`, (gameState: PlayerGameState) => {
    console.log(" Game updated:", gameState);
    console.log('am i in here');
    // Clear the current play area
    UI.PLAY_AREA?.replaceChildren();
    
    // Render the full game screen with updated state
    drawGameScreen(gameState);
    configurePlayAndBsButtons();
  });
  console.log('hello');
  socket.on(`game:${gameId}:error`, ({ error }: { error: string }) => {
    const errorDiv = document.createElement("div");
    errorDiv.className = "error message";
    errorDiv.textContent = error;
    UI.PLAY_AREA?.appendChild(errorDiv);
  });
};
