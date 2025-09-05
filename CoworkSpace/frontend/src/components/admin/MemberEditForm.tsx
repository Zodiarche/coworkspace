import { useState } from "react";
import type { Member, MembershipType } from "../../types/member";

export type UpdateMemberInput = Omit<Member, "id" | "isManager"> & {
  password?: string;
};

interface MemberEditFormProps {
  initial: UpdateMemberInput;
  isManager: boolean;
  onSubmit: (data: UpdateMemberInput) => void | Promise<void>;
  onAssignManager: () => void;
}

export default function MemberEditForm({
  initial,
  isManager,
  onSubmit,
  onAssignManager,
}: MemberEditFormProps) {
  const [form, setForm] = useState<UpdateMemberInput>(initial);

  function handleChange<K extends keyof UpdateMemberInput>(
    key: K,
    value: UpdateMemberInput[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await onSubmit(form);
  }

  return (
    <form onSubmit={handleSubmit} className="member-form">
      <label>
        Prénom
        <input
          type="text"
          value={form.firstname}
          onChange={(e) => handleChange("firstname", e.target.value)}
          required
        />
      </label>

      <label>
        Nom
        <input
          type="text"
          value={form.lastname}
          onChange={(e) => handleChange("lastname", e.target.value)}
          required
        />
      </label>

      <label>
        Email
        <input
          type="email"
          value={form.email}
          onChange={(e) => handleChange("email", e.target.value)}
          required
        />
      </label>

      <label>
        Photo (URL)
        <input
          type="url"
          value={form.photo || ""}
          onChange={(e) => handleChange("photo", e.target.value)}
        />
      </label>

      <label>
        Profession
        <input
          type="text"
          value={form.profession || ""}
          onChange={(e) => handleChange("profession", e.target.value)}
        />
      </label>

      <label>
        Entreprise
        <input
          type="text"
          value={form.company || ""}
          onChange={(e) => handleChange("company", e.target.value)}
        />
      </label>

      <label>
        Compétences (séparées par des virgules)
        <input
          type="text"
          defaultValue={form.skills.join(", ")}
          onChange={(e) =>
            handleChange(
              "skills",
              e.target.value
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean)
            )
          }
        />
      </label>

      <label>
        Type d’abonnement
        <select
          value={form.membershipType}
          onChange={(e) =>
            handleChange("membershipType", e.target.value as MembershipType)
          }
        >
          {["basic", "premium", "vip"].map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </label>

      <label>
        Mot de passe (laisser vide pour ne pas changer)
        <input
          type="password"
          value={form.password || ""}
          onChange={(e) => handleChange("password", e.target.value)}
          placeholder="Nouveau mot de passe"
        />
      </label>

      {isManager ? (
        "Est manager"
      ) : (
        <button type="button" onClick={onAssignManager}>
          Rendre le membre manager
        </button>
      )}
      <button type="submit">Enregistrer</button>
    </form>
  );
}
