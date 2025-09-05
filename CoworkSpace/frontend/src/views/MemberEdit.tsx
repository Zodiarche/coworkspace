import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { Member } from "../types/member";
import MemberEditForm from "../components/admin/MemberEditForm";

type UpdateMemberInput = Omit<Member, "id" | "isManager">;

const API_BASE = "http://localhost:3000";

const MemberEdit = () => {
  const { id } = useParams<{ id: string }>();
  const nav = useNavigate();

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
          const msg = await res.json().catch(() => ({}));
          throw new Error(
            msg.message || `Échec du chargement (HTTP ${res.status})`
          );
        }

        const data: Member = await res.json();
        // on enlève id / isManager
        const { id: _, isManager, ...updateFields } = data;
        setMember(updateFields);
        setIsManager(isManager);
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
        const msg = await res.json().catch(() => ({}));
        throw new Error(
          msg.message || `Échec de l'attribution du rôle (HTTP ${res.status})`
        );
      }
      setMember((prev) => (prev ? { ...prev, isManager: true } : prev));
    } catch (e) {
      setErr((e as Error).message);
    }
  }

  async function handleSubmit(payload: UpdateMemberInput) {
    if (!id) return;

    try {
      const res = await fetch(`${API_BASE}/api/admin/members/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });
    } catch (e) {}
  }

  if (loading)
    return (
      <section className="layout">
        <p>Chargement…</p>
      </section>
    );
  if (err)
    return (
      <section className="layout">
        <p style={{ color: "red" }}>{err}</p>
      </section>
    );
  if (!member)
    return (
      <section className="layout">
        <p>Membre introuvable</p>
      </section>
    );

  return (
    <section className="layout">
      <h2>Modifier un membre</h2>
      <MemberEditForm
        initial={member}
        isManager={isManager}
        onAssignManager={handleAssignManager}
        onSubmit={handleSubmit}
      />
    </section>
  );
};

export default MemberEdit;
