/**
 * Genera cardId alfanumerici, crea cards.csv e importa in Firestore.
 *
 * Uso:
 *   GOOGLE_APPLICATION_CREDENTIALS=./service-account.json npm run provision
 *   GOOGLE_APPLICATION_CREDENTIALS=./service-account.json npm run provision -- --count 100
 *   GOOGLE_APPLICATION_CREDENTIALS=./service-account.json npm run provision -- --dry-run
 */

import { randomBytes } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

const CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const DEFAULT_COUNT = 100;
const CARD_ID_LENGTH = 12;

function parseArgs() {
  const args = process.argv.slice(2);
  let count = DEFAULT_COUNT;
  let dryRun = false;
  let baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://appspottly.com";

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--count" && args[i + 1]) {
      count = parseInt(args[i + 1]!, 10);
      i++;
    } else if (args[i] === "--dry-run") {
      dryRun = true;
    } else if (args[i] === "--base-url" && args[i + 1]) {
      baseUrl = args[i + 1]!.replace(/\/$/, "");
      i++;
    }
  }

  return { count, dryRun, baseUrl };
}

function generateCardId(length: number): string {
  const bytes = randomBytes(length);
  let result = "";
  for (let i = 0; i < length; i++) {
    result += CHARSET[bytes[i]! % CHARSET.length];
  }
  return result;
}

function generateUniqueIds(count: number): string[] {
  const ids = new Set<string>();
  while (ids.size < count) {
    ids.add(generateCardId(CARD_ID_LENGTH));
  }
  return [...ids];
}

async function main() {
  const { count, dryRun, baseUrl } = parseArgs();
  const cardIds = generateUniqueIds(count);

  const rows = ["cardId,url", ...cardIds.map((id) => `${id},${baseUrl}/c/${id}`)];
  const csvPath = resolve(process.cwd(), "cards.csv");
  writeFileSync(csvPath, rows.join("\n") + "\n", "utf8");

  console.log(`Generati ${count} cardId → ${csvPath}`);

  if (dryRun) {
    console.log("Dry-run: nessun import su Firestore.");
    return;
  }

  const credPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (!credPath) {
    console.error(
      "\n❌ Manca GOOGLE_APPLICATION_CREDENTIALS.\n\n" +
        "1. Firebase Console → Impostazioni progetto → Account di servizio\n" +
        "2. Clicca «Genera nuova chiave privata» → scarica il JSON\n" +
        "3. Rinominalo e mettilo nella cartella del progetto:\n" +
        "   cp ~/Downloads/card-spottly-*.json ./service-account.json\n" +
        "4. Poi:\n" +
        "   export GOOGLE_APPLICATION_CREDENTIALS=./service-account.json\n" +
        "   npm run provision\n",
    );
    process.exit(1);
  }

  const credFullPath = resolve(process.cwd(), credPath);

  let serviceAccount: object;
  try {
    serviceAccount = JSON.parse(readFileSync(credFullPath, "utf8"));
  } catch (err) {
    const code = (err as NodeJS.ErrnoException).code;
    if (code === "ENOENT") {
      console.error(
        `\n❌ File non trovato: ${credFullPath}\n\n` +
          "Scarica la chiave da Firebase Console:\n" +
          "  Impostazioni progetto → Account di servizio → Genera nuova chiave privata\n\n" +
          "Poi salvala come:\n" +
          "  ./service-account.json\n\n" +
          "Il CSV è già stato creato. Dopo aver messo il file, rilancia:\n" +
          "  npm run provision\n",
      );
      process.exit(1);
    }
    throw err;
  }

  if (!getApps().length) {
    initializeApp({ credential: cert(serviceAccount) });
  }

  const db = getFirestore();
  const batchSize = 400;
  let imported = 0;

  for (let i = 0; i < cardIds.length; i += batchSize) {
    const chunk = cardIds.slice(i, i + batchSize);
    const batch = db.batch();

    for (const cardId of chunk) {
      const ref = db.collection("cards").doc(cardId);
      batch.set(ref, {
        createdAt: FieldValue.serverTimestamp(),
        claimedBy: null,
        claimedAt: null,
      });
    }

    await batch.commit();
    imported += chunk.length;
    console.log(`Importati ${imported}/${count}...`);
  }

  console.log("Fatto. Scrivi gli URL sui tag NFC.");
}

main().catch((err) => {
  const code = (err as { code?: number }).code;
  if (code === 5) {
    console.error(
      "\n❌ Firestore non trovato nel progetto Firebase.\n\n" +
        "Crea il database:\n" +
        "  Firebase Console → Firestore Database → Crea database\n" +
        "  (scegli una regione, es. europe-west)\n\n" +
        "Poi rilancia: npm run provision\n",
    );
    process.exit(1);
  }
  console.error(err);
  process.exit(1);
});
