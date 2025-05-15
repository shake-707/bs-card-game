import express from "express";

import {Request, Response} from "express";

import db from "../db/connection"

const router = express.Router();



router.get('/', async (_request: Request, respnse: Response) => {
    try {

        db.none("INSERT INTO test_table (test_string) VALUES ($1)", [
            `Test String ${new Date().toISOString()}`,
        ]);
        const results = await db.any('SELECT * FROM test_table');
        respnse.json(results);
    } catch (error) {
        console.log(error);
    }
    
});

router.post("/socket-test", (request: Request, response: Response) => {
    const io = request.app.get("io");
    // @ts-ignore
    const { id } = request.session.user;
  
    if (io) {
      console.log("io not null");
  
      io.emit("test-event", {
        message: "Hello from the server!",
        timestamp: new Date(),
      });
      io.to(id).emit("test-event", {
        message: `Secret message for user ${id}`,
        timestamp: new Date(),
      });
  
      response.status(200).send();
    } else {
      response.status(500).send();
    }
  });

export default router;
