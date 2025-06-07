import { Request, Response } from "express";
import { Game } from "../../db";
import db from "../../db/connection";

// export const get = async (request: Request, response: Response) => {
//   const { gameId: paramsGameId } = request.params;
//   const gameId = parseInt(paramsGameId);

//   // @ts-ignore
//   const { id: userId } = request.session.user;

//   const hostId = await Game.getHost(gameId);
//   const gameInfo = await Game.getInfo(gameId); // ← Add this
//   const playerCount = await db.one(
//     "SELECT COUNT(*) FROM game_users WHERE game_id = $1",
//     [gameId]
//   );

//   response.render("games", {
//     gameId,
//     isHost: hostId === userId,
//     playerCount: parseInt(playerCount.count),
//     started: gameInfo.has_started, // ← Add this
//     user: request.session.user,
//   });
// };
export const get = async (request: Request, response: Response) => {
  try {
    const { gameId: paramsGameId } = request.params;
    const gameId = parseInt(paramsGameId);
    // @ts-ignore
    const { id: userId } = request.session.user;

    const hostId = await Game.getHost(gameId);
    const gameInfo = await Game.getInfo(gameId);
    const playerCount = await db.one(
      "SELECT COUNT(*) FROM game_users WHERE game_id = $1",
      [gameId]
    );
    //console.log('entered here');
    response.render("games", {
      gameId,
      isHost: hostId === userId,
      playerCount: parseInt(playerCount.count),
      started: gameInfo.has_started,
      // @ts-ignore
      user: request.session.user,
    });
  } catch (error) {
    console.error("❌ Error in GET /games/:gameId:", error);
    response.status(500).send("Something went wrong");
  }
};
