import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Card from "../components/Card";
import Field from "../components/Field";
import Button from "../components/Button";
import { useAuth } from "../auth/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const nav = useNavigate();

  const [form, setForm] = useState({
    login: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeRules: false,
    subscribe: true,
  });

  const [err, setErr] = useState("");

  async function submit(e) {
    e.preventDefault();
    setErr("");

    if (form.password !== form.confirmPassword) {
      setErr("Пароли не совпадают");
      return;
    }
    if (!form.agreeRules) {
      setErr("Нужно согласиться с правилами");
      return;
    }

    try {
      await register(form);
      nav("/profile");
    } catch (e2) {
      setErr(e2?.response?.data?.message || "Не удалось зарегистрироваться");
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <Card title="Регистрация">
        <form onSubmit={submit} className="space-y-3">
          <Field
            label="Логин"
            value={form.login}
            onChange={(e) => setForm({ ...form, login: e.target.value })}
          />
          <Field
            label="E-mail"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <Field
            label="Пароль"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <Field
            label="Подтверждение пароля"
            type="password"
            value={form.confirmPassword}
            onChange={(e) =>
              setForm({ ...form, confirmPassword: e.target.value })
            }
          />

          <label className="flex items-start gap-2 text-sm text-slate-300">
            <input
              type="checkbox"
              className="mt-1"
              checked={form.agreeRules}
              onChange={(e) =>
                setForm({ ...form, agreeRules: e.target.checked })
              }
            />
            <span>
              Я согласен с правилами проекта (пользовательское соглашение / политика)
            </span>
          </label>

          <label className="flex items-start gap-2 text-sm text-slate-300">
            <input
              type="checkbox"
              className="mt-1"
              checked={form.subscribe}
              onChange={(e) =>
                setForm({ ...form, subscribe: e.target.checked })
              }
            />
            <span>Получать рассылку о новостях проекта</span>
          </label>

          {err && <div className="text-sm text-red-400">{err}</div>}
          <Button type="submit" className="w-full">
            Зарегистрироваться
          </Button>
        </form>

        <div className="mt-4 text-sm text-slate-300">
          Уже есть аккаунт?{" "}
          <Link to="/login" className="hover:text-slate-100">
            Войти
          </Link>
        </div>
      </Card>
    </div>
  );
}
