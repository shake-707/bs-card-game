import { Card, OtherPlayerInfo, PlayerInfo, PlayerGameState } from "global";
import { cloneTemplate } from "../utils";
import { createCard } from "./create-card";
import { getGameId } from "../utils";
import { post } from "./fetch-wrapper";
import { getSelectedCardId } from "./get-select-card-id";

const playerPositions: Record<number, string> = {};

const POSITION_MAPS = [
  [],
  ["bottom"],
  ["bottom", "top"],
  ["bottom", "left", "right"],
  ["bottom", "left", "top", "right"],
];

const initSeatOrder = (gameState: PlayerGameState) => {
  const allPlayers = [
    ...Object.entries(gameState.otherPlayers).map(([id, { seat }]) => ({
      playerId: parseInt(id),
      seat,
    })),
    { playerId: gameState.currentPlayer.id, seat: gameState.currentPlayer.seat },
  ];

  const sorted = allPlayers.sort((a, b) => a.seat - b.seat);
  const currentPlayerIndex = sorted.findIndex(
    ({ playerId }) => playerId === gameState.currentPlayer.id
  );

  const inOrder = sorted
    .slice(currentPlayerIndex)
    .concat(sorted.slice(0, currentPlayerIndex));

  const mapped = POSITION_MAPS[inOrder.length];

  inOrder.forEach((entry, idx) => {
    playerPositions[entry.playerId] = mapped[idx];
  });
};

const getPlayerPosition = (playerId: number, gameState: PlayerGameState) => {
  if (Object.keys(playerPositions).length === 0) {
    initSeatOrder(gameState);
  }

  return playerPositions[playerId];
};

// Current player's view (bottom of screen)
export const currentPlayer = ({
  hand,
  id,
  seat,
  isCurrent,
}: PlayerInfo): HTMLDivElement => {
  const el = cloneTemplate("#player-template").querySelector<HTMLDivElement>(".player")!;
  el.classList.add("bottom");

  const handArea = el.querySelector<HTMLDivElement>(".hand")!;
  hand.forEach((card: Card) => {
    const cardEl = createCard(card);
    handArea.appendChild(cardEl);
  });

  handArea.addEventListener("click", (e) => {
    const target = (e.target as HTMLElement).closest<HTMLDivElement>(".card");
    if (!target) return;

    handArea.querySelectorAll(".card").forEach((c) => c.classList.remove("selected"));
    target.classList.add("selected");
  });

  const pileBtn = el.querySelector<HTMLDivElement>(".middle-pile-btn");
  if (pileBtn) {
    pileBtn.addEventListener("click", () => {
      const selectedCardId = getSelectedCardId();
      if (!selectedCardId) return;

      post(`/games/${getGameId()}/play`, {
        selectedCardId: parseInt(selectedCardId),
      });
    });
  }

  return el;
};

// Opponents’ view (left, right, top)
export const otherPlayer = (
  player: OtherPlayerInfo,
  gameState: PlayerGameState
): HTMLDivElement => {
  const el = cloneTemplate("#opponent-template").querySelector<HTMLDivElement>(".player")!;
  el.classList.add(getPlayerPosition(player.id, gameState));

  const handCountDiv = el.querySelector<HTMLDivElement>(".hand-count");
  handCountDiv!.innerText = `${player.handCount}`;

  const cardContainer = el.querySelector<HTMLDivElement>(".hand")!;
  for (let i = 0; i < player.handCount; i++) {
    cardContainer.appendChild(createCard());
  }

  return el;
};
