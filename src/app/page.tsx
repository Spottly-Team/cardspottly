import type { Metadata } from "next";
import Link from "next/link";
import { Shell } from "@/components/ui/Shell";
import { Button } from "@/components/ui/Button";
import { LegalFooterLinks } from "@/components/LegalFooterLinks";

const SHOP_URL = "https://appspottly.com/shop";

export const metadata: Metadata = {
  title: "Spottly Card — Attiva la tua tessera NFC",
  description:
    "Scansiona la tessera NFC Spottly, configura il profilo con Google e condividi i tuoi social con un tap.",
  alternates: {
    canonical: "/",
  },
};

export default function HomePage() {
  return (
    <Shell
      showShopLink
      title="Spottly Card"
      subtitle="Scansiona la tua card NFC per configurarla o mostrare il tuo profilo."
    >
      <div className="flex flex-1 flex-col justify-between gap-8">
        <ol className="space-y-6 border-l-2 border-white pl-6">
          <li>
            <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
              Passo 1
            </p>
            <p className="mt-1 font-medium text-white">
              Non hai ancora la tessera? Acquistala nello shop Spottly.
            </p>
            <a
              href={SHOP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex text-sm font-semibold text-white underline decoration-white/40 underline-offset-4"
            >
              Acquista la card →
            </a>
            <p className="mt-3 text-sm text-neutral-400">
              Ce l&apos;hai già? Appoggiala al telefono per iniziare.
            </p>
          </li>
          <li>
            <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
              Passo 2
            </p>
            <p className="mt-1 font-medium text-white">Accedi con Google</p>
          </li>
          <li>
            <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
              Passo 3
            </p>
            <p className="mt-1 font-medium text-white">Compila il profilo e salva</p>
          </li>
        </ol>

        <div className="flex flex-col gap-3">
          <Link href="/me">
            <Button fullWidth variant="outline">
              Hai già configurato la card? Area personale
            </Button>
          </Link>
          <p className="text-center text-xs text-neutral-400">
            Scansiona la tua tessera per aprire la pagina del profilo.
          </p>
          <LegalFooterLinks className="mt-2 border-t border-white/10 pt-6" />
        </div>
      </div>
    </Shell>
  );
}
