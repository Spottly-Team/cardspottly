import {
  browserLocalPersistence,
  getRedirectResult,
  setPersistence,
  type Auth,
  type UserCredential,
} from "firebase/auth";

/** Una sola getRedirectResult per caricamento pagina (React Strict Mode la chiama due volte). */
let redirectResultPromise: Promise<UserCredential | null> | null = null;

export async function ensureAuthPersistence(auth: Auth): Promise<void> {
  try {
    await setPersistence(auth, browserLocalPersistence);
  } catch {
    /* browser non supportato */
  }
}

export function completeGoogleRedirect(auth: Auth): Promise<UserCredential | null> {
  if (!redirectResultPromise) {
    redirectResultPromise = getRedirectResult(auth);
  }
  return redirectResultPromise;
}
