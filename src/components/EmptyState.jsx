export default function EmptyState({ title, description, action }) {
  return (
    <div className="rounded-[2rem] border border-dashed border-black/15 bg-white/60 p-8 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-black text-white">•</div>
      <h3 className="mt-5 text-2xl font-black uppercase tracking-tight">{title}</h3>
      {description && <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-black/60">{description}</p>}
      {action && <div className="mt-6 flex justify-center">{action}</div>}
    </div>
  );
}
