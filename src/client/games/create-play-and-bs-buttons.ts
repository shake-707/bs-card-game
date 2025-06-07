// src/client/games/create-play-and-bs-buttons.ts

import { post } from "./fetch-wrapper";
import { getGameId } from "../utils";
import { getSelectedCardIds } from "./get-select-card-id";

export const configurePlayAndBsButtons = () => {
  const oldPlay = document.querySelector<HTMLButtonElement>("#play-button");
  if (oldPlay) {
    const playBtn = oldPlay.cloneNode(true) as HTMLButtonElement;
    oldPlay.replaceWith(playBtn);
    playBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const selected = getSelectedCardIds();
      if (selected.length === 0) {
        alert("Pick at least one card to play!");
        return;
      }
      post(`/games/${getGameId()}/play`, {
        selectedCardIds: selected.map((id) => parseInt(id, 10)),
      });
    });
  }
    
  const oldBs = document.querySelector<HTMLButtonElement>("#bs-button");
  if (oldBs) {
    const bsBtn = oldBs.cloneNode(true) as HTMLButtonElement;
    oldBs.replaceWith(bsBtn);
    bsBtn.addEventListener("click", (e) => {
      e.preventDefault();
      if (confirm("Call BS on the previous play?")) {
      post(`/games/${getGameId()}/bs`  , {});
      }
    });
  }

};
