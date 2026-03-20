import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { useTheme } from "../theme/ThemeContext";
import BrandMark from "./BrandMark";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

function navLinkClass({ isActive }, dark) {
  return [
    "border-b pb-1 text-sm font-medium transition",
    dark
      ? isActive
        ? "border-black text-black"
        : "border-transparent text-black/65 hover:border-black/30 hover:text-black"
      : isActive
        ? "border-white text-white"
        : "border-transparent text-white/75 hover:border-white/30 hover:text-white",
  ].join(" ");
}

export default function Navbar() {
  const { isAuthed, user, role, logout } = useAuth();
  const { isLight, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const dark = isLight;
  const isTeamPage = location.pathname === "/team";

  const avatarSrc = user?.avatarUrl
    ? user.avatarUrl.startsWith("http://") || user.avatarUrl.startsWith("https://")
      ? user.avatarUrl
      : `${API_BASE}${user.avatarUrl}`
    : "";

  const publicLinks = [
    { to: "/", label: "Главная" },
    { to: "/login", label: "Вход" },
    { to: "/register", label: "Регистрация" },
  ];

  const privateLinks = [
    { to: "/", label: "Главная" },
    { to: "/categories", label: "Сообщить" },
    { to: "/my-incidents", label: "Мои обращения" },
    { to: "/incidents", label: "Все обращения" },
    { to: "/notifications", label: "Уведомления" },
    { to: "/profile", label: "Профиль" },
  ];

  if (isTeamPage) {
    return (
      <header className="app-container pt-5 sm:pt-6">
        <div className="flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3">
            <BrandMark dark={dark} />
          </Link>
        </div>
      </header>
    );
  }

  return (
    <header className="app-container pt-6 sm:pt-8">
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <Link to="/" className="self-start">
          <BrandMark dark={dark} />
        </Link>

        <div className="flex flex-col items-start gap-4 md:items-end">
          <nav className="flex flex-wrap items-center gap-5 sm:gap-8">
            {(isAuthed ? privateLinks : publicLinks).map((item) => (
              <NavLink key={item.to} to={item.to} className={(state) => navLinkClass(state, dark)}>
                {item.label}
              </NavLink>
            ))}

            {isAuthed && role === "admin" && (
              <NavLink to="/admin" className={(state) => navLinkClass(state, dark)}>
                Админ
              </NavLink>
            )}
          </nav>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={toggleTheme}
              className={[
                "rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition",
                dark
                  ? "border-black/10 bg-white/70 text-black/70 hover:bg-white hover:text-black"
                  : "border-white/10 bg-white/5 text-white/75 hover:bg-white/10 hover:text-white",
              ].join(" ")}
            >
              {isLight ? "Тёмная тема" : "Светлая тема"}
            </button>

            {isAuthed && (
              <>
                <div
                  className={[
                    "flex items-center gap-3 rounded-full border px-3 py-1.5 text-xs uppercase tracking-[0.18em]",
                    dark
                      ? "border-black/10 bg-white/70 text-black/70"
                      : "border-white/10 bg-white/5 text-white/65",
                  ].join(" ")}
                >
                  <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-current/10 bg-black/5">
                    {avatarSrc ? (
                      <img
                        src={avatarSrc}
                        alt="Аватар"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-[10px] font-black">
                        {String(user?.login || user?.email || "U")
                          .slice(0, 1)
                          .toUpperCase()}
                      </span>
                    )}
                  </div>

                  <span>{user?.login || user?.email || "user"}</span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    logout();
                    navigate("/");
                  }}
                  className={[
                    "rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition",
                    dark
                      ? "border-black/10 bg-white/70 text-black/65 hover:bg-white hover:text-black"
                      : "border-white/10 text-white/75 hover:bg-white/10",
                  ].join(" ")}
                >
                  Выйти
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}