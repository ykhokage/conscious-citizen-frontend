import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/client";
import Button from "../components/Button";
import Card from "../components/Card";
import EmptyState from "../components/EmptyState";
import PageHeader from "../components/PageHeader";
import { StatusBadge } from "../components/StatusBadge";
import { formatDateTime } from "../utils/format";

export default function MyIncidents() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [tab, setTab] = useState("published");
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);

  async function load() {
    setError("");

    try {
      const { data } = await api.get("/api/incidents/my");
      const list = data?.items || data || [];
      setItems(Array.isArray(list) ? list : []);
    } catch (requestError) {
      setError(requestError?.response?.data?.message || "Не удалось загрузить список");
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    return items.filter((item) => (tab === "draft" ? item.status === "draft" : item.status !== "draft"));
  }, [items, tab]);

  async function publish(id) {
    setError("");
    setBusyId(id);

    try {
      try {
        await api.post(`/api/incidents/${id}/publish`);
      } catch {
        await api.patch(`/api/incidents/${id}`, { status: "published" });
      }
      await load();
      navigate(`/incident/${id}`);
    } catch (requestError) {
      setError(requestError?.response?.data?.message || "Не удалось опубликовать");
    } finally {
      setBusyId(null);
    }
  }

  async function remove(id) {
    setError("");
    setBusyId(id);

    try {
      await api.delete(`/api/incidents/${id}`);
      await load();
    } catch (requestError) {
      setError(requestError?.response?.data?.message || "Не удалось удалить");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="кабинет пользователя"
        title="Мои обращения"
        description="Черновики можно доработать и опубликовать позже, а опубликованные обращения — отслеживать по статусу."
      />

      <Card
        title="Список обращений"
        right={
          <div className="flex gap-2 rounded-full border border-black/10 bg-white p-1">
            <button
              type="button"
              onClick={() => setTab("published")}
              className={`rounded-full px-4 py-2 text-sm font-semibold ${tab === "published" ? "bg-black text-white" : "text-black/55"}`}
            >
              Опубликованные
            </button>
            <button
              type="button"
              onClick={() => setTab("draft")}
              className={`rounded-full px-4 py-2 text-sm font-semibold ${tab === "draft" ? "bg-black text-white" : "text-black/55"}`}
            >
              Черновики
            </button>
          </div>
        }
      >
        {error && <div className="mb-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

        {!filtered.length ? (
          <EmptyState
            title={tab === "draft" ? "Черновиков нет" : "Обращений пока нет"}
            description={tab === "draft" ? "Сохраните новое обращение как черновик, чтобы вернуться к нему позже." : "Создайте первое сообщение и начните фиксировать нарушения."}
            action={
              <Link to="/categories">
                <Button>Новое обращение</Button>
              </Link>
            }
          />
        ) : (
          <div className="grid gap-4">
            {filtered.map((item) => {
              const isDraft = item.status === "draft";
              const href = isDraft ? `/incident/edit/${item.id}` : `/incident/${item.id}`;

              return (
                <div key={item.id} className="rounded-[1.75rem] border border-black/10 bg-white p-5">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <div className="flex flex-wrap gap-2">
                        <StatusBadge value={item.category} tone="category" />
                        <StatusBadge value={item.status} />
                      </div>
                      <h3 className="mt-4 text-2xl font-black uppercase tracking-tight">{item.title}</h3>
                      <p className="mt-3 text-sm leading-6 text-black/65">{item.address || "Адрес не указан"}</p>
                      {item.createdAt && <div className="mt-3 text-xs uppercase tracking-[0.18em] text-black/40">{formatDateTime(item.createdAt)}</div>}
                    </div>

                    <div className="flex flex-wrap gap-3 lg:justify-end">
                      <Link to={href}>
                        <Button variant="secondary">{isDraft ? "Редактировать" : "Открыть"}</Button>
                      </Link>
                      {isDraft && (
                        <>
                          <Button variant="ghost" onClick={() => publish(item.id)} disabled={busyId === item.id}>
                            Опубликовать
                          </Button>
                          <Button
                            variant="soft"
                            onClick={() => {
                              if (window.confirm("Удалить черновик?")) {
                                remove(item.id);
                              }
                            }}
                            disabled={busyId === item.id}
                          >
                            Удалить
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
