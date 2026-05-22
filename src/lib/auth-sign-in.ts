import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  type Auth,
} from "firebase/auth";
import { saveAuthRedirect } from "@/lib/auth-redirect-storage";

function prefersRedirect(): boolean {
  if (typeof window === "undefined") return false;
  const ua = navigator.userAgent;
  if (/iPhone|iPad|iPod|Android/i.test(ua)) return true;
  if (navigator.maxTouchPoints > 1 && /Macintosh/i.test(ua)) return true;
  if (/FBAN|FBAV|Instagram|Line\//i.test(ua)) return true;
  return false;
}

export async function signInWithGoogle(auth: Auth): Promise<void> {
  const provider = new GoogleAuthProvider();
  const redirect = new URLSearchParams(window.location.search).get("redirect");
  if (redirect) {
    saveAuthRedirect(redirect);
  }
  if (prefersRedirect()) {
    await signInWithRedirect(auth, provider);
    return;
  }
  await signInWithPopup(auth, provider);
}
