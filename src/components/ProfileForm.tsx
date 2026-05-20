"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import type { ProfileFormData } from "@/lib/types";
import { isValidSpottlyUsername } from "@/lib/username";

type Props = {
  initial: ProfileFormData;
  existingAvatarUrl?: string;
  submitLabel?: string;
  onSubmit: (data: ProfileFormData, avatarFile: File | null) => Promise<void>;
};

export function ProfileForm({
  initial,
  existingAvatarUrl,
  submitLabel = "Salva",
  onSubmit,
}: Props) {
  const [form, setForm] = useState(initial);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const avatarSrc = preview ?? existingAvatarUrl ?? null;

  function update<K extends keyof ProfileFormData>(
    key: K,
    value: ProfileFormData[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!isValidSpottlyUsername(form.spottlyUsername)) {
      setError(
        "Username Spottly: 3-20 caratteri, solo lettere minuscole, numeri e _",
      );
      return;
    }

    setLoading(true);
    try {
      await onSubmit(form, avatarFile);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore imprevisto.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 pb-4">
      <div className="flex flex-col items-center gap-4">
        <div className="relative h-28 w-28 overflow-hidden rounded-full border-2 border-white bg-white/10">
          {avatarSrc ? (
            <Image
              src={avatarSrc}
              alt="Foto profilo"
              fill
              className="object-cover"
              unoptimized={avatarSrc.startsWith("blob:")}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs font-semibold uppercase tracking-widest text-neutral-500">
              Foto
            </div>
          )}
        </div>
        <label className="cursor-pointer text-xs font-semibold uppercase tracking-widest text-white underline decoration-white/40 underline-offset-4">
          Carica foto profilo
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              setError(null);
              setAvatarFile(file);
              if (preview) URL.revokeObjectURL(preview);
              setPreview(URL.createObjectURL(file));
              e.target.value = "";
            }}
          />
        </label>
      </div>

      <Input
        label="Nome e cognome"
        value={form.fullName}
        onChange={(e) => update("fullName", e.target.value)}
        placeholder="Mario Rossi"
        required
      />

      <Input
        label="Anno di nascita"
        type="number"
        inputMode="numeric"
        min={1900}
        max={new Date().getFullYear()}
        value={form.birthYear}
        onChange={(e) => update("birthYear", e.target.value)}
        placeholder="1998"
        required
      />

      <Input
        label="Username Spottly"
        value={form.spottlyUsername}
        onChange={(e) => update("spottlyUsername", e.target.value)}
        placeholder="mario_rossi"
        hint="Il tuo @ su Spottly (unico)"
        required
      />

      <Input
        label="Instagram"
        value={form.instagramUsername}
        onChange={(e) => update("instagramUsername", e.target.value)}
        placeholder="username"
        hint="Solo username, senza @"
      />

      <Input
        label="TikTok"
        value={form.tiktokUsername}
        onChange={(e) => update("tiktokUsername", e.target.value)}
        placeholder="username"
        hint="Solo username, senza @"
      />

      {error ? (
        <p className="rounded-xl border border-white/30 bg-white/5 px-4 py-3 text-sm text-white">
          {error}
        </p>
      ) : null}

      <Button type="submit" fullWidth disabled={loading}>
        {submitLabel}
      </Button>
    </form>
  );
}
