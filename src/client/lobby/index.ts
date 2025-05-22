const createGameButton = document.querySelector("#create-game-button");
const createGameContainer = document.querySelector("#create-game-container");
const closeButton = document.querySelector("#close-create-game-form");

const contentDiv = document.getElementById("content");
const userId = Number(contentDiv?.dataset.userId);

// async function loadGames() {
//   try {
//     const res = await fetch("/games/active");
//     const games: {
//       id: number;
//       host_id: number;
//       player_count: number;
//       host_name: string;
//     }[] = await res.json();

//     const list = document.getElementById("games-list");
//     if (!list) return;
//     list.innerHTML = "";

//     games.forEach((game) => {
//       const hostLabel = game.host_id === userId ? "You" : game.host_name;
//       const li = document.createElement("li");
//       li.innerText = `Game ${game.id} by ${hostLabel} (${game.player_count} players)`;

//       if (game.host_id === userId) {
//         const hostBtn = document.createElement("button");
//         hostBtn.innerText = "Return as Host";
//         hostBtn.style.marginLeft = "8px";
//         hostBtn.addEventListener("click", () => {
//           location.href = `/games/${game.id}`;
//         });
//         li.appendChild(hostBtn);
//       } else {
//         const joinBtn = document.createElement("button");
//         joinBtn.innerText = "Join";
//         joinBtn.style.marginLeft = "8px";
//         joinBtn.addEventListener("click", () => {
//           fetch("/games/join", {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify({ gameId: game.id, userId }),
//           }).then(() => {
//             location.href = `/games/${game.id}`;
//           });
//         });
//         li.appendChild(joinBtn);
//       }

//       list.appendChild(li);
//     });
//   } catch (err) {
//     console.error("Failed to load games", err);
//   }
// }

document.addEventListener("DOMContentLoaded", () => {
  

  createGameButton?.addEventListener("click", (e) => {
    e.preventDefault();
    createGameContainer?.classList.add("visible");
  });

  closeButton?.addEventListener("click", (event) => {
    event.preventDefault();
    createGameContainer?.classList.remove("visible");
  });
});
