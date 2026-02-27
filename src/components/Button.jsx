export default function Button({ children, variant = "primary", className = "", ...props }) {
  const cls =
    variant === "primary"
      ? "bg-emerald-500 text-slate-950 hover:bg-emerald-400"
      : variant === "ghost"
      ? "bg-slate-800 hover:bg-slate-700 text-slate-100"
      : "bg-slate-700 hover:bg-slate-600 text-slate-100";

  return (
    <button
      {...props}
      className={`px-4 py-2 rounded-xl text-sm font-medium transition ${cls} disabled:opacity-60 ${className}`}
    >
      {children}
    </button>
  );
}
