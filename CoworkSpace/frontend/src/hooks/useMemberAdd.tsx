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

type FormState = {
  gender: "" | Gender;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  profession: string;
  membershipType: "" | MembershipType;
  joinDate: string; // "YYYY-MM-DD"
  isManager: boolean;
};

export const useMemberAdd = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState<FormState>({
    gender: "",
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    profession: "",
    membershipType: "",
    joinDate: todayISO(),
    isManager: false,
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const update =
    (key: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const v =
        e.currentTarget.type === "checkbox"
          ? (e.currentTarget as HTMLInputElement).checked
          : e.currentTarget.value;
      setForm((f) => ({ ...f, [key]: v as any }));
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
      navigate("/community");
    } catch (err: any) {
      setError(err.message || "Échec de la création du membre");
    } finally {
      setSubmitting(false);
    }
  }

  return {
    form,
    update,
    fieldErrors,
    submitting,
    error,
    onSubmit,
    genders,
    membershipTypes,
  };
};
