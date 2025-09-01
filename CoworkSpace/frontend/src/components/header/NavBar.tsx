import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <header>
      <nav>
        <ul className="flex gap-6">
          <li>
            <NavLink to="/">Accueil</NavLink>
          </li>
          <li>
            <NavLink to="/community">Communauté</NavLink>
          </li>
          <li>
            <NavLink to="/profile">Profil</NavLink>
          </li>
          <li>
            <NavLink to="/events">Evénements</NavLink>
          </li>
          <li>
            <NavLink to="/signin">Connexion</NavLink>
          </li>
          <li>
            <NavLink to="/parameters">Paramètres</NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
}
