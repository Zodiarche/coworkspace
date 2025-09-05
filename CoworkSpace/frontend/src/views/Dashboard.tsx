import { Member } from "@/types/member";
import RandomMemberCard from "../components/dashboard/RandomMemberCard";
import { useAuth } from "../contexts/auth";
import { useEffect, useState } from "react";

type Status = "loading" | "ok" | "error";
type HealthResponse = { ok: boolean };

export const Dashboard = () => {
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
    } catch (err) {
      setStatus("error");
      setMessage((err as Error).message);
    }
  };

  useEffect(() => {
    fetchRandomMember();
  }, []);

  return (
    <section className="layout">
      <h2>Bienvenue sur le tableau de bord !</h2>
      <RandomMemberCard member={randomMember} />
      <button onClick={fetchRandomMember}>Charger un membre aléatoire</button>
    </section>
  );
};
