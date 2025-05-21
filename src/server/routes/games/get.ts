import { Request, Response } from "express";
import { Game } from "../../db";
import db from "../../db/connection";

export const get = async (request: Request, response: Response) => {
  const { gameId: paramsGameId } = request.params;
  const gameId = parseInt(paramsGameId);

  // @ts-ignore
  const { id: userId } = request.session.user;

  const hostId = await Game.getHost(gameId);
  const gameInfo = await Game.getInfo(gameId); // ← Add this
  const playerCount = await db.one(
    "SELECT COUNT(*) FROM game_users WHERE game_id = $1",
    [gameId]
  );

  response.render("games", {
    gameId,
    isHost: hostId === userId,
    playerCount: parseInt(playerCount.count),
    started: gameInfo.has_started, // ← Add this
    user: request.session.user,
  });
};
