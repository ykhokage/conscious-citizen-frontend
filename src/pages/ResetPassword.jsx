import { useState } from "react";
import Card from "../components/Card";
import Field from "../components/Field";
import Button from "../components/Button";
import api from "../api/client";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  async function submit(e) {
    e.preventDefault();
    setMsg("");
    try {
      await api.post("/api/auth/reset-password", { email });
      setMsg("Инструкция отправлена на почту (если email зарегистрирован).");
    } catch {
      setMsg("Не удалось отправить инструкцию. Проверьте email.");
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
          <Button type="submit" className="w-full">
            Сбросить пароль
          </Button>
        </form>
        {msg && <div className="mt-3 text-sm text-slate-300">{msg}</div>}
      </Card>
    </div>
  );
}
