import { timeStamp } from 'console';
import express from 'express';
import {Request, Response} from 'express';
import { getMessages } from '../db/games/get-messages';
import { insertMessage } from '../db/games/insert-message';
import { ChatMessage } from 'global';

const router = express.Router();
// /chat/*
router.post('/:roomId', async (request: Request, response: Response) => {
    const { roomId } = request.params;
    const { message } = request.body;
    console.log('enetered');

    
    
    try{
    // @ts-ignore
    const { id, email, gravatar, userName } = request.session.user;
    await insertMessage(parseInt(roomId),id, message);
    const dbMessages = await getMessages(parseInt(roomId));
    
    const io = request.app.get("io");
    console.log( "db Message: " ,dbMessages);
    console.log( typeof dbMessages);
    if (!io) {
        response.status(500).send("socket.io not initialized");
        return;
    }

    if (!message) {
        response.status(500).send("message required");
        return;
    }

    io.emit(`chat:message:${roomId}`, {
        dbMessages,
        message,
        sender: {
            id,
            email,
            user_name: userName,
            gravatar,
        },
        timestamp: new Date(),
    });


    response.status(200).send();
} catch {}

});

export default router;