import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import LanguageButton from "./LanguageButton";

function Navbar() {
  const { t } = useTranslation();
  return (
    <nav className="navbar navbar-expand navbar-dark bg-dark">
      <div className="container-fluid">
        <ul className="navbar-nav ">
          <li className="nav-item">
            <NavLink className="nav-link" aria-current="page" to="/">
              {t("nav_browser")}
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/roots">
              {t("nav_roots")}
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/notes">
              {t("nav_notes")}
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/translation">
              {t("nav_translation")}
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/coloring">
              {t("nav_coloring")}
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/tags">
              {t("nav_tags")}
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/inspector">
              {t("nav_inspector")}
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/about">
              {t("nav_about")}
            </NavLink>
          </li>
        </ul>
        <LanguageButton />
      </div>
    </nav>
  );
}

export default Navbar;
