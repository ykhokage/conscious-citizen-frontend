import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../api/client";
import Button from "../components/Button";
import Card from "../components/Card";
import EmptyState from "../components/EmptyState";
import Field from "../components/Field";
import PageHeader from "../components/PageHeader";

export default function IncidentEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [form, setForm] = useState({ title: "", description: "" });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    async function load() {
      setError("");
      setMessage("");

      try {
        const { data } = await api.get(`/api/incidents/${id}`);
        setItem(data);
        setForm({
          title: data?.title || "",
          description: data?.description || "",
        });
      } catch (requestError) {
        setError(requestError?.response?.data?.message || "Не удалось загрузить черновик");
      }
    }

    load();
  }, [id]);

  async function save() {
    setError("");
    setMessage("");
    setBusy(true);

    try {
      await api.patch(`/api/incidents/${id}`, {
        title: form.title,
        description: form.description,
      });
      setMessage("Изменения сохранены");
    } catch (requestError) {
      setError(requestError?.response?.data?.message || "Не удалось сохранить");
    } finally {
      setBusy(false);
    }
  }

  async function publish() {
    setError("");
    setMessage("");
    setBusy(true);

    try {
      // сначала сохраняем актуальные поля черновика
      await api.patch(`/api/incidents/${id}`, {
        title: form.title,
        description: form.description,
      });

      // потом публикуем только через специальный endpoint
      await api.post(`/api/incidents/${id}/publish`);

      navigate(`/incident/${id}`);
    } catch (requestError) {
      setError(requestError?.response?.data?.message || "Не удалось опубликовать");
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    setError("");
    setMessage("");
    setBusy(true);

    try {
      await api.delete(`/api/incidents/${id}`);
      navigate("/my-incidents");
    } catch (requestError) {
      setError(requestError?.response?.data?.message || "Не удалось удалить");
    } finally {
      setBusy(false);
    }
  }

  if (!item && error) {
    return <EmptyState title="Черновик не найден" description={error} />;
  }

  if (!item) {
    return <EmptyState title="Загрузка" description="Открываем черновик для редактирования." />;
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="редактирование"
        title="Черновик обращения"
        description={item.address || "Адрес не указан"}
      />

      <Card
        title="Текст обращения"
        description="Перед публикацией можно ещё раз проверить формулировки и адрес."
      >
        {error && (
          <div className="mb-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {message && (
          <div className="mb-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {message}
          </div>
        )}

        <div className="space-y-4">
          <div className="rounded-[1.5rem] border border-black/10 bg-white px-5 py-4 text-sm text-black/65">
            Адрес: <span className="font-semibold text-black">{item.address || "—"}</span>
          </div>

          <Field
            label="Заголовок"
            value={form.title}
            onChange={(event) =>
              setForm((current) => ({ ...current, title: event.target.value }))
            }
          />

          <Field
            label="Описание"
            as="textarea"
            rows={10}
            value={form.description}
            onChange={(event) =>
              setForm((current) => ({ ...current, description: event.target.value }))
            }
          />
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Button onClick={save} disabled={busy}>
            Сохранить
          </Button>

          <Button variant="ghost" onClick={publish} disabled={busy}>
            Опубликовать
          </Button>

          <Button
            variant="soft"
            onClick={() => {
              if (window.confirm("Удалить черновик?")) {
                remove();
              }
            }}
            disabled={busy}
          >
            Удалить
          </Button>

          <Link
            to="/my-incidents"
            className="inline-flex items-center text-sm font-semibold text-black/65 hover:text-black"
          >
            Назад в мои обращения
          </Link>
        </div>
      </Card>
    </div>
  );
}