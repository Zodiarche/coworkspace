import { useEffect, useState } from "react";
import MemberCount from "../components/community/MemberCount";
import MembersList from "../components/community/MembersList";
import type { Member } from "@/types/member";

export const Community = () => {
  const [members, setMembers] = useState<Member[]>([]);

  useEffect(() => {
    fetch("/data/members.json")
      .then((res) => res.json())
      .then((data) => setMembers(data))
      .catch((err) => console.error("Erreur de chargement :", err));
  }, []);

  return (
    <>
      <h1>Découvrir la Communauté</h1>
      <p>
        Rencontrez des professionnels passionés, échangez vos compétences et
        développez votre réseau
      </p>

      <MemberCount members={members} />
      <MembersList members={members} />
    </>
  );
};
