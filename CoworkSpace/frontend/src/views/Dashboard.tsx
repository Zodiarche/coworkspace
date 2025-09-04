import RandomMemberCard from "../components/dashboard/RandomMemberCard";
import { useAuth } from "../contexts/auth";
import { useEffect, useState } from "react";

type Status = "loading" | "ok" | "error";
type HealthResponse = { ok: boolean };

export const Dashboard = () => {
  const [status, setStatus] = useState<Status>("loading");
  const [message, setMessage] = useState<string>("");
  const { user } = useAuth();

  const checkHealth = async () => {
    try {
      setStatus("loading");
      const res = await fetch("http://localhost:3000/health");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: HealthResponse = await res.json();
      if (data.ok === true) {
        setStatus("ok");
        setMessage("");
      } else {
        setStatus("error");
        setMessage("Réponse invalide");
      }
    } catch (err) {
      setStatus("error");
      setMessage((err as Error).message);
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  return (
    <section className="layout">
      <h1>Bonjour {user?.firstname}</h1>
      <RandomMemberCard />
    </section>
  );
};
