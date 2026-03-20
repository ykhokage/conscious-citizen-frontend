import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/client";
import Button from "../components/Button";
import Card from "../components/Card";
import Field from "../components/Field";
import { clearPendingAuth } from "../utils/storage";

export default function VerifyEmail() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setEmail(localStorage.getItem("pendingEmail") || localStorage.getItem("lastEmail") || "");
  }, []);

  async function submit(event) {
    event.preventDefault();
    setMessage("");
    setError("");

    const safeEmail = String(email).trim().toLowerCase();
    const safeCode = String(code).replace(/\D/g, "").slice(0, 6);

    if (!safeEmail) {
      setError("Введите email");
      return;
    }

    if (!/^\d{6}$/.test(safeCode)) {
      setError("Код должен состоять из 6 цифр");
      return;
    }

    setBusy(true);

    try {
      await api.post("/api/auth/verify-email", { email: safeEmail, code: safeCode });
      localStorage.removeItem("pendingEmail");
      localStorage.setItem("lastEmail", safeEmail);
      clearPendingAuth();
      setMessage("Email подтверждён. Теперь можно войти в аккаунт.");
      setTimeout(() => navigate("/login"), 700);
    } catch (requestError) {
      setError(requestError?.response?.data?.message || "Не удалось подтвердить email");
    } finally {
      setBusy(false);
    }
  }

  async function resend() {
    setMessage("");
    setError("");

    if (!email.trim()) {
      setError("Введите email");
      return;
    }

    setBusy(true);

    try {
      const { data } = await api.post("/api/auth/resend-code", { email: email.trim().toLowerCase() });
      setMessage(data?.message || "Код отправлен повторно. Проверьте почту и папку со спамом.");
    } catch (requestError) {
      setError(requestError?.response?.data?.message || "Не удалось отправить код повторно");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="app-container pt-14 sm:pt-20">
      <Card
        title="Подтверждение email"
        description="Введите адрес и шестизначный код, который пришёл вам на почту после регистрации."
        className="mx-auto max-w-3xl"
      >
        <form onSubmit={submit} className="grid gap-4 md:grid-cols-2">
          <Field label="Email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
          <Field
            label="Код подтверждения"
            value={code}
            onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
            placeholder="123456"
          />

          {error && <div className="md:col-span-2 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
          {message && <div className="md:col-span-2 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</div>}

          <div className="md:col-span-2 flex flex-wrap gap-3 pt-2">
            <Button type="submit" size="lg" disabled={busy}>
              Подтвердить
            </Button>
            <Button type="button" variant="ghost" size="lg" onClick={resend} disabled={busy}>
              Отправить код на почту
            </Button>
            <Link to="/login" className="inline-flex items-center text-sm font-semibold text-black/65 hover:text-black">
              Вернуться ко входу
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
}
