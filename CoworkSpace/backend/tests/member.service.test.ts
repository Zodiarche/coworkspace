import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { Member } from "../src/domain/entities/Member";
import { MemberRepository } from "../src/domain/interfaces/MemberRepository";
import { PasswordHasher } from "../src/domain/interfaces/PasswordHasher";
import { MemberService } from "../src/domain/services/MemberService";

const baseMember: Member = {
  id: "m1",
  gender: "female",
  firstname: "Alice",
  lastname: "Martin",
  email: "alice@example.com",
  password: "hashed",
  membershipType: "Premium",
  joinDate: new Date("2024-04-01"),
  isManager: false,
};

describe("MemberService", () => {
  let repo: jest.Mocked<MemberRepository>;
  let hasher: jest.Mocked<PasswordHasher>;
  let service: MemberService;

  beforeEach(() => {
    repo = {
      findAll: jest.fn(),
      findByEmail: jest.fn(),
      findById: jest.fn(),
      findRandom: jest.fn(),
      search: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as any;

    hasher = {
      hash: jest.fn(),
      compare: jest.fn(),
    };

    service = new MemberService(repo, hasher);
  });

  it("createMember() - hash le mot de passe et crée", async () => {
    hasher.hash.mockResolvedValue("hashed_pw");
    repo.create.mockImplementation(
      async (d) => ({ ...baseMember, ...d } as Member)
    );

    const created = await service.createMember({
      firstname: "Alice",
      lastname: "Martin",
      email: "alice@example.com",
      password: "secret123",
      gender: "female",
      membershipType: "Premium",
      joinDate: new Date("2024-04-01"),
      isManager: false,
    });

    expect(hasher.hash).toHaveBeenCalledWith("secret123");
    expect(repo.create).toHaveBeenCalled();
    expect(created.password).toBe("hashed_pw");
  });

  it("updateMember() - hash si mot de passe fourni", async () => {
    hasher.hash.mockResolvedValue("hpw");
    repo.update.mockResolvedValue({ ...baseMember, password: "hpw" });

    const updated = await service.updateMember("m1", { password: "newpass" });

    expect(hasher.hash).toHaveBeenCalledWith("newpass");
    expect(repo.update).toHaveBeenCalledWith("m1", { password: "hpw" });
    expect(updated.password).toBe("hpw");
  });

  it("updateMember() - ne hash pas si pas de mot de passe", async () => {
    repo.update.mockResolvedValue(baseMember);

    const updated = await service.updateMember("m1", { firstname: "Alicia" });

    expect(hasher.hash).not.toHaveBeenCalled();
    expect(repo.update).toHaveBeenCalledWith("m1", { firstname: "Alicia" });
    expect(updated.firstname).toBe("Alice"); // repo mock renvoie baseMember
  });
});
