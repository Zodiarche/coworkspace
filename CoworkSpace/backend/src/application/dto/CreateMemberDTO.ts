import { Gender, MembershipType } from "../../domain/entities/Member";

export interface CreateMemberDTO {
  gender: Gender;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  profession?: string;
  membershipType: MembershipType;
  joinDate: Date;
  isManager: boolean;
}
