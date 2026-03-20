export default function BrandMark({ dark = false, variant = "default", title, subtitle, hideText = false }) {
  const ink = dark ? "#090909" : "#f3f3f3";

  if (variant === "hospital") {
    return (
      <div className="flex items-center gap-3">
        <div
          className={`flex h-14 w-14 items-center justify-center rounded-2xl border ${
            dark ? "border-black/15 bg-white/70 shadow-[0_8px_24px_rgba(0,0,0,0.06)]" : "border-white/15 bg-white/[0.05]"
          }`}
        >
          <svg width="30" height="30" viewBox="0 0 64 64" fill="none" aria-hidden="true">
            <path
              d="M27 10h10v17h17v10H37v17H27V37H10V27h17V10Z"
              fill={ink}
            />
            <path
              d="M27 10h10v17h17v10H37v17H27V37H10V27h17V10Z"
              stroke={ink}
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        {!hideText && <div className="hidden sm:block">
          <div className={`text-xs uppercase tracking-[0.34em] ${dark ? "text-black/45" : "text-white/45"}`}>
            {subtitle || "закрытое отделение"}
          </div>
          <div className={`text-sm font-semibold ${dark ? "text-black" : "text-white"}`}>
            {title || "Психиатрическая больница T1"}
          </div>
        </div>}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <div
        className={`flex h-14 w-14 items-center justify-center rounded-2xl border ${
          dark ? "border-black/15 bg-white/70 shadow-[0_8px_24px_rgba(0,0,0,0.06)]" : "border-white/15 bg-white/5"
        }`}
      >
        <svg width="30" height="30" viewBox="0 0 64 64" fill="none" aria-hidden="true">
          <path
            d="M32 8c-10.493 0-19 8.507-19 19 0 13.193 15.345 26.515 18.196 28.896a1.25 1.25 0 0 0 1.608 0C35.655 53.515 51 40.193 51 27 51 16.507 42.493 8 32 8Z"
            stroke={ink}
            strokeWidth="4"
          />
          <circle cx="32" cy="27" r="6" fill={ink} />
          <path d="M10 56h44" stroke={ink} strokeWidth="4" strokeLinecap="round" />
          <path d="M16 49h7v7M41 49h7v7" stroke={ink} strokeWidth="4" strokeLinecap="round" />
        </svg>
      </div>
      <div className="hidden sm:block">
        <div className={`text-xs uppercase tracking-[0.3em] ${dark ? "text-black/45" : "text-white/45"}`}>
          civic platform
        </div>
        <div className={`text-sm font-semibold ${dark ? "text-black" : "text-white"}`}>
          Гражданский контроль
        </div>
      </div>
    </div>
  );
}
