import { useEffect, useState } from "react";
import type { Member } from "@/types/member";

export default function useCommunity() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filter, setFilter] = useState<string>("");

  useEffect(() => {
    async function fetchMembers() {
      try {
        setLoading(true);
        const res = await fetch("/data/members.json");
        if (!res.ok) throw new Error("Impossible de charger les membres");
        const data = await res.json();
        setMembers(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }

    fetchMembers();
  }, []);

  // Logique de filtrage (optionnelle)
  const filteredMembers = filter
    ? members.filter((member) =>
        member.skills.some((skill) =>
          skill.toLowerCase().includes(filter.toLowerCase())
        )
      )
    : members;

  return {
    members: filteredMembers,
    loading,
    error,
    setFilter, // pour changer le filtre depuis un input
    total: members.length,
  };
}
