"use client";

import { useId } from "react";

type Props = {
  className?: string;
};

/** Icona Spottly — SVG bianco puro dal logo ufficiale */
export function SpottlyIcon({ className = "h-9 w-9" }: Props) {
  const uid = useId().replace(/:/g, "");
  const maskId = `spottly-mask-${uid}`;

  return (
    <svg
      className={className}
      viewBox="0 0 512 512"
      fill="none"
      aria-hidden
    >
      <defs>
        <mask
          id={maskId}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="512"
          height="512"
        >
          <image
            href="/spottly-mask.png"
            width="512"
            height="512"
            preserveAspectRatio="xMidYMid meet"
          />
        </mask>
      </defs>
      <rect width="512" height="512" fill="#FFFFFF" mask={`url(#${maskId})`} />
    </svg>
  );
}
