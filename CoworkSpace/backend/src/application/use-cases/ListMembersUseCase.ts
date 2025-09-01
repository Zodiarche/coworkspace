import { MemberService } from "../../domain/services/MemberService";
import { toMemberDTO } from "../mappers/MemberMapper";

export class ListMembersUseCase {
  constructor(private readonly members: MemberService) {}

  async execute(filter: any, page: { page: number; size: number }) {
    const res = await this.members.listMembers(filter, page);

    return { items: res.items.map(toMemberDTO), total: res.total };
  }
}
