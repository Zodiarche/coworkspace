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
}
