import type { Express, RequestHandler } from "express";
import session from "express-session";

// adapter that saves sessions into postgres
import connectPgSimple from "connect-pg-simple";

let sessionMiddleWare: RequestHandler;

const configureSession = (app: Express) => {
    const store = new (connectPgSimple(session))({
        createTableIfMissing: true,
    });

    sessionMiddleWare = session({
        store,
        secret: process.env.SESSION_SECRET!,
        resave: true,
        saveUninitialized: true,
    });

    app.use(sessionMiddleWare);

    return sessionMiddleWare;
};

export default configureSession;
export { sessionMiddleWare };