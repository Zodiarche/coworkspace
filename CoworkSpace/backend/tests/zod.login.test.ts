import { describe, it, expect } from "@jest/globals";
import { loginSchema } from "../src/application/dto/LoginRequestDTO";

describe("Zod - loginSchema", () => {
  it("valide un payload correct", () => {
    const parsed = loginSchema.parse({ email: "USER@Example.com", password: "secret123" });
    expect(parsed.email).toBe("user@example.com"); // toLowerCase()
  });

  it("rejette un payload invalide", () => {
    expect(() => loginSchema.parse({ email: "not-an-email", password: "123" })).toThrow();
  });
});
