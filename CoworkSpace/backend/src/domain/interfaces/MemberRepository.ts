import { Member } from "../entities/Member";
import { FilterCriteria } from "../value-objects/FilterCriteria";
import { Page } from "../value-objects/Page";

export interface MemberRepository {
  findAll(): Promise<Member[]>;
  findByEmail(email: string): Promise<Member | null>;
  findById(id: string): Promise<Member | null>;
  findRandom(excludeId: string): Promise<Member | null>;
  search(
    filter: FilterCriteria,
    page: { page: number; size: number }
  ): Promise<Page<Member>>;
  create(data: Partial<Member>): Promise<Member>;
  update(id: string, data: Partial<Member>): Promise<Member>;
  delete(id: string): Promise<void>;
}
