import { useEffect, useMemo, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { useTheme } from "../theme/ThemeContext";
import BrandMark from "./BrandMark";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

function navLinkClass({ isActive }, dark) {
  return [
    "rounded-full border px-4 py-3 text-sm font-medium transition lg:rounded-none lg:border-x-0 lg:border-t-0 lg:bg-transparent lg:px-0 lg:py-0 lg:pb-1",
    dark
      ? isActive
        ? "border-black bg-black text-white lg:border-black lg:bg-transparent lg:text-black"
        : "border-black/10 bg-white/70 text-black/70 hover:bg-white hover:text-black lg:border-transparent lg:bg-transparent lg:text-black/65 lg:hover:border-black/30"
      : isActive
        ? "border-white bg-white text-black lg:border-white lg:bg-transparent lg:text-white"
        : "border-white/10 bg-white/[0.03] text-white/80 hover:bg-white/10 hover:text-white lg:border-transparent lg:bg-transparent lg:text-white/75 lg:hover:border-white/30",
  ].join(" ");
}

function MenuButton({ dark, open, onClick }) {
  return (
    <button
      type="button"
      aria-label={open ? "Закрыть меню" : "Открыть меню"}
      aria-expanded={open}
      onClick={onClick}
      className={[
        "flex h-12 w-12 items-center justify-center rounded-2xl border transition lg:hidden",
        dark
          ? "border-black/10 bg-white/70 text-black hover:bg-white"
          : "border-white/10 bg-white/[0.03] text-white hover:bg-white/10",
      ].join(" ")}
    >
      <span className="relative block h-4 w-5">
        <span
          className={[
            "absolute left-0 top-0 block h-[2px] w-5 rounded-full bg-current transition-transform duration-200",
            open ? "translate-y-[7px] rotate-45" : "translate-y-0",
          ].join(" ")}
        />
        <span
          className={[
            "absolute left-0 top-[7px] block h-[2px] w-5 rounded-full bg-current transition-opacity duration-200",
            open ? "opacity-0" : "opacity-100",
          ].join(" ")}
        />
        <span
          className={[
            "absolute left-0 top-[14px] block h-[2px] w-5 rounded-full bg-current transition-transform duration-200",
            open ? "-translate-y-[7px] -rotate-45" : "translate-y-0",
          ].join(" ")}
        />
      </span>
    </button>
  );
}

export default function Navbar() {
  const { isAuthed, user, role, logout } = useAuth();
  const { isLight, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dark = isLight;
  const isTeamPage = location.pathname === "/team";

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const avatarSrc = user?.avatarUrl
    ? user.avatarUrl.startsWith("http://") || user.avatarUrl.startsWith("https://")
      ? user.avatarUrl
      : `${API_BASE}${user.avatarUrl}`
    : "";

  const publicLinks = useMemo(
    () => [
      { to: "/", label: "Главная" },
      { to: "/login", label: "Вход" },
      { to: "/register", label: "Регистрация" },
    ],
    []
  );

  const privateLinks = useMemo(
    () => [
      { to: "/", label: "Главная" },
      { to: "/categories", label: "Сообщить" },
      { to: "/my-incidents", label: "Мои обращения" },
      { to: "/incidents", label: "Все обращения" },
      { to: "/notifications", label: "Уведомления" },
      { to: "/profile", label: "Профиль" },
    ],
    []
  );

  const navLinks = isAuthed ? privateLinks : publicLinks;

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
    <header className="app-container pt-4 sm:pt-6 lg:pt-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between lg:gap-6">
        <div className="flex items-center justify-between gap-4">
          <Link to="/" className="min-w-0 flex-1 self-start">
            <BrandMark dark={dark} />
          </Link>
          <MenuButton dark={dark} open={isMenuOpen} onClick={() => setIsMenuOpen((current) => !current)} />
        </div>

        <div
          className={[
            "flex flex-col gap-4 lg:items-end",
            isMenuOpen ? "flex" : "hidden lg:flex",
          ].join(" ")}
        >
          <nav
            className={[
              "grid w-full gap-3 rounded-[1.8rem] border p-4 sm:grid-cols-2 lg:flex lg:w-auto lg:flex-wrap lg:items-center lg:gap-5 lg:rounded-none lg:border-0 lg:p-0 xl:gap-8",
              dark
                ? "border-black/10 bg-white/55 backdrop-blur lg:bg-transparent"
                : "border-white/10 bg-white/[0.03] backdrop-blur lg:bg-transparent",
            ].join(" ")}
          >
            {navLinks.map((item) => (
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

          <div className="grid w-full gap-3 sm:grid-cols-2 lg:flex lg:w-auto lg:flex-wrap lg:justify-end">
            <button
              type="button"
              onClick={toggleTheme}
              className={[
                "w-full rounded-full border px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] transition lg:w-auto lg:py-2",
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
                    "flex w-full items-center justify-between gap-3 rounded-full border px-3 py-2 text-xs uppercase tracking-[0.18em] sm:col-span-2 lg:w-auto lg:justify-start lg:py-1.5",
                    dark
                      ? "border-black/10 bg-white/70 text-black/70"
                      : "border-white/10 bg-white/5 text-white/65",
                  ].join(" ")}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full border border-current/10 bg-black/5">
                      {avatarSrc ? (
                        <img src={avatarSrc} alt="Аватар" className="h-full w-full object-cover" />
                      ) : (
                        <span className="text-[10px] font-black">
                          {String(user?.login || user?.email || "U")
                            .slice(0, 1)
                            .toUpperCase()}
                        </span>
                      )}
                    </div>

                    <span className="truncate">{user?.login || user?.email || "user"}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    logout();
                    navigate("/");
                  }}
                  className={[
                    "w-full rounded-full border px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] transition lg:w-auto lg:py-2",
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
