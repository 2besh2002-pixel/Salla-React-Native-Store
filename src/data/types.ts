/**
 * Shared types for the store app (mock data layer).
 */

export interface Category {
  /** Stable identifier used in mock data and navigation params. */
  id: string;
  /** Human readable category name in Arabic. */
  name: string;
  /** URL friendly slug, also used as the navigation param for the product list. */
  slug: string;
}

export interface Product {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  /** Current price in SAR (Saudi Riyal). */
  price: number;
  /** Optional original price, shown as a discounted price. */
  oldPrice?: number;
  /** Main product image (remote mock URL). */
  image: string;
  rating: number;
  reviewsCount: number;
  stock: number;
  featured?: boolean;
}
