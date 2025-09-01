import { AuthService } from "../../domain/services/AuthService";
import { LoginRequestDTO } from "../dto/LoginRequestDTO";

export class LoginUseCase {
  constructor(private readonly auth: AuthService) {}

  async execute(req: LoginRequestDTO) {
    return this.auth.login(req.email, req.password);
  }
}
