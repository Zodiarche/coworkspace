import React from "react";
import MemberEditForm from "../components/admin/MemberEditForm";
import { useMemberEdit } from "../hooks/useMemberEdit";

const MemberEdit = () => {
  const { member, isManager, loading, err, handleAssignManager, handleSubmit } =
    useMemberEdit();

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
