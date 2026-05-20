const CARD_ID_REGEX = /^[A-Z0-9]{12,16}$/;

export function isValidCardId(cardId: string): boolean {
  return CARD_ID_REGEX.test(cardId.toUpperCase());
}

export function normalizeCardId(cardId: string): string {
  return cardId.trim().toUpperCase();
}
