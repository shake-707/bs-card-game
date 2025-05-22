import { Card } from "global";
import { cloneTemplate } from "../utils";

const cardLabels: Record<number, string> = {
  1: "A",
  2: "2",
  3: "3",
  4: "4",
  5: "5",
  6: "6",
  7: "7",
  8: "8",
  9: "9",
  10: "10",
  11: "J",
  12: "Q",
  13: "K",
};


const suitSymbols: Record<Card["suit"], string> = {
  hearts: "♥",
  diamonds: "♦",
  clubs: "♣",
  spades: "♠",
};

const createFaceCard = (card: Card) => {
  const div = cloneTemplate("#face-card-template");

  const cardDiv = div.querySelector<HTMLDivElement>(".card")!;
  cardDiv.dataset.cardId = `${card.id}`;

  cardDiv.querySelector<HTMLDivElement>(".card-label")!.innerText = cardLabels[card.value];
  cardDiv.querySelector<HTMLDivElement>(".card-suit")!.innerText = suitSymbols[card.suit];

  if (card.suit === "hearts" || card.suit === "diamonds") {
    cardDiv.classList.add("red");
  }

  return div;
};

const createNumberCard = (card: Card) => {
  const div = cloneTemplate("#number-card-template");

  const cardDiv = div.querySelector<HTMLDivElement>(".card")!;
  cardDiv.dataset.cardId = `${card.id}`;
  cardDiv.dataset.number = `${card.value}`;

  cardDiv.querySelector<HTMLDivElement>(".card-number")!.innerText = cardLabels[card.value];
  cardDiv.querySelector<HTMLDivElement>(".card-suit")!.innerText = suitSymbols[card.suit];

  if (card.suit === "hearts" || card.suit === "diamonds") {
    cardDiv.classList.add("red");
  }

  return div;
};

const createFaceDownCard = () => {
  const div = cloneTemplate("#faceDown-card-template");
  div.querySelector<HTMLDivElement>(".card")!.classList.add("blank");
  return div;
};

export const createCard = (card?: Card) => {
  if (!card) {
    return createFaceDownCard();
  } else if (card.value === 1 || card.value >= 11) {
    return createFaceCard(card);
  } else {
    return createNumberCard(card);
  }
};


