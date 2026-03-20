import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";
import Button from "../components/Button";
import Card from "../components/Card";
import Field from "../components/Field";
import PageHeader from "../components/PageHeader";
import { categoryLabel } from "../utils/format";

export default function IncidentCreate() {
  const navigate = useNavigate();
  const category = sessionStorage.getItem("cc_category") || "parking";
  const lat = Number(sessionStorage.getItem("cc_lat"));
  const lon = Number(sessionStorage.getItem("cc_lon"));
  const address = sessionStorage.getItem("cc_address") || "";
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [photos, setPhotos] = useState([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const categoryText = useMemo(() => categoryLabel(category), [category]);

  async function uploadPhotos(incidentId) {
    if (!photos.length) return;

    for (const file of photos) {
      const data = new FormData();
      data.append("photo", file);
      await api.post(`/api/incidents/${incidentId}/photos`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    }
  }

  async function create(status) {
    setError("");
    setBusy(true);

    try {
      const { data } = await api.post("/api/incidents", {
        category,
        title,
        description,
        latitude: lat,
        longitude: lon,
        address,
        status,
      });

      const incidentId = data?.id;

      if (!incidentId) {
        throw new Error("Сервер не вернул id обращения");
      }

      await uploadPhotos(incidentId);
      navigate(`/incident/${incidentId}`);
    } catch (requestError) {
      setError(requestError?.response?.data?.message || "Не удалось создать обращение");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="создание обращения"
        title="Опишите проблему"
        description="Чем точнее вы сформулируете заголовок и описание, тем проще будет обработать обращение дальше."
      />

      <Card title={categoryText} description="Добавьте краткий заголовок, описание и фотофиксацию.">
        <div className="mb-5 rounded-[1.75rem] border border-black/10 bg-white/70 px-5 py-4 text-sm text-black/70">
          Адрес: <span className="font-semibold text-black">{address || "—"}</span>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1fr_0.85fr]">
          <div className="space-y-4">
            <Field label="Заголовок" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Кратко опишите проблему" />
            <Field
              label="Описание"
              as="textarea"
              rows={8}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Опишите, что произошло, когда вы заметили нарушение и почему это важно."
            />
          </div>

          <div className="space-y-4">
            <label className="block rounded-[1.75rem] border border-dashed border-black/20 bg-white px-5 py-5">
              <span className="text-sm font-semibold text-black">Добавить фото</span>
              <p className="mt-2 text-sm leading-6 text-black/55">Загрузите одно или несколько изображений для подтверждения обращения.</p>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(event) => setPhotos(Array.from(event.target.files || []))}
                className="mt-4 block w-full text-sm text-black/65"
              />
              {photos.length > 0 && <div className="mt-4 text-sm text-black/70">Выбрано файлов: {photos.length}</div>}
              <div className="mt-4 text-xs uppercase tracking-[0.2em] text-black/40">
                Координаты: {Number.isFinite(lat) ? lat.toFixed(5) : "—"}, {Number.isFinite(lon) ? lon.toFixed(5) : "—"}
              </div>
            </label>
          </div>
        </div>

        {error && <div className="mt-5 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

        <div className="mt-6 flex flex-wrap gap-3">
          <Button onClick={() => create("published")} size="lg" disabled={busy || !title || !description}>
            Опубликовать
          </Button>
          <Button variant="ghost" size="lg" onClick={() => create("draft")} disabled={busy}>
            Сохранить в черновик
          </Button>
        </div>
      </Card>
    </div>
  );
}
