import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  runTransaction,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  type Firestore,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import type { CardDoc, ProfileFormData, UserProfile } from "./types";
import { getFirebaseDb, getFirebaseStorage } from "./firebase";
import { normalizeUsername } from "./username";
import { convertImageToWebp } from "./image-webp";

/** Firestore rifiuta i campi con valore `undefined` */
function stripUndefined<T extends Record<string, unknown>>(obj: T): T {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined),
  ) as T;
}

export async function getCard(cardId: string): Promise<CardDoc | null> {
  const snap = await getDoc(doc(getFirebaseDb(), "cards", cardId));
  if (!snap.exists()) return null;
  return snap.data() as CardDoc;
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(getFirebaseDb(), "users", uid));
  if (!snap.exists()) return null;
  return snap.data() as UserProfile;
}

export async function getCardsByOwner(uid: string): Promise<string[]> {
  const q = query(
    collection(getFirebaseDb(), "cards"),
    where("claimedBy", "==", uid),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.id);
}

export async function claimCard(cardId: string, uid: string): Promise<void> {
  const cardRef = doc(getFirebaseDb(), "cards", cardId);
  const snap = await getDoc(cardRef);

  if (!snap.exists()) {
    throw new Error("Questa card non esiste.");
  }

  const data = snap.data() as CardDoc;
  if (data.claimedBy) {
    throw new Error("Questa card è già stata configurata.");
  }

  await updateDoc(cardRef, {
    claimedBy: uid,
    claimedAt: serverTimestamp(),
  });
}

export async function saveUserProfile(
  uid: string,
  form: ProfileFormData,
  avatarFile?: File | null,
): Promise<void> {
  const db = getFirebaseDb();
  const spottlyUsername = normalizeUsername(form.spottlyUsername);
  const birthYear = parseInt(form.birthYear, 10);

  if (!form.fullName.trim()) throw new Error("Inserisci nome e cognome.");
  if (!Number.isFinite(birthYear) || birthYear < 1900 || birthYear > new Date().getFullYear()) {
    throw new Error("Inserisci un anno di nascita valido.");
  }

  let avatarUrl: string | undefined;
  if (avatarFile) {
    const webpFile = await convertImageToWebp(avatarFile);
    const storage = getFirebaseStorage();
    const storageRef = ref(storage, `avatars/${uid}/profile.webp`);
    await uploadBytes(storageRef, webpFile, {
      contentType: "image/webp",
    });
    avatarUrl = await getDownloadURL(storageRef);
  }

  const profile = stripUndefined({
    fullName: form.fullName.trim(),
    birthYear,
    spottlyUsername,
    ...(form.instagramUsername.trim()
      ? { instagramUsername: normalizeUsername(form.instagramUsername) }
      : {}),
    ...(form.tiktokUsername.trim()
      ? { tiktokUsername: normalizeUsername(form.tiktokUsername) }
      : {}),
    ...(avatarUrl ? { avatarUrl } : {}),
    updatedAt: serverTimestamp(),
  }) as UserProfile & { updatedAt: ReturnType<typeof serverTimestamp> };

  await runTransaction(db, async (tx) => {
    const userRef = doc(db, "users", uid);
    const usernameRef = doc(db, "usernames", spottlyUsername);
    const existingUser = await tx.get(userRef);
    const existingUsername = await tx.get(usernameRef);

    if (existingUsername.exists()) {
      const owner = existingUsername.data()?.uid as string;
      if (owner !== uid) {
        throw new Error("Questo username Spottly è già in uso.");
      }
    } else {
      tx.set(usernameRef, { uid });
    }

    const prevUsername = existingUser.exists()
      ? (existingUser.data() as UserProfile).spottlyUsername
      : null;

    if (prevUsername && prevUsername !== spottlyUsername) {
      tx.delete(doc(db, "usernames", prevUsername));
    }

    const existing = existingUser.exists()
      ? (existingUser.data() as UserProfile)
      : null;

    const merged = stripUndefined({
      ...existing,
      ...profile,
      ...(avatarUrl
        ? { avatarUrl }
        : existing?.avatarUrl
          ? { avatarUrl: existing.avatarUrl }
          : {}),
    });

    tx.set(userRef, merged, { merge: true });
  });
}

export function profileToForm(profile: UserProfile | null): ProfileFormData {
  return {
    fullName: profile?.fullName ?? "",
    birthYear: profile?.birthYear?.toString() ?? "",
    instagramUsername: profile?.instagramUsername ?? "",
    tiktokUsername: profile?.tiktokUsername ?? "",
    spottlyUsername: profile?.spottlyUsername ?? "",
  };
}
