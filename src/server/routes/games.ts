import express from 'express';
import { Request, Response } from 'express';

import { Game } from '../db';
import { ADD_PLAYER_SQL } from '../db/games/index';
import db from '../db/connection';

const router = express.Router();

// Get list of active games
router.get("/active", async (_req, res) => {
  try {
    const games = await Game.getActive();
    res.json(games);
  } catch (err) {
    console.error(err);
    res.status(500).json([]);
  }
});

// Create a new game
router.post("/create", async (request: Request, response: Response) => {
  // @ts-ignore
  const { id: userId } = request.session.user;
  const { maxPlayers } = request.body;

  try {
    const gameId = await Game.create(userId, Number(maxPlayers));
    response.redirect("/lobby"); // TEMP
  } catch (error) {
    console.log(error);
    response.redirect("/lobby");
  }
});

// Join a game
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

// Load game page
router.get('/:gameId', async (req, res) => {
  const { gameId } = req.params;
  // @ts-ignore
  const user = req.session.user;

  try {
    const game = await db.oneOrNone('SELECT * FROM games WHERE id = $1', [gameId]);
    const hostId = game ? game.host_id : null;

    res.render("games", { gameId, user, hostId });
  } catch (err) {
    console.error("Error loading game", err);
    res.render("games", { gameId, user, hostId: null });
  }
});

// Start game
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

// Handle play card request (stub)
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
      return response.json({ success: true, message: 'Card played (stub)' });
    })
    .catch(() => {
      return response.status(500).json({ error: 'Server error' });
    });
});

// Check game status
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
