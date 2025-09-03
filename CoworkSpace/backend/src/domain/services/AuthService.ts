import { MemberRepository } from "../interfaces/MemberRepository";
import { PasswordHasher } from "../interfaces/PasswordHasher";
import { TokenProvider } from "../interfaces/TokenProvider";
import { AuthResult } from "../value-objects/AuthResult";

export class AuthService {
  constructor(
    private readonly repo: MemberRepository,
    private readonly hasher: PasswordHasher,
    private readonly tokens: TokenProvider
  ) {}

  async login(email: string, password: string): Promise<AuthResult> {
    const member = await this.repo.findByEmail(email);
    if (!member) throw new Error("Identifiants invalides");

    const ok = await this.hasher.compare(password, member.password);
    if (!ok) throw new Error("Identifiants invalides");

    const token = await this.tokens.sign(
      { sub: member.id, email: member.email, isManager: member.isManager },
      Number(process.env.JWT_EXPIRES_IN)
    );

    return { token, member };
  }

  async verifyToken(token: string) {
    const payload = await this.tokens.verify(token);

    const member = await this.repo.findById(payload.sub);
    if (!member) throw new Error("Membre non trouvé");

    return { member };
  }
}
