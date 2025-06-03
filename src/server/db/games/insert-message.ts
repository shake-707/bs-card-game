import db from "../connection";

const SQL = 
`INSERT INTO messages (game_id, user_id, message)
 VALUES ($1, $2, $3)`;


export const insertMessage = async (gameId: number, userId: number, message: string) => {
     db.none(SQL, [gameId, userId, message]);
};