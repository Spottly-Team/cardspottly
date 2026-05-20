"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Shell } from "@/components/ui/Shell";
import { Button } from "@/components/ui/Button";
import { PublicProfile } from "@/components/PublicProfile";
import { useAuth } from "@/components/AuthProvider";
import { isValidCardId, normalizeCardId } from "@/lib/card-id";
import { getCard, getUserProfile } from "@/lib/firestore";
import type { UserProfile } from "@/lib/types";

export default function CardPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const rawId = typeof params.cardId === "string" ? params.cardId : "";
  const cardId = normalizeCardId(rawId);

  const [loading, setLoading] = useState(true);
  const [claimed, setClaimed] = useState(false);
  const [ownerUid, setOwnerUid] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!isValidCardId(cardId)) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    async function load() {
      setLoading(true);
      try {
        const card = await getCard(cardId);
        if (!card) {
          setNotFound(true);
          return;
        }

        if (card.claimedBy) {
          setClaimed(true);
          setOwnerUid(card.claimedBy);
          const userProfile = await getUserProfile(card.claimedBy);
          setProfile(userProfile);
        } else {
          setClaimed(false);
        }
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [cardId]);

  if (!isValidCardId(cardId)) {
    return (
      <Shell
        title="Link non valido"
        subtitle="Il codice card deve essere di 12 caratteri (lettere e numeri)."
      >
        <p className="mb-6 text-sm text-neutral-400">
          Usa l&apos;URL completo, es.{" "}
          <span className="font-mono">/c/24VGJ5Q12GAM</span>
        </p>
        <Link href="/">
          <Button variant="outline">Torna alla home</Button>
        </Link>
      </Shell>
    );
  }

  if (notFound) {
    return (
      <Shell
        title="Card non trovata"
        subtitle="Questo codice non è nel database. Usa un link dal tuo cards.csv."
      >
        <p className="mb-2 font-mono text-sm">{cardId}</p>
        <p className="mb-6 text-sm text-neutral-400">
          Apri:{" "}
          <span className="font-mono">
            http://localhost:3000/c/{cardId}
          </span>
        </p>
        <Link href="/">
          <Button variant="outline">Torna alla home</Button>
        </Link>
      </Shell>
    );
  }

  if (loading || authLoading) {
    return (
      <Shell title="Caricamento" subtitle="Un attimo...">
        <div className="flex flex-1 items-center justify-center">
          <div className="h-8 w-8 animate-pulse rounded-full bg-white/20" />
        </div>
      </Shell>
    );
  }

  if (claimed && profile) {
    return (
      <Shell publicView>
        <PublicProfile profile={profile} />
      </Shell>
    );
  }

  if (claimed && !profile) {
    return (
      <Shell
        title="Profilo in preparazione"
        subtitle="La card è associata ma il profilo non è ancora completo."
      >
        {user && ownerUid === user.uid ? (
          <Link href={`/setup?cardId=${cardId}`}>
            <Button fullWidth>Completa profilo</Button>
          </Link>
        ) : null}
      </Shell>
    );
  }

  return (
    <Shell
      title="Configura la tua card"
      subtitle="Segui questi passaggi per attivare la tessera Spottly."
    >
      <ol className="mb-8 space-y-5 border-l-2 border-white pl-6">
        <li>
          <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
            1
          </p>
          <p className="mt-1 font-medium text-white">Accedi con Google o Apple</p>
        </li>
        <li>
          <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
            2
          </p>
          <p className="mt-1 font-medium text-white">Associa questa card al tuo account</p>
        </li>
        <li>
          <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
            3
          </p>
          <p className="mt-1 font-medium text-white">
            Inserisci i tuoi dati: social, nome, anno di nascita e foto
          </p>
        </li>
      </ol>

      <div className="mt-auto flex flex-col gap-3">
        {user ? (
          <Button fullWidth onClick={() => router.push(`/claim/${cardId}`)}>
            Associa questa card
          </Button>
        ) : (
          <Link href={`/auth?redirect=${encodeURIComponent(`/claim/${cardId}`)}`}>
            <Button fullWidth>Accedi per configurare</Button>
          </Link>
        )}
        <p className="text-center text-xs font-mono text-neutral-400">
          Card ID: {cardId}
        </p>
      </div>
    </Shell>
  );
}
