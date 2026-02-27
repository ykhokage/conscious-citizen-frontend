import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const navClass = ({ isActive }) =>
  `px-3 py-2 rounded-lg text-sm ${
    isActive ? "bg-slate-800" : "hover:bg-slate-900"
  }`;

export default function Navbar() {
  const { isAuthed, user, role, logout } = useAuth();
  const nav = useNavigate();

  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
      <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between gap-3 flex-wrap">
        <Link to="/" className="font-semibold tracking-tight">
          Сознательный гражданин
        </Link>

        {!isAuthed ? (
          <div className="flex gap-2">
            <NavLink to="/login" className={navClass}>
              Вход
            </NavLink>
            <NavLink to="/register" className={navClass}>
              Регистрация
            </NavLink>
          </div>
        ) : (
          <div className="flex items-center gap-2 flex-wrap">
            <NavLink to="/categories" className={navClass}>
              Рубрики
            </NavLink>
            <NavLink to="/my-incidents" className={navClass}>
              Мои сообщения
            </NavLink>
            <NavLink to="/all-incidents" className={navClass}>
              Все сообщения
            </NavLink>
            <NavLink to="/notifications" className={navClass}>
              Уведомления
            </NavLink>
            <NavLink to="/profile" className={navClass}>
              Профиль
            </NavLink>

            {role === "admin" && (
              <NavLink to="/admin" className={navClass}>
                Админ
              </NavLink>
            )}

            <div className="ml-2 flex items-center gap-2">
              <span className="text-xs text-slate-400">
                {user?.login || "user"}
              </span>
              <button
                onClick={() => {
                  logout();
                  nav("/login");
                }}
                className="px-3 py-2 rounded-lg text-sm bg-slate-800 hover:bg-slate-700"
              >
                Выйти
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
