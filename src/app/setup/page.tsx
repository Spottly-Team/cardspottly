"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Shell } from "@/components/ui/Shell";
import { ProfileForm } from "@/components/ProfileForm";
import { useAuth } from "@/components/AuthProvider";
import {
  getCard,
  getUserProfile,
  profileToForm,
  saveUserProfile,
} from "@/lib/firestore";
import { isValidCardId, normalizeCardId } from "@/lib/card-id";
import { isRegisteredUser } from "@/lib/profile-complete";

function SetupContent() {
  const { user, loading, redirectHandled } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const cardId = params.get("cardId")
    ? normalizeCardId(params.get("cardId")!)
    : null;
  const [initial, setInitial] = useState(profileToForm(null));
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>();
  const [profileLoading, setProfileLoading] = useState(true);
  const [cardCheckLoading, setCardCheckLoading] = useState(!!cardId);

  useEffect(() => {
    if (!redirectHandled || loading) return;
    if (!user) {
      const redirect =
        cardId && isValidCardId(cardId) ? `/c/${cardId}` : "/me";
      router.replace(`/auth?redirect=${encodeURIComponent(redirect)}`);
    }
  }, [redirectHandled, loading, user, router, cardId]);

  useEffect(() => {
    if (!user) return;
    const uid = user.uid;

    async function load() {
      if (cardId && isValidCardId(cardId)) {
        const card = await getCard(cardId);
        if (!card?.claimedBy || card.claimedBy !== uid) {
          router.replace(`/claim/${cardId}`);
          return;
        }
      }

      if (await isRegisteredUser(uid)) {
        router.replace("/me");
        return;
      }
      const p = await getUserProfile(uid);
      setInitial(profileToForm(p));
      setAvatarUrl(p?.avatarUrl);
      setProfileLoading(false);
      setCardCheckLoading(false);
    }

    load();
  }, [user, cardId, router]);

  if (!redirectHandled || loading || !user || profileLoading || cardCheckLoading) {
    return (
      <Shell title="Setup profilo" subtitle="Caricamento...">
        <div className="flex flex-1 items-center justify-center">
          <div className="h-8 w-8 animate-pulse rounded-full bg-white/20" />
        </div>
      </Shell>
    );
  }

  return (
    <Shell
      title="Crea il tuo profilo"
      subtitle="Compila i campi. Potrai modificarli in qualsiasi momento dall'area personale."
    >
      <ProfileForm
        initial={initial}
        existingAvatarUrl={avatarUrl}
        submitLabel="Salva e attiva card"
        onSubmit={async (data, avatar) => {
          await saveUserProfile(user.uid, data, avatar);
          if (cardId) {
            router.push(`/c/${cardId}`);
          } else {
            router.push("/me");
          }
        }}
      />
    </Shell>
  );
}

export default function SetupPage() {
  return (
    <Suspense
      fallback={
        <Shell title="Setup profilo" subtitle="Caricamento...">
          <div className="flex flex-1 items-center justify-center">
            <div className="h-8 w-8 animate-pulse rounded-full bg-white/20" />
          </div>
        </Shell>
      }
    >
      <SetupContent />
    </Suspense>
  );
}
