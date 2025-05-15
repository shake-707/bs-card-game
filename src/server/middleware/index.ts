import { Request, Response, NextFunction } from 'express';


export { default as authMiddleware } from './auth';

/* ------------------------------------------------------------------
 * Safe timeMiddleware — no longer crashes  app
 * ------------------------------------------------------------------*/
export function timeMiddleware(
  _req: Request,
  _res: Response,
  next: NextFunction
) {
  // If you ever need a request timestamp, uncomment the line below:
  // (_req as any).requestStart = Date.now();

  next();                     // ← IMPORTANT: hand control to the next handler
}
