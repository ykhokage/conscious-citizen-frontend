import { useTheme } from "../theme/ThemeContext";

const positionClasses = {
  center:
  "pointer-events-auto z-30 -translate-x-[50%] scale-100 opacity-100 rotate-0 shadow-[0_55px_120px_rgba(0,0,0,0.5)]",
  left:
    "pointer-events-auto z-20 -translate-x-[60%] translate-y-[5%] rotate-[-7deg] scale-[0.86] opacity-95 shadow-[0_38px_85px_rgba(0,0,0,0.32)]",
  right:
    "pointer-events-auto z-20 translate-x-[52%] translate-y-[5%] rotate-[7deg] scale-[0.86] opacity-95 shadow-[0_38px_85px_rgba(0,0,0,0.32)]",
  backLeft:
    "pointer-events-none z-10 -translate-x-[96%] translate-y-[8%] rotate-[-11deg] scale-[0.7] opacity-16 blur-[0.6px]",
  backRight:
    "pointer-events-none z-10 translate-x-[88%] translate-y-[8%] rotate-[11deg] scale-[0.7] opacity-16 blur-[0.6px]",
  hidden: "pointer-events-none z-0 scale-[0.62] opacity-0",
};

function getCardPosition(index, activeIndex, total) {
  const offset = (index - activeIndex + total) % total;
  if (offset === 0) return "center";
  if (offset === 1) return "right";
  if (offset === total - 1) return "left";
  if (offset === 2) return "backRight";
  if (offset === total - 2) return "backLeft";
  return "hidden";
}

export default function TeamCarousel({ items, activeIndex, onSelect }) {
  const { isLight } = useTheme();

  return (
    <div
      className={[
        "relative h-[820px] overflow-hidden rounded-[2.8rem] border px-3 py-10 sm:px-6 lg:h-[900px] xl:h-[960px]",
        isLight
          ? "border-black/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.78),rgba(232,229,221,0.94))]"
          : "border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))]",
      ].join(" ")}
    >
      <div className="hospital-noise pointer-events-none absolute inset-0 opacity-55" />
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

          return (
            <article
              key={item.id}
              className={[
                "absolute left-1/2 top-[45%] flex h-[660px] w-[320px] -translate-y-1/2 flex-col overflow-hidden rounded-[2rem] border p-4 transition-all duration-500 ease-out sm:h-[730px] sm:w-[370px] sm:p-5 lg:h-[800px] lg:w-[440px] lg:p-6",
                isLight
                  ? "border-black/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(236,233,226,0.99))] text-black"
                  : "border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.09),rgba(255,255,255,0.02))] text-white",
                positionClasses[position],
                !isActive ? "cursor-pointer" : "",
              ].join(" ")}
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
                    isLight ? "border-black/10 bg-black/[0.03]" : "border-white/10 bg-black/25",
                  ].join(" ")}
                >
                  <div
                    className={[
                      "relative h-[260px] overflow-hidden rounded-[1.25rem] border sm:h-[300px] lg:h-[340px]",
                      isLight ? "border-black/10 bg-[#ddd8ce]" : "border-white/10 bg-white/10",
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

                <div className="mt-5 flex flex-1 flex-col text-center">
                  <div
                    className={[
                      "text-[11px] uppercase tracking-[0.42em] transition-opacity duration-300",
                      isLight ? "text-black/38" : "text-white/38",
                      isActive ? "opacity-100" : "opacity-0",
                    ].join(" ")}
                  >
                    {item.roleLabel}
                  </div>

                  <div
                    className={[
                      "mt-3 leading-tight transition-all duration-300",
                      isActive ? "text-[2.55rem] font-extrabold" : "text-[1.35rem] font-semibold opacity-75",
                    ].join(" ")}
                  >
                    {item.name}
                  </div>

                  <div
                    className={[
                      "mt-2 transition-all duration-300",
                      isActive ? "text-lg font-semibold" : "text-sm font-medium opacity-70",
                      isLight ? "text-black/68" : "text-white/72",
                    ].join(" ")}
                  >
                    {item.role}
                  </div>

                  {isActive ? (
                    <div
                      className={[
                        "mt-5 rounded-[1.45rem] border px-5 py-4 text-left text-sm leading-6 sm:text-[15px] sm:leading-7",
                        isLight
                          ? "border-black/10 bg-white/78 text-black/74"
                          : "border-white/10 bg-black/20 text-white/74",
                      ].join(" ")}
                    >
                      {item.summary}
                    </div>
                  ) : (
                    <div className="mt-auto pt-8 text-xs uppercase tracking-[0.24em] text-center">
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
    </div>
  );
}