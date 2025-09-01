import { AuthPayload } from "../value-objects/AuthPayload";

export interface TokenProvider {
  sign(payload: AuthPayload, expiresInSeconds: number): Promise<string>;
  verify(token: string): Promise<AuthPayload>;
}
