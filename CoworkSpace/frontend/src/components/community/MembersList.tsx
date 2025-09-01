import MemberCard from "./MemberCard";
import type { Member } from "@/types/member";

export default function MembersList({ members }: { members: Member[] }) {
  return (
    <div className="members-list">
      {members.map((member) => (
        <MemberCard key={member.id} member={member} />
      ))}
    </div>
  );
}
