import express from 'express';
import { Request, Response } from 'express';

import { Game } from '../db';

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

        response.redirect(`/games/${gameId}`);
    } catch (error) {
        console.log(error);

        response.redirect("/lobby");
    }
});

router.get('/:gameId', (request: Request, response: Response) => {
    const { gameId } = request.params;
    
    response.render("games", { gameId });
});

export default router;