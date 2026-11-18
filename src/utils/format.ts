/**
 * Price & number formatting helpers for the Arabic (RTL) UI.
 */

/** Default currency label used across the app (Saudi Riyal). */
export const CURRENCY_LABEL = 'ر.س';

/**
 * Formats a numeric price into a localized Arabic string,
 * e.g. `299` -> `"٣٩٩ ر.س"`.
 */
export function formatPrice(price: number): string {
  const arabicDigits = price.toLocaleString('ar-SA');
  return `${arabicDigits} ${CURRENCY_LABEL}`.trim();
}

/**
 * Formats a rating such as `4.8` into an Arabic text like `"4.8 من 5"`.
 */
export function formatRating(rating: number): string {
  const rounded = Math.round(rating * 10) / 10;
  const max = 5;
  return `${rounded} من ${max}`;
}
