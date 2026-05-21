import Link from "next/link";

export function LegalFooterLinks({ className = "" }: { className?: string }) {
  return (
    <p
      className={`text-center text-xs leading-relaxed text-neutral-500 ${className}`.trim()}
    >
      <Link
        href="/privacypolicy"
        className="underline decoration-white/30 underline-offset-2 transition hover:text-white"
      >
        Privacy Policy
      </Link>
      <span className="mx-2 text-neutral-600">·</span>
      <Link
        href="/termini-condizioni"
        className="underline decoration-white/30 underline-offset-2 transition hover:text-white"
      >
        Termini e condizioni
      </Link>
    </p>
  );
}
