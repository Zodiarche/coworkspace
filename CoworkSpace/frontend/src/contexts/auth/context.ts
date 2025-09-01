import { createContext } from "react";
import type { Member } from "@/types/member";

export type AuthContextValue = {
  user: Member | null;
  login: (user: Member) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined
);
