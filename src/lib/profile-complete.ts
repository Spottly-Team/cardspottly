import type { UserProfile } from "@/lib/types";

export function hasCompleteProfile(profile: UserProfile | null | undefined): boolean {
  if (!profile) return false;
  return Boolean(profile.fullName?.trim() && profile.spottlyUsername?.trim());
}
