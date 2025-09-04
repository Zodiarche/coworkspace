import { Db } from "mongodb";
import { v4 as uuid } from "uuid";
import { Member } from "../../domain/entities/Member";
import { MemberRepository } from "../../domain/interfaces/MemberRepository";
import { FilterCriteria } from "../../domain/value-objects/FilterCriteria";
import { Page } from "../../domain/value-objects/Page";

export class MemberRepositoryMongo implements MemberRepository {
  private collectionName = "members";
  constructor(private readonly db: Db) {}

  private col() {
    return this.db.collection<Member>(this.collectionName);
  }

  async findAll(): Promise<Member[]> {
    return this.col().find().toArray();
  }

  async findByEmail(email: string): Promise<Member | null> {
    return this.col().findOne({ email });
  }

  async findById(id: string | number) {
    console.log("findById repo mongo id:", id);
    return this.col().findOne({ id });
  }

  async findRandom(excludeId: string): Promise<Member | null> {
    const pipeline = [
      { $match: { id: { $ne: excludeId } } },
      { $sample: { size: 1 } },
    ];
    const docs = await this.col().aggregate<Member>(pipeline).toArray();

    return docs[0] || null;
  }

  async search(
    filter: FilterCriteria,
    page: { page: number; size: number }
  ): Promise<Page<Member>> {
    const q: any = {};
    if (filter?.name) {
      q.$or = [
        { firstname: { $regex: filter.name, $options: "i" } },
        { lastname: { $regex: filter.name, $options: "i" } },
      ];
    }
    if (filter?.profession)
      q.profession = { $regex: filter.profession, $options: "i" };
    if (filter?.membershipType) q.membershipType = filter.membershipType;

    const skip = (Math.max(1, page.page) - 1) * Math.max(1, page.size);
    const [items, total] = await Promise.all([
      this.col().find(q).skip(skip).limit(page.size).toArray(),
      this.col().countDocuments(q),
    ]);

    return { items, total };
  }

  async create(data: Partial<Member>): Promise<Member> {
    const entity: Member = {
      id: data.id || uuid(),
      gender: data.gender!,
      firstname: data.firstname!,
      lastname: data.lastname!,
      email: data.email!,
      password: data.password!,
      phone: data.phone,
      birthdate: data.birthdate ? new Date(data.birthdate) : undefined,
      city: data.city,
      country: data.country,
      photo: data.photo,
      profession: data.profession,
      company: data.company,
      skills: data.skills ?? [],
      membershipType: data.membershipType!,
      joinDate: data.joinDate ? new Date(data.joinDate) : new Date(),
      bio: data.bio,
      linkedinUrl: data.linkedinUrl,
      isManager: Boolean(data.isManager),
    };
    await this.col().insertOne(entity as any);

    return entity;
  }

  async update(id: string, data: Partial<Member>): Promise<Member> {
    const $set = { ...data } as any;
    if ($set.birthdate) $set.birthdate = new Date($set.birthdate);
    if ($set.joinDate) $set.joinDate = new Date($set.joinDate);

    await this.col().updateOne({ id }, { $set });

    const updated = await this.findById(id);
    if (!updated) throw new Error("Member not found after update");

    return updated;
  }

  async delete(id: string): Promise<void> {
    await this.col().deleteOne({ id });
  }
}
