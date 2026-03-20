import { useTheme } from "../theme/ThemeContext";

const sizes = {
  sm: "h-10 px-4 text-sm",
  md: "h-12 px-5 text-sm sm:text-base",
  lg: "h-14 px-6 text-base",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}) {
  const { isLight } = useTheme();

  const variants = {
    primary:
      "bg-black text-white hover:-translate-y-0.5 hover:bg-neutral-800 border-black shadow-[0_8px_24px_rgba(0,0,0,0.18)] hover:shadow-[0_14px_32px_rgba(0,0,0,0.28)]",
    secondary: isLight
      ? "bg-black text-white hover:-translate-y-0.5 hover:bg-neutral-800 border-black shadow-[0_8px_24px_rgba(0,0,0,0.12)]"
      : "bg-white text-black hover:-translate-y-0.5 hover:bg-neutral-100 hover:text-neutral-700 border-black/15 shadow-[0_10px_30px_rgba(255,255,255,0.08)] hover:shadow-[0_18px_36px_rgba(255,255,255,0.14)]",
    ghost: "bg-transparent text-black hover:bg-black/5 border-black/10",
    darkGhost: isLight
      ? "bg-transparent text-black hover:-translate-y-0.5 hover:bg-black/5 hover:text-black border-black/10 shadow-[0_8px_24px_rgba(0,0,0,0.08)]"
      : "bg-transparent text-white hover:-translate-y-0.5 hover:bg-white/10 hover:text-white border-white/10 shadow-[0_8px_24px_rgba(0,0,0,0.14)]",
    soft: "bg-black/5 text-black hover:bg-black/10 border-black/10",
  };

  return (
    <button
      className={[
        "inline-flex items-center justify-center gap-2 rounded-2xl border font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 active:translate-y-0",
        variants[variant],
        sizes[size],
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
