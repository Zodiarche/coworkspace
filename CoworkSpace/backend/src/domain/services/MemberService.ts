import { CreateMemberDTO } from "../../application/dto/CreateMemberDTO";
import { UpdateMemberDTO } from "../../application/dto/UpdateMemberDTO";
import { Member } from "../entities/Member";
import { MemberRepository } from "../interfaces/MemberRepository";
import { PasswordHasher } from "../interfaces/PasswordHasher";
import { FilterCriteria } from "../value-objects/FilterCriteria";
import { Page } from "../value-objects/Page";

export class MemberService {
  constructor(
    private readonly repo: MemberRepository,
    private readonly hasher: PasswordHasher
  ) {}

  async getRandomMember(currentUserId: string): Promise<Member> {
    const m = await this.repo.findRandom(currentUserId);
    if (!m) throw new Error("Aucun membre trouvé");

    return m;
  }

  async listMembers(
    filter: FilterCriteria,
    page: { page: number; size: number }
  ): Promise<Page<Member>> {
    return this.repo.search(filter, page);
  }

  async updateOwnProfile(id: string, data: Partial<Member>): Promise<Member> {
    const payload = { ...data };
    if (payload.password) {
      payload.password = await this.hasher.hash(payload.password);
    }

    return this.repo.update(id, payload);
  }

  async createMember(data: Partial<CreateMemberDTO>): Promise<Member> {
    if (!data.email || !data.password || !data.firstname || !data.lastname) {
      throw new Error("Champs requis manquants");
    }

    const hashed = await this.hasher.hash(data.password);
    const toCreate: Partial<Member> = {
      ...data,
      password: hashed,
      joinDate: data.joinDate ?? new Date(),
      isManager: data.isManager ?? false,
    };

    return this.repo.create(toCreate);
  }

  async updateMember(
    id: string,
    data: Partial<UpdateMemberDTO>
  ): Promise<Member> {
    const payload = { ...data };
    if (payload.password) {
      payload.password = await this.hasher.hash(payload.password);
    }

    return this.repo.update(id, payload);
  }

  async deleteMember(id: string): Promise<void> {
    return this.repo.delete(id);
  }

  async assignManagerRole(id: string): Promise<Member> {
    return this.repo.update(id, { isManager: true });
  }
}
