import jwt from "jsonwebtoken";
import { TokenProvider } from "../../domain/interfaces/TokenProvider";
import { AuthPayload } from "../../domain/value-objects/AuthPayload";

export class JwtTokenProvider implements TokenProvider {
  private secret: string;

  constructor(secret: string) {
    this.secret = secret;
  }

  async sign(payload: AuthPayload, expiresInSeconds: number): Promise<string> {
    return jwt.sign(payload, this.secret, { expiresIn: expiresInSeconds });
  }

  async verify(token: string): Promise<AuthPayload> {
    return jwt.verify(token, this.secret) as AuthPayload;
  }
}
