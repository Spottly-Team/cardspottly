import {
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  type Auth,
} from "firebase/auth";

function prefersRedirect(): boolean {
  if (typeof window === "undefined") return false;
  const ua = navigator.userAgent;
  if (/iPhone|iPad|iPod|Android/i.test(ua)) return true;
  // iPadOS con UA "Macintosh"
  if (navigator.maxTouchPoints > 1 && /Macintosh/i.test(ua)) return true;
  return false;
}

export async function signInWithGoogle(auth: Auth): Promise<void> {
  const provider = new GoogleAuthProvider();
  if (prefersRedirect()) {
    await signInWithRedirect(auth, provider);
    return;
  }
  await signInWithPopup(auth, provider);
}

export async function signInWithApple(auth: Auth): Promise<void> {
  const provider = new OAuthProvider("apple.com");
  provider.addScope("email");
  // "name" su web può causare errori con alcune config Apple/Firebase
  if (prefersRedirect()) {
    await signInWithRedirect(auth, provider);
    return;
  }
  await signInWithPopup(auth, provider);
}
