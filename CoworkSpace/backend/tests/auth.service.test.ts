import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { Member } from "../src/domain/entities/Member";
import { MemberRepository } from "../src/domain/interfaces/MemberRepository";
import { PasswordHasher } from "../src/domain/interfaces/PasswordHasher";
import { TokenProvider } from "../src/domain/interfaces/TokenProvider";
import { AuthService } from "../src/domain/services/AuthService";

const sampleMember: Member = {
  id: "u_1",
  gender: "male",
  firstname: "Jean",
  lastname: "Dupont",
  email: "jean@example.com",
  password: "hashed_pw",
  membershipType: "Basic",
  joinDate: new Date("2024-01-01"),
  isManager: false,
};

describe("AuthService", () => {
  let repo: jest.Mocked<MemberRepository>;
  let hasher: jest.Mocked<PasswordHasher>;
  let tokens: jest.Mocked<TokenProvider>;
  let service: AuthService;

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

    tokens = {
      sign: jest.fn(),
      verify: jest.fn(),
    };

    service = new AuthService(repo, hasher, tokens);
  });

  it("login() - succès", async () => {
    repo.findByEmail.mockResolvedValue(sampleMember);
    hasher.compare.mockResolvedValue(true);
    tokens.sign.mockResolvedValue("jwt_token_123");

    const res = await service.login("jean@example.com", "secret123");

    expect(repo.findByEmail).toHaveBeenCalledWith("jean@example.com");
    expect(hasher.compare).toHaveBeenCalledWith("secret123", "hashed_pw");
    expect(tokens.sign).toHaveBeenCalled();
    expect(res.token).toBe("jwt_token_123");
    expect(res.member).toEqual({
      id: "u_1",
      firstname: "Jean",
      lastname: "Dupont",
      email: "jean@example.com",
      photo: undefined,
      profession: undefined,
      company: undefined,
      skills: undefined,
      membershipType: "Basic",
      isManager: false,
    });
  });

  it("login() - email inconnu -> erreur", async () => {
    repo.findByEmail.mockResolvedValue(null);

    await expect(service.login("nope@example.com", "x")).rejects.toThrow(
      "Identifiants invalides"
    );
  });

  it("login() - mot de passe invalide -> erreur", async () => {
    repo.findByEmail.mockResolvedValue(sampleMember);
    hasher.compare.mockResolvedValue(false);

    await expect(service.login("jean@example.com", "bad")).rejects.toThrow(
      "Identifiants invalides"
    );
  });

  it("verifyToken() - succès", async () => {
    tokens.verify.mockResolvedValue({ sub: "u_1" } as any);
    repo.findById.mockResolvedValue(sampleMember);

    const res = await service.verifyToken("token_xyz");

    expect(tokens.verify).toHaveBeenCalledWith("token_xyz");
    expect(repo.findById).toHaveBeenCalledWith("u_1");
    expect(res.member.email).toBe("jean@example.com");
  });

  it("verifyToken() - membre introuvable -> erreur", async () => {
    tokens.verify.mockResolvedValue({ sub: "u_missing" } as any);
    repo.findById.mockResolvedValue(null);

    await expect(service.verifyToken("token_xyz")).rejects.toThrow(
      "Membre non trouvé"
    );
  });
});
