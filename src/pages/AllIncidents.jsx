import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";
import Button from "../components/Button";
import Card from "../components/Card";
import EmptyState from "../components/EmptyState";
import Field from "../components/Field";
import PageHeader from "../components/PageHeader";
import { StatusBadge } from "../components/StatusBadge";
import { formatDateTime } from "../utils/format";

export default function AllIncidents() {
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      setError("");

      try {
        const { data } = await api.get("/api/incidents");
        setItems(data?.items || data || []);
      } catch {
        setError("Не удалось загрузить список обращений");
      }
    }

    load();
  }, []);

  const filtered = useMemo(() => {
    const safeQuery = query.trim().toLowerCase();
    if (!safeQuery) return items;

    return items.filter((item) => {
      const haystack = `${item.title || ""} ${item.address || ""} ${item.description || ""}`.toLowerCase();
      return haystack.includes(safeQuery);
    });
  }, [items, query]);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="общественный реестр"
        title="Все обращения"
        description="Публичная лента обращений с быстрым поиском по заголовку, адресу и описанию."
        actions={
          <Link to="/categories">
            <Button variant="secondary">Создать обращение</Button>
          </Link>
        }
      />

      <Card title="Лента" description="Актуальные публикации пользователей.">
        <div className="mb-5 max-w-xl">
          <Field label="Поиск" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Например: парковка, магазин, Московское шоссе" />
        </div>

        {error && <div className="mb-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

        {!filtered.length ? (
          <EmptyState title="Ничего не найдено" description="Попробуйте изменить запрос или вернитесь к списку позже." />
        ) : (
          <div className="grid gap-4">
            {filtered.map((item) => (
              <Link key={item.id} to={`/incident/${item.id}`} className="block rounded-[1.75rem] border border-black/10 bg-white p-5 transition hover:-translate-y-0.5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="flex flex-wrap gap-2">
                      <StatusBadge value={item.category} tone="category" />
                      <StatusBadge value={item.status} />
                    </div>
                    <h3 className="mt-4 text-2xl font-black uppercase tracking-tight">{item.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-black/65">{item.address || "Адрес не указан"}</p>
                    {item.description && <p className="mt-3 line-clamp-2 text-sm leading-6 text-black/55">{item.description}</p>}
                  </div>
                  <div className="shrink-0 text-xs uppercase tracking-[0.18em] text-black/40">{formatDateTime(item.createdAt)}</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
