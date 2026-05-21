import { FirebaseError } from "firebase/app";

const MESSAGES: Record<string, string> = {
  "auth/operation-not-allowed":
    "Accesso non attivo su Firebase. Vai su Console → Authentication → Sign-in method e abilita Google o Apple, poi salva.",
  "auth/popup-closed-by-user": "Accesso annullato.",
  "auth/popup-blocked-by-browser":
    "Il browser ha bloccato il popup. Consenti i popup per questo sito e riprova.",
  "auth/unauthorized-domain":
    "Dominio non autorizzato. In Firebase aggiungi questo sito in Authentication → Settings → Authorized domains.",
  "auth/invalid-credential":
    "Configurazione Apple/Google non valida. Controlla Service ID, chiave .p8 e Return URL in Firebase e Apple Developer.",
};

export function getAuthErrorMessage(err: unknown): string {
  if (err instanceof FirebaseError && MESSAGES[err.code]) {
    return MESSAGES[err.code];
  }
  if (err instanceof Error) return err.message;
  return "Accesso non riuscito. Riprova.";
}
