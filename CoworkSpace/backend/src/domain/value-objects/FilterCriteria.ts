import { MembershipType } from "../entities/Member";

export interface FilterCriteria {
  name?: string;
  profession?: string;
  membershipType?: MembershipType;
}
