import type { Category } from './types';

/**
 * Mock categories of the store.
 * Kept in a single source of truth: every product references a category id.
 */
export const CATEGORIES: Category[] = [
  { id: 'electronics', name: 'الإلكترونيات', slug: 'electronics' },
  { id: 'fashion', name: 'الموضة', slug: 'fashion' },
  { id: 'home', name: 'المنزل', slug: 'home' },
  { id: 'beauty', name: 'الجمال', slug: 'beauty' },
  { id: 'sports', name: 'الرياضة', slug: 'sports' },
  { id: 'books', name: 'الكتب', slug: 'books' },
];
