import { MemberService } from "../../domain/services/MemberService";

export class DeleteMemberUseCase {
  constructor(private readonly members: MemberService) {}

  async execute(id: string) {
    return this.members.deleteMember(id);
  }
}
