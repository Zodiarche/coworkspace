import { MembershipType } from "../../domain/entities/Member";

export interface MemberDTO {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  photo?: string;
  profession?: string;
  company?: string;
  skills?: string[];
  membershipType: MembershipType;
  isManager: boolean;
}
