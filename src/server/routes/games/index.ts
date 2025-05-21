import express from "express";
import { create } from "./create";
import { get } from "./get";
import { join } from "./join";
import { start } from "./start";
import { ping } from "./ping";

const router = express.Router();

router.post("/create", create);
router.get("/:gameId", get);
router.post("/join/:gameId", join);
// @ts-ignore
router.post("/:gameId/start", start);
// @ts-ignore
router.post("/:gameId/ping", ping);


export default router;