import type { UserProfile } from "@/lib/types";
import { getCardsByOwner, getUserProfile } from "@/lib/firestore";

/** Profilo compilato almeno una volta (nome o username Spottly). */
export function hasCompleteProfile(
  profile: UserProfile | null | undefined,
): boolean {
  if (!profile) return false;
  return Boolean(
    profile.fullName?.trim() || profile.spottlyUsername?.trim(),
  );
}

/** Utente già registrato: profilo in Firestore e/o almeno una card associata. */
export async function isRegisteredUser(uid: string): Promise<boolean> {
  const profile = await getUserProfile(uid);
  if (hasCompleteProfile(profile)) return true;
  const cards = await getCardsByOwner(uid);
  return cards.length > 0;
}
