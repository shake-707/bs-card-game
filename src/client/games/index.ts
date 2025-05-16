console.log('Hello from games client!');
import { getGameId } from "../utils";

const startGameButton = document.querySelector("#start-game-button");

startGameButton?.addEventListener("click", async (event) => {
  event.preventDefault();

  const response = await fetch(`/games/${getGameId()}/start`, {
    method: "post",
  });

  if (!response.ok) {
    try {
      const data = await response.json();
      alert(data.error || "Failed to start game");
    } catch {
      alert("Failed to start game");
    }
    return;
  }


  alert("Game started!");
});

document.addEventListener("DOMContentLoaded", async () => {
  const gameId = getGameId();
  const res = await fetch(`/games/${gameId}/status`);
  const data = await res.json();
  if (!data.started) {
    const gameContainer = document.getElementById("game-container");
    if (gameContainer) {
      gameContainer.innerHTML = `
        <div style="color:red;font-size:1.5rem;text-align:center;">
          Waiting for host to start the game...
        </div>
      `;
    }
    // Optionally hide other controls
  }
});
