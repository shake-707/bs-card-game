import UI from "../elements";
import { configureSocketEvents } from "./configure-socket-events";
import { getGameId } from "../utils";
console.log('in this page');



// Set up socket listeners for game state updates
configureSocketEvents();



// When host clicks "Start Game" button, send POST request to start game
UI.START_GAME_BUTTON?.addEventListener("click", async (event) => {
  event.preventDefault();

  try {
    const response = await fetch(`/games/${getGameId()}/start`, {
      method: "POST",
    });

    const text = await response.text();

    // Show popup based on server response
    if (response.ok) {
      alert(text); // "Game started" or "Not enough players to start."
    } else {
      alert("Error: " + text);
    }
  } catch (error) {
    console.error("Error starting game:", error);
    alert("Failed to start game. Please try again.");
  }
});


// If the game has already started (e.g. page reloaded mid-game), notify server to re-sync
if (UI.PLAY_AREA?.classList.contains("started")) {
  fetch(`/games/${getGameId()}/ping`, {
    method: "POST",
  });
}
