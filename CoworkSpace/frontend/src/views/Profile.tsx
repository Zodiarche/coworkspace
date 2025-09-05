import { Member } from "../types/member";
import { useAuth } from "../contexts/auth";
import React, { useState, useEffect } from "react";

export type UpdateMemberInput = Omit<Member, "id" | "isManager"> & {
  password?: string;
};

const Profile = () => {
  const { user, update } = useAuth();

  const [tempUser, setTempUser] = useState<UpdateMemberInput>();

  // si `user` change dans le contexte, on met à jour le state local
  useEffect(() => {
    setTempUser(user!);
  }, [user]);

  const handleChange = (field: string, value: string) => {
    setTempUser((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { id, isManager, ...updatedUser } = tempUser!;
    update(updatedUser);
  };

  return (
    <section className="layout">
      <div className="profile">
        <h1>Modifier mon profil</h1>
        <p>Mettez à jour vos informations personnelles et professionnelles</p>

        <div className="profile-header">
          <img src={tempUser?.photo} alt="Avatar" className="profile-photo" />
          <h2>
            {tempUser?.firstname} {tempUser?.lastname}
          </h2>
          <p>{tempUser?.profession}</p>
        </div>

        <div className="profile-forms">
          <div className="profile-section">
            <h3>Informations personnelles</h3>
            <label>Prénom</label>
            <input
              type="text"
              value={tempUser?.firstname ?? ""}
              onChange={(e) => handleChange("firstname", e.target.value)}
            />
            <label>Nom</label>
            <input
              type="text"
              value={tempUser?.lastname ?? ""}
              onChange={(e) => handleChange("lastname", e.target.value)}
            />
            <label>Email</label>
            <input
              type="email"
              value={tempUser?.email ?? ""}
              onChange={(e) => handleChange("email", e.target.value)}
            />
            {/* <label>Téléphone</label>
            <input
              type="text"
              value={tempUser?.phone ?? ""}
              onChange={(e) => handleChange("phone", e.target.value)}
            />

            <label>Ville</label>
            <input
              type="text"
              value={tempUser?.city ?? ""}
              onChange={(e) => handleChange("city", e.target.value)}
            />
           <label>Pays</label>
            <input
              type="text"
              value={tempUser?.country ?? ""}
              onChange={(e) => handleChange("country", e.target.value)}
            />
            {/* */}
          </div>

          <div className="profile-section">
            <h3>Informations professionnelles</h3>
            <label>Profession</label>
            <input
              type="text"
              value={tempUser?.profession ?? ""}
              onChange={(e) => handleChange("profession", e.target.value)}
            />

            <label>Entreprise</label>
            <input
              type="text"
              value={tempUser?.company ?? ""}
              onChange={(e) => handleChange("company", e.target.value)}
            />

            <label>Compétences</label>
            <input
              type="text"
              value={tempUser?.skills ?? ""}
              onChange={(e) => handleChange("skills", e.target.value)}
            />
          </div>
        </div>

        {/* <div className="profile-section">
          <h3>À propos de moi</h3>
          <label>Biographie</label>
          <textarea
            rows={4}
            value={tempUser?.bio ?? ""}
            onChange={(e) => handleChange("bio", e.target.value)}
          />
        </div> */}

        <div>
          Sécurité
          <label>Mot de passe</label>
          <input
            type="password"
            value={tempUser?.password ?? ""}
            onChange={(e) => handleChange("password", e.target.value)}
          />
        </div>

        <button onClick={handleSubmit}>Confirmer</button>
      </div>
    </section>
  );
};

export default Profile;
