import { useState } from "react";
import type { Member } from "@/types/member";
import { useAuth } from "../contexts/auth/useAuth";

export default function useLogin() {
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function signIn(email: string, password: string): Promise<boolean> {
    setLoading(true);
    setError(null);

    try {
      // (test avant d'intégrer le backend)
      const res = await fetch("/data/members.json");
      if (!res.ok) throw new Error("Impossible de charger les membres");

      const members: (Member & { password?: string })[] = await res.json();

      const found = members.find((m) => m.email === email);
      if (!found) {
        setError("Email inconnu");
        return false;
      }

      if (password !== "password") {
        setError("Mot de passe incorrect");
        return false;
      }

      login(found);
      return true;
    } catch (err) {
      setError((err as Error).message);
      return false;
    } finally {
      setLoading(false);
    }
  }

  return { signIn, error, loading };
}
