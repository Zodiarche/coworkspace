import { useEffect, useState } from "react";
import type { Member } from "@/types/member";
import { AuthContext } from "./context";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<Member | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem("auth:user");
    if (raw) {
      try {
        setUser(JSON.parse(raw));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const login = (member: Member) => {
    setUser(member);
    localStorage.setItem("auth:user", JSON.stringify(member));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("auth:user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
