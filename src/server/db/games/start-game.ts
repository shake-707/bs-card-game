import db from "../connection";
import { getPlayers } from "./get-players";
import { dealCards } from "./deal-cards";
import { setCurrentPlayer } from "./set-current-player";

const SQL = `
  INSERT INTO game_cards (game_id, card_id, owner_id)
  SELECT $(gameId), id, 0
  FROM cards
`;

export const start = async (gameId: number) => {
  // Insert all cards for the game with owner_id = 0 (middle pile)
  await db.none(SQL, { gameId });

  // Get all players in the game
  const players = await getPlayers(gameId);

  if (players.length !== 4) {
    throw new Error("BS game must have exactly 4 players.");
  }

  // Shuffle and deal 13 cards to each player
  for (const player of players) {
    await dealCards(gameId, player.id, 13);
  }

  // Set the first player in the array as the current player
  await setCurrentPlayer(gameId, players[0].id);
};
