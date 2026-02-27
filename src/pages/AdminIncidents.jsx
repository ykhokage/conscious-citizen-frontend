import { useEffect, useState } from "react";
import Card from "../components/Card";
import Field from "../components/Field";
import api from "../api/client";

export default function AdminIncidents() {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [err, setErr] = useState("");

  async function load() {
    setErr("");
    try {
      const { data } = await api.get("/api/admin/incidents", {
        params: { q, category },
      });
      setItems(data?.items || data || []);
    } catch {
      setErr("Не удалось загрузить список (проверь права/endpoint)");
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <Card title="Сообщения (админ)">
      <div className="grid sm:grid-cols-3 gap-3 mb-4">
        <Field label="Поиск" value={q} onChange={(e) => setQ(e.target.value)} />
        <label className="block">
          <span className="text-sm text-slate-300">Рубрика</span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-slate-100"
          >
            <option value="">Все</option>
            <option value="parking">Парковка</option>
            <option value="products">Просрочка</option>
          </select>
        </label>
        <button
          onClick={load}
          className="mt-6 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sm"
        >
          Применить
        </button>
      </div>

      {err && <div className="text-sm text-red-400">{err}</div>}

      <div className="grid gap-3">
        {items.map((i) => (
          <div
            key={i.id}
            className="rounded-2xl border border-slate-800 bg-slate-950 p-4"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="font-semibold">{i.title}</div>
              <div className="text-xs text-slate-400">
                {i.category} • {i.status}
              </div>
            </div>
            <div className="text-sm text-slate-300 mt-1">{i.address}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}
