import type { Member } from "../../types/member";
import { useAuth } from "../../contexts/auth";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL ?? "";

export default function MemberCard({
  member,
  onDeleted,
}: {
  member: Member;
  onDeleted?: () => void; // callback pour dire au parent de re-fetch
}) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isManager = !!user?.isManager;

  const handleDelete = async () => {
    if (!window.confirm(`Supprimer ${member.firstname} ${member.lastname} ?`))
      return;
    try {
      const res = await fetch(`${API}/admin/members/${member.id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        let msg = `HTTP ${res.status}`;
        try {
          const j = await res.json();
          msg = j.error || msg;
        } catch {}
        throw new Error(msg);
      }
      onDeleted?.(); // demande au parent de re-fetch la page courante
    } catch (e: any) {
      alert(`Échec de la suppression : ${e.message || e}`);
    }
  };

  const handleEdit = () => {
    navigate(`/members/${member.id}/edit`, { state: { member } });
  };

  return (
    <div className="member-card">
      <img
        className="member-photo"
        src={member.photo}
        alt={`${member.firstname} ${member.lastname}`}
      />
      <div className="member-info">
        <h3>
          {member.firstname} {member.lastname}
        </h3>
        {member.profession && <p>{member.profession}</p>}
        {member.city && member.country && (
          <p className="location">
            {member.city}, {member.country}
          </p>
        )}
      </div>

      {isManager && (
        <div className="member-actions">
          <button type="button" onClick={handleEdit}>
            Modifier
          </button>
          <button type="button" className="danger" onClick={handleDelete}>
            Supprimer
          </button>
        </div>
      )}
    </div>
  );
}
