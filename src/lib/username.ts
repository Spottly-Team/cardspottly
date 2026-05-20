const USERNAME_REGEX = /^[a-z0-9_]{3,20}$/;

export function normalizeUsername(value: string): string {
  return value.trim().toLowerCase().replace(/^@/, "");
}

export function isValidSpottlyUsername(value: string): boolean {
  return USERNAME_REGEX.test(normalizeUsername(value));
}
