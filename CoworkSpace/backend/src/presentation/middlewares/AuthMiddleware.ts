import { NextFunction, Request, Response } from "express";
import { TokenProvider } from "../../domain/interfaces/TokenProvider";

export const AuthMiddleware = (tokens: TokenProvider) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.cookies.token;
      if (!token) return res.status(401).json({ error: "Token manquant." });

      const payload = await tokens.verify(token);
      req.user = payload;
      next();
    } catch (e) {
      return res.status(401).json({ error: "Token invalide." });
    }
  };
};
