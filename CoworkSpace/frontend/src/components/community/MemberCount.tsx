import type { Member } from "@/types/member";

export default function MemberCount({ members }: { members: Member[] }) {
  return (
    <p>
      Nombre de membres : <strong>{members.length}</strong>
    </p>
  );
}
