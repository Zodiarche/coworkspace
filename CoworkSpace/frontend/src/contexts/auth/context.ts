import { createContext } from "react";
import type { Member } from "@/types/member";

export type AuthContextValue = {
  user: Member | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  getMe: () => Promise<void>;
  update: (updatedUser: Partial<Member>) => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined
);
