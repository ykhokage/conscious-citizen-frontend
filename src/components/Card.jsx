export default function Card({ title, children, right }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 shadow-sm">
      {(title || right) && (
        <div className="flex items-center justify-between mb-4 gap-2">
          <h2 className="text-lg font-semibold">{title}</h2>
          {right}
        </div>
      )}
      {children}
    </div>
  );
}
