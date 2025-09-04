import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL ?? ""; // ex: http://localhost:3000

type Gender = "male" | "female" | "other";
type MembershipType = "Basic" | "Premium" | "Enterprise";

const genders: Gender[] = ["female", "male", "other"];
const membershipTypes: MembershipType[] = ["Basic", "Premium", "Enterprise"];

// util: "YYYY-MM-DD" pour input[type=date]
function todayISO() {
  const d = new Date();
  const m = `${d.getMonth() + 1}`.padStart(2, "0");
  const day = `${d.getDate()}`.padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

export default function MemberAddForm() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    gender: "" as "" | Gender,
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    profession: "",
    membershipType: "" as "" | MembershipType,
    joinDate: todayISO(),
    isManager: false,
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const update =
    (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const v =
        e.currentTarget.type === "checkbox"
          ? (e.currentTarget as HTMLInputElement).checked
          : e.currentTarget.value;
      setForm((f) => ({ ...f, [key]: v }));
      setFieldErrors((fe) => ({ ...fe, [key as string]: "" })); // clear field error
    };

  function validateClient() {
    const fe: Record<string, string> = {};
    if (!form.gender) fe.gender = "Le genre est requis";
    if (!form.firstname.trim()) fe.firstname = "Le prénom est requis";
    if (!form.lastname.trim()) fe.lastname = "Le nom est requis";
    if (!form.email.trim()) fe.email = "L'email est requis";
    if (!form.password || form.password.length < 6)
      fe.password = "Mot de passe trop court (min 6 caractères)";
    if (!form.membershipType)
      fe.membershipType = "Le type d’abonnement est requis";
    if (!form.joinDate) fe.joinDate = "La date d’adhésion est requise";
    setFieldErrors(fe);
    return Object.keys(fe).length === 0;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    if (!validateClient()) return;

    setSubmitting(true);
    try {
      // payload conforme au schema backend
      const payload = {
        gender: form.gender,
        firstname: form.firstname.trim(),
        lastname: form.lastname.trim(),
        email: form.email.trim(),
        password: form.password,
        profession: form.profession.trim() || undefined,
        membershipType: form.membershipType,
        joinDate: form.joinDate, // "YYYY-MM-DD"
        isManager: Boolean(form.isManager),
      };

      const res = await fetch(`${API}/admin/members`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        // essaie de lire l’erreur structurée du backend
        let msg = `HTTP ${res.status}`;
        let details: any;
        try {
          const j = await res.json();
          msg = j.error || msg;
          details = j.details;
        } catch {}
        // si le backend renvoie details (ex. tableau [{ path, message }])
        if (Array.isArray(details)) {
          const fe: Record<string, string> = {};
          for (const d of details) {
            const path = Array.isArray(d.path) ? d.path.join(".") : d.path;
            if (path) fe[path] = d.message || "Invalide";
          }
          setFieldErrors(fe);
        }
        throw new Error(msg);
      }

      // succès → redirection (adapte la route cible)
      navigate("/community"); // par ex. vers la liste d’admin
    } catch (err: any) {
      setError(err.message || "Échec de la création du membre");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="layout">
      <h1>Créer un membre</h1>
      <form onSubmit={onSubmit} className="form-grid">
        {/* Genre */}
        <label>
          Genre *
          <select value={form.gender} onChange={update("gender")}>
            <option value="">— choisir —</option>
            {genders.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
          {fieldErrors.gender && (
            <span className="fe">{fieldErrors.gender}</span>
          )}
        </label>

        {/* Prénom */}
        <label>
          Prénom *
          <input
            type="text"
            value={form.firstname}
            onChange={update("firstname")}
            placeholder="Sarah"
          />
          {fieldErrors.firstname && (
            <span className="fe">{fieldErrors.firstname}</span>
          )}
        </label>

        {/* Nom */}
        <label>
          Nom *
          <input
            type="text"
            value={form.lastname}
            onChange={update("lastname")}
            placeholder="Martin"
          />
          {fieldErrors.lastname && (
            <span className="fe">{fieldErrors.lastname}</span>
          )}
        </label>

        {/* Email */}
        <label>
          Email *
          <input
            type="email"
            value={form.email}
            onChange={update("email")}
            placeholder="sarah.martin@example.com"
          />
          {fieldErrors.email && <span className="fe">{fieldErrors.email}</span>}
        </label>

        {/* Mot de passe */}
        <label>
          Mot de passe *
          <input
            type="password"
            value={form.password}
            onChange={update("password")}
            placeholder="min 6 caractères"
          />
          {fieldErrors.password && (
            <span className="fe">{fieldErrors.password}</span>
          )}
        </label>

        {/* Profession (optionnelle) */}
        <label>
          Profession
          <input
            type="text"
            value={form.profession}
            onChange={update("profession")}
            placeholder="Développeur, Designer…"
          />
        </label>

        {/* Type d’abonnement */}
        <label>
          Type d’abonnement *
          <select
            value={form.membershipType}
            onChange={update("membershipType")}
          >
            <option value="">— choisir —</option>
            {membershipTypes.map((mt) => (
              <option key={mt} value={mt}>
                {mt}
              </option>
            ))}
          </select>
          {fieldErrors.membershipType && (
            <span className="fe">{fieldErrors.membershipType}</span>
          )}
        </label>

        {/* Date d'adhésion */}
        <label>
          Date d’adhésion *
          <input
            type="date"
            value={form.joinDate}
            onChange={update("joinDate")}
          />
          {fieldErrors.joinDate && (
            <span className="fe">{fieldErrors.joinDate}</span>
          )}
        </label>

        {/* Manager */}
        <label className="checkbox">
          <input
            type="checkbox"
            checked={form.isManager}
            onChange={update("isManager")}
          />
          Manager ?
        </label>

        {/* Actions */}
        <div className="actions">
          <button
            type="button"
            onClick={() => navigate(-1)}
            disabled={submitting}
          >
            Annuler
          </button>
          <button type="submit" disabled={submitting}>
            {submitting ? "Création…" : "Créer"}
          </button>
        </div>

        {/* Erreur globale */}
        {error && <p className="error">{error}</p>}
      </form>
    </section>
  );
}
