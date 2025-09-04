import { MemberService } from "../../domain/services/MemberService";

export class GetMemberByIdUseCase {
  constructor(private readonly members: MemberService) {}

  async execute(id: string) {
    return this.members.getMemberById(id);
  }
}
