import { Card, PlayerGameState } from "global";
import { createCard } from "./create-card";
import { cloneTemplate } from "../utils";
import elements from "../elements";

export const drawGameScreen = (state: PlayerGameState) => {
  const { currentPlayer, otherPlayers, middlePile } = state;
  const container = elements.PLAY_AREA;
  if (!container) return;

  container.innerHTML = "";

  // Top opponent
  const topDiv = document.createElement("div");
  topDiv.className = "top-opponent";
  topDiv.appendChild(createCard());
  topDiv.appendChild(document.createTextNode(`# of cards: ${Object.values(otherPlayers)[2]?.handCount ?? 0}`));
  container.appendChild(topDiv);

  // Left opponent
  const leftDiv = document.createElement("div");
  leftDiv.className = "side-opponent left";
  leftDiv.appendChild(createCard());
  leftDiv.appendChild(document.createTextNode(`# of cards: ${Object.values(otherPlayers)[0]?.handCount ?? 0}`));
  container.appendChild(leftDiv);

  // Right opponent
  const rightDiv = document.createElement("div");
  rightDiv.className = "side-opponent right";
  rightDiv.appendChild(createCard());
  rightDiv.appendChild(document.createTextNode(`# of cards: ${Object.values(otherPlayers)[1]?.handCount ?? 0}`));
  container.appendChild(rightDiv);

  // Middle pile
  const pileDiv = document.createElement("div");
  pileDiv.id = "card-pile";
  pileDiv.appendChild(createCard());
  pileDiv.appendChild(document.createTextNode(`# cards in pile: ${middlePile.length}`));
  container.appendChild(pileDiv);

  // User cards
  const userDiv = document.createElement("div");
  userDiv.id = "user-cards";
  const name = document.createElement("div");
  name.className = "player-name";
  name.innerText = currentPlayer.user_id.toString();
  userDiv.appendChild(name);
  currentPlayer.hand.forEach((card) => {
    userDiv.appendChild(createCard(card));
  });
  container.appendChild(userDiv);

};