import { getCard } from "@/lib/firestore";
import { isValidCardId, normalizeCardId } from "@/lib/card-id";
import { isRegisteredUser } from "@/lib/profile-complete";

function parseCardIdFromRedirect(raw: string): string | null {
  const claimMatch = raw.match(/^\/claim\/([A-Za-z0-9]{12,16})/i);
  if (claimMatch) {
    const id = normalizeCardId(claimMatch[1]);
    if (isValidCardId(id)) return id;
  }

  const cardMatch = raw.match(/^\/c\/([A-Za-z0-9]{12,16})/i);
  if (cardMatch) {
    const id = normalizeCardId(cardMatch[1]);
    if (isValidCardId(id)) return id;
  }

  const fromQuery = raw.match(/[?&]cardId=([A-Za-z0-9]{12,16})/i)?.[1];
  if (fromQuery) {
    const id = normalizeCardId(fromQuery);
    if (isValidCardId(id)) return id;
  }

  return null;
}

/** Dove mandare l'utente dopo l'accesso Google, in base a profilo e flusso card. */
export async function resolvePostAuthPath(
  uid: string,
  redirectParam: string | null,
): Promise<string> {
  const raw = (redirectParam ?? "").trim();

  if (raw === "/me" || raw.startsWith("/me?")) {
    return "/me";
  }

  const cardId = parseCardIdFromRedirect(raw);
  const registered = await isRegisteredUser(uid);

  if (registered) {
    if (cardId) {
      const card = await getCard(cardId);
      if (card?.claimedBy === uid) return `/c/${cardId}`;
    }
    return "/me";
  }

  if (cardId) {
    const card = await getCard(cardId);
    if (card?.claimedBy === uid) {
      return `/setup?cardId=${cardId}`;
    }
    if (!card?.claimedBy) {
      return `/claim/${cardId}`;
    }
  }

  if (raw === "/setup" || raw.startsWith("/setup?")) {
    return cardId ? `/setup?cardId=${cardId}` : "/setup";
  }

  return cardId ? `/setup?cardId=${cardId}` : "/setup";
}
