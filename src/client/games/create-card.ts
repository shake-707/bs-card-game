import { Card } from "global";
import { cloneTemplate } from "../utils";

const cardLabels = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
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
  } else if (card.value === 0 || card.value >= 10) {
    return createFaceCard(card);
  } else {
    return createNumberCard(card);
  }
};


// const createFaceCard = (card: Card) => {
//     const div = cloneTemplate("#face-card-template");

//     div.querySelector<HTMLDivElement>(".card")!.dataset.cardId = `${card.id}`;

//     return div;
// };

// const createNumberCard = (card: Card) => {
//     const div = cloneTemplate("#number-card-template");

//     div.querySelector<HTMLDivElement>(".card")!.dataset.cardId = `${card.id}`;
//     div.querySelector<HTMLDivElement>(".card")!.dataset.number = `${card.value}`;

//     div.querySelector<HTMLDivElement>(".card-number")!.innerText = `${card.value}`;

//     return div

// };

// const createFaceDownCard = () => {
//     const div = cloneTemplate("#faceDown-card-template");

//     div.querySelector<HTMLDivElement>(".card")!.classList.add("blank");

//     return div;
// };

// export const createCard = (card?:Card) => {
//     if (!card) {
//         return createFaceDownCard();
//     } else if (card.value == 0) {
//         return createFaceCard(card);
//     } else {
//         return createNumberCard(card);
//     }
// };