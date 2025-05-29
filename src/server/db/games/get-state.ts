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
  console.log(players[0]);
  for (const player of players) {
    console.log('player user id is: ' + player.user_id + ' player game user id is: ' + player.game_user_id);
    const { game_user_id, user_id, turn_order, is_current: isCurrent } = player;
    // const { id: gameUserId, user_id, turn_order, is_current: isCurrent } = player;

    const hand = await db.any(GET_CARD_SQL, {
      gameId,
      userId: game_user_id,
    });

    playerInfo[user_id] = {
      id: game_user_id,           // game_users.id
      user_id,      // users.id (real user ID)
      seat: turn_order,
      isCurrent,
      hand,
      handCount: hand.length,
    };

  }

  const { id: systemGameUserId } = await db.one<{ id: number }>(
    `SELECT id FROM game_users WHERE game_id = $1 AND user_id = 0`,
    [gameId]
  );

  const middlePile = await db.any(GET_CARD_SQL, {
    gameId,
    userId: systemGameUserId,
  });

  const gameMeta = await db.one<{
    current_turn: number;
    current_value_index: number;
  }>(`SELECT current_turn, current_value_index FROM games WHERE id = $1`, [
    gameId,
  ]);

  return {
    currentTurn: gameMeta.current_turn,
    currentValueIndex: gameMeta.current_value_index,
    middlePile,
    players: playerInfo,
  };
};