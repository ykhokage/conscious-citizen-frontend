export default function Field({ label, ...props }) {
  return (
    <label className="block">
      <span className="text-sm text-slate-300">{label}</span>
      <input
        {...props}
        className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-slate-600"
      />
    </label>
  );
}
