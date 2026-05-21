import { getUserProfile } from "@/lib/firestore";
import { isValidCardId, normalizeCardId } from "@/lib/card-id";

/** Dove mandare l'utente dopo Google/Apple, in base a profilo e flusso card. */
export async function resolvePostAuthPath(
  uid: string,
  redirectParam: string | null,
): Promise<string> {
  const raw = (redirectParam ?? "").trim();

  const claimMatch = raw.match(/^\/claim\/([A-Za-z0-9]{12,16})/i);
  if (claimMatch) {
    const cardId = normalizeCardId(claimMatch[1]);
    if (isValidCardId(cardId)) return `/claim/${cardId}`;
  }

  const cardIdFromQuery = raw.match(/[?&]cardId=([A-Za-z0-9]{12,16})/i)?.[1];
  const cardId = cardIdFromQuery ? normalizeCardId(cardIdFromQuery) : null;

  const profile = await getUserProfile(uid);

  if (!profile) {
    if (cardId && isValidCardId(cardId)) {
      return `/setup?cardId=${cardId}`;
    }
    return "/setup";
  }

  if (!raw || raw === "/setup" || raw.startsWith("/setup?")) {
    return "/me";
  }

  if (raw === "/me") {
    return "/me";
  }

  return raw;
}
