import MemberCard from "./MemberCard";

interface Member {
  id: string;
  firstname: string;
  lastname: string;
  profession: string;
  city: string;
  country: string;
  photo: string;
}

export default function MembersList({ members }: { members: Member[] }) {
  return (
    <div className="members-list">
      {members.map((member) => (
        <MemberCard key={member.id} member={member} />
      ))}
    </div>
  );
}
