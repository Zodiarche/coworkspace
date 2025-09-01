interface Member {
  id: number;
  firstname: string;
  lastname: string;
  profession: string;
}

export default function MemberCount({ members }: { members: Member[] }) {
  return (
    <p>
      Nombre de membres : <strong>{members.length}</strong>
    </p>
  );
}
