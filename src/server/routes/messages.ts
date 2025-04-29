import { Router } from 'express';
const router = Router();

/**
 * POST /messages   { "to": "...", "msg": "..." }
 * For now we skip TypeScript typings entirely to avoid overload noise.
 */
router.post('/', (req: any, res: any) => {
  const to  = req.body?.to;
  const msg = req.body?.msg;

  if (typeof to !== 'string' || typeof msg !== 'string' || !to || !msg) {
    return res.status(400).json({ error: '`to` and `msg` are required' });
  }

  req.app.get('io')
         .to(to)
         .emit('message:direct', { from: req.headers['x-sender'] ?? 'SERVER', msg });

  return res.sendStatus(204);
});

export default router;
