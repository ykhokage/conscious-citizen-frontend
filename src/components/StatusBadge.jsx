import { categoryLabel, statusLabel } from "../utils/format";

export function StatusBadge({ value, tone = "status" }) {
  const styles =
    tone === "category"
      ? "border-black/10 bg-black/5 text-black/80"
      : value === "draft"
        ? "border-amber-500/20 bg-amber-100 text-amber-800"
        : value === "resolved"
          ? "border-emerald-500/20 bg-emerald-100 text-emerald-800"
          : "border-black/10 bg-white text-black/70";

  return (
    <span className={["inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]", styles].join(" ")}>
      {tone === "category" ? categoryLabel(value) : statusLabel(value)}
    </span>
  );
}
