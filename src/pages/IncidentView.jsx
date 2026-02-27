import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Card from "../components/Card";
import Button from "../components/Button";
import api from "../api/client";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function IncidentView() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function load() {
    setErr("");
    try {
      const { data } = await api.get(`/api/incidents/${id}`);
      setItem(data);
    } catch {
      setErr("Не удалось загрузить сообщение");
    }
  }

  async function downloadPdf() {
    setBusy(true);
    try {
      const res = await api.get(`/api/incidents/${id}/document`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(res.data);
      const a = document.createElement("a");
      a.href = url;
      a.download = `incident_${id}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch {
      setErr("Не удалось сформировать PDF");
    } finally {
      setBusy(false);
    }
  }

  async function sendEmail() {
    setBusy(true);
    try {
      await api.post(`/api/incidents/${id}/send-email`);
      alert("Отправлено на email (или поставлено в очередь).");
    } catch {
      setErr("Не удалось отправить на email");
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    load();
  }, [id]);

  // Всегда строим URL на backend, потому что он точно работает
  const photoSrc = (p) => {
    const filename =
      p?.filename ||
      (typeof p?.url === "string"
        ? p.url.split("/").pop()
        : null);

    if (!filename) return null;
    return `${API_BASE}/uploads/${filename}`;
  };

  return (
    <div className="grid gap-4">
      <Card title="Сообщение">
        {err && <div className="text-sm text-red-400">{err}</div>}

        {!item ? (
          <div className="text-sm text-slate-300">Загрузка…</div>
        ) : (
          <div className="grid gap-3">
            <div>
              <div className="text-sm text-slate-400">Тема</div>
              <div className="text-lg font-semibold">{item.title}</div>
            </div>

            <div className="text-sm text-slate-300">
              Адрес: <span className="text-slate-100">{item.address}</span>
            </div>

            <div>
              <div className="text-sm text-slate-400">Описание</div>
              <div className="whitespace-pre-wrap">{item.description}</div>
            </div>

            {!!item.photos?.length && (
              <div className="grid sm:grid-cols-3 gap-2">
                {item.photos.map((p) => {
                  const src = photoSrc(p);
                  if (!src) return null;

                  return (
                    <img
                      key={p.id}
                      src={src}
                      alt="photo"
                      className="rounded-xl border border-slate-800 object-cover h-40 w-full"
                      loading="lazy"
                    />
                  );
                })}
              </div>
            )}

            <div className="flex flex-wrap gap-2 pt-2">
              <Button variant="ghost" onClick={downloadPdf} disabled={busy}>
                Скачать PDF
              </Button>
              <Button variant="ghost" onClick={sendEmail} disabled={busy}>
                Отправить на email
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}