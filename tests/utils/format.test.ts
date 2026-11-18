import { CURRENCY_LABEL, formatPrice, formatRating } from '@/utils/format';

describe('formatPrice', () => {
  it('includes the arabic currency label', () => {
    expect(formatPrice(150)).toContain(CURRENCY_LABEL);
  });

  it('returns a non-empty string for any numeric price', () => {
    expect(typeof formatPrice(0)).toBe('string');
    expect(formatPrice(0).length).toBeGreaterThan(0);
    expect(typeof formatPrice(99999)).toBe('string');
  });
});

describe('formatRating', () => {
  it('formats the rating with the maximum value', () => {
    expect(formatRating(4.8)).toBe('4.8 من 5');
  });
});
