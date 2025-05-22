import { Request, Response } from "express";
import { Game } from "../../db";
import { broadcastGameState } from "./broadcast-game-state";

export const start = async (request: Request, response: Response) => {
  const { gameId: paramGameId } = request.params;
  const gameId = parseInt(paramGameId);
  //@ts-ignore
  const { id: userId } = request.session.user!;

  const hostId = await Game.getHost(gameId);

  // Only host can start the game
  if (hostId !== userId) {
    return response.status(403).send("Only host can start the game.");
  }

  const gameInfo = await Game.getInfo(gameId);

  // Ensure game has exactly 4 players (for BS)
  // 0 for middle pile and 1-4 for players 
  if (gameInfo.player_count < 5) {
    // You could emit a socket message here to notify
    console.log('not enough players');
    return response.status(200).send("Not enough players to start.");
  }
  
  await Game.start(gameId);
  await broadcastGameState(gameId, request.app.get("io"));
  
  return response.status(200).send("Game started");
};
