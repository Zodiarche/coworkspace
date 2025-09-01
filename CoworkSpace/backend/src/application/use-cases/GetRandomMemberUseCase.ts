import { MemberService } from "../../domain/services/MemberService";
import { toMemberDTO } from "../mappers/MemberMapper";

export class GetRandomMemberUseCase {
  private readonly getCurrentUserId: () => string;

  constructor(
    private readonly members: MemberService,

    getCurrentUserId: () => string
  ) {
    this.getCurrentUserId = getCurrentUserId;
  }

  async execute() {
    const m = await this.members.getRandomMember(this.getCurrentUserId());

    return toMemberDTO(m);
  }
}
