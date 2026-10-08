/**
 * Utility to format price in Sri Lankan Rupees.
 * Expected format: LKR 4,800
 */
export function formatLKR(amount: number | string | undefined | null): string {
  const num = typeof amount === 'number' ? amount : Number(amount) || 0;
  return `LKR ${Math.round(num).toLocaleString('en-US')}`;
}
