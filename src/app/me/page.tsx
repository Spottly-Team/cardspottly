"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Shell } from "@/components/ui/Shell";
import { Button } from "@/components/ui/Button";
import { ProfileForm } from "@/components/ProfileForm";
import { useAuth } from "@/components/AuthProvider";
import {
  getCardsByOwner,
  getUserProfile,
  profileToForm,
  saveUserProfile,
} from "@/lib/firestore";
import { getAppBaseUrl } from "@/lib/firebase";
import type { UserProfile } from "@/lib/types";

export default function MePage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [cards, setCards] = useState<string[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth?redirect=%2Fsetup");
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (!user) return;
    const uid = user.uid;

    async function load() {
      const [p, c] = await Promise.all([
        getUserProfile(uid),
        getCardsByOwner(uid),
      ]);
      setProfile(p);
      setCards(c);
      setPageLoading(false);
      if (!p) setEditing(true);
    }

    load();
  }, [user]);

  if (loading || pageLoading) {
    return (
      <Shell title="Area personale" subtitle="Caricamento...">
        <div className="flex flex-1 items-center justify-center">
          <div className="h-8 w-8 animate-pulse rounded-full bg-white/20" />
        </div>
      </Shell>
    );
  }

  if (!user) return null;

  const baseUrl = getAppBaseUrl();

  return (
    <Shell
      title="Area personale"
      subtitle={
        profile
          ? `Ciao, ${profile.fullName.split(" ")[0]}`
          : "Completa il tuo profilo"
      }
    >
      {!editing && profile ? (
        <div className="flex flex-col gap-8">
          <div className="rounded-2xl border border-white/20 bg-white/5 p-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
              Profilo
            </p>
            <p className="mt-2 text-xl font-black text-white">
              @{profile.spottlyUsername}
            </p>
            <p className="mt-1 text-sm text-neutral-400">{profile.fullName}</p>
          </div>

          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-neutral-400">
              Le tue card ({cards.length})
            </p>
            {cards.length === 0 ? (
              <p className="text-sm text-neutral-400">
                Nessuna card associata. Scansiona una card per configurarla.
              </p>
            ) : (
              <ul className="space-y-2">
                {cards.map((id) => (
                  <li key={id}>
                    <Link
                      href={`/c/${id}`}
                      className="flex min-h-[3.25rem] items-center justify-between rounded-xl border border-white/20 bg-white/5 px-4 py-3 transition active:bg-white/10"
                    >
                      <span className="font-mono text-sm text-white">{id}</span>
                      <span className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
                        Apri
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="mt-auto flex flex-col gap-3">
            <Button fullWidth onClick={() => setEditing(true)}>
              Modifica profilo
            </Button>
            <Button fullWidth variant="outline" onClick={() => logout()}>
              Esci
            </Button>
          </div>
        </div>
      ) : (
        <ProfileForm
          initial={profileToForm(profile)}
          existingAvatarUrl={profile?.avatarUrl}
          submitLabel="Salva modifiche"
          onSubmit={async (data, avatar) => {
            await saveUserProfile(user.uid, data, avatar);
            const updated = await getUserProfile(user.uid);
            setProfile(updated);
            setEditing(false);
          }}
        />
      )}

      {!editing ? (
        <p className="mt-6 text-center text-xs text-neutral-400">
          {baseUrl}
        </p>
      ) : (
        <button
          type="button"
          onClick={() => setEditing(false)}
          className="mt-4 text-center text-xs font-semibold uppercase tracking-widest text-neutral-400 underline"
        >
          Annulla
        </button>
      )}
    </Shell>
  );
}
