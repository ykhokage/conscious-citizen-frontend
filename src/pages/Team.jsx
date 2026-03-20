import { useMemo, useState } from "react";
import TeamCarousel from "../components/TeamCarousel";
import { teamRecords } from "../data/teamRecords";
import { useTheme } from "../theme/ThemeContext";

export default function Team() {
  const [activeIndex, setActiveIndex] = useState(0);
  const { isLight, toggleTheme } = useTheme();

  const activeItem = useMemo(() => teamRecords[activeIndex] || teamRecords[0], [activeIndex]);

  return (
    <div className="app-container pt-4 sm:pt-6">
      <section
        className={[
          "relative overflow-hidden rounded-[2.9rem] border px-4 py-6 shadow-[0_40px_120px_rgba(0,0,0,0.45)] sm:px-6 sm:py-8 lg:px-8",
          isLight
            ? "border-black/10 bg-[linear-gradient(180deg,rgba(250,248,242,0.985),rgba(233,229,219,0.98))]"
            : "border-white/10 bg-[linear-gradient(180deg,rgba(10,10,12,0.98),rgba(4,4,6,0.99))]",
        ].join(" ")}
      >
        <div className="hospital-noise pointer-events-none absolute inset-0 opacity-70" />
        <div
          className={[
            "pointer-events-none absolute inset-0 opacity-30",
            isLight
              ? "[background-image:linear-gradient(rgba(0,0,0,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.045)_1px,transparent_1px)]"
              : "[background-image:linear-gradient(rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.045)_1px,transparent_1px)]",
            "[background-size:28px_28px]",
          ].join(" ")}
        />
        <div className="pointer-events-none absolute -left-10 top-12 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.08),transparent_62%)] blur-3xl" />
        <div className="pointer-events-none absolute right-0 top-0 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(182,37,37,0.14),transparent_60%)] blur-3xl" />

        <div className="relative flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={toggleTheme}
            className={[
              "rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] transition",
              isLight
                ? "border-black/10 bg-white/75 text-black/75 hover:bg-white hover:text-black"
                : "border-white/10 bg-white/[0.03] text-white/75 hover:bg-white/10 hover:text-white",
            ].join(" ")}
          >
            {isLight ? "Тёмная тема" : "Светлая тема"}
          </button>
        </div>

        <div className="relative mt-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-4xl">
            <div className={["section-kicker", isLight ? "text-black/55" : "text-white/55"].join(" ")}>
              team easter egg / creators
            </div>
            <h1 className="mt-3 text-4xl font-extrabold uppercase leading-[0.9] tracking-[-0.03em] sm:text-6xl lg:text-[5rem]">
              Наша команда
            </h1>
            <p
              className={[
                "mt-5 max-w-2xl text-sm leading-7 sm:text-base",
                isLight ? "text-black/68" : "text-white/58",
              ].join(" ")}
            >
              Небольшая пасхалка про людей, которые собирали этот проект. Перемещай карточки в центр и смотри,
              кто за какую часть продукта отвечал.
            </p>
          </div>

          <div
            className={[
              "self-start rounded-[1.6rem] border px-5 py-4 text-sm leading-6 lg:max-w-sm",
              isLight ? "border-black/10 bg-white/65 text-black/72" : "border-white/10 bg-white/[0.04] text-white/68",
            ].join(" ")}
          >
            <div className="text-xs font-semibold uppercase tracking-[0.28em]">В центре</div>
            <div className="mt-2 text-2xl font-extrabold leading-tight">{activeItem.name}</div>
            <div className={["mt-1 font-medium", isLight ? "text-black/60" : "text-white/58"].join(" ")}>{activeItem.role}</div>
          </div>
        </div>

        <div className="mt-8">
          <TeamCarousel items={teamRecords} activeIndex={activeIndex} onSelect={setActiveIndex} ariaLabel={activeItem?.role} />
        </div>
      </section>
    </div>
  );
}
