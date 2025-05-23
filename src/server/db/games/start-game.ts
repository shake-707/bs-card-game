import db from "../connection";
import { getPlayers } from "./get-players";
import { setCurrentPlayer } from "./set-current-player";

const SQL = `
  WITH shuffled_cards AS (
    SELECT id AS card_id, ROW_NUMBER() OVER (ORDER BY RANDOM()) AS rn
    FROM cards
  ),
  player_ids AS (
    SELECT id AS game_user_id, ROW_NUMBER() OVER (ORDER BY turn_order) AS rn
    FROM game_users
    WHERE game_id = $(gameId) AND user_id != 0
  )
  INSERT INTO game_cards (game_id, card_id, owner_id)
  SELECT
    $(gameId),
    sc.card_id,
    p.game_user_id
  FROM shuffled_cards sc
  JOIN player_ids p ON CEIL(sc.rn::decimal / 13) = p.rn
  WHERE p.rn <= 4
`;

export const start = async (gameId: number) => {
  // ✅ First, validate exactly 4 players
  const players = await getPlayers(gameId);

  if (players.length !== 4) {
    throw new Error("BS game must have exactly 4 players.");
  }

  // ✅ Now insert shuffled cards to each player
  await db.none(SQL, { gameId });

  // ✅ Set current player to the first player
  await setCurrentPlayer(gameId, players[0].id);

  await db.none(`UPDATE games SET started = true WHERE id = $1`, [gameId]);

  await db.none(
    `UPDATE games
       SET current_turn = 0,
           current_value_index = 0
     WHERE id = $1`,
    [gameId]
  );
};
