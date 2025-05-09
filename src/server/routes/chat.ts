import { timeStamp } from 'console';
import express from 'express';
import {Request, Response} from 'express';



const router = express.Router();
// /chat/*
router.post('/:roomId', (request: Request, response: Response) => {
    const { roomId } = request.params;
    const { message } = request.body;
    console.log('enetered');
    
    // @ts-ignore
    const { id, email, gravatar, userName } = request.session.user;
    const io = request.app.get("io");

    if (!io) {
        response.status(500).send("socket.io not initialized");
        return;
    }

    if (!message) {
        response.status(500).send("message required");
        return;
    }

    io.emit(`chat:message:${roomId}`, {
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

});

export default router;