export function getPriceLabel(priceLevel: number | null): string | null {
  if (priceLevel === null) return null;
  const labels: Record<number, string> = {
    0: 'Free',
    1: '$',
    2: '$$',
    3: '$$$',
    4: '$$$$',
  };
  return labels[priceLevel] ?? null;
}
