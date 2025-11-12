import { useState, useContext, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, LogOut } from "lucide-react";
import { AuthContext } from "../contexts/AuthContext.jsx";

export default function Navbar() {
  const location = useLocation();
  const { user, logout } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const linkClasses = (path) =>
    `hover:text-secondary transition ${location.pathname === path ? "text-secondary font-semibold" : ""
    }`;

  return (
    <nav className="fixed top-0 left-0 right-0 bg-primary text-white shadow-md z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-12">
          <Link to="/" className="text-lg font-semibold">
            DealPlay
          </Link>

          <div className="hidden md:flex gap-5">
            <Link to="/" className={linkClasses("/")}>
              Início
            </Link>

            {user?.role === "admin" && (
              <>
                <Link to="/users" className={linkClasses("/users")} testid="navbar-users-link">
                  Usuários
                </Link>

                <Link to="/games" className={linkClasses("/games")} testid="navbar-games-link">
                  Jogos
                </Link>

                <Link to="/playlogs" className={linkClasses("/playlogs")} testid="navbar-playlogs-link">
                  PlayLogs
                </Link>
              </>
            )}

            {user?.role !== "admin" && (
              <>
                <Link to="/games/popular" className={linkClasses("/games/popular")}>
                  Populares
                </Link>

                <Link to="/deals/best" className={linkClasses("/deals/best")}>
                  Ofertas
                </Link>

                <Link to="/games/search" className={linkClasses("/games/search")}>
                  Buscar
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="hidden md:flex items-center gap-4 relative" ref={menuRef}>
          <button
            onClick={() => setUserMenuOpen((prev) => !prev)}
            className="flex items-center gap-1 font-semibold hover:text-secondary transition focus:outline-none"
          >
            <span>Olá, {user?.name}</span>
            <ChevronDown
              className={`w-4 h-4 transition-transform ${userMenuOpen ? "rotate-180" : ""
                }`}
              testid="navbar-user-menu"
            />
          </button>

          <div
            className={`absolute right-0 top-10 bg-white text-gray-700 rounded-md shadow-lg w-44 border border-gray-200 transform transition-all duration-200 origin-top-right
              ${userMenuOpen
                ? "scale-100 opacity-100"
                : "scale-95 opacity-0 pointer-events-none"
              }`}
          >
            <Link
              to="/profile"
              className="block px-4 py-2 text-sm hover:bg-gray-100 transition"
              onClick={() => setUserMenuOpen(false)}
            >
              Ver perfil
            </Link>
            <Link
              to="/profile/edit"
              className="block px-4 py-2 text-sm hover:bg-gray-100 transition"
              onClick={() => setUserMenuOpen(false)}
            >
              Editar perfil
            </Link>
            <button
              onClick={logout}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center gap-1 transition"
              testid="navbar-logout-btn"
            >
              <LogOut className="w-4 h-4" />
              Sair
            </button>
          </div>
        </div>

        <button
          className="md:hidden p-2 rounded hover:bg-blue-800 transition"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {menuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-primary border-t border-blue-800 px-6 py-3 space-y-2">
          <Link
            to="/"
            className={`${linkClasses("/")} block`}
            onClick={() => setMenuOpen(false)}
          >
            Início
          </Link>

          {user?.role === "admin" && (
            <>
              <Link
                to="/users"
                className={`${linkClasses("/users")} block`}
                onClick={() => setMenuOpen(false)}
              >
                Usuários
              </Link>

              <Link
                to="/games"
                className={`${linkClasses("/games")} block`}
                onClick={() => setMenuOpen(false)}
              >
                Jogos
              </Link>

              <Link
                to="/playlogs"
                className={`${linkClasses("/playlogs")} block`}
                onClick={() => setMenuOpen(false)}
              >
                PlayLogs
              </Link>
            </>
          )}

          {user?.role !== "admin" && (
            <>
              <Link
                to="/games/popular"
                className={`${linkClasses("/games/popular")} block`}
                onClick={() => setMenuOpen(false)}
              >
                Populares
              </Link>

              <Link
                to="/deals/best"
                className={`${linkClasses("/deals/best")} block`}
                onClick={() => setMenuOpen(false)}
              >
                Ofertas
              </Link>

              <Link
                to="/games/search"
                className={`${linkClasses("/games/search")} block`}
                onClick={() => setMenuOpen(false)}
              >
                Buscar
              </Link>
            </>
          )}

          <Link
            to="/profile"
            className={`${linkClasses("/profile")} block`}
            onClick={() => setMenuOpen(false)}
          >
            Perfil
          </Link>

          <hr className="border-blue-800 my-2" />

          <div className="flex items-center justify-between">
            <span>
              <b>{user?.name}</b>
            </span>
            <button
              onClick={() => {
                setMenuOpen(false);
                logout();
              }}
              className="bg-white text-primary font-semibold px-3 py-1 rounded hover:bg-gray-100 transition"
            >
              Sair
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
