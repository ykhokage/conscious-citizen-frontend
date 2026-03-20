export default function Card({ title, description, right, className = "", children }) {
  return (
    <section className={["paper-card", className].filter(Boolean).join(" ")}>
      {(title || description || right) && (
        <div className="mb-5 flex flex-col gap-3 border-b border-black/10 pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            {title && <h2 className="text-2xl font-black uppercase tracking-tight">{title}</h2>}
            {description && <p className="mt-2 max-w-2xl text-sm leading-6 text-black/60">{description}</p>}
          </div>
          {right && <div className="shrink-0">{right}</div>}
        </div>
      )}
      {children}
    </section>
  );
}
