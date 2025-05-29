import {Server} from "socket.io";
import type {Express, RequestHandler} from "express";

const configureSockets = (io: Server, app: Express,sessionMiddleWare: RequestHandler) => {
    app.set("io", io);

    io.engine.use(sessionMiddleWare);
    
    io.on('connection', (socket) => {
        // @ts-ignore
        const session = socket.request.session;
        const user = session?.user;
    
        if (user) {
            console.log(` User [${user.id}] connected: ${user.email}`);
            socket.join(`${user.id}`);
        } else {
            console.log(' Anonymous user connected.');
        }

    
        socket.on('disconnect', () => {
            // @ts-ignore
            const session = socket.request.session;
            const user = session?.user;
    
            if (user) {
                console.log(`User [${user.id}] disconnected: ${user.email}`);
            } else {
                console.log('Anonymous user disconnected.');
            }
        });
    });
    
}

export default configureSockets;