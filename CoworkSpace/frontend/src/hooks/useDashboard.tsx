import { useEffect, useState } from "react";
import { Member } from "@/types/member";
import { useAuth } from "../contexts/auth";

type Status = "loading" | "ok" | "error";

export const useDashboard = () => {
  const [randomMember, setRandomMember] = useState<Member | null>(null);
  const [status, setStatus] = useState<Status>("loading");
  const [message, setMessage] = useState<string>("");

  const { user } = useAuth();

  const fetchRandomMember = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/members/random", {
        credentials: "include",
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setRandomMember(data);
      setStatus("ok");
    } catch (err) {
      setStatus("error");
      setMessage((err as Error).message);
    }
  };

  useEffect(() => {
    fetchRandomMember();
  }, []);

  return {
    user,
    randomMember,
    status,
    message,
    fetchRandomMember,
  };
};
