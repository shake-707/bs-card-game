import express from 'express';
import { Request, Response } from 'express';

import { Game } from '../db';
import db from '../db/connection';

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

router.get('/:gameId', (request: Request, response: Response) => {
    const { gameId } = request.params;
    // @ts-ignore
    const user = request.session.user;
    db.oneOrNone('SELECT * FROM games WHERE id = $1', [gameId])
      .then(game => {
        const hostId = game ? game.host_id : null;
        response.render("games", { gameId, user, hostId });
      })
      .catch(() => {
        response.render("games", { gameId, user, hostId: null });
      });
});

router.post('/:gameId/start', (request: Request, response: Response) => {
  const { gameId } = request.params;
  // @ts-ignore
  const userId = request.session.user?.id;

  db.oneOrNone('SELECT * FROM games WHERE id = $1', [gameId])
    .then(game => {
      if (!game) {
        return response.status(404).json({ error: 'Game not found' });
      }
      if (game.host_id !== userId) {
        return response.status(403).json({ error: 'Only the host can start the game' });
      }
      return Game.getPlayerCount(Number(gameId)).then(playerCount => {
        if (playerCount !== 4) {
          return response.status(400).json({ error: 'Need 4 players to start the game' });
        }
        return Game.startGame(Number(gameId)).then(() => {
          return response.json({ success: true });
        });
      });
    })
    .catch(() => {
      return response.status(500).json({ error: 'Server error' });
    });
});

router.post('/:gameId/play', (request: Request, response: Response) => {
  const { gameId } = request.params;
  // @ts-ignore
  const userId = request.session.user?.id;

  db.oneOrNone('SELECT started FROM games WHERE id = $1', [gameId])
    .then(game => {
      if (!game || !game.started) {
        return response.status(400).json({ error: 'Game has not started yet.' });
      }
      // TODO: Add your play card logic here
      // Example: const { cardId } = request.body;
      return response.json({ success: true, message: 'Card played (stub)' });
    })
    .catch(() => {
      return response.status(500).json({ error: 'Server error' });
    });
});

router.get('/:gameId/status', (request: Request, response: Response) => {
  const { gameId } = request.params;
  db.oneOrNone('SELECT started FROM games WHERE id = $1', [gameId])
    .then(game => {
      if (!game) {
        return response.status(404).json({ error: 'Game not found' });
      }
      return response.json({ started: game.started });
    })
    .catch(() => {
      return response.status(500).json({ error: 'Server error' });
    });
});

export default router;