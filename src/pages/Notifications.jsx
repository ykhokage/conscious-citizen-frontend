import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
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

export default function Notifications() {
  const nav = useNavigate();
  const [items, setItems] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [showUnread, setShowUnread] = useState(false);

  async function load() {
    setErr("");
    try {
      // ✅ путь как в backend: /api/incidents/notifications
      const { data } = await api.get("/api/incidents/notifications");

      let list = data.items || [];
      const uc = Number(data.unreadCount || 0);

      // ✅ фильтрация делаем на фронте (в бэке параметр unread не нужен)
      if (showUnread) list = list.filter((x) => !x.readAt);

      setItems(list);
      setUnreadCount(uc);
    } catch (e) {
      setErr(e?.response?.data?.message || "Не удалось загрузить уведомления");
    }
  }

  async function openNotification(n) {
    setErr("");
    try {
      if (!n.readAt) {
        // ✅ путь как в backend
        await api.post(`/api/incidents/notifications/${n.id}/read`);
      }
      nav(n.href || "/notifications");
    } catch (e) {
      setErr(e?.response?.data?.message || "Не удалось открыть уведомление");
    } finally {
      load();
    }
  }

  async function readAll() {
    setBusy(true);
    setErr("");
    try {
      // ✅ путь как в backend
      await api.post("/api/incidents/notifications/read-all");
      await load();
    } catch (e) {
      setErr(e?.response?.data?.message || "Не удалось отметить прочитанными");
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    load();
    const t = setInterval(load, 7000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showUnread]);

  const headerRight = useMemo(() => {
    return (
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="text-sm text-slate-300 hover:text-slate-100"
          onClick={() => setShowUnread((v) => !v)}
        >
          {showUnread ? "Показать все" : `Только непрочитанные (${unreadCount})`}
        </button>

        <Button
          variant="ghost"
          onClick={readAll}
          disabled={busy || unreadCount === 0}
        >
          Прочитать все
        </Button>
      </div>
    );
  }, [showUnread, unreadCount, busy]);

  return (
    <div className="max-w-3xl mx-auto">
      <Card title="Уведомления" right={headerRight}>
        {err && <div className="text-sm text-red-400 mb-2">{err}</div>}

        {!items.length ? (
          <div className="text-sm text-slate-300">Уведомлений пока нет.</div>
        ) : (
          <div className="grid gap-2">
            {items.map((n) => (
              <button
                key={n.id}
                onClick={() => openNotification(n)}
                className={[
                  "text-left rounded-xl border p-3 transition",
                  n.readAt
                    ? "border-slate-800 bg-slate-950/30 hover:bg-slate-950/40"
                    : "border-emerald-700/40 bg-emerald-900/10 hover:bg-emerald-900/15",
                ].join(" ")}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="font-semibold text-slate-100">{n.title}</div>
                  <div className="text-xs text-slate-400">
                    {fmt(n.createdAt)}
                  </div>
                </div>

                {n.body && (
                  <div className="text-sm text-slate-300 mt-1">{n.body}</div>
                )}

                <div className="text-xs text-slate-500 mt-2">
                  {n.readAt ? "Прочитано" : "Новое"} • перейти →
                </div>
              </button>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}