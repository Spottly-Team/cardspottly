import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  type Auth,
} from "firebase/auth";

function prefersRedirect(): boolean {
  if (typeof window === "undefined") return false;
  const ua = navigator.userAgent;
  if (/iPhone|iPad|iPod|Android/i.test(ua)) return true;
  if (navigator.maxTouchPoints > 1 && /Macintosh/i.test(ua)) return true;
  return false;
}

export async function signInWithGoogle(auth: Auth): Promise<void> {
  const provider = new GoogleAuthProvider();
  const redirect = new URLSearchParams(window.location.search).get("redirect");
  if (redirect) {
    sessionStorage.setItem("spottly_auth_redirect", redirect);
  }
  if (prefersRedirect()) {
    await signInWithRedirect(auth, provider);
    return;
  }
  await signInWithPopup(auth, provider);
}
