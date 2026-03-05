import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Card from "../components/Card";
import Field from "../components/Field";
import Button from "../components/Button";
import api from "../api/client";

export default function IncidentEdit() {
  const { id } = useParams();
  const nav = useNavigate();

  const [item, setItem] = useState(null);
  const [form, setForm] = useState({ title: "", description: "" });
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  async function load() {
    setErr("");
    setMsg("");
    try {
      const { data } = await api.get(`/api/incidents/${id}`);
      setItem(data);
      setForm({
        title: data?.title || "",
        description: data?.description || "",
      });
    } catch (e) {
      setErr(e?.response?.data?.message || "Не удалось загрузить черновик");
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function save() {
    setErr("");
    setMsg("");
    setBusy(true);
    try {
      // Обычно это PATCH /api/incidents/:id
      await api.patch(`/api/incidents/${id}`, {
        title: form.title,
        description: form.description,
      });
      setMsg("Сохранено");
      await load();
    } catch (e) {
      setErr(e?.response?.data?.message || "Не удалось сохранить");
    } finally {
      setBusy(false);
    }
  }

  async function publish() {
    setErr("");
    setMsg("");
    setBusy(true);
    try {
      // Вариант 1: POST /publish
      try {
        await api.post(`/api/incidents/${id}/publish`);
      } catch {
        // Вариант 2: PATCH status
        await api.patch(`/api/incidents/${id}`, { status: "published" });
      }
      nav(`/incident/${id}`);
    } catch (e) {
      setErr(e?.response?.data?.message || "Не удалось опубликовать");
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    setErr("");
    setMsg("");
    setBusy(true);
    try {
      await api.delete(`/api/incidents/${id}`);
      nav("/my-incidents");
    } catch (e) {
      setErr(e?.response?.data?.message || "Не удалось удалить");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Card title="Редактирование черновика">
        {err && <div className="text-sm text-red-400 mb-2">{err}</div>}
        {msg && <div className="text-sm text-emerald-300 mb-2">{msg}</div>}

        {!item ? (
          <div className="text-sm text-slate-300">Загрузка…</div>
        ) : (
          <div className="grid gap-3">
            <div className="text-sm text-slate-300">
              Адрес: <span className="text-slate-100">{item.address}</span>
            </div>

            <Field
              label="Тема"
              value={form.title}
              onChange={(e) => setForm((v) => ({ ...v, title: e.target.value }))}
            />

            <div>
              <div className="text-sm text-slate-400 mb-1">Описание</div>
              <textarea
                className="w-full min-h-[140px] rounded-xl border border-slate-800 bg-slate-950 p-3 text-slate-100 outline-none focus:ring-2 focus:ring-emerald-600/30"
                value={form.description}
                onChange={(e) => setForm((v) => ({ ...v, description: e.target.value }))}
              />
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              <Button onClick={save} disabled={busy}>
                Сохранить
              </Button>

              <Button variant="ghost" onClick={publish} disabled={busy}>
                Опубликовать
              </Button>

              <Button
                variant="ghost"
                onClick={() => {
                  if (confirm("Удалить черновик?")) remove();
                }}
                disabled={busy}
              >
                Удалить
              </Button>

              <Link
                to="/my-incidents"
                className="text-sm text-slate-300 hover:text-slate-100 self-center ml-2"
              >
                Назад в “Мои сообщения”
              </Link>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}