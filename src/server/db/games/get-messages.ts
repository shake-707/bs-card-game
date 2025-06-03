import db from "../connection";
import { ChatMessage } from "global";

const SQL = 
`SELECT messages.user_id AS sender, messages.sent_at AS timestamp, 
messages.message, users.user_name AS userName
 FROM messages  
 JOIN users ON messages.user_id = users.id 
 WHERE messages.game_id = $(gameId)`;

export const getMessages = async (gameId : number): Promise<ChatMessage[]> => {
    return db.any(SQL, { gameId });
}