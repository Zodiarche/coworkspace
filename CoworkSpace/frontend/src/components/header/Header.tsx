import { useState } from "react";
import { useAuth } from "../../contexts/auth";
import { NavLink } from "react-router-dom";

export default function Header() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <header className="navbar">
      <div className="navbar__logo">
        <img src="/vite.svg" alt="CoworkSpace" />
        CoworkSpace
      </div>

      {user && (
        <>
          {/* Desktop identique à avant */}
          <div className="desktop-only">
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
              <NavLink to="/profile">Mon profil</NavLink>
              <NavLink
                to="/login"
                className="navbar__profile-link"
                onClick={logout}
              >
                Se déconnecter
              </NavLink>
            </nav>
          </div>

          {/* Mobile : bouton + drawer pleine largeur */}
          <div className="mobile-only">
            <button
              className="navbar__burger"
              aria-label="Ouvrir le menu"
              aria-expanded={open}
              aria-controls="mobileMenu"
              onClick={() => setOpen((o) => !o)}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>

            <div
              id="mobileMenu"
              className={`navbar__drawer ${open ? "is-open" : ""}`}
            >
              <NavLink to="/dashboard" end onClick={close}>
                Dashboard
              </NavLink>
              <NavLink to="/community" onClick={close}>
                Communauté
              </NavLink>
              <NavLink to="/profile" onClick={close}>
                Mon profil
              </NavLink>
              <button
                className="logout"
                onClick={() => {
                  logout();
                  close();
                }}
              >
                Se déconnecter
              </button>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
