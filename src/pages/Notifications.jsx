import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";
import Button from "../components/Button";
import Card from "../components/Card";
import EmptyState from "../components/EmptyState";
import PageHeader from "../components/PageHeader";
import { formatDateTime } from "../utils/format";

export default function Notifications() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showUnread, setShowUnread] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function load() {
    setError("");

    try {
      const { data } = await api.get("/api/incidents/notifications");
      let list = data?.items || [];
      const unread = Number(data?.unreadCount || 0);

      if (showUnread) {
        list = list.filter((item) => !item.readAt);
      }

      setItems(list);
      setUnreadCount(unread);
    } catch (requestError) {
      setError(requestError?.response?.data?.message || "Не удалось загрузить уведомления");
    }
  }

  useEffect(() => {
    load();
    const timer = setInterval(load, 7000);
    return () => clearInterval(timer);
  }, [showUnread]);

  async function openNotification(notification) {
    setError("");

    try {
      if (!notification.readAt) {
        await api.post(`/api/incidents/notifications/${notification.id}/read`);
      }
      navigate(notification.href || "/notifications");
    } catch (requestError) {
      setError(requestError?.response?.data?.message || "Не удалось открыть уведомление");
    } finally {
      load();
    }
  }

  async function readAll() {
    setBusy(true);
    setError("");

    try {
      await api.post("/api/incidents/notifications/read-all");
      await load();
    } catch (requestError) {
      setError(requestError?.response?.data?.message || "Не удалось отметить всё прочитанным");
    } finally {
      setBusy(false);
    }
  }

  const actions = useMemo(
    () => (
      <>
        <Button variant="secondary" onClick={() => setShowUnread((current) => !current)}>
          {showUnread ? "Показать все" : `Только непрочитанные (${unreadCount})`}
        </Button>
        <Button variant="soft" onClick={readAll} disabled={busy}>
          Прочитать всё
        </Button>
      </>
    ),
    [busy, showUnread, unreadCount]
  );

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="центр событий"
        title="Уведомления"
        description="Системные события по обращениям, обновления статусов и переходы к нужным карточкам."
        actions={actions}
      />

      <Card title="Лента уведомлений">
        {error && <div className="mb-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

        {!items.length ? (
          <EmptyState title="Уведомлений пока нет" description="Когда по вашим обращениям появятся изменения, они отобразятся здесь." />
        ) : (
          <div className="grid gap-4">
            {items.map((notification) => (
              <button
                key={notification.id}
                type="button"
                onClick={() => openNotification(notification)}
                className={[
                  "rounded-[1.75rem] border p-5 text-left transition",
                  notification.readAt
                    ? "border-black/10 bg-white hover:-translate-y-0.5"
                    : "border-black bg-black text-white hover:-translate-y-0.5",
                ].join(" ")}
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className={`text-xs uppercase tracking-[0.22em] ${notification.readAt ? "text-black/40" : "text-white/45"}`}>
                      {notification.readAt ? "Прочитано" : "Новое"}
                    </div>
                    <div className="mt-3 text-xl font-black uppercase tracking-tight">{notification.title}</div>
                    {notification.body && <p className={`mt-3 text-sm leading-6 ${notification.readAt ? "text-black/60" : "text-white/70"}`}>{notification.body}</p>}
                  </div>
                  <div className={`shrink-0 text-xs uppercase tracking-[0.18em] ${notification.readAt ? "text-black/40" : "text-white/45"}`}>
                    {formatDateTime(notification.createdAt)}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
