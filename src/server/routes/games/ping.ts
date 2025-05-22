import { Request, Response } from "express";
import { broadcastGameStateToPlayer } from "./broadcast-game-state";

export const ping = async (request: Request, response: Response) => {
  try {
    // @ts-ignore
    const { id: userId } = request.session.user!;
    const gameId = Number(request.params.gameId);

    await broadcastGameStateToPlayer(gameId, `${userId}`, request.app.get("io"));

    return response.status(200).send("Pinged and state sent");
  } catch (error) {
    console.error("Error in ping:", error);
    return response.status(500).send("Failed to ping");
  }
};
