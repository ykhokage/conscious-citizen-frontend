import { useEffect, useMemo, useState } from "react";
import { useTheme } from "../theme/ThemeContext";

export default function TeamRecordModal({ item, onClose }) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const { isLight } = useTheme();

  const speechText = useMemo(
    () => item?.dossier || item?.note || "Описание досье пока недоступно.",
    [item]
  );

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  useEffect(() => {
    if (!item) return undefined;

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [item, onClose]);

  if (!item) return null;

  const speak = () => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(speechText);
    utterance.lang = "ru-RU";
    utterance.rate = 0.82;
    utterance.pitch = 0.58;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeech = () => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 py-6 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className={[
          "relative w-full max-w-5xl overflow-hidden rounded-[2.4rem] border shadow-[0_45px_140px_rgba(0,0,0,0.72)]",
          isLight
            ? "border-black/10 bg-[linear-gradient(180deg,rgba(248,246,241,0.99),rgba(226,223,214,0.98))] text-black"
            : "border-white/10 bg-[linear-gradient(180deg,rgba(11,11,11,0.99),rgba(4,4,4,0.995))] text-white",
        ].join(" ")}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="hospital-noise pointer-events-none absolute inset-0 opacity-90" />
        <div
          className={[
            "pointer-events-none absolute inset-0 opacity-30",
            isLight
              ? "[background-image:linear-gradient(rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.05)_1px,transparent_1px)]"
              : "[background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)]",
            "[background-size:28px_28px]",
          ].join(" ")}
        />
        <div className="pointer-events-none absolute right-0 top-0 h-80 w-72 rounded-full bg-[radial-gradient(circle,rgba(120,13,13,0.12),transparent_58%)] blur-3xl" />

        <div className="relative grid gap-8 p-5 sm:p-7 lg:grid-cols-[0.92fr_1.08fr] lg:p-9">
          <div>
            <div
              className={[
                "text-xs uppercase tracking-[0.4em]",
                isLight ? "text-black/38" : "text-white/35",
              ].join(" ")}
            >
              палата наблюдения / закрытый доступ
            </div>

            <div className="mt-4">
              <div className="text-3xl font-light sm:text-4xl">{item.code}</div>
              <div
                className={[
                  "mt-3 text-sm uppercase tracking-[0.28em]",
                  isLight ? "text-red-950/48" : "text-red-200/38",
                ].join(" ")}
              >
                {item.fullName}
              </div>
            </div>

            <div
              className={[
                "mt-7 rounded-[2rem] border p-4",
                isLight ? "border-black/10 bg-black/[0.04]" : "border-white/10 bg-white/[0.03]",
              ].join(" ")}
            >
              <div
                className={[
                  "overflow-hidden rounded-[1.5rem] border",
                  isLight ? "border-black/10 bg-[#d7d6d3]" : "border-white/10 bg-white/8",
                ].join(" ")}
              >
                <img src={item.imageSrc} alt={item.code} className="h-full w-full object-cover grayscale" />
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-between gap-6">
            <div>
              <div
                className={[
                  "text-xs uppercase tracking-[0.4em]",
                  isLight ? "text-red-950/50" : "text-red-200/42",
                ].join(" ")}
              >
                личное досье
              </div>
              <div
                className={[
                  "mt-5 rounded-[2rem] border p-6 text-base leading-8",
                  isLight ? "border-black/10 bg-white/70 text-black/84" : "border-white/10 bg-black/28 text-white/84",
                ].join(" ")}
              >
                <div className="mb-4 text-sm uppercase tracking-[0.28em] opacity-55">{item.fullName}</div>
                {item.dossier || item.note || "Описание пока недоступно."}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={isSpeaking ? stopSpeech : speak}
                className={[
                  "rounded-full px-6 py-3 text-sm font-semibold uppercase tracking-[0.12em] transition",
                  isLight
                    ? "bg-black text-white hover:-translate-y-0.5"
                    : "bg-white text-black hover:-translate-y-0.5",
                ].join(" ")}
              >
                {isSpeaking ? "Остановить" : "Озвучить досье"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
