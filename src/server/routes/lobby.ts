import express from "express";
import { Request, Response } from "express";

const router = express.Router();

router.get("/", (request: Request, response: Response) => {
  //@ts-ignore
  console.log("/lobby session.user =", request.session.user);
  //@ts-ignore
  response.render("lobby", { user: request.session.user });
});

export default router;