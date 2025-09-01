import { MemberService } from "../../domain/services/MemberService";
import { toMemberDTO } from "../mappers/MemberMapper";

export class UpdateMemberUseCase {
  constructor(private readonly members: MemberService) {}

  async execute(id: string, data: any) {
    const m = await this.members.updateMember(id, data);

    return toMemberDTO(m);
  }
}
