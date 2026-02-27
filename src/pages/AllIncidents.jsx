import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Card from "../components/Card";
import api from "../api/client";

export default function AllIncidents() {
  const [items, setItems] = useState([]);
  const [err, setErr] = useState("");

  async function load() {
    setErr("");
    try {
      const { data } = await api.get("/api/incidents");
      setItems(data?.items || data || []);
    } catch {
      setErr("Не удалось загрузить список");
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <Card title="Все сообщения">
      {err && <div className="text-sm text-red-400">{err}</div>}
      <div className="grid gap-3">
        {items.length === 0 ? (
          <div className="text-sm text-slate-300">Пока нет сообщений.</div>
        ) : (
          items.map((i) => (
            <Link
              key={i.id}
              to={`/incident/${i.id}`}
              className="rounded-2xl border border-slate-800 bg-slate-950 p-4 hover:bg-slate-900"
            >
              <div className="font-semibold">{i.title}</div>
              <div className="text-sm text-slate-300 mt-1">{i.address}</div>
            </Link>
          ))
        )}
      </div>
    </Card>
  );
}
