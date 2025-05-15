import { Request, Response } from "express";

export const Logger = (req: Request, res: Response, next) => {
    console.log("ip:", req.ip);
    next();
}


