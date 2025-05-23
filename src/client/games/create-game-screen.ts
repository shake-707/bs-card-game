// import { Card, PlayerGameState, OtherPlayerInfo } from "global";
// import { createCard } from "./create-card";
// import elements from "../elements";

// export const drawGameScreen = (state: PlayerGameState) => {
//   const { currentPlayer, otherPlayers, middlePile } = state;
//   const container = elements.PLAY_AREA;
//   if (!container) return;
//   container.innerHTML = "";

//   const rankLabels: Record<number, string> = {
//     1: "A",
//     2: "2",
//     3: "3",
//     4: "4",
//     5: "5",
//     6: "6",
//     7: "7",
//     8: "8",
//     9: "9",
//     10: "10",
//     11: "J",
//     12: "Q",
//     13: "K",
//   };
//   const claimedRank = (state.currentValueIndex % 13) + 1;
//   const valueBanner = document.createElement("div");
//   valueBanner.id = "value-banner";
//   valueBanner.innerText = `Claimed Rank: ${rankLabels[claimedRank]}`;
//   container.appendChild(valueBanner);

//   const isMyTurn = currentPlayer.isCurrent;

//   const oppArray = Object.values(otherPlayers) as OtherPlayerInfo[];

//   const makeOppDiv = (
//     posClass: "side-opponent left" | "side-opponent right" | "top-opponent",
//     info: OtherPlayerInfo
//   ) => {
//     const div = document.createElement("div");
//     div.className = posClass;
//     if (info.isCurrent) {
//       div.classList.add("current-turn");
//     }
//     div.appendChild(createCard());
//     div.appendChild(document.createTextNode(`# of cards: ${info.handCount}`));
//     return div;
//   };

//   container.appendChild(
//     makeOppDiv(
//       "side-opponent left",
//       oppArray[0] ?? ({ handCount: 0, isCurrent: false } as any)
//     )
//   );
//   container.appendChild(
//     makeOppDiv(
//       "side-opponent right",
//       oppArray[1] ?? ({ handCount: 0, isCurrent: false } as any)
//     )
//   );
//   container.appendChild(
//     makeOppDiv(
//       "top-opponent",
//       oppArray[2] ?? ({ handCount: 0, isCurrent: false } as any)
//     )
//   );

//   // Middle pile
//   const pileDiv = document.createElement("div");
//   pileDiv.id = "card-pile";
//   middlePile.forEach(() => pileDiv.appendChild(createCard()));
//   pileDiv.appendChild(
//     document.createTextNode(`  (${middlePile.length} in pile)`)
//   );
//   container.appendChild(pileDiv);

//   // User cards
//   const userDiv = document.createElement("div");
//   userDiv.id = "user-cards";
//   if (isMyTurn) {
//     userDiv.classList.add("current-turn");
//   }

//   const name = document.createElement("div");
//   name.className = "player-name";
//   name.innerText = currentPlayer.user_id.toString();
//   userDiv.appendChild(name);
//   currentPlayer.hand.forEach((card) => {
//     const cardEl = createCard(card).querySelector<HTMLDivElement>(".card")!;
//     if (!isMyTurn) cardEl.classList.add("disabled");
//     userDiv.appendChild(cardEl);
//   });
//   container.appendChild(userDiv);

//   if (isMyTurn) {
//     userDiv.querySelectorAll<HTMLDivElement>(".card").forEach((cardEl) => {
//       cardEl.addEventListener("click", () => {
//         cardEl.classList.toggle("selected");
//       });
//     });
//   }

//   // === Add Play and Call BS buttons ===
//   const buttonContainer = document.createElement("div");
//   buttonContainer.id = "play-controls";
//   console.log('is it my turn:' + isMyTurn);
//   const playBtn = document.createElement("button");
//   playBtn.id = "play-button";
//   playBtn.className = "game-button";
//   playBtn.innerText = "Play Cards";
//   playBtn.disabled = !isMyTurn; 

//   const bsBtn = document.createElement("button");
//   bsBtn.id = "bs-button";
//   bsBtn.className = "game-button";
//   bsBtn.innerText = "Call BS";
//   bsBtn.disabled = false; 

//   buttonContainer.append(playBtn, bsBtn);
//   container.appendChild(buttonContainer);

//   const allPlayers = [currentPlayer, ...Object.values(otherPlayers)];
//   const winner = allPlayers.find((p) => p.handCount === 0 && p.user_id !== 0);

//   if (winner) {
//     alert(`Player ${winner.user_id} has won the game!`);
//     window.location.href = "/lobby"; // or your desired lobby route
//   }

// };
import { Card, PlayerGameState, OtherPlayerInfo } from "global";
import { createCard } from "./create-card";
import elements from "../elements";
import { getGameId } from "../utils";

export const drawGameScreen = (state: PlayerGameState) => {
  const { currentPlayer, otherPlayers, middlePile } = state;
  const container = elements.PLAY_AREA;
  if (!container) return;

  container.innerHTML = "";

  const rankLabels: Record<number, string> = {
    1: "A", 2: "2", 3: "3", 4: "4", 5: "5", 6: "6", 7: "7",
    8: "8", 9: "9", 10: "10", 11: "J", 12: "Q", 13: "K",
  };
  const claimedRank = (state.currentValueIndex % 13) + 1;
  const valueBanner = document.createElement("div");
  valueBanner.id = "value-banner";
  valueBanner.innerText = `Claimed Rank: ${rankLabels[claimedRank]}`;
  container.appendChild(valueBanner);

  const isMyTurn = currentPlayer.isCurrent;
  const oppArray = Object.values(otherPlayers) as OtherPlayerInfo[];

  const makeOppDiv = (
    posClass: "side-opponent left" | "side-opponent right" | "top-opponent",
    info: OtherPlayerInfo
  ) => {
    const div = document.createElement("div");
    div.className = posClass;
    if (info.isCurrent) div.classList.add("current-turn");
    div.appendChild(createCard());
    div.appendChild(document.createTextNode(`# of cards: ${info.handCount}`));
    return div;
  };

  container.appendChild(
    makeOppDiv("side-opponent left", oppArray[0] ?? { handCount: 0, isCurrent: false } as any)
  );
  container.appendChild(
    makeOppDiv("side-opponent right", oppArray[1] ?? { handCount: 0, isCurrent: false } as any)
  );
  container.appendChild(
    makeOppDiv("top-opponent", oppArray[2] ?? { handCount: 0, isCurrent: false } as any)
  );

  // Middle pile
  const pileDiv = document.createElement("div");
  pileDiv.id = "card-pile";
  middlePile.forEach(() => pileDiv.appendChild(createCard()));
  pileDiv.appendChild(document.createTextNode(`  (${middlePile.length} in pile)`));
  container.appendChild(pileDiv);

  // User cards
  const userDiv = document.createElement("div");
  userDiv.id = "user-cards";
  if (isMyTurn) userDiv.classList.add("current-turn");

  const name = document.createElement("div");
  name.className = "player-name";
  name.innerText = currentPlayer.user_id.toString();
  userDiv.appendChild(name);

  currentPlayer.hand.forEach((card) => {
    const cardEl = createCard(card).querySelector<HTMLDivElement>(".card")!;
    if (!isMyTurn) cardEl.classList.add("disabled");
    userDiv.appendChild(cardEl);
  });
  container.appendChild(userDiv);

  if (isMyTurn) {
    userDiv.querySelectorAll<HTMLDivElement>(".card").forEach((cardEl) => {
      cardEl.addEventListener("click", () => {
        cardEl.classList.toggle("selected");
      });
    });
  }

  // Play and BS buttons
  const buttonContainer = document.createElement("div");
  buttonContainer.id = "play-controls";

  const playBtn = document.createElement("button");
  playBtn.id = "play-button";
  playBtn.className = "game-button";
  playBtn.innerText = "Play Cards";
  playBtn.disabled = !isMyTurn;

  const bsBtn = document.createElement("button");
  bsBtn.id = "bs-button";
  bsBtn.className = "game-button";
  bsBtn.innerText = "Call BS";
  bsBtn.disabled = false;

  buttonContainer.append(playBtn, bsBtn);
  container.appendChild(buttonContainer);

  // === Check for game winner via backend ===
  console.log('currentplayer: id ' + currentPlayer.id);
  fetch(`/games/${getGameId()}/check-winner`)
    .then((res) => res.json())
    .then((data) => {
      if (data.winner) {
        alert(`Player ${data.winner} has won the game!`);
        window.location.href = "/lobby"; // or your actual lobby path
      }
    })
    .catch((err) => {
      console.error("Failed to check winner:", err);
    });

    

};
