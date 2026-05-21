import type { Metadata } from "next";
import Link from "next/link";
import { Shell } from "@/components/ui/Shell";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Spottly Card — Attiva la tua tessera NFC",
  description:
    "Scansiona la tessera NFC Spottly, configura il profilo con Google o Apple e condividi i tuoi social con un tap.",
  alternates: {
    canonical: "/",
  },
};

export default function HomePage() {
  return (
    <Shell
      title="Spottly Card"
      subtitle="Scansiona la tua card NFC per configurarla o mostrare il tuo profilo."
    >
      <div className="flex flex-1 flex-col justify-between gap-8">
        <ol className="space-y-6 border-l-2 border-white pl-6">
          <li>
            <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
              Passo 1
            </p>
            <p className="mt-1 font-medium text-white">Appoggia la card al telefono</p>
          </li>
          <li>
            <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
              Passo 2
            </p>
            <p className="mt-1 font-medium text-white">Accedi con Google o Apple</p>
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
            <Button fullWidth variant="solid">
              Area personale
            </Button>
          </Link>
          <p className="text-center text-xs text-neutral-400">
            Hai già una card? Scansionala per aprire la tua pagina.
          </p>
        </div>
      </div>
    </Shell>
  );
}
