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
    "Configurazione Apple non valida. Controlla Services ID, Team ID, Key ID, chiave .p8 e Return URL in Firebase e Apple Developer.",
  "auth/invalid-oauth-client-id":
    "Services ID Apple errato in Firebase (deve essere com.appspottly.card.web).",
  "auth/account-exists-with-different-credential":
    "Esiste già un account con questa email. Prova l'altro metodo di accesso (Google o Apple).",
  "auth/credential-already-in-use":
    "Questo account è già collegato. Prova ad accedere invece di registrarti.",
  "auth/internal-error":
    "Errore server Firebase/Apple. Riprova tra poco o usa Google.",
  "auth/web-storage-unsupported":
    "Il browser blocca l'accesso. Disattiva la modalità privata estrema o prova Safari/Chrome.",
};

export function getAuthErrorMessage(err: unknown): string {
  if (err instanceof FirebaseError && MESSAGES[err.code]) {
    return MESSAGES[err.code];
  }
  if (err instanceof Error) {
    const msg = err.message;
    if (/registrazione non riuscita|registration.*failed/i.test(msg)) {
      return "Accesso Apple non riuscito. Verifica in Firebase che Apple sia abilitato con Services ID, Team ID, Key ID e chiave .p8, poi riprova su https://card.appspottly.com";
    }
    if (/network|fetch/i.test(msg)) {
      return "Connessione assente. Controlla la rete e riprova.";
    }
    return msg;
  }
  return "Accesso non riuscito. Riprova.";
}
