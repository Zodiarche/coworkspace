import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Member } from "../types/member";

export type UpdateMemberInput = Omit<Member, "id" | "isManager"> & {
  password?: string;
};

const API_BASE = "http://localhost:3000";

export function useMemberEdit() {
  const { id } = useParams<{ id: string }>();

  const [member, setMember] = useState<UpdateMemberInput | null>(null);
  const [isManager, setIsManager] = useState(false);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setErr("Identifiant manquant.");
      setLoading(false);
      return;
    }

    (async () => {
      try {
        setLoading(true);
        setErr(null);

        const res = await fetch(`${API_BASE}/api/admin/members/${id}`, {
          credentials: "include",
        });

        if (!res.ok) {
          const msg = await res.json().catch(() => ({} as any));
          throw new Error(
            (msg as any).message || `Échec du chargement (HTTP ${res.status})`
          );
        }

        const data: Member = await res.json();

        // ⚠️ renommer pour éviter le conflit avec la constante `id` des params
        const { id: _unused, isManager: manager, ...updateFields } = data;

        setMember(updateFields);
        setIsManager(Boolean(manager));
      } catch (e) {
        setErr((e as Error).message);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  async function handleAssignManager() {
    if (!id) return;

    try {
      const res = await fetch(
        `${API_BASE}/api/admin/members/${id}/assign-manager`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (!res.ok) {
        const msg = await res.json().catch(() => ({} as any));
        throw new Error(
          (msg as any).message ||
            `Échec de l'attribution du rôle (HTTP ${res.status})`
        );
      }
      setIsManager(true);
    } catch (e) {
      setErr((e as Error).message);
    }
  }

  async function handleSubmit(payload: UpdateMemberInput) {
    if (!id) return;

    const {
      firstname,
      lastname,
      email,
      password,
      photo,
      profession,
      company,
      skills,
      membershipType,
    } = payload;

    const body = {
      firstname,
      lastname,
      email,
      password,
      photo,
      profession,
      company,
      skills,
      membershipType,
    };

    try {
      await fetch(`${API_BASE}/api/admin/members/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });
    } catch {
      // même comportement que ta version : pas de gestion supplémentaire
    }
  }

  return {
    member,
    isManager,
    loading,
    err,
    handleAssignManager,
    handleSubmit,
  };
}
