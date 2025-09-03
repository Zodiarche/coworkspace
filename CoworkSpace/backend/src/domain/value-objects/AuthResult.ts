import { MemberDTO } from "../../application/dto/MemberDTO";

export interface AuthResult {
  token: string;
  member: MemberDTO;
}
