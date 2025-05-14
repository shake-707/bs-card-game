import express from 'express';
import { Request, Response } from 'express';

import { Game } from '../db';
import { ADD_PLAYER_SQL } from '../db/games';

import db from "../db/connection";

const router = express.Router();

router.get("/active", async (_req, res) => {
  try {
    const games = await Game.getActive();
    res.json(games);
  } catch (err) {
    console.error(err);
    res.status(500).json([]);
  }
});

 router.post("/create", async (request: Request, response: Response) => {
   // @ts-ignore
   const { id: userId } = request.session.user;
   const { maxPlayers } = request.body;

   try {
     const gameId = await Game.create(
       userId,
       Number(maxPlayers)
     );

     // response.redirect(`/games/${gameId}`);
     response.redirect("/lobby"); //TEMP
    } catch (error) {
        console.log(error);

        response.redirect("/lobby");
    }
});

router.get('/:gameId', async (req, res) => {
  const { gameId } = req.params;

  try {
    const { player_count } = await db.one(
      'SELECT COUNT(*) AS player_count FROM game_users WHERE game_id = $1',
      [gameId]
    );

    res.render("games", {
      gameId,
      playerCount: player_count,
    });
  } catch (err) {
    console.error("couldnt get player count", err);
    res.status(500).send("Error loading players");
  }
});


// server/routes/games.ts
router.post("/join", async (req, res) => {
  const { gameId, userId } = req.body;

  try {
    await db.none(ADD_PLAYER_SQL, [gameId, userId]);
    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Join game failed:", err);
    res.status(500).json({ error: "Could not join game" });
  }
});


export default router;