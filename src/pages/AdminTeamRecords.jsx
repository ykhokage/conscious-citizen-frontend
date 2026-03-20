import { useMemo, useState } from "react";
import Button from "../components/Button";
import Card from "../components/Card";
import PageHeader from "../components/PageHeader";
import { teamRecords } from "../data/teamRecords";
import {
  getMergedTeamRecords,
  resetTeamRecordOverride,
  saveTeamRecordOverride,
} from "../utils/teamRecordsStorage";

function makeInitialDrafts() {
  return getMergedTeamRecords(teamRecords).reduce((accumulator, record) => {
    accumulator[record.id] = record.note || "";
    return accumulator;
  }, {});
}

export default function AdminTeamRecords() {
  const [records, setRecords] = useState(() => getMergedTeamRecords(teamRecords));
  const [drafts, setDrafts] = useState(() => makeInitialDrafts());
  const [message, setMessage] = useState("");

  const changedCount = useMemo(
    () => records.filter((record) => (drafts[record.id] || "") !== (record.note || "")).length,
    [records, drafts]
  );

  const refreshRecords = () => {
    const nextRecords = getMergedTeamRecords(teamRecords);
    setRecords(nextRecords);
    setDrafts(
      nextRecords.reduce((accumulator, record) => {
        accumulator[record.id] = record.note || "";
        return accumulator;
      }, {})
    );
  };

  const saveRecord = (id) => {
    saveTeamRecordOverride(id, {
      note: drafts[id] || "",
    });
    refreshRecords();
    setMessage(`Досье пациента №${id} сохранено.`);
  };

  const resetRecord = (id) => {
    resetTeamRecordOverride(id);
    refreshRecords();
    setMessage(`Досье пациента №${id} сброшено к базовому тексту.`);
  };

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="панель администратора / team"
        title="Досье пациентов"
        description="Здесь администратор может менять текст досье для карточек на странице Team. Изменения сохраняются без правок бэкенда и сразу отображаются в модалке пациента. Озвучка читает тот же текст."
        actions={
          <Button variant="secondary" onClick={refreshRecords}>
            Обновить данные
          </Button>
        }
      />

      <Card
        title="Как это работает"
        description="Тексты сохраняются локально в браузере администратора. Это значит, что для продакшена или общего доступа позже всё равно лучше будет вынести их на сервер."
        className="space-y-4"
      >
        <div className="flex flex-wrap items-center gap-3 text-sm text-black/65">
          <div className="rounded-full border border-black/10 bg-black/5 px-4 py-2">
            Изменено карточек: {changedCount}
          </div>
          {message && <div className="rounded-full border border-black/10 bg-black px-4 py-2 text-white">{message}</div>}
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-2">
        {records.map((record) => {
          const isChanged = (drafts[record.id] || "") !== (record.note || "");

          return (
            <section
              key={record.id}
              className="overflow-hidden rounded-[2rem] border border-black/10 bg-[color:var(--card-bg)] shadow-[0_18px_50px_rgba(0,0,0,0.08)]"
            >
              <div className="grid gap-0 md:grid-cols-[220px_1fr]">
                <div className="border-b border-black/10 bg-black/[0.03] p-5 md:border-b-0 md:border-r">
                  <div className="overflow-hidden rounded-[1.6rem] border border-black/10 bg-white/60 p-3">
                    <div className="aspect-[0.82] overflow-hidden rounded-[1.2rem] border border-black/10 bg-black/5">
                      <img src={record.imageSrc} alt={record.code} className="h-full w-full object-cover grayscale" />
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="text-xs uppercase tracking-[0.28em] text-black/40">карточка</div>
                    <div className="mt-2 text-2xl font-black uppercase tracking-tight">{record.code}</div>
                    <p className="mt-3 text-sm leading-6 text-black/60">
                      Текст из этого поля показывается в досье и используется для озвучки на странице Team.
                    </p>
                  </div>
                </div>

                <div className="p-5 sm:p-6">
                  <label className="block text-sm font-semibold text-black/80">Текст досье</label>
                  <textarea
                    value={drafts[record.id] || ""}
                    onChange={(event) => {
                      const value = event.target.value;
                      setDrafts((current) => ({
                        ...current,
                        [record.id]: value,
                      }));
                    }}
                    rows={8}
                    className="mt-3 w-full rounded-[1.5rem] border border-black/10 bg-white/70 px-4 py-4 text-sm leading-7 outline-none transition placeholder:text-black/30 focus:border-black/30 focus:bg-white"
                    placeholder="Введите текст досье для этого пациента"
                  />

                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <Button onClick={() => saveRecord(record.id)} disabled={!isChanged}>
                      Сохранить досье
                    </Button>
                    <Button variant="ghost" onClick={() => resetRecord(record.id)}>
                      Сбросить
                    </Button>
                    {isChanged && (
                      <span className="rounded-full border border-black/10 bg-black/5 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-black/60">
                        есть несохранённые изменения
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
