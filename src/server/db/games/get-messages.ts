import db from "../connection";
import { ChatMessage } from "global";

const SQL = 
`SELECT users.user_name AS sender, users.gravatar, messages.sent_at AS timestamp, 
messages.message 
 FROM messages  
 JOIN users ON messages.user_id = users.id 
 WHERE messages.game_id = $(gameId)
 ORDER BY timestamp ASC`;

export const getMessages = async (gameId : number): Promise<ChatMessage[]> => {
    return db.any(SQL, { gameId });
}