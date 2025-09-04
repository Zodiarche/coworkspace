import { useAuth } from "../../contexts/auth";
import { NavLink } from "react-router-dom";

export default function Header() {
  const { user } = useAuth();

  return (
    <header className="navbar">
      {/* Logo */}
      <div className="navbar__logo">
        <img src="/vite.svg" alt="CoworkSpace" />
        CoworkSpace
      </div>

      {/* Links */}
      <nav className="navbar__menu">
        <NavLink
          to="/dashboard"
          end
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/community"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Communauté
        </NavLink>
        <NavLink
          to="/events"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Événements
        </NavLink>
        <NavLink
          to="/settings"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Paramètres
        </NavLink>
      </nav>

      {/* Profile */}
      {user ? (
        <div className="navbar__right">
          <div className="navbar__profile">
            <img src={user.photo} alt="Profil" />
            <div className="navbar__info">
              <span className="navbar__name">{user.firstname}</span>
              <span className="navbar__role">{user.profession}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="navbar__right">
          <button onClick={() => console.log("Login")}>Se connecter</button>
        </div>
      )}
    </header>
  );
}
