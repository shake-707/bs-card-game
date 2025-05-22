import { Request, Response } from "express";
import { Game } from "../../db";

export const join = async (request: Request, response: Response) => {
    const { gameId } = request.params;
    // @ts-ignore
    const { id: userId } = request.session.user;

    try {
        const playerCount = await Game.join(userId, parseInt(gameId));
        response.redirect(`/games/${gameId}`);
    } catch (error) {
        console.log({ error });

        response.redirect(`/lobby`);
    }
};