import { SpottlyIcon } from "@/components/icons/SpottlyIcon";

type Props = {
  size?: "sm" | "md" | "lg";
  className?: string;
  showWordmark?: boolean;
};

const sizes = {
  sm: "h-7 w-7",
  md: "h-10 w-10",
  lg: "h-12 w-12",
};

export function SpottlyLogo({
  size = "md",
  className = "",
  showWordmark = false,
}: Props) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <SpottlyIcon className={sizes[size]} />
      {showWordmark ? (
        <span className="text-lg font-black tracking-tight text-white">
          SPOTTLY
        </span>
      ) : null}
    </span>
  );
}
