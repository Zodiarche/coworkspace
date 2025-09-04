import MemberCard from "./MemberCard";
import type { Member } from "../../types/member";

export default function MembersList({
  members,
  onDeleted,
}: {
  members: Member[];
  onDeleted?: () => void;
}) {
  return (
    <div className="members-list">
      {members.map((m) => (
        <MemberCard key={m.id} member={m} onDeleted={onDeleted} />
      ))}
    </div>
  );
}
