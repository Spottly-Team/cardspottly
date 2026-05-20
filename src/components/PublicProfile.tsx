import type { ReactNode } from "react";
import Image from "next/image";
import type { UserProfile } from "@/lib/types";
import { InstagramIcon, TikTokIcon, SpottlyIcon } from "@/components/icons/SocialIcons";

function SocialRow({
  label,
  username,
  href,
  icon,
}: {
  label: string;
  username: string;
  href: string;
  icon: ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex min-h-[4rem] items-center gap-4 rounded-2xl border border-white/15 bg-white/5 px-4 py-3 transition active:scale-[0.99] active:border-white/30 active:bg-white/10"
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10 text-white">
        {icon}
      </span>
      <span className="min-w-0 flex-1 text-left">
        <span className="block text-xs font-semibold uppercase tracking-widest text-neutral-500">
          {label}
        </span>
        <span className="block truncate text-base font-semibold text-white">
          @{username}
        </span>
      </span>
      <span className="text-neutral-500 transition group-active:text-white">
        →
      </span>
    </a>
  );
}

export function PublicProfile({ profile }: { profile: UserProfile }) {
  const initial = profile.fullName.charAt(0).toUpperCase();

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex flex-col">
      {/* Hero */}
      <div className="flex flex-col items-center pb-8 pt-2 text-center">
        <div className="relative mb-5 h-[7.5rem] w-[7.5rem]">
          <div className="absolute inset-0 rounded-full bg-white/10 blur-md" />
          <div className="relative h-full w-full overflow-hidden rounded-full border-2 border-white ring-4 ring-white/10">
            {profile.avatarUrl ? (
              <Image
                src={profile.avatarUrl}
                alt={profile.fullName}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-white text-4xl font-black text-black">
                {initial}
              </div>
            )}
          </div>
        </div>

        <h2 className="text-2xl font-black tracking-tight text-white">
          {profile.fullName}
        </h2>
        <p className="mt-1.5 text-sm font-medium text-neutral-400">
          @{profile.spottlyUsername}
        </p>
        <p className="mt-1 text-xs text-neutral-500">
          Nato nel {profile.birthYear}
        </p>
      </div>

      {/* Link social */}
      <div className="flex flex-col gap-3">
        <SocialRow
          label="Spottly"
          username={profile.spottlyUsername}
          href={`https://appspottly.com/u/${profile.spottlyUsername}`}
          icon={<SpottlyIcon className="h-9 w-9" />}
        />
        {profile.instagramUsername ? (
          <SocialRow
            label="Instagram"
            username={profile.instagramUsername}
            href={`https://instagram.com/${profile.instagramUsername}`}
            icon={<InstagramIcon className="h-5 w-5" />}
          />
        ) : null}
        {profile.tiktokUsername ? (
          <SocialRow
            label="TikTok"
            username={profile.tiktokUsername}
            href={`https://tiktok.com/@${profile.tiktokUsername}`}
            icon={<TikTokIcon className="h-5 w-5" />}
          />
        ) : null}
      </div>
      </div>

      {/* Partner — in basso */}
      <div className="mt-auto flex flex-col gap-3 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-8">
        <p className="text-center text-xs leading-relaxed text-neutral-500">
          Con questa tessera puoi accedere a sconti nei locali partner Spottly.
        </p>
        <a
          href="https://appspottly.com/partner"
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-14 w-full items-center justify-center rounded-full bg-white px-6 text-sm font-semibold tracking-wide text-black transition active:scale-[0.98]"
        >
          Vedi i partner
        </a>
      </div>
    </div>
  );
}
