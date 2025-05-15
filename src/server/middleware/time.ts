import { NextFunction, Request, Response } from "express";

const timeMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction
) => {
    const currentTime = new Date().toISOString();
    console.log(`Current Time: ${currentTime}`);
    response.locals.currentTime = currentTime;
    next();
};

export {timeMiddleware};