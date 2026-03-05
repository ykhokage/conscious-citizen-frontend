import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Card from "../components/Card";
import Field from "../components/Field";
import Button from "../components/Button";
import api from "../api/client";
import { useAuth } from "../auth/AuthContext";
export default function VerifyEmail() {
  const nav = useNavigate();

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    const pending = localStorage.getItem("pendingEmail") || "";
    if (pending) setEmail(pending);
  }, []);

  async function submit(e) {
    e.preventDefault();
    setErr("");
    setMsg("");

    const eMail = String(email).trim().toLowerCase();
    const c = String(code).trim();

    if (!eMail) return setErr("Введите email");
    if (!/^\d{6}$/.test(c)) return setErr("Код должен быть из 6 цифр");

    setBusy(true);
    try {
      await api.post("/api/auth/verify-email", { email: eMail, code: c });
      setMsg("Email подтверждён. Теперь можно войти.");
      localStorage.removeItem("pendingEmail");
      // чтобы на логине было удобно:
      localStorage.setItem("lastEmail", eMail);
      setTimeout(() => nav("/login"), 600);
    } catch (e2) {
      setErr(e2?.response?.data?.message || "Не удалось подтвердить email");
    } finally {
      setBusy(false);
    }
  }

  async function resend() {
    setErr("");
    setMsg("");
    const eMail = String(email).trim().toLowerCase();
    if (!eMail) return setErr("Введите email");

    setBusy(true);
    try {
      const { data } = await api.post("/api/auth/resend-code", { email: eMail });
      setMsg(data?.message || "Код отправлен повторно. Проверьте почту/спам.");
    } catch (e2) {
      setErr(e2?.response?.data?.message || "Не удалось отправить код ещё раз");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <Card title="Подтверждение почты">
        <form onSubmit={submit} className="space-y-3">
          <Field
            label="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Field
            label="Код (6 цифр)"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
          />

          {err && <div className="text-sm text-red-400">{err}</div>}
          {msg && <div className="text-sm text-emerald-300">{msg}</div>}

          <Button type="submit" className="w-full" disabled={busy}>
            Подтвердить
          </Button>

          <Button
            type="button"
            variant="ghost"
            className="w-full"
            onClick={resend}
            disabled={busy}
          >
            Отправить код ещё раз
          </Button>
        </form>

        <div className="mt-4 text-sm text-slate-300">
          <Link to="/login" className="hover:text-slate-100">
            Вернуться ко входу
          </Link>
        </div>
      </Card>
    </div>
  );
}