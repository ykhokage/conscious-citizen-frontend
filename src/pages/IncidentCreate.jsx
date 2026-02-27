import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import Field from "../components/Field";
import Button from "../components/Button";
import api from "../api/client";

export default function IncidentCreate() {
  const nav = useNavigate();

  const category = sessionStorage.getItem("cc_category") || "parking";
  const lat = Number(sessionStorage.getItem("cc_lat"));
  const lon = Number(sessionStorage.getItem("cc_lon"));
  const address = sessionStorage.getItem("cc_address") || "";

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [photos, setPhotos] = useState([]);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const categoryLabel = useMemo(
    () => (category === "parking" ? "Неправильная парковка" : "Просроченные товары"),
    [category]
  );

  async function uploadPhotos(incidentId) {
    if (!photos.length) return;
    for (const file of photos) {
      const fd = new FormData();
      fd.append("photo", file);
      await api.post(`/api/incidents/${incidentId}/photos`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    }
  }

  async function create(status) {
    setErr("");
    setBusy(true);
    try {
      const { data } = await api.post("/api/incidents", {
        category,
        title,
        description,
        latitude: lat,
        longitude: lon,
        address,
        status, // published | draft
      });

      const id = data?.id;
      if (!id) throw new Error("Сервер не вернул id инцидента");

      await uploadPhotos(id);
      nav(`/incident/${id}`);
    } catch (e) {
      setErr(e?.response?.data?.message || "Не удалось создать сообщение");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-4">
      <Card title="Создание сообщения" right={<span className="text-xs text-slate-400">{categoryLabel}</span>}>
        <div className="grid gap-3">
          <div className="text-sm text-slate-300">
            Адрес: <span className="text-slate-100">{address || "—"}</span>
          </div>

          <Field label="Тема сообщения" value={title} onChange={(e) => setTitle(e.target.value)} />
          <label className="block">
            <span className="text-sm text-slate-300">Описание проблемы</span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 w-full min-h-28 rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-slate-600"
            />
          </label>

          <label className="block">
            <span className="text-sm text-slate-300">Добавить фото</span>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => setPhotos(Array.from(e.target.files || []))}
              className="mt-2 block w-full text-sm text-slate-300"
            />
            {photos.length > 0 && (
              <div className="mt-2 text-xs text-slate-400">
                Выбрано файлов: {photos.length}
              </div>
            )}
          </label>

          {err && <div className="text-sm text-red-400">{err}</div>}

          <div className="flex flex-wrap gap-2">
            <Button onClick={() => create("published")} disabled={busy || !title || !description}>
              Опубликовать
            </Button>
            <Button variant="ghost" onClick={() => create("draft")} disabled={busy}>
              В черновик
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
