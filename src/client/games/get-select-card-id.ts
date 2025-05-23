export const getSelectedCardIds = (): string[] =>
  Array.from(document.querySelectorAll<HTMLDivElement>(".card.selected"))
    .map((el) => el.dataset.cardId!)
    .filter(Boolean);

export const getSelectedCardId = (): string | undefined =>
  getSelectedCardIds()[0];
