import { AuthPayload } from "../../domain/value-objects/AuthPayload";

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}
export {};
