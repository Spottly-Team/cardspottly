# Spottly Card

Web app per configurare tessere NFC Spottly: ogni card ha un URL univoco (`/c/<cardId>`).

## Flusso utente

1. Scansiona la card → pagina istruzioni
2. Login con **Google** o **Apple**
3. Associa la card al proprio account
4. Compila profilo (Instagram, TikTok, username Spottly, nome, anno nascita, foto)
5. Scan successivi → mostra il profilo pubblico
6. Modifica → area personale `/me` (solo il proprietario)

## Setup Firebase

1. Crea un progetto su [Firebase Console](https://console.firebase.google.com)
2. Abilita **Authentication** → Google e Apple
3. Crea app **Web** e copia le credenziali in `.env.local` (da `.env.example`)
4. Abilita **Firestore** e **Storage**
5. Deploy regole (devi essere loggato con l’account **proprietario** del progetto):
   ```bash
   npx firebase login
   npm run firebase:deploy-rules
   ```
   Se il CLI dà errore 403, incolla le regole manualmente in Console:
   - **Firestore** → Regole → copia `firebase/firestore.rules` → Pubblica
   - **Storage** → Regole → copia `firebase/storage.rules` → Pubblica

### Pagine legali

- `/privacypolicy` e `/termini-condizioni` — testo ufficiale Spottly (da `public/legal/` e `src/content/`)
- Link in footer pagina `/auth`

### Apple Sign-In (web)

- Apple Developer → Identifiers → Service ID
- Configura domini e redirect URL Firebase
- Aggiungi provider Apple in Firebase Auth

## Avvio locale

```bash
npm install
cp .env.example .env.local
# compila .env.local con le credenziali Firebase
npm run dev
```

Apri [http://localhost:3000](http://localhost:3000)

## Deploy su Netlify

1. Collega il repo [Spottly-Team/cardspottly](https://github.com/Spottly-Team/cardspottly)
2. **Build command:** `npm run build` (già in `netlify.toml`)
3. **Publish directory:** imposta **`.next`** oppure lascia vuoto — **mai** `/` o la root del repo (altrimenti errore plugin Next.js)
4. Netlify userà automaticamente `@netlify/plugin-nextjs` (incluso nel repo)
5. In **Site settings → Environment variables** aggiungi tutte le variabili da `.env.example`:
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`
   - `NEXT_PUBLIC_APP_URL` = `https://card.appspottly.com`
6. **Firebase Auth** → Authorized domains → aggiungi `card.appspottly.com` (e `cardspottly.netlify.app` finché usi Netlify)
7. **Google Cloud** → OAuth → Authorized JavaScript origins → `https://card.appspottly.com`
8. **Netlify** → Domain management → aggiungi `card.appspottly.com` (DNS CNAME verso Netlify)
8. Rideploy dopo aver salvato le variabili

> Se vedi “Page not found” di Netlify: quasi sempre **Publish directory** sbagliata (`public` invece del plugin Next.js).

## Test da telefono (stessa Wi‑Fi)

Il dev server è già in ascolto sulla rete locale (`npm run dev` → `-H 0.0.0.0`).

1. **Mac e telefono sulla stessa Wi‑Fi**
2. Sul telefono apri l’IP che vedi nel terminale, es.:
   ```
   http://192.168.1.120:3000/c/ACD45JODQC9H
   ```
   (sostituisci IP e `cardId` dal tuo `cards.csv`)

3. **Firebase Console** → Authentication → Settings → **Authorized domains**  
   Aggiungi: `192.168.1.120` (solo l’IP, senza porta)

4. **Google Cloud Console** → [Credentials](https://console.cloud.google.com/apis/credentials)  
   Apri il client OAuth “Web client” del progetto Firebase → **Authorized JavaScript origins**  
   Aggiungi: `http://192.168.1.120:3000`

5. Riavvia `npm run dev` se era già avviato

> **Nota:** se cambi IP (router diverso), ripeti i passi 3–4 con il nuovo IP.  
> **Apple Sign-In** su IP locale spesso non funziona (serve HTTPS + dominio): per provare usa **Google**.


Genera 100 `cardId` alfanumerici, CSV e import Firestore:

```bash
# Scarica service account JSON dalla console Firebase
# Project settings → Service accounts → Generate new private key
export GOOGLE_APPLICATION_CREDENTIALS=./service-account.json

npm run provision
# oppure solo CSV senza import:
npm run provision -- --dry-run

# personalizza quantità e dominio:
npm run provision -- --count 200 --base-url https://card.appspottly.com
```

Output: `cards.csv` con colonne `cardId,url`

Scrivi su ogni tag NFC l'URL corrispondente, es. `https://card.appspottly.com/c/A1B2C3D4E5F6`

## Struttura

- `src/app/c/[cardId]` — landing card (istruzioni / profilo)
- `src/app/auth` — login
- `src/app/claim/[cardId]` — associa card
- `src/app/setup` — wizard profilo
- `src/app/me` — dashboard proprietario
- `scripts/provision-cards.ts` — genera cardId + import DB
