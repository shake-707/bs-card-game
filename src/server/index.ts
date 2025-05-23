// src/server/index.ts

import * as path from "path";


import dotenv from "dotenv";
import express from "express";
import httpErrors from "http-errors";
dotenv.config();

import { createServer } from "http";
import { Server as IOServer } from "socket.io";

import cookieParser from "cookie-parser";
import morgan from "morgan";
import seedCards from "./db/seedCards";

import * as config from "./config";
import * as middleware from "./middleware";
import * as routes from "./routes";

const app = express();
const httpServer = createServer(app);
const io = new IOServer(httpServer);
const PORT = process.env.PORT || 3000;

async function startServer() {
  await seedCards();

  config.liveReload(app);
  const sessionMiddleWare = config.session(app);
  config.socket(io, app, sessionMiddleWare);

  app.use(morgan("dev"));
  app.use(cookieParser());
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(middleware.timeMiddleware);
  app.use(express.static(path.join(process.cwd(), "public")));
  app.use("/messages", routes.messages);
  app.set("views", path.join(process.cwd(), "src", "server", "views"));
  app.set("view engine", "ejs");
  app.use("/chat", middleware.authMiddleware, routes.chat);

  app.use("/", routes.root);
  app.use("/test", routes.test);
  app.use("/auth", routes.auth);
  app.use("/messages", [middleware.authMiddleware, routes.messages]);
  app.use("/lobby", middleware.authMiddleware, routes.lobby);
  app.use("/games", middleware.authMiddleware, routes.games);

  app.use((_req, _res, next) => next(httpErrors(404)));

  httpServer.listen(PORT, () =>
    console.log(`🚀  Server running on http://localhost:${PORT}`)
  );
}

startServer();
