import { FirebaseError } from "firebase/app";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  type Auth,
  type UserCredential,
} from "firebase/auth";
import { saveAuthRedirect } from "@/lib/auth-redirect-storage";
import { resetGoogleRedirectState } from "@/lib/auth-bootstrap";

const OAUTH_STARTED_KEY = "spottly_oauth_started";

function isLocalDev(): boolean {
  if (typeof window === "undefined") return false;
  const host = window.location.hostname;
  return host === "localhost" || host === "127.0.0.1";
}

function shouldUseRedirect(err: unknown): boolean {
  if (!(err instanceof FirebaseError)) return false;
  return (
    err.code === "auth/popup-blocked" ||
    err.code === "auth/popup-closed-by-user" ||
    err.code === "auth/cancelled-popup-request"
  );
}

/**
 * Login Google. Su produzione usa il popup (Safari/Chrome bloccano redirect cross-domain).
 * Ritorna le credenziali se il popup ha finito; null se è partito un redirect full-page.
 */
export async function signInWithGoogle(
  auth: Auth,
): Promise<UserCredential | null> {
  const provider = new GoogleAuthProvider();
  const redirect =
    new URLSearchParams(window.location.search).get("redirect") || "/me";
  saveAuthRedirect(redirect);

  if (isLocalDev()) {
    markOAuthStarted();
    resetGoogleRedirectState();
    await signInWithRedirect(auth, provider);
    return null;
  }

  try {
    return await signInWithPopup(auth, provider);
  } catch (err) {
    if (!shouldUseRedirect(err)) throw err;
    markOAuthStarted();
    resetGoogleRedirectState();
    await signInWithRedirect(auth, provider);
    return null;
  }
}

export function markOAuthStarted(): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(OAUTH_STARTED_KEY, "1");
}

export function consumeOAuthStarted(): boolean {
  if (typeof window === "undefined") return false;
  const v = sessionStorage.getItem(OAUTH_STARTED_KEY);
  sessionStorage.removeItem(OAUTH_STARTED_KEY);
  return v === "1";
}
