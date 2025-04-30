import * as path from 'path';


import express, { NextFunction, Request, Response } from 'express';
import httpErrors from 'http-errors';
import dotenv from 'dotenv';
dotenv.config();

import { createServer } from 'http';
import { Server as IOServer } from 'socket.io';

import morgan from 'morgan';
import cookieParser from 'cookie-parser';

import * as config from './config';
import * as routes from './routes';
import * as middleware from './middleware';

const app = express();
const httpServer = createServer(app);
const io = new IOServer(httpServer);
const PORT = process.env.PORT || 3000;


config.liveReload(app);
const sessionMiddleWare = config.session(app);
config.socket(io, app, sessionMiddleWare);

app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(middleware.timeMiddleware);
app.use(express.static(path.join(process.cwd(), 'public')));
app.use('/messages', routes.messages);
app.set('views', path.join(process.cwd(), 'src', 'server', 'views'));
app.set('view engine', 'ejs');
app.use('/chat', middleware.authMiddleware, routes.chat);


app.use('/', routes.root);
app.use('/test', routes.test);
app.use('/auth', routes.auth);
app.use('/messages', [middleware.authMiddleware, routes.messages]);   // NEW
app.use('/lobby', middleware.authMiddleware, routes.lobby);
app.use('/games', middleware.authMiddleware, routes.games);

app.use((_req, _res, next) => next(httpErrors(404)));


httpServer.listen(PORT, () =>
  console.log(`🚀  Server running on http://localhost:${PORT}`)
);

