import { useAuth } from "../../contexts/auth";
import { NavLink } from "react-router-dom";

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="navbar">
      {/* Logo */}
      <div className="navbar__logo">
        <img src="/vite.svg" alt="CoworkSpace" />
        CoworkSpace
      </div>

      {/* Links */}
      <nav className="navbar__menu">
        {user && (
          <>
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

            {/* Profile */}
            <NavLink to="/profile">Mon profil</NavLink>

            <NavLink
              to="/login"
              className="navbar__profile-link"
              onClick={logout}
            >
              Se déconnecter
            </NavLink>
          </>
        )}
      </nav>
    </header>
  );
}
