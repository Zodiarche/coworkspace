// src/contexts/auth/AuthProvider.tsx
import React, { useEffect, useState } from "react";
import type { Member } from "@/types/member";
import { AuthContext } from "./context";

const TOKEN_KEY = "auth:token"; // sessionStorage key

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Member | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Au montage : restaure le token depuis sessionStorage puis refresh le user
  useEffect(() => {
    const t = sessionStorage.getItem(TOKEN_KEY);
    if (t) setToken(t);
    refresh(t ?? null).finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function refresh(existingToken?: string | null) {
    const tk = existingToken ?? token;
    if (!tk) {
      setUser(null);
      return;
    }
    try {
      setError(null);
      const res = await fetch("http://localhost:3000/api/auth/me", {
        headers: { Authorization: `Bearer ${tk}` },
      });
      if (!res.ok) {
        setUser(null);
        return;
      }
      const me: Member = await res.json();
      setUser(me);
    } catch {
      setUser(null);
      setError("Impossible de récupérer la session.");
    }
  }

  async function login(email: string, password: string): Promise<boolean> {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json().catch(() => ({}));
      console.log("data :", data);

      if (data.token && data.member) {
        setToken(data.token);
        setUser(data.member);
      } else {
        setError("Connexion impossible");
        return false;
      }

      return true;
    } catch {
      setError("Erreur réseau.");
      return false;
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    setLoading(true);
    setError(null);
    try {
      if (token) {
        await fetch("http://localhost:3000/api/auth/logout", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });
      }
    } finally {
      setUser(null);
      setToken(null);
      sessionStorage.removeItem(TOKEN_KEY);
      setLoading(false);
    }
  }

  return (
    <AuthContext.Provider
      value={{ user, token, loading, error, login, logout, refresh }}
    >
      {children}
    </AuthContext.Provider>
  );
}
