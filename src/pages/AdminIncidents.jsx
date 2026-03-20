import { useEffect, useState } from "react";
import api from "../api/client";
import Button from "../components/Button";
import Card from "../components/Card";
import EmptyState from "../components/EmptyState";
import Field from "../components/Field";
import PageHeader from "../components/PageHeader";
import { StatusBadge } from "../components/StatusBadge";
import { categoryLabel, formatDateTime } from "../utils/format";
import {
  clearAdminIncidentMeta,
  getAdminIncidentMeta,
  setAdminIncidentMeta,
} from "../utils/storage";

const STAGE_OPTIONS = [
  { value: "", label: "Без служебной метки" },
  { value: "рассматривается", label: "Рассматривается" },
  { value: "в обработке", label: "В обработке" },
  { value: "готово", label: "Готово" },
  { value: "отклонено", label: "Отклонено" },
];

function AdminLabelBadge({ children, tone = "soft" }) {
  const styles =
    tone === "stage"
      ? "border-blue-500/20 bg-blue-50 text-blue-800"
      : "border-black/10 bg-black/5 text-black/75";

  return (
    <span
      className={[
        "inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]",
        styles,
      ].join(" ")}
    >
      {children}
    </span>
  );
}

function enrichItems(items) {
  return items.map((item) => {
    const meta = getAdminIncidentMeta(item.id);
    return {
      ...item,
      adminStage: meta.stage || "",
      adminLabels: Array.isArray(meta.labels) ? meta.labels : [],
    };
  });
}

export default function AdminIncidents() {
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [editorBusy, setEditorBusy] = useState(false);
  const [activeId, setActiveId] = useState(null);
  const [draft, setDraft] = useState(null);
  const [labelInput, setLabelInput] = useState("");

  async function load(options = {}) {
    const preserveMessage = options.preserveMessage ?? false;
    setBusy(true);
    setError("");
    if (!preserveMessage) setMessage("");

    try {
      const { data } = await api.get("/api/admin/incidents", {
        params: { q: query, category },
      });
      const nextItems = enrichItems(data?.items || data || []);
      setItems(nextItems);
    } catch {
      setError("Не удалось загрузить список. Проверьте права и endpoint.");
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    load();
  }, []);


  async function openEditor(item) {
    setEditorBusy(true);
    setError("");
    setMessage("");

    try {
      const { data } = await api.get(`/api/incidents/${item.id}`);
      const meta = getAdminIncidentMeta(item.id);
      setDraft({
        id: item.id,
        title: data?.title || item.title || "",
        address: data?.address || item.address || "",
        category: data?.category || item.category || "parking",
        description: data?.description || "",
        backendStatus: data?.status || item.status || "published",
        stage: meta.stage || "",
        labels: Array.isArray(meta.labels) ? meta.labels : [],
        createdAt: item.createdAt || data?.createdAt || "",
      });
      setLabelInput("");
      setActiveId(item.id);
    } catch (requestError) {
      setError(requestError?.response?.data?.message || "Не удалось открыть обращение для модерации.");
    } finally {
      setEditorBusy(false);
    }
  }

  function closeEditor() {
    setActiveId(null);
    setDraft(null);
    setLabelInput("");
    setMessage("");
  }

  function addLabel() {
    const value = labelInput.trim();
    if (!value || !draft) return;

    setDraft((current) => ({
      ...current,
      labels: Array.from(new Set([...(current?.labels || []), value])),
    }));
    setLabelInput("");
  }

  function removeLabel(label) {
    setDraft((current) => ({
      ...current,
      labels: (current?.labels || []).filter((item) => item !== label),
    }));
  }

  async function saveIncident() {
    if (!draft) return;

    setEditorBusy(true);
    setError("");
    setMessage("");

    try {
      await api.patch(`/api/incidents/${draft.id}`, {
        title: draft.title,
        address: draft.address,
        category: draft.category,
        description: draft.description,
      });

      setAdminIncidentMeta(draft.id, {
        stage: draft.stage,
        labels: draft.labels,
      });

      setItems((current) =>
        current.map((item) =>
          item.id === draft.id
            ? {
                ...item,
                title: draft.title,
                address: draft.address,
                category: draft.category,
                adminStage: draft.stage,
                adminLabels: draft.labels,
              }
            : item
        )
      );

      setMessage("Обращение обновлено. Текст сохранён на сервер, служебные метки — в браузере администратора.");
    } catch (requestError) {
      setError(requestError?.response?.data?.message || "Не удалось сохранить изменения.");
    } finally {
      setEditorBusy(false);
    }
  }

  async function removeIncident(item) {
    const confirmed = window.confirm(`Удалить обращение «${item.title || `#${item.id}`}»?`);
    if (!confirmed) return;

    setEditorBusy(true);
    setError("");
    setMessage("");

    try {
      await api.delete(`/api/incidents/${item.id}`);
      clearAdminIncidentMeta(item.id);
      setItems((current) => current.filter((entry) => entry.id !== item.id));

      if (activeId === item.id) {
        closeEditor();
      }

      setMessage("Обращение удалено.");
    } catch (requestError) {
      setError(requestError?.response?.data?.message || "Не удалось удалить обращение.");
    } finally {
      setEditorBusy(false);
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="модерация"
        title="Все обращения"
        description="Поиск по заголовку, редактирование текста, удаление кейсов и собственные административные метки."
      />

      <Card title="Фильтры" description="Параметры запроса к административному списку обращений.">
        <div className="grid gap-4 md:grid-cols-[1fr_280px_auto]">
          <Field
            label="Поиск"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Ключевое слово"
          />
          <Field
            label="Рубрика"
            as="select"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            options={[
              { value: "", label: "Все" },
              { value: "parking", label: "Парковка" },
              { value: "products", label: "Просрочка" },
            ]}
          />
          <div className="md:self-end">
            <Button variant="secondary" onClick={() => load()} disabled={busy} className="w-full md:w-auto">
              Применить
            </Button>
          </div>
        </div>

        {error && <div className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
        {message && <div className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</div>}
      </Card>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr] xl:items-start">
        <Card title="Результаты" description="Список всех обращений для просмотра и ручной модерации.">
          {!items.length ? (
            <EmptyState title="Список пуст" description="По текущим фильтрам ничего не найдено." />
          ) : (
            <div className="grid gap-4">
              {items.map((item) => (
                <div key={item.id} className="rounded-[1.75rem] border border-black/10 bg-white p-5">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap gap-2">
                        <StatusBadge value={item.category} tone="category" />
                        <StatusBadge value={item.status} />
                        {item.adminStage && <AdminLabelBadge tone="stage">{item.adminStage}</AdminLabelBadge>}
                        {item.adminLabels.map((label) => (
                          <AdminLabelBadge key={`${item.id}-${label}`}>{label}</AdminLabelBadge>
                        ))}
                      </div>
                      <h3 className="mt-4 text-2xl font-black uppercase tracking-tight">{item.title}</h3>
                      <p className="mt-3 text-sm leading-6 text-black/65">{item.address || "Адрес не указан"}</p>
                      <p className="mt-2 text-xs uppercase tracking-[0.22em] text-black/35">
                        {formatDateTime(item.createdAt) || "Дата не указана"}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-3 lg:justify-end">
                      <Button variant="soft" onClick={() => openEditor(item)} disabled={editorBusy && activeId === item.id}>
                        Редактировать
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => removeIncident(item)}
                        disabled={editorBusy && activeId === item.id}
                      >
                        Удалить
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card title="Редактор" description="Откройте обращение, чтобы изменить текст, адрес, рубрику и служебные метки. Удаление доступно из списка обращений.">
          {!draft ? (
            <EmptyState
              title="Выберите обращение"
              description="Нажмите «Редактировать» у нужного кейса. Здесь откроется карточка для изменения текста и служебных меток."
            />
          ) : (
            <div className="space-y-5">
              <div className="rounded-[1.5rem] border border-black/10 bg-white px-5 py-4 text-sm text-black/65">
                <div className="flex flex-wrap gap-2">
                  <StatusBadge value={draft.category} tone="category" />
                  <StatusBadge value={draft.backendStatus} />
                  {draft.stage && <AdminLabelBadge tone="stage">{draft.stage}</AdminLabelBadge>}
                </div>
                <div className="mt-4">
                  <div className="text-xs uppercase tracking-[0.22em] text-black/35">ID обращения</div>
                  <div className="mt-2 font-semibold text-black">#{draft.id}</div>
                </div>
              </div>

              <Field
                label="Заголовок"
                value={draft.title}
                onChange={(event) => setDraft((current) => ({ ...current, title: event.target.value }))}
              />
              <Field
                label="Адрес"
                value={draft.address}
                onChange={(event) => setDraft((current) => ({ ...current, address: event.target.value }))}
              />
              <Field
                label="Рубрика"
                as="select"
                value={draft.category}
                onChange={(event) => setDraft((current) => ({ ...current, category: event.target.value }))}
                options={[
                  { value: "parking", label: categoryLabel("parking") },
                  { value: "products", label: categoryLabel("products") },
                ]}
              />
              <Field
                label="Описание"
                as="textarea"
                rows={8}
                value={draft.description}
                onChange={(event) => setDraft((current) => ({ ...current, description: event.target.value }))}
              />

              <div className="rounded-[1.5rem] border border-black/10 bg-white p-5">
                <div className="text-sm font-semibold text-black">Служебные метки</div>
                <p className="mt-2 text-sm leading-6 text-black/55">
                  Эти метки не отправляются на сервер и нужны только для внутренней работы администратора.
                </p>

                <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
                  <Field
                    label="Основной статус модерации"
                    as="select"
                    value={draft.stage}
                    onChange={(event) => setDraft((current) => ({ ...current, stage: event.target.value }))}
                    options={STAGE_OPTIONS}
                  />
                  <Button
                    variant="ghost"
                    onClick={() => setDraft((current) => ({ ...current, stage: "" }))}
                    disabled={!draft.stage}
                  >
                    Сбросить статус
                  </Button>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
                  <Field
                    label="Своя метка"
                    value={labelInput}
                    onChange={(event) => setLabelInput(event.target.value)}
                    placeholder="например: требует звонка"
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        addLabel();
                      }
                    }}
                  />
                  <Button variant="secondary" onClick={addLabel} disabled={!labelInput.trim()}>
                    Добавить
                  </Button>
                </div>

                {!!draft.labels.length && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {draft.labels.map((label) => (
                      <button
                        key={label}
                        type="button"
                        onClick={() => removeLabel(label)}
                        className="inline-flex items-center rounded-full border border-black/10 bg-black/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-black/75 transition hover:bg-black/10"
                      >
                        {label} ×
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-3">
                <Button onClick={saveIncident} disabled={editorBusy}>
                  Сохранить
                </Button>
                <Button variant="ghost" onClick={closeEditor} disabled={editorBusy}>
                  Закрыть
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
