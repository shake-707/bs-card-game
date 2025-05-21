import db from "../connection";

export const dealCards = async (
  gameId: number,
  playerId: number,
  count: number
) => {
  const SQL = `
    UPDATE game_cards
    SET owner_id = $(playerId)
    WHERE id IN (
      SELECT id FROM game_cards
      WHERE game_id = $(gameId)
        AND owner_id = 0
      ORDER BY RANDOM()
      LIMIT $(count)
    )
  `;

  await db.none(SQL, { gameId, playerId, count });
};
