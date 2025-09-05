import { useNavigate } from "react-router-dom";
import { useMemberAdd } from "../../hooks/useMemberAdd";

export default function MemberAddForm() {
  const navigate = useNavigate();
  const {
    form,
    update,
    fieldErrors,
    submitting,
    error,
    onSubmit,
    genders,
    membershipTypes,
  } = useMemberAdd();

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
