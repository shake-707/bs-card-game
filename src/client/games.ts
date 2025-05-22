// import UI from "./elements";
// import { configureSocketEvents } from "./games/configure-socket-events";
// import { getGameId } from "./utils";
// console.log('in this page');
// // Set up socket listeners for game state updates
// configureSocketEvents();

// // When host clicks "Start Game" button, send POST request to start game
// UI.START_GAME_BUTTON?.addEventListener("click", (event) => {
//   event.preventDefault();

//   fetch(`/games/${getGameId()}/start`, {
//     method: "POST",
//   });
// });

// // If the game has already started (e.g. page reloaded mid-game), notify server to re-sync
// if (UI.PLAY_AREA?.classList.contains("started")) {
//   fetch(`/games/${getGameId()}/ping`, {
//     method: "POST",
//   });
// }
