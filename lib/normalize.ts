export function normalizeBabyName(input: string): string {
  return input.trim().toLowerCase().replace(/\s+/g, " ");
}

export function normalizeGuestName(input: string): string {
  return input.trim().replace(/\s+/g, " ");
}
