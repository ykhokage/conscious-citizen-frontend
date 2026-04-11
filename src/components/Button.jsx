import { useTheme } from "../theme/ThemeContext";

const sizes = {
  sm: "min-h-10 px-4 text-sm",
  md: "min-h-12 px-5 text-sm sm:text-base",
  lg: "min-h-14 px-6 text-base",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  type = "button",
  ...props
}) {
  const { isLight } = useTheme();

  const variants = {
    primary:
      "border-black bg-black text-white shadow-[0_8px_24px_rgba(0,0,0,0.18)] hover:-translate-y-0.5 hover:bg-neutral-800 hover:shadow-[0_14px_32px_rgba(0,0,0,0.28)]",
    secondary: isLight
      ? "border-black bg-black text-white shadow-[0_8px_24px_rgba(0,0,0,0.12)] hover:-translate-y-0.5 hover:bg-neutral-800"
      : "border-white/20 bg-white text-black shadow-[0_12px_30px_rgba(0,0,0,0.28)] hover:-translate-y-0.5 hover:bg-neutral-100 hover:text-neutral-800",
    ghost: isLight
      ? "border-black/12 bg-transparent text-black hover:-translate-y-0.5 hover:bg-black/5"
      : "border-white/12 bg-transparent text-white hover:-translate-y-0.5 hover:bg-white/10",
    darkGhost: isLight
      ? "border-black/10 bg-transparent text-black shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 hover:bg-black/5 hover:text-black"
      : "border-white/10 bg-white/[0.03] text-white shadow-[0_8px_24px_rgba(0,0,0,0.14)] hover:-translate-y-0.5 hover:bg-white/10 hover:text-white",
    soft: isLight
      ? "border-black/10 bg-white/80 text-black shadow-[0_10px_26px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 hover:bg-white"
      : "border-white/20 bg-white text-black shadow-[0_14px_34px_rgba(0,0,0,0.34)] hover:-translate-y-0.5 hover:bg-neutral-100",
  };

  return (
    <button
      type={type}
      className={[
        "inline-flex min-w-0 items-center justify-center gap-2 rounded-2xl border font-semibold leading-5 text-center transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 active:translate-y-0",
        variants[variant] || variants.primary,
        sizes[size] || sizes.md,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </button>
  );
}
