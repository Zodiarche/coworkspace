import bcrypt from "bcryptjs";
import { PasswordHasher } from "../../domain/interfaces/PasswordHasher";

export class BcryptPasswordHasher implements PasswordHasher {
  async hash(plain: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);

    return bcrypt.hash(plain, salt);
  }

  async compare(plain: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plain, hash);
  }
}
