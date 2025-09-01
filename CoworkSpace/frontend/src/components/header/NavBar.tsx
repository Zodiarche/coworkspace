import { NavLink } from "react-router-dom";

export default function NavBar() {
  return (
    <header className="navbar">
      {/* Logo */}
      <div className="navbar__logo">
        <img src="/logo.svg" alt="CoworkSpace" />
        CoworkSpace
      </div>

      {/* Links */}
      <nav className="navbar__menu">
        <NavLink
          to="/"
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
      <div className="navbar__right">
        <div className="navbar__profile">
          <img src="/profile.jpg" alt="Profil" />
          <div className="navbar__info">
            <span className="navbar__name">Bocar Coly</span>
            <span className="navbar__role">Architecte logiciel</span>
          </div>
        </div>
      </div>
    </header>
  );
}
