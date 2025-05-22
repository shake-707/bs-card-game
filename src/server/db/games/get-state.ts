import { GameState, PlayerInfo } from "global";
import db from "../connection";
import {
  MIDDLE_PILE,
  PLAYER_HAND,
} from "./constants";
import { getPlayers } from "./get-players";

const GET_CARD_SQL = `
SELECT cards.*
FROM cards
JOIN game_cards ON cards.id = game_cards.card_id
WHERE game_cards.owner_id = $(userId)
  AND game_cards.game_id = $(gameId)
ORDER BY cards.id DESC
`;

export const getState = async (gameId: number): Promise<GameState> => {
  const players = await getPlayers(gameId);

  const playerInfo: Record<string, PlayerInfo> = {};

  for (const player of players) {
    const { id: gameUserId, user_id, turn_order, is_current: isCurrent } = player;

    const hand = await db.any(GET_CARD_SQL, {
      gameId,
      userId: gameUserId,
      pile: PLAYER_HAND,
    });

    playerInfo[user_id] = {
      id: gameUserId,           // game_users.id
      user_id,      // users.id (real user ID)
      seat: turn_order,
      isCurrent,
      hand,
      handCount: hand.length,
    };

  }

  const middlePile = await db.any(GET_CARD_SQL, {
    gameId,
    userId: 0,
    pile: MIDDLE_PILE,
  });

  const gameMeta = await db.one(
    `SELECT current_turn, current_value_index FROM games WHERE id = $1`,
    [gameId]
  );

  return {
    currentTurn: gameMeta.current_turn,
    currentValueIndex: gameMeta.current_value_index,
    middlePile,
    players: playerInfo,
  };
};