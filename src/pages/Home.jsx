import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { useTheme } from "../theme/ThemeContext";
import Button from "../components/Button";

const features = [
  "Нарушения правил парковки",
  "Факты продажи просроченных продуктов",
  "Фотофиксация и история обращений",
];

export default function Home() {
  const { isAuthed } = useAuth();
  const { isLight } = useTheme();
  const heroShadow = isLight
    ? "[text-shadow:8px_8px_0_rgba(0,0,0,0.10)]"
    : "[text-shadow:8px_8px_0_rgba(255,255,255,0.12)]";

  return (
    <div className="app-container pt-8 sm:pt-12 lg:pt-10 xl:pt-12">
      <section className="grid gap-6 lg:gap-10 xl:grid-cols-[minmax(0,1.18fr)_minmax(320px,0.58fr)] xl:items-end xl:gap-20">
        <div className="max-w-full xl:-mt-8">
          <div className="section-kicker">городская платформа обращений</div>
          <h1 className="hero-title mt-5 max-w-full sm:mt-6 xl:max-w-5xl">
            <span className={["inline-block", heroShadow].join(" ")}>Гражданский</span>
            <br />
            <span
              className={[
                "inline-block border-b pb-2 tracking-[0.02em] font-extrabold",
                heroShadow,
                isLight ? "border-black/25" : "border-white/35",
              ].join(" ")}
            >
              контроль
            </span>
          </h1>
        </div>

        <div className="dark-panel w-full p-5 sm:p-8 xl:justify-self-end xl:max-w-[390px] 2xl:max-w-[420px]">
          <p className="max-w-none text-sm leading-7 text-[color:var(--muted-fg)] sm:text-base">
            Подавайте обращения быстро и без лишних шагов: отметьте проблему на карте, добавьте фото,
            коротко опишите ситуацию и отправьте её в понятном городском формате.
          </p>
          <div className="mt-8 flex flex-col items-stretch gap-3">
            <Link to={isAuthed ? "/categories" : "/register"} className="block w-full">
              <Button variant="secondary" size="lg" className="w-full">
                Донести
              </Button>
            </Link>
            <Link to="/incidents" className="block w-full sm:mx-auto sm:max-w-[220px] lg:mx-0 lg:max-w-none">
              <Button variant="darkGhost" size="lg" className="w-full justify-center">
                Все обращения
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="paper mt-10 overflow-hidden rounded-t-[2.25rem] border border-black/10 shadow-ink">
        <div className="grid items-stretch gap-8 px-5 py-6 sm:px-8 sm:py-10 lg:grid-cols-[1.15fr_0.85fr] lg:px-10">
          <div className="flex h-full flex-col">
            <div className="max-w-3xl border-b border-black/35 pb-4 text-base leading-8 text-black/75 sm:text-[1.15rem]">
              Сообщайте о нарушениях парковки, продаже просроченных товаров и других заметных
              городских проблемах. Формируйте обращение, прикладывайте фото и сохраняйте всю
              историю в одном месте.
            </div>

            <div className="mt-8 grid flex-1 gap-4 md:grid-cols-3 md:auto-rows-fr">
              {features.map((feature, index) => (
                <div
                  key={feature}
                  className="flex h-full min-h-[170px] flex-col rounded-[1.75rem] border border-black/10 bg-white/70 p-5 sm:min-h-[220px]"
                >
                  <div className="text-xs uppercase tracking-[0.22em] text-black/40">0{index + 1}</div>
                  <div className="mt-3 text-sm font-semibold leading-6 text-black/80">{feature}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex h-full flex-col justify-between gap-8 rounded-[2rem] border border-black/10 bg-black p-6 text-white sm:p-8">
            <div>
              <div className="text-xs uppercase tracking-[0.22em] text-white/40">миссия</div>
              <div className="mt-5 text-3xl font-black uppercase leading-tight sm:text-4xl">
                Вместе мы делаем город лучше.
              </div>
            </div>

            <div className="space-y-3 text-sm leading-6 text-white/70">
              <p>Одна заявка — это не просто запись в системе, а понятный сигнал о городской проблеме.</p>
              <p>Чем аккуратнее подан кейс, тем проще его обработать и передать дальше.</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-black/10 px-5 py-4 text-[11px] uppercase tracking-[0.22em] text-black/45 sm:flex-row sm:items-center sm:justify-between sm:px-10">
          <div className="flex flex-wrap gap-4">
            <span>Самара 2026</span>
            <span>incidents.info63@gmail.ru</span>
          </div>
          <span>
            Design system by <Link to="/team" className="team-link relative inline-block">Team</Link> 1
          </span>
        </div>
      </section>
    </div>
  );
}
