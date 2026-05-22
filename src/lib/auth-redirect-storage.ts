const KEY = "spottly_auth_redirect";

/** Salva dove tornare dopo OAuth (sopravvive al redirect Google su mobile). */
export function saveAuthRedirect(path: string): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(KEY, path);
  try {
    localStorage.setItem(KEY, path);
  } catch {
    /* modalità privata / storage pieno */
  }
}

export function peekAuthRedirect(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(KEY) ?? localStorage.getItem(KEY);
}

export function clearAuthRedirect(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(KEY);
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}

/** Legge e rimuove il redirect salvato (una sola volta per sessione). */
export function takeAuthRedirect(): string | null {
  const value = peekAuthRedirect();
  clearAuthRedirect();
  return value;
}
