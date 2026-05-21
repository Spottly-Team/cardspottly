import { FirebaseError } from "firebase/app";

const MESSAGES: Record<string, string> = {
  "auth/operation-not-allowed":
    "Accesso Google non attivo su Firebase. Vai su Console → Authentication → Sign-in method e abilita Google, poi salva.",
  "auth/popup-closed-by-user": "Accesso annullato.",
  "auth/popup-blocked-by-browser":
    "Il browser ha bloccato il popup. Consenti i popup per questo sito e riprova.",
  "auth/unauthorized-domain":
    "Dominio non autorizzato. In Firebase aggiungi questo sito in Authentication → Settings → Authorized domains.",
  "auth/invalid-credential":
    "Configurazione Google non valida. Controlla le credenziali OAuth in Firebase e Google Cloud.",
  "auth/account-exists-with-different-credential":
    "Esiste già un account con questa email. Prova ad accedere con lo stesso metodo usato in precedenza.",
  "auth/credential-already-in-use":
    "Questo account è già collegato. Prova ad accedere.",
  "auth/internal-error": "Errore server. Riprova tra poco.",
  "auth/web-storage-unsupported":
    "Il browser blocca l'accesso. Disattiva la modalità privata estrema o prova Safari/Chrome.",
};

export function getAuthErrorCode(err: unknown): string | null {
  if (err instanceof FirebaseError) return err.code;
  return null;
}

export function getAuthErrorMessage(err: unknown): string {
  if (err instanceof FirebaseError && MESSAGES[err.code]) {
    return MESSAGES[err.code];
  }
  if (err instanceof Error) {
    const msg = err.message;
    if (/network|fetch/i.test(msg)) {
      return "Connessione assente. Controlla la rete e riprova.";
    }
    return msg;
  }
  return "Accesso non riuscito. Riprova.";
}
