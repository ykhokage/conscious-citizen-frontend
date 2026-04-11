import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Card from "../components/Card";
import Field from "../components/Field";
import { useAuth } from "../auth/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ login: localStorage.getItem("lastEmail") || "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setError("");
    setBusy(true);

    try {
      await login(form.login, form.password);
      const next = location.state?.from || "/";
      navigate(next);
    } catch (requestError) {
      const status = requestError?.response?.status;
      const message = requestError?.response?.data?.message || "Не удалось войти";

      if (status === 403) {
        setError("Email ещё не подтверждён. Завершите подтверждение почты после регистрации, затем войдите снова.");
      } else {
        setError(message);
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="app-container pt-14 sm:pt-20">
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div className="pt-4">
          <div className="section-kicker">личный кабинет</div>
          <h1 className="mt-4 text-5xl font-black uppercase leading-[0.95] sm:text-6xl">Вход</h1>
          <p className="mt-6 max-w-lg text-sm leading-7 text-[color:var(--muted-fg)] sm:text-base">
            Авторизуйтесь, чтобы подавать обращения, сохранять черновики и отслеживать статус своих сообщений.
          </p>
        </div>

        <Card
          title="Добро пожаловать"
          description="Введите логин или email и пароль."
          className="max-w-2xl justify-self-end"
        >
          <form onSubmit={submit} className="space-y-4">
            <Field
              label="Логин или email"
              value={form.login}
              onChange={(event) => setForm((current) => ({ ...current, login: event.target.value }))}
              placeholder="ivanov или ivanov@mail.ru"
            />
            <Field
              label="Пароль"
              type="password"
              value={form.password}
              onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
              placeholder="••••••••"
            />
            {error && <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
            <div className="flex flex-wrap gap-3 pt-2">
              <Button type="submit" size="lg" disabled={busy} className="min-w-[190px]">
                {busy ? "Входим..." : "Войти"}
              </Button>
              <Link to="/reset-password">
                <Button type="button"  size="lg">
                  Забыли пароль?
                </Button>
              </Link>
            </div>
          </form>

          <div className="mt-8 border-t border-black/10 pt-6 text-sm text-black/60">
            Нет аккаунта? <Link to="/register" className="font-semibold text-black">Создать профиль</Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
