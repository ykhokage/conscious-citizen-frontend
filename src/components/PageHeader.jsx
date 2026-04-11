export default function PageHeader({ eyebrow = "раздел", title, description, actions }) {
  return (
    <div className="grid gap-6 border-b border-[color:var(--frame-border)] pb-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
      <div>
        <div className="section-kicker">{eyebrow}</div>
        <h1 className="mt-3 text-4xl font-black uppercase tracking-tight sm:text-5xl">{title}</h1>
        {description && (
          <p className="mt-4 max-w-3xl text-sm leading-6 text-[color:var(--muted-fg)] sm:text-base">
            {description}
          </p>
        )}
      </div>

      {actions && (
        <div className="page-header-actions flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center lg:w-auto lg:justify-end">
          {actions}
        </div>
      )}
    </div>
  );
}
