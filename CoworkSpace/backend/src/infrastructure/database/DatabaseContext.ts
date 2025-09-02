import { Db, MongoClient } from "mongodb";
import { MemberRepository } from "../../domain/interfaces/MemberRepository";
import { MemberRepositoryMongo } from "../repositories/MemberRepositoryMongo";

export class DatabaseContext {
  private static mongoClient: MongoClient | null = null;
  private static mongoDb: Db | null = null;
  private static memberRepository: MemberRepository | null = null;

  static async init() {
    const uri = process.env.MONGODB_URI;
    this.mongoClient = new MongoClient(uri!);
    await this.mongoClient.connect();
    this.mongoDb = this.mongoClient.db();
    this.memberRepository = new MemberRepositoryMongo(this.mongoDb);
    console.log("[Database] Connected to MongoDB");
  }

  static getMemberRepository(): MemberRepository {
    if (!this.memberRepository)
      throw new Error("DatabaseContext not initialized");

    return this.memberRepository;
  }

  static async dispose() {
    if (this.mongoClient) await this.mongoClient.close();
  }
}
