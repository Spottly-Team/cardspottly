import {
  browserLocalPersistence,
  getRedirectResult,
  setPersistence,
  type Auth,
  type UserCredential,
} from "firebase/auth";

let redirectResultPromise: Promise<UserCredential | null> | null = null;

export function resetGoogleRedirectState(): void {
  redirectResultPromise = null;
}

export async function ensureAuthPersistence(auth: Auth): Promise<void> {
  try {
    await setPersistence(auth, browserLocalPersistence);
  } catch {
    /* browser non supportato */
  }
}

/** Completa OAuth redirect — va chiamato prima di setPersistence. */
export function completeGoogleRedirect(
  auth: Auth,
): Promise<UserCredential | null> {
  if (!redirectResultPromise) {
    redirectResultPromise = getRedirectResult(auth);
  }
  return redirectResultPromise;
}
