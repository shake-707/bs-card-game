import { Request , Response } from "express";
import { Game } from "../../db";

export const create = async (request: Request, response: Response) => {
    
    // @ts-ignore
    const { id: userId } = request.session.user;
    const { maxPlayers } = request.body;

    try {
    
    const gameId = await Game.createGame(String(userId), String(maxPlayers));


    response.redirect("/lobby"); // TEMP
    } catch (error) {
        console.log(error);
        response.redirect("/lobby");
    }

}