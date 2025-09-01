import { Member } from "../../domain/entities/Member";
import { MemberRepository } from "../../domain/interfaces/MemberRepository";
import { FilterCriteria } from "../../domain/value-objects/FilterCriteria";
import { Page } from "../../domain/value-objects/Page";

export class MemberRepositorySQL implements MemberRepository {
  // NOTE: This is just a scaffold placeholder. Plug your SQL client here.
  async findAll(): Promise<Member[]> { throw new Error("Not implemented"); }
  async findByEmail(email: string): Promise<Member | null> { throw new Error("Not implemented"); }
  async findById(id: string): Promise<Member | null> { throw new Error("Not implemented"); }
  async findRandom(excludeId: string): Promise<Member | null> { throw new Error("Not implemented"); }
  async search(filter: FilterCriteria, page: { page: number; size: number }): Promise<Page<Member>> { throw new Error("Not implemented"); }
  async create(data: Partial<Member>): Promise<Member> { throw new Error("Not implemented"); }
  async update(id: string, data: Partial<Member>): Promise<Member> { throw new Error("Not implemented"); }
  async delete(id: string): Promise<void> { throw new Error("Not implemented"); }
}
