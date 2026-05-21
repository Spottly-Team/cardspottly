import Link from "next/link";
import type { ReactNode } from "react";
import { SpottlyLogo } from "@/components/SpottlyLogo";

const SHOP_URL = "https://appspottly.com/shop";

export function Shell({
  children,
  title,
  subtitle,
  publicView = false,
  showShopLink = false,
  headerAction,
}: {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  /** Vista pubblica profilo card */
  publicView?: boolean;
  /** Home: mostra "Acquista la card" invece di Area personale */
  showShopLink?: boolean;
  /** Es. Accedi o Area personale in vista pubblica */
  headerAction?: { href: string; label: string };
}) {
  const showHeaderEnd = showShopLink || (!publicView && !showShopLink) || headerAction;

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-lg flex-col px-5 pb-10 pt-[max(2rem,env(safe-area-inset-top))]">
      <header
        className={`mb-8 flex items-center gap-4 ${showHeaderEnd ? "justify-between" : "justify-center"}`}
      >
        <Link href="/" aria-label="Spottly home">
          <SpottlyLogo size="md" showWordmark />
        </Link>
        {headerAction ? (
          <Link
            href={headerAction.href}
            className="shrink-0 text-xs font-semibold uppercase tracking-widest text-neutral-400 transition hover:text-white"
          >
            {headerAction.label}
          </Link>
        ) : showShopLink ? (
          <a
            href={SHOP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 rounded-full border border-white/25 px-3 py-2 text-xs font-semibold uppercase tracking-widest text-white transition active:bg-white/10"
          >
            Acquista la card
          </a>
        ) : !publicView ? (
          <Link
            href="/me"
            className="shrink-0 text-xs font-semibold uppercase tracking-widest text-neutral-400 transition hover:text-white"
          >
            Area personale
          </Link>
        ) : null}
      </header>

      {(title || subtitle) && (
        <div className="mb-8">
          {title ? (
            <h1 className="text-[1.75rem] font-black leading-tight tracking-tight text-white sm:text-3xl">
              {title}
            </h1>
          ) : null}
          {subtitle ? (
            <p className="mt-2 text-base leading-relaxed text-neutral-400">
              {subtitle}
            </p>
          ) : null}
        </div>
      )}

      <main className="flex flex-1 flex-col">{children}</main>
    </div>
  );
}
