// src/contexts/auth/AuthProvider.tsx
import React, { useState } from "react";
import type { Member } from "@/types/member";
import { AuthContext } from "./context";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Member | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function getMe() {
    console.log("getMe called !");
    setLoading(true);
    setError(null);
    try {
      setError(null);
      const res = await fetch("http://localhost:3000/api/auth/login/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (!res.ok) {
        setUser(null);
        return;
      }

      const me: Member = await res.json();
      console.log("User fetched: ", me);
      setUser(me);
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
      const res = await fetch("http://localhost:3000/api/auth/login", {
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
        await fetch("http://localhost:3000/api/auth/logout", {
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
    console.log("token: ", token);
    console.log("updatedUser: ", updatedUser);
    try {
      const res = await fetch("http://localhost:3000/api/members/me", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ ...updatedUser }),
      });
      const data = await res.json();
      console.log(data);
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
