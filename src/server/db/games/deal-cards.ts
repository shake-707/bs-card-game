import db from "../connection";

export const dealCards = async (
  gameId: number,
  playerId: number,
  count: number
) => {
  const { id: systemGameUserId } = await db.one(
    `SELECT id FROM game_users WHERE game_id = $1 AND user_id = 0`,
    [gameId]
  );

  const SQL = `
    WITH selected_cards AS (
      SELECT id
      FROM game_cards
      WHERE game_id = $(gameId)
        AND owner_id = $(systemGameUserId)
      ORDER BY RANDOM()
      LIMIT $(count)
    )
    UPDATE game_cards
    SET owner_id = $(playerId)
    WHERE id IN (SELECT id FROM selected_cards)
  `;
  console.log(gameId);
  console.log(playerId);
  console.log('here');
  await db.none(SQL, { gameId, playerId, count, systemGameUserId });
};
