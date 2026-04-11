import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../auth/AuthContext";
import Button from "../components/Button";
import Card from "../components/Card";
import Field from "../components/Field";

export default function ResetPassword() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState(
    localStorage.getItem("pendingEmail") || localStorage.getItem("lastEmail") || ""
  );
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function resendCode() {
    setError("");
    setMessage("");
    setBusy(true);

    try {
      await api.post("/api/auth/reset-password", {
        email: email.trim().toLowerCase(),
      });
      setMessage("Код отправлен на почту, если такой email зарегистрирован.");
    } catch (requestError) {
      setError(requestError?.response?.data?.message || "Не удалось отправить код");
    } finally {
      setBusy(false);
    }
  }

  async function submit(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (newPassword !== confirmPassword) {
      setError("Пароли не совпадают");
      return;
    }

    if (!/^\d{6}$/.test(code)) {
      setError("Код должен состоять из 6 цифр");
      return;
    }

    setBusy(true);

    try {
      const safeEmail = email.trim().toLowerCase();

      await api.post("/api/auth/reset-password/confirm", {
        email: safeEmail,
        code: code.trim(),
        newPassword,
        confirmPassword,
      });

      await login(safeEmail, newPassword);

      setMessage("Пароль изменён. Сейчас откроем кабинет.");
      setTimeout(() => navigate("/categories"), 700);
    } catch (requestError) {
      setError(requestError?.response?.data?.message || "Не удалось сменить пароль");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="app-container pt-14 sm:pt-20">
      <Card
        title="Сброс пароля"
        description="Сначала укажите email и нажмите «Отправить код на почту». Затем введите код из письма и новый пароль."
        className="mx-auto max-w-4xl"
      >
        <form onSubmit={submit} className="grid gap-4 md:grid-cols-2">
          <Field
            label="Email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />

          <Field
            label="Код из письма"
            value={code}
            onChange={(event) =>
              setCode(event.target.value.replace(/\D/g, "").slice(0, 6))
            }
            placeholder="123456"
          />

          <Field
            label="Новый пароль"
            type="password"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
          />

          <Field
            label="Повторите пароль"
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
          />

          {error && (
            <div className="md:col-span-2 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {message && (
            <div className="md:col-span-2 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {message}
            </div>
          )}

          <div className="md:col-span-2 flex flex-wrap gap-3 pt-2">
            <Button type="submit" size="lg" disabled={busy}>
              Подтвердить и сменить пароль
            </Button>

            <Button type="button" size="lg" onClick={resendCode} disabled={busy}>
              Отправить код на почту
            </Button>

            <Link
              to="/login"
              className="inline-flex items-center text-sm font-semibold text-black/65 hover:text-black"
            >
              Вернуться ко входу
            </Link>

            <p className="w-full text-sm text-black/55">
              Сначала нажмите «Отправить код на почту». Если письмо не пришло, нажмите кнопку ещё раз.
            </p>
          </div>
        </form>
      </Card>
    </div>
  );
}