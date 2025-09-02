import { Request, Response } from "express";
import { LoginUseCase } from "../../application/use-cases/LoginUseCase";

export class AuthController {
  constructor(private readonly loginUseCase: LoginUseCase) {}

  login = async (req: Request, res: Response) => {
    try {
      const result = await this.loginUseCase.execute(req.body);

      res.json(result);
    } catch (e: any) {
      res
        .status(401)
        .json({ error: e.message || "Echec de l'authentification" });
    }
  };
}
