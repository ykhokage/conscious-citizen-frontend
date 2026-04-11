import { useEffect, useState } from "react";
import { useTheme } from "../theme/ThemeContext";

function getViewportMode() {
  if (typeof window === "undefined") return "desktop";
  if (window.innerWidth < 768) return "mobile";
  if (window.innerWidth < 1280) return "tablet";
  return "desktop";
}

function getCardPosition(index, activeIndex, total) {
  const offset = (index - activeIndex + total) % total;
  if (offset === 0) return "center";
  if (offset === 1) return "right";
  if (offset === total - 1) return "left";
  if (offset === 2) return "backRight";
  if (offset === total - 2) return "backLeft";
  return "hidden";
}

const motionMap = {
  mobile: {
    center: {
      transform: "translate(-50%, calc(-50% - 1.2rem)) scale(1) rotate(0deg)",
      className:
        "pointer-events-auto z-30 opacity-100 shadow-[0_34px_80px_rgba(0,0,0,0.38)]",
    },
    left: {
      transform:
        "translate(calc(-50% - min(60vw,13rem)), calc(-50% + 1.1rem)) scale(0.74) rotate(-7deg)",
      className: "pointer-events-auto z-10 opacity-[0.32]",
    },
    right: {
      transform:
        "translate(calc(-50% + min(60vw,13rem)), calc(-50% + 1.1rem)) scale(0.74) rotate(7deg)",
      className: "pointer-events-auto z-10 opacity-[0.32]",
    },
    backLeft: {
      transform: "translate(calc(-50% - min(85vw,20rem)), calc(-50% + 2.6rem)) scale(0.6) rotate(-10deg)",
      className: "pointer-events-none z-0 opacity-0",
    },
    backRight: {
      transform: "translate(calc(-50% + min(85vw,20rem)), calc(-50% + 2.6rem)) scale(0.6) rotate(10deg)",
      className: "pointer-events-none z-0 opacity-0",
    },
    hidden: {
      transform: "translate(-50%, calc(-50% - 1.2rem)) scale(0.55)",
      className: "pointer-events-none z-0 opacity-0",
    },
  },
  tablet: {
    center: {
      transform: "translate(-50%, -50%) scale(1) rotate(0deg)",
      className:
        "pointer-events-auto z-30 opacity-100 shadow-[0_44px_100px_rgba(0,0,0,0.44)]",
    },
    left: {
      transform:
        "translate(calc(-50% - min(33vw,17rem)), calc(-50% + 2.75rem)) scale(0.8) rotate(-7deg)",
      className: "pointer-events-auto z-20 opacity-[0.88]",
    },
    right: {
      transform:
        "translate(calc(-50% + min(33vw,17rem)), calc(-50% + 2.75rem)) scale(0.8) rotate(7deg)",
      className: "pointer-events-auto z-20 opacity-[0.88]",
    },
    backLeft: {
      transform:
        "translate(calc(-50% - min(50vw,27rem)), calc(-50% + 4rem)) scale(0.66) rotate(-10deg)",
      className: "pointer-events-none z-10 opacity-[0.14] blur-[0.5px]",
    },
    backRight: {
      transform:
        "translate(calc(-50% + min(50vw,27rem)), calc(-50% + 4rem)) scale(0.66) rotate(10deg)",
      className: "pointer-events-none z-10 opacity-[0.14] blur-[0.5px]",
    },
    hidden: {
      transform: "translate(-50%, -50%) scale(0.58)",
      className: "pointer-events-none z-0 opacity-0",
    },
  },
  desktop: {
    center: {
      transform: "translate(-50%, -50%) scale(1) rotate(0deg)",
      className:
        "pointer-events-auto z-30 opacity-100 shadow-[0_55px_120px_rgba(0,0,0,0.5)]",
    },
    left: {
      transform:
        "translate(calc(-50% - min(26vw,21rem)), calc(-50% + 3rem)) scale(0.83) rotate(-7deg)",
      className: "pointer-events-auto z-20 opacity-[0.92]",
    },
    right: {
      transform:
        "translate(calc(-50% + min(26vw,21rem)), calc(-50% + 3rem)) scale(0.83) rotate(7deg)",
      className: "pointer-events-auto z-20 opacity-[0.92]",
    },
    backLeft: {
      transform:
        "translate(calc(-50% - min(42vw,33rem)), calc(-50% + 4.25rem)) scale(0.68) rotate(-11deg)",
      className: "pointer-events-none z-10 opacity-[0.16] blur-[0.6px]",
    },
    backRight: {
      transform:
        "translate(calc(-50% + min(42vw,33rem)), calc(-50% + 4.25rem)) scale(0.68) rotate(11deg)",
      className: "pointer-events-none z-10 opacity-[0.16] blur-[0.6px]",
    },
    hidden: {
      transform: "translate(-50%, -50%) scale(0.62)",
      className: "pointer-events-none z-0 opacity-0",
    },
  },
};

export default function TeamCarousel({ items = [], activeIndex, onSelect }) {
  const { isLight } = useTheme();
  const [viewportMode, setViewportMode] = useState(getViewportMode);

  useEffect(() => {
    const handleResize = () => setViewportMode(getViewportMode());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!items.length) {
    return null;
  }

  const goPrev = () => onSelect((activeIndex - 1 + items.length) % items.length);
  const goNext = () => onSelect((activeIndex + 1) % items.length);
  const showNavButtons = viewportMode !== "desktop";

  return (
    <div
      className={[
        "relative h-[660px] overflow-hidden rounded-[2.3rem] border px-3 py-8 sm:h-[720px] sm:px-5 lg:h-[840px] lg:px-6 lg:py-10 xl:h-[920px]",
        isLight
          ? "border-black/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.78),rgba(232,229,221,0.94))]"
          : "border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))]",
      ].join(" ")}
    >
      <div className="hospital-noise pointer-events-none absolute inset-0 opacity-[0.55]" />
      <div
        className={[
          "pointer-events-none absolute inset-0 opacity-25",
          isLight
            ? "[background-image:linear-gradient(rgba(0,0,0,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.04)_1px,transparent_1px)]"
            : "[background-image:linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)]",
          "[background-size:24px_24px]",
        ].join(" ")}
      />
      <div className="pointer-events-none absolute inset-y-0 left-1/2 w-[38rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.08),transparent_62%)] blur-3xl" />

      <div className="relative mx-auto h-full w-full max-w-[86rem]">
        {items.map((item, index) => {
          const position = getCardPosition(index, activeIndex, items.length);
          const isActive = position === "center";
          const motion = motionMap[viewportMode][position] || motionMap.desktop.hidden;

          return (
            <article
              key={item.id}
              className={[
                "absolute left-1/2 top-1/2 flex h-[560px] w-[272px] flex-col overflow-hidden rounded-[2rem] border p-4 text-left transition-[transform,opacity,box-shadow] duration-500 ease-out sm:h-[620px] sm:w-[332px] sm:p-5 lg:h-[730px] lg:w-[400px] lg:p-6 xl:h-[790px] xl:w-[440px]",
                isLight
                  ? "border-black/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(236,233,226,0.99))] text-black"
                  : "border-white/10 bg-[linear-gradient(180deg,rgba(18,18,20,0.97),rgba(8,8,10,0.995))] text-white",
                motion.className,
                !isActive ? "cursor-pointer" : "",
              ].join(" ")}
              style={{ transform: motion.transform }}
              onClick={() => !isActive && onSelect(index)}
            >
              <div
                className={[
                  "absolute inset-0 rounded-[2rem]",
                  isLight
                    ? "bg-[radial-gradient(circle_at_top,rgba(0,0,0,0.05),transparent_40%)]"
                    : "bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_36%)]",
                ].join(" ")}
              />

              <div className="relative flex h-full flex-col">
                <div
                  className={[
                    "rounded-[1.65rem] border p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]",
                    isLight ? "border-black/10 bg-black/[0.03]" : "border-white/10 bg-[#121214]",
                  ].join(" ")}
                >
                  <div
                    className={[
                      "relative h-[200px] overflow-hidden rounded-[1.25rem] border sm:h-[300px] lg:h-[340px]",
                      isLight ? "border-black/10 bg-[#ddd8ce]" : "border-white/10 bg-[#1b1b20]",
                    ].join(" ")}
                  >
                    <img
                      src={item.imageSrc}
                      alt={item.name}
                      className="h-full w-full object-cover object-center"
                      draggable={false}
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(0,0,0,0.14))]" />
                  </div>
                </div>

                <div className="mt-4 flex flex-1 flex-col text-center sm:mt-5">
                  <div
                    className={[
                      "text-[10px] uppercase tracking-[0.42em] sm:text-[11px]",
                      isLight ? "text-black/38" : "text-white/38",
                      isActive ? "opacity-100" : "opacity-0",
                    ].join(" ")}
                  >
                    {item.roleLabel}
                  </div>

                  <div
                    className={[
                      "mt-3 text-[1.85rem] font-extrabold leading-[1.02] sm:text-[2.4rem] lg:text-[2.55rem]",
                      isActive ? "opacity-100" : "opacity-72",
                    ].join(" ")}
                  >
                    {item.name}
                  </div>

                  <div
                    className={[
                      "mt-2 text-[1.02rem] font-semibold lg:text-lg",
                      isActive ? "opacity-100" : "opacity-72",
                      isLight ? "text-black/68" : "text-white/72",
                    ].join(" ")}
                  >
                    {item.role}
                  </div>

                  {isActive ? (
                    <div
                      className={[
                        "mt-4 rounded-[1.45rem] border px-4 py-3.5 text-left text-[13.5px] leading-[1.6] sm:mt-5 sm:px-5 sm:py-4 sm:text-[15px] sm:leading-7",
                        isLight
                          ? "border-black/10 bg-white/78 text-black/74"
                          : "border-white/10 bg-[#121214] text-white/78",
                      ].join(" ")}
                    >
                      {item.summary}
                    </div>
                  ) : (
                    <div className="mt-auto pt-8 text-center text-[10px] uppercase tracking-[0.24em] sm:text-xs">
                      <span className={isLight ? "text-black/28" : "text-white/24"}>
                        нажмите, чтобы переместить в центр
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {showNavButtons ? (
        <div className="absolute bottom-4 left-1/2 z-40 flex -translate-x-1/2 items-center gap-3 sm:bottom-6 lg:hidden">
          <button
            type="button"
            onClick={goPrev}
            className={[
              "rounded-full border px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] transition sm:px-5",
              isLight
                ? "border-black/10 bg-white/75 text-black/70 hover:bg-white hover:text-black"
                : "border-white/10 bg-white/[0.05] text-white/75 hover:bg-white/10 hover:text-white",
            ].join(" ")}
          >
            Назад
          </button>
          <button
            type="button"
            onClick={goNext}
            className={[
              "rounded-full border px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] transition sm:px-5",
              isLight
                ? "border-black/10 bg-black text-white hover:bg-neutral-800"
                : "border-white/14 bg-white text-black hover:bg-neutral-100",
            ].join(" ")}
          >
            Вперёд
          </button>
        </div>
      ) : null}
    </div>
  );
}
