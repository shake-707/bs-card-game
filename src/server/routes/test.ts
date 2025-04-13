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


export default router;
