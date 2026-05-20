"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { Shell } from "@/components/ui/Shell";
import { PublicProfile } from "@/components/PublicProfile";
import { getFirebaseDb } from "@/lib/firebase";
import { getUserProfile } from "@/lib/firestore";
import { normalizeUsername } from "@/lib/username";
import type { UserProfile } from "@/lib/types";

export default function PublicUsernamePage() {
  const params = useParams();
  const username = normalizeUsername(
    typeof params.username === "string" ? params.username : "",
  );
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!username) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    async function load() {
      setLoading(true);
      const db = getFirebaseDb();
      const usernameSnap = await getDoc(doc(db, "usernames", username));
      if (!usernameSnap.exists()) {
        setNotFound(true);
        setLoading(false);
        return;
      }
      const uid = usernameSnap.data()?.uid as string;
      const userProfile = await getUserProfile(uid);
      if (!userProfile) {
        setNotFound(true);
      } else {
        setProfile(userProfile);
      }
      setLoading(false);
    }

    load();
  }, [username]);

  if (loading) {
    return (
      <Shell title="Profilo" subtitle="Caricamento...">
        <div className="flex flex-1 items-center justify-center">
          <div className="h-8 w-8 animate-pulse rounded-full bg-white/20" />
        </div>
      </Shell>
    );
  }

  if (notFound || !profile) {
    return (
      <Shell title="Profilo non trovato" subtitle="Questo username non esiste.">
        <p className="text-sm text-neutral-400">@{username}</p>
      </Shell>
    );
  }

  return (
    <Shell publicView>
      <PublicProfile profile={profile} />
    </Shell>
  );
}
