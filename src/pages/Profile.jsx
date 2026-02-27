import { useEffect, useState } from "react";
import Card from "../components/Card";
import Field from "../components/Field";
import Button from "../components/Button";
import api from "../api/client";
import { useAuth } from "../auth/AuthContext";
import { setAuth } from "../utils/storage";

export default function Profile() {
  const { user, token } = useAuth();
  const [form, setForm] = useState({
    surname: "",
    name: "",
    patronymic: "",
    phone: "",
    city: "Самара",
    street: "",
    house: "",
    flat: "",
  });

  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  async function load() {
    setErr("");
    try {
      const { data } = await api.get("/api/profile");
      setForm((p) => ({ ...p, ...data }));
    } catch {
      setErr("Не удалось загрузить профиль");
    }
  }

  async function save() {
    setMsg("");
    setErr("");
    try {
      const { data } = await api.put("/api/profile", form);
      setMsg("Сохранено");
      setAuth(token, { ...user, ...data });
    } catch (e) {
      setErr(e?.response?.data?.message || "Не удалось сохранить");
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <Card title="Профиль">
      {err && <div className="text-sm text-red-400 mb-3">{err}</div>}
      {msg && <div className="text-sm text-emerald-300 mb-3">{msg}</div>}

      <div className="grid sm:grid-cols-2 gap-3">
        <Field label="Фамилия" value={form.surname || ""} onChange={(e) => setForm({ ...form, surname: e.target.value })} />
        <Field label="Имя" value={form.name || ""} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <Field label="Отчество" value={form.patronymic || ""} onChange={(e) => setForm({ ...form, patronymic: e.target.value })} />
        <Field label="Телефон" value={form.phone || ""} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <Field label="Город" value={form.city || "Самара"} onChange={(e) => setForm({ ...form, city: e.target.value })} />
        <Field label="Улица" value={form.street || ""} onChange={(e) => setForm({ ...form, street: e.target.value })} />
        <Field label="Дом" value={form.house || ""} onChange={(e) => setForm({ ...form, house: e.target.value })} />
        <Field label="Квартира" value={form.flat || ""} onChange={(e) => setForm({ ...form, flat: e.target.value })} />
      </div>

      <div className="mt-4">
        <Button onClick={save}>Сохранить</Button>
      </div>
    </Card>
  );
}
