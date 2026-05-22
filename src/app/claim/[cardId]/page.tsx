"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Shell } from "@/components/ui/Shell";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/components/AuthProvider";
import { isValidCardId, normalizeCardId } from "@/lib/card-id";
import { claimCard, getCard } from "@/lib/firestore";
import { isRegisteredUser } from "@/lib/profile-complete";

export default function ClaimPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading, redirectHandled } = useAuth();
  const cardId = normalizeCardId(
    typeof params.cardId === "string" ? params.cardId : "",
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [alreadyClaimed, setAlreadyClaimed] = useState(false);
  const [claiming, setClaiming] = useState(false);

  useEffect(() => {
    if (!redirectHandled || authLoading) return;
    if (!user) {
      router.replace(
        `/auth?redirect=${encodeURIComponent(`/c/${cardId}`)}`,
      );
    }
  }, [redirectHandled, authLoading, user, router, cardId]);

  useEffect(() => {
    if (!isValidCardId(cardId)) return;
    if (!user) return;
    const uid = user.uid;

    async function check() {
      const card = await getCard(cardId);
      if (!card) {
        setError("Card non trovata.");
      } else if (card.claimedBy) {
        if (card.claimedBy === uid) {
          router.replace(
            (await isRegisteredUser(uid)) ? "/me" : `/setup?cardId=${cardId}`,
          );
          return;
        }
        setAlreadyClaimed(true);
      }
      setLoading(false);
    }

    check();
  }, [cardId, user, router]);

  async function handleClaim() {
    if (!user) return;
    setClaiming(true);
    setError(null);
    try {
      await claimCard(cardId, user.uid);
      router.push(
        (await isRegisteredUser(user.uid)) ? "/me" : `/setup?cardId=${cardId}`,
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore durante il claim.");
    } finally {
      setClaiming(false);
    }
  }

  if (!isValidCardId(cardId)) {
    return (
      <Shell title="Link non valido" subtitle="Questa card non esiste.">
        <Link href="/">
          <Button variant="outline">Home</Button>
        </Link>
      </Shell>
    );
  }

  if (!redirectHandled || authLoading || loading) {
    return (
      <Shell title="Associa card" subtitle="Caricamento...">
        <div className="flex flex-1 items-center justify-center">
          <div className="h-8 w-8 animate-pulse rounded-full bg-white/20" />
        </div>
      </Shell>
    );
  }

  if (alreadyClaimed) {
    return (
      <Shell
        title="Card già configurata"
        subtitle="Questa tessera è già associata a un altro account."
      >
        <Link href={`/c/${cardId}`}>
          <Button fullWidth variant="outline">
            Vedi profilo
          </Button>
        </Link>
      </Shell>
    );
  }

  return (
    <Shell
      title="Associa la card"
      subtitle="Confermi di voler collegare questa tessera al tuo account Spottly?"
    >
      <div className="mt-auto flex flex-col gap-4">
        <p className="rounded-2xl border border-white/20 bg-white/5 px-4 py-3 text-sm text-neutral-300">
          Nel passo successivo inserirai nome, social, anno di nascita e foto
          profilo.
        </p>
        {error ? (
          <p className="rounded-xl border border-white/30 bg-white/5 px-4 py-3 text-sm text-white">
            {error}
          </p>
        ) : null}
        <Button fullWidth onClick={handleClaim} disabled={claiming}>
          {claiming ? "Associazione..." : "Sì, associa questa card"}
        </Button>
        <Link href={`/c/${cardId}`}>
          <Button fullWidth variant="ghost">
            Annulla
          </Button>
        </Link>
      </div>
    </Shell>
  );
}
