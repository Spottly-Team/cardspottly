export type CardDoc = {
  createdAt: unknown;
  claimedBy: string | null;
  claimedAt: unknown | null;
};

export type UserProfile = {
  fullName: string;
  birthYear: number;
  instagramUsername?: string;
  tiktokUsername?: string;
  spottlyUsername: string;
  avatarUrl?: string;
  updatedAt?: unknown;
};

export type ProfileFormData = {
  fullName: string;
  birthYear: string;
  instagramUsername: string;
  tiktokUsername: string;
  spottlyUsername: string;
};
