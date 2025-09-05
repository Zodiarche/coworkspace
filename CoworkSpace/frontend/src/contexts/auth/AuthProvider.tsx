import React, { useState } from "react";
import type { Member } from "@/types/member";
import { AuthContext } from "./context";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Member | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const BASE_API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  async function getMe() {
    setLoading(true);
    setError(null);
    try {
      setError(null);
      const res = await fetch(`${BASE_API_URL}/auth/login/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (!res.ok) {
        setUser(null);
        return;
      }

      const me = await res.json();
      setUser(me.member);
    } catch {
      setUser(null);
      setError("Impossible de récupérer la session.");
    } finally {
      setLoading(false);
    }
  }

  async function login(email: string, password: string): Promise<boolean> {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BASE_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json().catch(() => ({}));

      if (data.token && data.member) {
        setToken(data.token);
        setUser(data.member);
      }
      return true;
    } catch {
      setError("Erreur lors de la connexion.");
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
        await fetch(`${BASE_API_URL}/auth/logout`, {
          method: "POST",
          credentials: "include",
        });
      }
    } finally {
      setUser(null);
      setToken(null);
      setLoading(false);
    }
  }

  async function update(updatedUser: Partial<Member>) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BASE_API_URL}/members/me`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ ...updatedUser }),
      });
      const data = await res.json();
      setUser({ ...data });
    } catch {
      setError("Erreur lors de la modification du profil.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        login,
        logout,
        getMe,
        update,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
