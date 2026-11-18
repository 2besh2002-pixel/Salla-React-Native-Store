import { CATEGORIES, PRODUCTS, getFeaturedProducts, getProductById, getProductsByCategory } from '@/data';

describe('mock product catalog', () => {
  it('contains a non-empty catalog', () => {
    expect(PRODUCTS.length).toBeGreaterThan(0);
  });

  it('has at least one product for every category', () => {
    CATEGORIES.forEach((category) => {
      expect(getProductsByCategory(category.slug).length).toBeGreaterThan(0);
    });
  });

  it('filters products by category slug', () => {
    const electronics = getProductsByCategory('electronics');
    expect(electronics.length).toBeGreaterThan(0);
    expect(electronics.every((product) => product.categoryId === 'electronics')).toBe(true);
  });

  it('returns undefined for an unknown product id', () => {
    expect(getProductById('does-not-exist')).toBeUndefined();
  });

  it('returns featured products', () => {
    expect(getFeaturedProducts().length).toBeGreaterThan(0);
  });
});
