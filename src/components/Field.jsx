export default function Field({
  label,
  hint,
  error,
  as = "input",
  className = "",
  options = [],
  ...props
}) {
  const Component = as;
  const baseClassName = [
    "mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-black outline-none transition placeholder:text-black/35 focus:border-black focus:ring-0",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <label className="block">
      {label && <span className="text-sm font-semibold text-black">{label}</span>}
      {hint && <p className="mt-1 text-xs text-black/50">{hint}</p>}

      {as === "select" ? (
        <select className={baseClassName} {...props}>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <Component className={baseClassName} {...props} />
      )}

      {error && <div className="mt-2 text-sm text-red-600">{error}</div>}
    </label>
  );
}
