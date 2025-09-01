import { MemberService } from "../../domain/services/MemberService";
import { toMemberDTO } from "../mappers/MemberMapper";

export class AssignManagerRoleUseCase {
  constructor(private readonly members: MemberService) {}

  async execute(id: string) {
    const m = await this.members.assignManagerRole(id);

    return toMemberDTO(m);
  }
}
