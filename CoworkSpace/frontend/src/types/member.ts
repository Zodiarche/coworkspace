export type MembershipType = "Basic" | "Premium" | "Enterprise";

export interface Member {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  photo: string;
  profession: string;
  company: string;
  skills: string[];
  membershipType: MembershipType;
  isManager: boolean;
}
