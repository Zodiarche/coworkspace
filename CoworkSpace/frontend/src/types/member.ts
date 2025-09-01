export type Gender = "male" | "female";

export type MembershipType = "Basic" | "Premium" | "Enterprise";

export interface Member {
  id: string;
  gender: Gender;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  birthdate: string; // au format ISO "YYYY-MM-DD"
  city: string;
  country: string;
  photo: string;
  profession: string;
  company: string;
  skills: string[];
  membershipType: MembershipType;
  joinDate: string; // au format ISO "YYYY-MM-DD"
  bio: string;
  linkedinUrl: string;
  isManager: boolean;
}
