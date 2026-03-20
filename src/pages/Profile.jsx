import { useEffect, useRef, useState } from "react";
import api from "../api/client";
import Button from "../components/Button";
import Card from "../components/Card";
import Field from "../components/Field";
import PageHeader from "../components/PageHeader";
import { useAuth } from "../auth/AuthContext";

const MAX_AVATAR_SIZE = 2 * 1024 * 1024;
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export default function Profile() {
  const { user, setUser } = useAuth();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    surname: "",
    name: "",
    patronymic: "",
    phone: "",
    city: "Самара",
    street: "",
    house: "",
    flat: "",
    avatarUrl: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const avatarSrc = form.avatarUrl
    ? form.avatarUrl.startsWith("http://") || form.avatarUrl.startsWith("https://")
      ? form.avatarUrl
      : `${API_BASE}${form.avatarUrl}`
    : "";

  useEffect(() => {
    async function load() {
      setError("");

      try {
        const { data } = await api.get("/api/profile");

        setForm((current) => ({
          ...current,
          ...data,
        }));

        setUser({
          ...(user || {}),
          avatarUrl: data.avatarUrl || "",
        });
      } catch {
        setError("Не удалось загрузить профиль");
      }
    }

    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function save() {
    setBusy(true);
    setError("");
    setMessage("");

    try {
      const { data } = await api.put("/api/profile", {
        surname: form.surname,
        name: form.name,
        patronymic: form.patronymic,
        phone: form.phone,
        city: form.city,
        street: form.street,
        house: form.house,
        flat: form.flat,
      });

      setForm((current) => ({ ...current, ...data }));

      setUser({
        ...(user || {}),
        ...data,
        avatarUrl: form.avatarUrl,
      });

      setMessage("Профиль сохранён");
    } catch (requestError) {
      setError(requestError?.response?.data?.message || "Не удалось сохранить профиль");
    } finally {
      setBusy(false);
    }
  }

  async function uploadAvatar(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Для аватарки подходит только изображение");
      return;
    }

    if (file.size > MAX_AVATAR_SIZE) {
      setError("Изображение слишком большое. Выберите файл до 2 МБ");
      return;
    }

    setBusy(true);
    setError("");
    setMessage("");

    try {
      const payload = new FormData();
      payload.append("avatar", file);

      const { data } = await api.post("/api/profile/avatar", payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setForm((current) => ({
        ...current,
        avatarUrl: data.avatarUrl,
      }));

      setUser({
        ...(user || {}),
        avatarUrl: data.avatarUrl,
      });

      setMessage("Аватарка сохранена");
    } catch (requestError) {
      setError(requestError?.response?.data?.message || "Не удалось загрузить аватар");
    } finally {
      setBusy(false);
    }
  }

  async function removeAvatar() {
    setBusy(true);
    setError("");
    setMessage("");

    try {
      await api.delete("/api/profile/avatar");

      setForm((current) => ({
        ...current,
        avatarUrl: "",
      }));

      setUser({
        ...(user || {}),
        avatarUrl: "",
      });

      setMessage("Аватарка удалена");

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (requestError) {
      setError(requestError?.response?.data?.message || "Не удалось удалить аватар");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="личные данные"
        title="Профиль"
        description="Уточните контактную информацию, чтобы обращения было проще сопоставлять и обрабатывать."
      />

      <Card
        title="Фото профиля"
        description="Аватарка сохраняется в облачное хранилище и будет доступна после повторного входа."
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

        <div className="flex flex-col gap-5 md:flex-row md:items-center">
          <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-[2rem] border border-black/10 bg-white shadow-[0_12px_32px_rgba(0,0,0,0.08)]">
            {avatarSrc ? (
              <img
                src={avatarSrc}
                alt="Аватар профиля"
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-3xl font-black uppercase text-black/45">
                {String(form.name || user?.login || user?.email || "U").slice(0, 1)}
              </span>
            )}
          </div>

          <div className="space-y-3">
            <div className="text-sm text-black/60">
              JPG, PNG или WEBP до 2 МБ.
            </div>

            <div className="flex flex-wrap gap-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={uploadAvatar}
                className="hidden"
                id="profile-avatar-upload"
              />

              <Button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={busy}
              >
                Загрузить аватарку
              </Button>

              <Button
                type="button"
                variant="ghost"
                onClick={removeAvatar}
                disabled={!form.avatarUrl || busy}
              >
                Удалить
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <Card
        title="Контактные данные"
        description="Изменения сохраняются в вашем профиле и используются в личном кабинете."
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <Field
            label="Фамилия"
            value={form.surname}
            onChange={(event) =>
              setForm((current) => ({ ...current, surname: event.target.value }))
            }
          />
          <Field
            label="Имя"
            value={form.name}
            onChange={(event) =>
              setForm((current) => ({ ...current, name: event.target.value }))
            }
          />
          <Field
            label="Отчество"
            value={form.patronymic}
            onChange={(event) =>
              setForm((current) => ({ ...current, patronymic: event.target.value }))
            }
          />
          <Field
            label="Телефон"
            value={form.phone}
            onChange={(event) =>
              setForm((current) => ({ ...current, phone: event.target.value }))
            }
          />
          <Field
            label="Город"
            value={form.city}
            onChange={(event) =>
              setForm((current) => ({ ...current, city: event.target.value }))
            }
          />
          <Field
            label="Улица"
            value={form.street}
            onChange={(event) =>
              setForm((current) => ({ ...current, street: event.target.value }))
            }
          />
          <Field
            label="Дом"
            value={form.house}
            onChange={(event) =>
              setForm((current) => ({ ...current, house: event.target.value }))
            }
          />
          <Field
            label="Квартира"
            value={form.flat}
            onChange={(event) =>
              setForm((current) => ({ ...current, flat: event.target.value }))
            }
          />
        </div>

        <div className="mt-6">
          <Button onClick={save} disabled={busy}>
            Сохранить
          </Button>
        </div>
      </Card>
    </div>
  );
}