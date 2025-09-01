export type Gender = "male" | "female";

export type MembershipType = "Basic" | "Premium" | "Enterprise";

export interface Member {
  id: string;
  gender: Gender;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  phone?: string;
  birthdate?: Date;
  city?: string;
  country?: string;
  photo?: string;
  profession?: string;
  company?: string;
  skills?: string[];
  membershipType: MembershipType;
  joinDate: Date;
  bio?: string;
  linkedinUrl?: string;
  isManager: boolean;
}
