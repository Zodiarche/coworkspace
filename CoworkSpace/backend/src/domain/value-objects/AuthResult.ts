import { Member } from "../entities/Member";

export interface AuthResult {
  token: string;
  member: Member;
}
