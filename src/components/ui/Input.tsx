import type { InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  hint?: string;
};

export function Input({ label, hint, className = "", id, ...props }: Props) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, "-");
  return (
    <label htmlFor={inputId} className="flex flex-col gap-2">
      <span className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
        {label}
      </span>
      <input
        id={inputId}
        className={`h-14 rounded-xl border border-white/25 bg-white/5 px-4 text-base text-white outline-none transition placeholder:text-neutral-500 focus:border-white focus:bg-white/10 ${className}`}
        {...props}
      />
      {hint ? <span className="text-xs text-neutral-500">{hint}</span> : null}
    </label>
  );
}
