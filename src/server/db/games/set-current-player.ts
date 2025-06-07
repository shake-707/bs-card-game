import db from "../connection";


const SQL = `
UPDATE game_users
SET is_current = (user_id = $(userId))
WHERE game_id = $(gameId)
`;

export const setCurrentPlayer = async (gameId: number, userId: number) => {
  //console.log('current id ' + userId);
  await db.none(SQL, { gameId, userId });
};
