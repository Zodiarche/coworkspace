import { MemberService } from "../../domain/services/MemberService";
import { toMemberDTO } from "../mappers/MemberMapper";

export class CreateMemberUseCase {
  constructor(private readonly members: MemberService) {}

  async execute(data: any) {
    const m = await this.members.createMember(data);

    return toMemberDTO(m);
  }
}
