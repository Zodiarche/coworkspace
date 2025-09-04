import { Request, Response } from "express";
import { z } from "zod";
import { loginSchema } from "../../application/dto/LoginRequestDTO";
import { LoginUseCase } from "../../application/use-cases/LoginUseCase";

export class AuthController {
  constructor(private readonly loginUseCase: LoginUseCase) {}

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const credentials = loginSchema.parse(req.body);

      const result = await this.loginUseCase.execute(credentials);

      res.cookie("token", result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 604800, // 1 semaine
      });

      res.json(result);
    } catch (e) {
      if (e instanceof z.ZodError) {
        res.status(400).json({
          error: "Données invalides",
          details: e.issues,
        });
        return;
      }

      const message =
        e && typeof e === "object" && "message" in e
          ? (e as any).message
          : "Échec de l'authentification";

      res.status(401).json({ error: message });
    }
  };

  verifyToken = async (req: Request, res: Response): Promise<void> => {
    try {
      const token = req.cookies.token;
      if (!token) throw new Error("Token manquant");

      const result = await this.loginUseCase.verifyToken(token);
      res.json(result);
    } catch (e) {
      const message =
        e && typeof e === "object" && "message" in e
          ? (e as any).message
          : "Échec de la vérification du token";

      res.status(401).json({ error: message });
    }
  };

  logout = (req: Request, res: Response): void => {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.json({ message: "Déconnexion réussie" });
  };
}
