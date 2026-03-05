import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Card from "../components/Card";
import Field from "../components/Field";
import Button from "../components/Button";
import { useAuth } from "../auth/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ login: "", password: "" });
  const [err, setErr] = useState("");

  async function submit(e) {
    e.preventDefault();
    setErr("");

    try {
      await login(form.login, form.password);
      nav("/categories");
    } catch (e2) {
      const status = e2?.response?.status;
      const message = e2?.response?.data?.message || "Не удалось войти";

      // ✅ если сервер говорит "почта не подтверждена" — ведём на /verify-email
      if (status === 403) {
        // если пользователь ввёл email вместо логина — сохраним его
        const v = String(form.login || "").trim();
        if (v.includes("@")) {
          localStorage.setItem("pendingEmail", v.toLowerCase());
        }
        nav("/verify-email");
        return;
      }

      setErr(message);
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <Card title="Вход">
        <form onSubmit={submit} className="space-y-3">
          <Field
            label="Логин (или email)"
            value={form.login}
            onChange={(e) => setForm({ ...form, login: e.target.value })}
          />
          <Field
            label="Пароль"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          {err && <div className="text-sm text-red-400">{err}</div>}

          <Button type="submit" className="w-full">
            Войти
          </Button>
        </form>

        <div className="mt-4 flex items-center justify-between text-sm text-slate-300">
          <Link to="/reset-password" className="hover:text-slate-100">
            Забыли пароль?
          </Link>
          <Link to="/register" className="hover:text-slate-100">
            Регистрация
          </Link>
        </div>
      </Card>
    </div>
  );
}