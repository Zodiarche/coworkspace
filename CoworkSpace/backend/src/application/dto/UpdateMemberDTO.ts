import { MembershipType } from "../../domain/entities/Member";

export interface UpdateMemberDTO {
  firstname?: string;
  lastname?: string;
  email?: string;
  password?: string;
  phone?: string;
  city?: string;
  country?: string;
  photo?: string;
  profession?: string;
  company?: string;
  skills?: string[];
  membershipType?: MembershipType;
  bio?: string;
  linkedinUrl?: string;
}
