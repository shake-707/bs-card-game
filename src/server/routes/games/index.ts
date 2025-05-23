import express from "express";
import { create } from "./create";
import { get } from "./get";
import { join } from "./join";
import { start } from "./start";
import { ping } from "./ping";
import { play } from "./play";
import { callBs } from "./call-bs";
import { checkWinner } from "./check-winner";

const router = express.Router();

router.post("/create", create);
router.get("/:gameId", get);
router.post("/join/:gameId", join);
// @ts-ignore
router.post("/:gameId/start", start);
// @ts-ignore
router.post("/:gameId/ping", ping);
// @ts-ignore
router.post("/:gameId/bs", callBs);
// @ts-ignore
router.post("/:gameId/play", play);
//@ts-ignore
router.get("/:gameId/check-winner", checkWinner);

export default router;