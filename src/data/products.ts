import type { Category, Product } from './types';
import { CATEGORIES } from './categories';

const image = (seed: string) => `https://picsum.photos/seed/${seed}/600/600`;

/**
 * Mock product catalog.
 * NOTE: This is a static mock dataset (no backend / no API yet).
 */
export const PRODUCTS: Product[] = [
  {
    id: 'p-01',
    categoryId: 'electronics',
    name: 'سماعات لاسلكية',
    description:
      'سماعات بلوتوث محمولة بخاصية إلغاء الضوضاء وتحكم صوتي، مصممة للعمل لساعات طويلة.',
    price: 299,
    oldPrice: 399,
    rating: 4.7,
    reviewsCount: 128,
    stock: 25,
    featured: true,
    image: image('p-01'),
  },
  {
    id: 'p-02',
    categoryId: 'electronics',
    name: 'ساعة ذكية',
    description:
      'ساعة ذكية بقياس نبضات القلب ومعدل الأيض ومعلومات GPS، مقاومة للماء.',
    price: 899,
    oldPrice: 1099,
    rating: 4.8,
    reviewsCount: 342,
    stock: 12,
    featured: true,
    image: image('p-02'),
  },
  {
    id: 'p-03',
    categoryId: 'electronics',
    name: 'كاميرا رقمية',
    description: 'كاميرا رقمية بجودة ۴K وميزات تصوير متقدمة للهواة.',
    price: 1499,
    rating: 4.6,
    reviewsCount: 98,
    stock: 8,
    image: image('p-03'),
  },
  {
    id: 'p-04',
    categoryId: 'electronics',
    name: 'بطارية خارجية',
    description: 'بطارية 20000mAh شاملة مع دعم الشحن السريع.',
    price: 159,
    rating: 4.5,
    reviewsCount: 64,
    stock: 60,
    image: image('p-04'),
  },
  {
    id: 'p-05',
    categoryId: 'fashion',
    name: 'حقيبة ظهر عملية',
    description: 'حقيبة ظهر بجيب مدمج ومقاومة للماء بتصميم عصري.',
    price: 199,
    rating: 4.5,
    reviewsCount: 76,
    stock: 40,
    image: image('p-05'),
  },
  {
    id: 'p-06',
    categoryId: 'fashion',
    name: 'قميص قطن',
    description: 'قميص قطن 100% مناسب للجميع بتصميم مريح.',
    price: 149,
    rating: 4.4,
    reviewsCount: 203,
    stock: 60,
    featured: true,
    image: image('p-06'),
  },
  {
    id: 'p-07',
    categoryId: 'fashion',
    name: 'سترة قطنية',
    description: 'سترة قطنية سهلة الملاءمة تناسب جميع الأعمار.',
    price: 99,
    rating: 4.3,
    reviewsCount: 45,
    stock: 80,
    image: image('p-07'),
  },
  {
    id: 'p-08',
    categoryId: 'home',
    name: 'مصباح ذكي',
    description: 'مصباح ذكي بتحكم صوتي ودعم الإضاءة التلقائية.',
    price: 259,
    rating: 4.3,
    reviewsCount: 64,
    stock: 30,
    image: image('p-08'),
  },
  {
    id: 'p-09',
    categoryId: 'home',
    name: 'مكيف سبليت',
    description: 'مكيف سبليت بسعة تهوية عالية لتلبي احتياجات الغرف الكبيرة.',
    price: 899,
    rating: 4.5,
    reviewsCount: 41,
    stock: 15,
    image: image('p-09'),
  },
  {
    id: 'p-10',
    categoryId: 'beauty',
    name: 'عطر عنبر',
    description: 'عطر خالص بمسحة الجلد وطبيعة منعشة منعشة. 50 مل.',
    price: 189,
    rating: 4.6,
    reviewsCount: 150,
    stock: 50,
    featured: true,
    image: image('p-10'),
  },
  {
    id: 'p-11',
    categoryId: 'sports',
    name: 'دراجة هوكي',
    description: 'دراجة هوكي بإطارات قابل للتبديل ومكابح احترافية.',
    price: 1299,
    rating: 4.7,
    reviewsCount: 55,
    stock: 10,
    image: image('p-11'),
  },
  {
    id: 'p-12',
    categoryId: 'books',
    name: 'كتاب عالم المستقبل',
    description: 'رواية فلسفية عن التقنية والتعليم في العالم المعاصر.',
    price: 79,
    rating: 4.9,
    reviewsCount: 88,
    stock: 100,
    featured: true,
    image: image('p-12'),
  },
];

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((product) => product.id === id);
}

export function getProductsByCategory(categorySlug: string): Product[] {
  const category = CATEGORIES.find((item) => item.slug === categorySlug);
  if (!category) {
    return [];
  }
  return PRODUCTS.filter((product) => product.categoryId === category.id);
}

export function getFeaturedProducts(): Product[] {
  return PRODUCTS.filter((product) => product.featured);
}

export function getCategoriesWithProductCount(): { category: Category; count: number }[] {
  return CATEGORIES.map((category) => ({
    category,
    count: PRODUCTS.filter((product) => product.categoryId === category.id).length,
  }));
}
