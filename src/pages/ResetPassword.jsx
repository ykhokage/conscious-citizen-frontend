import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Card from "../components/Card";
import Field from "../components/Field";
import Button from "../components/Button";
import api from "../api/client";

export default function ResetPasswordConfirm() {
  const nav = useNavigate();

  const [email, setEmail] = useState(localStorage.getItem("pendingEmail") || "");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [okMsg, setOkMsg] = useState("");

  async function resendCode() {
    setErr("");
    setOkMsg("");
    setBusy(true);
    try {
      // шаг 1: повторно запросить код на почту
      await api.post("/api/auth/reset-password", { email: email.trim().toLowerCase() });
      setOkMsg("Код отправлен на почту (если email зарегистрирован).");
    } catch (e) {
      setErr(e?.response?.data?.message || "Не удалось отправить код");
    } finally {
      setBusy(false);
    }
  }

  async function submit(e) {
    e.preventDefault();
    setErr("");
    setOkMsg("");

    // ВАЖНО: не trim() пароль
    if (newPassword !== confirmPassword) {
      setErr("Пароли не совпадают");
      return;
    }
    if (!/^\d{6}$/.test(code)) {
      setErr("Код должен состоять из 6 цифр");
      return;
    }

    setBusy(true);
    try {
      await api.post("/api/auth/reset-password/confirm", {
        email: email.trim().toLowerCase(),
        code: code.trim(),
        newPassword,
        confirmPassword,
      });

      setOkMsg("Пароль изменён. Сейчас войдёте…");

      // Автологин (если у тебя логин разрешён после смены пароля)
      // Тут предполагаю, что в login можно вводить email
      const { data } = await api.post("/api/auth/login", {
        login: email.trim().toLowerCase(),
        password: newPassword,
      });

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      nav("/categories");
    } catch (e2) {
      setErr(e2?.response?.data?.message || "Не удалось сменить пароль");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <Card title="Сброс пароля">
        <form onSubmit={submit} className="space-y-3">
          <Field
            label="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Field
            label="Код (6 цифр)"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />

          <Field
            label="Новый пароль"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <Field
            label="Подтверждение пароля"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          {err && <div className="text-sm text-red-400">{err}</div>}
          {okMsg && <div className="text-sm text-emerald-300">{okMsg}</div>}

          <Button type="submit" className="w-full" disabled={busy}>
            Сменить пароль
          </Button>

          <Button
            type="button"
            variant="ghost"
            className="w-full"
            onClick={resendCode}
            disabled={busy}
          >
            Отправить код ещё раз
          </Button>

          <div className="text-sm text-slate-300">
            <Link to="/login" className="hover:text-slate-100">
              Вернуться ко входу
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
}