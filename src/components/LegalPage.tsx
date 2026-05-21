import Link from "next/link";
import type { ReactNode } from "react";
import { Shell } from "@/components/ui/Shell";

type Props = {
  title: string;
  updated: string;
  children: ReactNode;
  otherLegal?: { href: string; label: string };
};

export function LegalPage({ title, updated, children, otherLegal }: Props) {
  return (
    <Shell publicView>
      <article className="legal-doc -mt-2 flex flex-1 flex-col pb-6">
        <div className="legal-doc__body">{children}</div>
        <footer className="legal-doc__footer mt-10 border-t border-white/10 pt-6">
          <p className="text-xs text-neutral-500">© 2026 Spottly</p>
          <nav className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs">
            <Link
              href="/privacypolicy"
              className="font-semibold text-neutral-400 underline decoration-white/30 underline-offset-2 hover:text-white"
            >
              Privacy Policy
            </Link>
            <Link
              href="/termini-condizioni"
              className="font-semibold text-neutral-400 underline decoration-white/30 underline-offset-2 hover:text-white"
            >
              Termini e condizioni
            </Link>
            {otherLegal ? (
              <Link
                href={otherLegal.href}
                className="font-semibold text-neutral-400 underline decoration-white/30 underline-offset-2 hover:text-white"
              >
                {otherLegal.label}
              </Link>
            ) : null}
            <a
              href="https://appspottly.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-neutral-400 underline decoration-white/30 underline-offset-2 hover:text-white"
            >
              Sito Spottly
            </a>
          </nav>
          <p className="mt-4 text-xs text-neutral-600">
            {title} · Ultimo aggiornamento: {updated}
          </p>
        </footer>
      </article>
    </Shell>
  );
}
