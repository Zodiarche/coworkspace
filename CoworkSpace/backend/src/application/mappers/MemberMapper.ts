import { Member } from "../../domain/entities/Member";
import { MemberDTO } from "../dto/MemberDTO";

export const toMemberDTO = (m: Member): MemberDTO => ({
  id: m.id,
  firstname: m.firstname,
  lastname: m.lastname,
  email: m.email,
  photo: m.photo,
  profession: m.profession,
  company: m.company,
  skills: m.skills,
  membershipType: m.membershipType,
  isManager: m.isManager,
});
