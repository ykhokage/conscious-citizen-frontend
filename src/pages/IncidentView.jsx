import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/client";
import Button from "../components/Button";
import Card from "../components/Card";
import EmptyState from "../components/EmptyState";
import PageHeader from "../components/PageHeader";
import { StatusBadge } from "../components/StatusBadge";
import { categoryLabel, formatDateTime, statusLabel } from "../utils/format";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export default function IncidentView() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    async function load() {
      setError("");

      try {
        const { data } = await api.get(`/api/incidents/${id}`);
        setItem(data);
      } catch {
        setError("Не удалось загрузить обращение");
      }
    }

    load();
  }, [id]);

  function photoSrc(photo) {
    if (!photo) return null;

    if (typeof photo.url === "string" && photo.url.trim()) {
      if (photo.url.startsWith("http://") || photo.url.startsWith("https://")) {
        return photo.url;
      }

      if (photo.url.startsWith("/")) {
        return `${API_BASE}${photo.url}`;
      }

      return photo.url;
    }

    if (photo.filename) {
      return `${API_BASE}/uploads/${photo.filename}`;
    }

    return null;
  }

  async function downloadPdf() {
    setBusy(true);

    try {
      const response = await api.get(`/api/incidents/${id}/document`, { responseType: "blob" });
      const url = window.URL.createObjectURL(response.data);
      const link = document.createElement("a");
      link.href = url;
      link.download = `incident_${id}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch {
      setError("Не удалось сформировать PDF");
    } finally {
      setBusy(false);
    }
  }

  async function sendEmail() {
    setBusy(true);

    try {
      await api.post(`/api/incidents/${id}/send-email`);
      window.alert("Обращение отправлено на email или поставлено в очередь отправки.");
    } catch {
      setError("Не удалось отправить на email");
    } finally {
      setBusy(false);
    }
  }

  if (!item && error) {
    return <EmptyState title="Не удалось открыть обращение" description={error} />;
  }

  if (!item) {
    return <EmptyState title="Загрузка" description="Подтягиваем данные обращения и вложения." />;
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="карточка обращения"
        title={item.title || "Обращение"}
        description={item.address || "Адрес не указан"}
        actions={
          <>
            <Button variant="secondary" onClick={downloadPdf} disabled={busy}>
              Скачать PDF
            </Button>
            <Button variant="soft" onClick={sendEmail} disabled={busy}>
              Отправить на email
            </Button>
          </>
        }
      />

      {error && <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card title="Описание" description="Основные данные по обращению.">
          <div className="flex flex-wrap gap-3">
            <StatusBadge value={item.category} tone="category" />
            <StatusBadge value={item.status} />
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.5rem] border border-black/10 bg-white px-5 py-4">
              <div className="text-xs uppercase tracking-[0.22em] text-black/40">Рубрика</div>
              <div className="mt-2 font-semibold">{categoryLabel(item.category)}</div>
            </div>

            <div className="rounded-[1.5rem] border border-black/10 bg-white px-5 py-4">
              <div className="text-xs uppercase tracking-[0.22em] text-black/40">Статус</div>
              <div className="mt-2 font-semibold">{statusLabel(item.status)}</div>
            </div>

            <div className="rounded-[1.5rem] border border-black/10 bg-white px-5 py-4 sm:col-span-2">
              <div className="text-xs uppercase tracking-[0.22em] text-black/40">Адрес</div>
              <div className="mt-2 font-semibold">{item.address || "—"}</div>
            </div>
          </div>

          <div className="mt-6 rounded-[1.75rem] border border-black/10 bg-white px-5 py-5">
            <div className="text-xs uppercase tracking-[0.22em] text-black/40">Текст обращения</div>
            <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-black/75">
              {item.description || "Описание отсутствует."}
            </p>
          </div>
        </Card>

        <Card title="Материалы" description="Фотографии и служебная информация.">
          <div className="space-y-4">
            <div className="rounded-[1.5rem] border border-black/10 bg-white px-5 py-4 text-sm leading-6 text-black/65">
              Создано: <span className="font-semibold text-black">{formatDateTime(item.createdAt) || "—"}</span>
            </div>

            {item.photos?.length ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {item.photos.map((photo) => {
                  const src = photoSrc(photo);
                  if (!src) return null;

                  return (
                    <a
                      key={photo.id || src}
                      href={src}
                      target="_blank"
                      rel="noreferrer"
                      className="overflow-hidden rounded-[1.5rem] border border-black/10 bg-white"
                    >
                      <img src={src} alt="Фото обращения" className="h-56 w-full object-cover" />
                    </a>
                  );
                })}
              </div>
            ) : (
              <EmptyState title="Фото нет" description="Для этого обращения пока не загружено ни одного изображения." />
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}