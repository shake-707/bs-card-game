
import { NextFunction } from "express";

export {default as root} from "./roots";
export {default as test} from "./test";
export { default as auth } from "./auth";
export { default as lobby } from "./lobby";
//npm run backend:dev
export { default as messageRoutes } from "./messages";
// other exports …
export { default as messages } from './messages';   
export { default as games } from "./games";
export function handleMessages(arg0: string, authMiddleware: (request: Request, response: Response, next: NextFunction) => void, messages: any) {
  throw new Error('Function not implemented.');
}
export { default as chat } from "./chat";