import { NextFunction, Request, Response } from "express";

export const RoleMiddleware = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user?.isManager) {
      return res.status(403).json({ error: "Rôle de manager requis." });
    }
    next();
  };
};
