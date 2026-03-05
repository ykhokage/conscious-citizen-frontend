import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Card from "../components/Card";
import Button from "../components/Button";
import api from "../api/client";

function fmt(dt) {
  try {
    return new Date(dt).toLocaleString("ru-RU");
  } catch {
    return "";
  }
}

export default function MyIncidents() {
  const nav = useNavigate();

  const [items, setItems] = useState([]);
  const [tab, setTab] = useState("published"); // "published" | "draft"
  const [err, setErr] = useState("");
  const [busyId, setBusyId] = useState(null);

  async function load() {
    setErr("");
    try {
      const { data } = await api.get("/api/incidents/my");
      const arr = data?.items || data || [];
      setItems(Array.isArray(arr) ? arr : []);
    } catch (e) {
      setErr(e?.response?.data?.message || "Не удалось загрузить список");
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    return items.filter((x) => (tab === "draft" ? x.status === "draft" : x.status !== "draft"));
  }, [items, tab]);

  async function publish(id) {
    setErr("");
    setBusyId(id);
    try {
      // Вариант 1 (если у тебя так на бэке): POST /api/incidents/:id/publish
      try {
        await api.post(`/api/incidents/${id}/publish`);
      } catch {
        // Вариант 2 (универсальный): PATCH /api/incidents/:id { status: "published" }
        await api.patch(`/api/incidents/${id}`, { status: "published" });
      }

      await load();
      nav(`/incident/${id}`);
    } catch (e) {
      setErr(e?.response?.data?.message || "Не удалось опубликовать");
    } finally {
      setBusyId(null);
    }
  }

  async function remove(id) {
    setErr("");
    setBusyId(id);
    try {
      await api.delete(`/api/incidents/${id}`);
      await load();
    } catch (e) {
      setErr(e?.response?.data?.message || "Не удалось удалить");
    } finally {
      setBusyId(null);
    }
  }

  const right = (
    <div className="flex items-center gap-2">
      <button
        type="button"
        className={[
          "px-3 py-1 rounded-full text-sm border transition",
          tab === "published"
            ? "border-emerald-700/40 bg-emerald-900/10 text-emerald-200"
            : "border-slate-800 text-slate-300 hover:text-slate-100 hover:bg-slate-900/40",
        ].join(" ")}
        onClick={() => setTab("published")}
      >
        Опубликованные
      </button>

      <button
        type="button"
        className={[
          "px-3 py-1 rounded-full text-sm border transition",
          tab === "draft"
            ? "border-emerald-700/40 bg-emerald-900/10 text-emerald-200"
            : "border-slate-800 text-slate-300 hover:text-slate-100 hover:bg-slate-900/40",
        ].join(" ")}
        onClick={() => setTab("draft")}
      >
        Черновики
      </button>
    </div>
  );

  return (
    <Card title="Мои сообщения" right={right}>
      {err && <div className="text-sm text-red-400 mb-2">{err}</div>}

      <div className="grid gap-3">
        {filtered.length === 0 ? (
          <div className="text-sm text-slate-300">
            {tab === "draft" ? "Черновиков пока нет." : "Пока нет опубликованных сообщений."}
          </div>
        ) : (
          filtered.map((i) => {
            const isDraft = i.status === "draft";
            const href = isDraft ? `/incident/edit/${i.id}` : `/incident/${i.id}`;

            return (
              <div
                key={i.id}
                className="rounded-2xl border border-slate-800 bg-slate-950 p-4"
              >
                <Link to={href} className="block hover:opacity-95">
                  <div className="flex items-center justify-between gap-2">
                    <div className="font-semibold text-slate-100">{i.title}</div>

                    <div
                      className={[
                        "text-xs px-2 py-1 rounded-full border",
                        isDraft
                          ? "border-yellow-600/40 text-yellow-200 bg-yellow-900/10"
                          : "border-emerald-700/40 text-emerald-200 bg-emerald-900/10",
                      ].join(" ")}
                    >
                      {isDraft ? "draft" : i.status}
                    </div>
                  </div>

                  <div className="text-sm text-slate-300 mt-1">{i.address}</div>

                  {i.createdAt && (
                    <div className="text-xs text-slate-500 mt-2">{fmt(i.createdAt)}</div>
                  )}
                </Link>

                {isDraft && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    <Button
                      variant="ghost"
                      onClick={() => nav(`/incident/edit/${i.id}`)}
                      disabled={busyId === i.id}
                    >
                      Редактировать
                    </Button>

                    <Button
                      variant="ghost"
                      onClick={() => publish(i.id)}
                      disabled={busyId === i.id}
                    >
                      Опубликовать
                    </Button>

                    <Button
                      variant="ghost"
                      onClick={() => {
                        if (confirm("Удалить черновик?")) remove(i.id);
                      }}
                      disabled={busyId === i.id}
                    >
                      Удалить
                    </Button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
}