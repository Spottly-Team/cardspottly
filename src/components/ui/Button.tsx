import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "solid" | "outline" | "ghost";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  children: ReactNode;
  fullWidth?: boolean;
};

const variants: Record<Variant, string> = {
  solid:
    "bg-white text-black hover:bg-neutral-200 active:scale-[0.98] disabled:bg-neutral-600 disabled:text-neutral-400",
  outline:
    "border-2 border-white bg-transparent text-white hover:bg-white/10 active:scale-[0.98] disabled:border-neutral-600 disabled:text-neutral-600",
  ghost:
    "bg-transparent text-white hover:bg-white/10 active:scale-[0.98] disabled:text-neutral-600",
};

export function Button({
  variant = "solid",
  fullWidth,
  className = "",
  children,
  ...props
}: Props) {
  return (
    <button
      className={`inline-flex h-14 items-center justify-center rounded-full px-6 text-sm font-semibold tracking-wide transition disabled:cursor-not-allowed ${variants[variant]} ${fullWidth ? "w-full" : ""} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
