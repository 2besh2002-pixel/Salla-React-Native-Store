/**
 * @file src/api/middleware.ts
 * Unified Store Catalog & Service Layer.
 *
 * Provides typed abstraction over store endpoints with rich curated mock data
 * for a complete, single shopping store experience.
 */

import { apiClient } from './client';
import {
  ApiResponse,
  Banner,
  Category,
  OrderPayload,
  OrderResponse,
  Product,
} from '@/types';

export const STORE_CATEGORIES: Category[] = [
  {
    id: 'cat-1',
    name: 'العود الطبيعي والمروكي',
    slug: 'natural-oud',
    productsCount: 14,
    imageUrl: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=400&q=80',
  },
  {
    id: 'cat-2',
    name: 'دهن العود الفاخر',
    slug: 'oud-oil',
    productsCount: 22,
    imageUrl: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&q=80',
  },
  {
    id: 'cat-3',
    name: 'عطور شرقية ملكية',
    slug: 'royal-perfumes',
    productsCount: 30,
    imageUrl: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=400&q=80',
  },
  {
    id: 'cat-4',
    name: 'محاصيل مختصة فلتر',
    slug: 'filter-beans',
    productsCount: 18,
    imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&q=80',
  },
  {
    id: 'cat-5',
    name: 'محاصيل إسبريسو',
    slug: 'espresso-beans',
    productsCount: 15,
    imageUrl: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&q=80',
  },
  {
    id: 'cat-6',
    name: 'هوديز وسويت شيرت',
    slug: 'hoodies',
    productsCount: 20,
    imageUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&q=80',
  },
  {
    id: 'cat-7',
    name: 'الإلكترونيات',
    slug: 'electronics',
    productsCount: 16,
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80',
  },
];

export const STORE_PRODUCTS: Product[] = [
  {
    id: 'prod-oud-1',
    storeId: 'store-main',
    categoryId: 'cat-1',
    categoryName: 'العود الطبيعي والمروكي',
    name: 'رقائق مروكي آصق طبيعي سوبر',
    description:
      'أجود رقائق العود المروكي الفاخر المستخرج من غابات آصق الإندونيسية. نكهة سويتية بخورية كثيفة تدوم طويلاً وتثبت في المجالس والملابس.',
    shortDescription: 'عود مروكي طبيعي فاخر بنكهة بخورية فواحة وثبات استثنائي.',
    sku: 'OUD-MRK-01',
    price: 285,
    regularPrice: 350,
    salePrice: 285,
    currency: 'SAR',
    images: [
      'https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=800&q=80',
      'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&q=80',
    ],
    thumbnail: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=400&q=80',
    rating: 4.9,
    reviewsCount: 128,
    stock: 45,
    isAvailable: true,
    hasVariants: true,
    badges: ['bestseller', 'sale'],
    options: [
      {
        id: 'opt-weight',
        name: 'الوزن',
        type: 'select',
        values: [
          { id: 'val-tola', name: 'تولة (12 جرام)', available: true, priceDelta: 0 },
          { id: 'val-oqiyah', name: 'أوقية (28 جرام)', available: true, priceDelta: 160 },
          { id: 'val-thumn', name: 'ثمن كيلو (125 جرام)', available: true, priceDelta: 620 },
        ],
      },
    ],
    variants: [
      { id: 'var-1', sku: 'OUD-MRK-12G', price: 285, stock: 20, options: { 'الوزن': 'تولة (12 جرام)' } },
      { id: 'var-2', sku: 'OUD-MRK-28G', price: 445, stock: 15, options: { 'الوزن': 'أوقية (28 جرام)' } },
      { id: 'var-3', sku: 'OUD-MRK-125G', price: 905, stock: 10, options: { 'الوزن': 'ثمن كيلو (125 جرام)' } },
    ],
  },
  {
    id: 'prod-oud-2',
    storeId: 'store-main',
    categoryId: 'cat-2',
    categoryName: 'دهن العود الفاخر',
    name: 'دهن عود براشين كلاسيك قديم معتق',
    description:
      'دهن عود بيور نقي 100% بنكهة خشبية فواحة وسويتية تدوم لأكثر من 18 ساعة على البشرة وثلاثة أيام على الأقمشة.',
    shortDescription: 'دهن براشين نقي معتق ذو فوحان ملكي وثبات عالي.',
    sku: 'OUD-BRS-02',
    price: 390,
    currency: 'SAR',
    images: [
      'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&q=80',
      'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800&q=80',
    ],
    thumbnail: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&q=80',
    rating: 4.8,
    reviewsCount: 94,
    stock: 18,
    isAvailable: true,
    hasVariants: false,
    badges: ['featured'],
  },
  {
    id: 'prod-oud-3',
    storeId: 'store-main',
    categoryId: 'cat-3',
    categoryName: 'عطور شرقية ملكية',
    name: 'عطر مسك الفخامة الملكي 100 مل',
    description:
      'مزيج فاخر من المسك الأبيض الحريري مع لمسات من الفانيلا والعنبر والورد الطائفي.',
    shortDescription: 'مسك نقي أنثوي ورجالي يعكس الفخامة والنقاء.',
    sku: 'PRF-MSK-03',
    price: 210,
    regularPrice: 260,
    salePrice: 210,
    currency: 'SAR',
    images: ['https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800&q=80'],
    thumbnail: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=400&q=80',
    rating: 4.7,
    reviewsCount: 65,
    stock: 30,
    isAvailable: true,
    hasVariants: false,
    badges: ['new'],
  },
  {
    id: 'prod-cafe-1',
    storeId: 'store-main',
    categoryId: 'cat-4',
    categoryName: 'محاصيل مختصة فلتر',
    name: 'إثيوبيا قوجي هامبيلا - مجففة',
    description:
      'إيحاءات الفراولة، الخوخ، وزهور الياسمين بقوام حريري ممتع مع حلاوة واضحة متوازنة للتقطير V60 و Chemex.',
    shortDescription: 'محصول إثيوبي مميز بإيحاءات الفاكهة الاستوائية والزهور العطرية.',
    sku: 'COF-ETH-01',
    price: 68,
    regularPrice: 75,
    salePrice: 68,
    currency: 'SAR',
    images: ['https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&q=80'],
    thumbnail: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&q=80',
    rating: 4.9,
    reviewsCount: 210,
    stock: 80,
    isAvailable: true,
    hasVariants: true,
    badges: ['bestseller'],
    options: [
      {
        id: 'opt-grind',
        name: 'نوع الطحنة',
        type: 'select',
        values: [
          { id: 'g-whole', name: 'حبوب كاملة (بدون طحن)', available: true },
          { id: 'g-v60', name: 'طحنة فلتر V60', available: true },
          { id: 'g-espresso', name: 'طحنة إسبريسو', available: true },
        ],
      },
    ],
    variants: [
      { id: 'v-c1', sku: 'COF-ETH-W', price: 68, stock: 50, options: { 'نوع الطحنة': 'حبوب كاملة (بدون طحن)' } },
      { id: 'v-c2', sku: 'COF-ETH-F', price: 68, stock: 20, options: { 'نوع الطحنة': 'طحنة فلتر V60' } },
      { id: 'v-c3', sku: 'COF-ETH-E', price: 68, stock: 10, options: { 'نوع الطحنة': 'طحنة إسبريسو' } },
    ],
  },
  {
    id: 'prod-cafe-2',
    storeId: 'store-main',
    categoryId: 'cat-5',
    categoryName: 'محاصيل إسبريسو',
    name: 'كولومبيا ويلا سوبريمو - مغسولة',
    description:
      'شوكولاتة داكنة، كراميل، ومكسرات محمصة. قوام ممتلئ غني مثالي للإسبريسو ومشروبات الحليب (كورتادو، فلات وايت، لاتيه).',
    shortDescription: 'محصول كولومبي كلاسيكي للشوكولاتة والكراميل بقوام مخملي.',
    sku: 'COF-COL-02',
    price: 62,
    currency: 'SAR',
    images: ['https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&q=80'],
    thumbnail: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&q=80',
    rating: 4.8,
    reviewsCount: 88,
    stock: 45,
    isAvailable: true,
    hasVariants: false,
    badges: ['featured'],
  },
  {
    id: 'prod-app-1',
    storeId: 'store-main',
    categoryId: 'cat-6',
    categoryName: 'هوديز وسويت شيرت',
    name: 'هودي أوفرسايز قطن عضوي ثقيل 450GSM',
    description:
      'هودي عصري مصمم بقصة مريحة واسعة من القطن الثقيل الممتاز مع جيب كنغر وقبعة مبطنة مزدوجة.',
    shortDescription: 'قطن 100% ثقيل بقصة عصرية مريحة ودافئة.',
    sku: 'APP-HD-01',
    price: 240,
    regularPrice: 290,
    salePrice: 240,
    currency: 'SAR',
    images: ['https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80'],
    thumbnail: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&q=80',
    rating: 4.8,
    reviewsCount: 154,
    stock: 35,
    isAvailable: true,
    hasVariants: true,
    badges: ['sale', 'bestseller'],
    options: [
      {
        id: 'opt-size',
        name: 'المقاس',
        type: 'select',
        values: [
          { id: 'sz-s', name: 'S', available: true },
          { id: 'sz-m', name: 'M', available: true },
          { id: 'sz-l', name: 'L', available: true },
          { id: 'sz-xl', name: 'XL', available: true },
        ],
      },
    ],
    variants: [
      { id: 'va-s', sku: 'HD-S', price: 240, stock: 10, options: { 'المقاس': 'S' } },
      { id: 'va-m', sku: 'HD-M', price: 240, stock: 15, options: { 'المقاس': 'M' } },
      { id: 'va-l', sku: 'HD-L', price: 240, stock: 8, options: { 'المقاس': 'L' } },
      { id: 'va-xl', sku: 'HD-XL', price: 240, stock: 2, options: { 'المقاس': 'XL' } },
    ],
  },
  {
    id: 'prod-tech-1',
    storeId: 'store-main',
    categoryId: 'cat-7',
    categoryName: 'الإلكترونيات',
    name: 'سماعات لاسلكية',
    description:
      'سماعات بلوتوث محمولة بخاصية إلغاء الضوضاء وتحكم صوتي، مصممة للعمل لساعات طويلة.',
    shortDescription: 'سماعات لاسلكية عالية الدقة مع بطارية تدوم طويلاً.',
    sku: 'TECH-AUD-01',
    price: 299,
    regularPrice: 399,
    salePrice: 299,
    currency: 'SAR',
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80'],
    thumbnail: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80',
    rating: 4.7,
    reviewsCount: 128,
    stock: 25,
    isAvailable: true,
    hasVariants: false,
    badges: ['sale', 'featured'],
  },
  {
    id: 'prod-tech-2',
    storeId: 'store-main',
    categoryId: 'cat-7',
    categoryName: 'الإلكترونيات',
    name: 'ساعة ذكية',
    description:
      'ساعة ذكية بقياس نبضات القلب ومعدل الأيض ومعلومات GPS، مقاومة للماء.',
    shortDescription: 'ساعة ذكية متكاملة لتتبع الصحة واللياقة البدنية.',
    sku: 'TECH-WTC-02',
    price: 899,
    regularPrice: 1099,
    salePrice: 899,
    currency: 'SAR',
    images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80'],
    thumbnail: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80',
    rating: 4.8,
    reviewsCount: 342,
    stock: 12,
    isAvailable: true,
    hasVariants: false,
    badges: ['bestseller'],
  },
];

export const STORE_BANNERS: Banner[] = [
  {
    id: 'ban-1',
    title: 'عروض الموسم الملكية',
    subtitle: 'خصومات تصل إلى 25% على أفخر أدهان العود والمروكي',
    imageUrl: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=1200&q=80',
    actionType: 'category',
    actionValue: 'cat-1',
  },
  {
    id: 'ban-2',
    title: 'جديد المسك الأبيض',
    subtitle: 'نقاء يدوم طوال اليوم مع لمسات من زهور الربيع',
    imageUrl: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=1200&q=80',
    actionType: 'product',
    actionValue: 'prod-oud-3',
  },
  {
    id: 'ban-3',
    title: 'محاصيل الموسم الإثيوبية',
    subtitle: 'حلاوة الفواكه الاستوائية بلمسة تحميص احترافية طازجة',
    imageUrl: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=1200&q=80',
    actionType: 'category',
    actionValue: 'cat-4',
  },
  {
    id: 'ban-4',
    title: 'تشكيلة الشتاء المحدودة',
    subtitle: 'أقمشة قطنية ثقيلة وقصات أوفرسايز مريحة',
    imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80',
    actionType: 'category',
    actionValue: 'cat-6',
  },
];

export interface FetchProductsParams {
  storeId?: string;
  categoryId?: string;
  search?: string;
  page?: number;
  limit?: number;
}

/**
 * Service API for Single Store.
 * Returns consistent unified catalog data.
 */
export const sallaMiddlewareApi = {
  // Fetch products with optional pagination, category, and search filters
  async getProducts(params: FetchProductsParams = {}): Promise<ApiResponse<Product[]>> {
    const { storeId = 'store-main', categoryId, search, page = 1, limit = 10 } = params;

    try {
      const response = await apiClient.get<ApiResponse<Product[]>>('/products', {
        params: { store_id: storeId, category_id: categoryId, q: search, page, limit },
      });
      if (response && response.data && response.data.data) {
        return response.data;
      }
    } catch {
      // Fall through to curated fallback data
    }

    let filtered = [...STORE_PRODUCTS];

      if (categoryId) {
        filtered = filtered.filter((p) => p.categoryId === categoryId);
      }

      if (search && search.trim()) {
        const query = search.trim().toLowerCase();
        filtered = filtered.filter(
          (p) =>
            p.name.toLowerCase().includes(query) ||
            p.description.toLowerCase().includes(query)
        );
      }

      const totalItems = filtered.length;
      const totalPages = Math.ceil(totalItems / limit) || 1;
      const startIndex = (page - 1) * limit;
      const paginatedData = filtered.slice(startIndex, startIndex + limit);

      return {
        success: true,
        data: paginatedData,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems,
          hasNextPage: page < totalPages,
        },
      };
  },

  // Fetch single product details by ID
  async getProductById(productId: string, storeId: string = 'store-main'): Promise<Product> {
    try {
      const response = await apiClient.get<ApiResponse<Product>>(`/products/${productId}`, {
        params: { store_id: storeId },
      });
      if (response && response.data && response.data.data) {
        return response.data.data;
      }
    } catch {
      // Fall through to fallback
    }

    const product = STORE_PRODUCTS.find((p) => p.id === productId);
    if (!product) {
      throw new Error('المنتج المطلوب غير متوفر حالياً.');
    }
    return product;
  },

  // Fetch store categories
  async getCategories(storeId: string = 'store-main'): Promise<Category[]> {
    try {
      const response = await apiClient.get<ApiResponse<Category[]>>('/categories', {
        params: { store_id: storeId },
      });
      if (response && response.data && response.data.data) {
        return response.data.data;
      }
    } catch {
      // Fall through to fallback
    }

    return STORE_CATEGORIES;
  },

  // Fetch store promotional banners
  async getBanners(storeId: string = 'store-main'): Promise<Banner[]> {
    try {
      const response = await apiClient.get<ApiResponse<Banner[]>>('/banners', {
        params: { store_id: storeId },
      });
      if (response && response.data && response.data.data) {
        return response.data.data;
      }
    } catch {
      // Fall through to fallback
    }

    return STORE_BANNERS;
  },

  // Submit checkout order
  async createOrder(payload: OrderPayload): Promise<OrderResponse> {
    try {
      const response = await apiClient.post<ApiResponse<OrderResponse>>('/orders', payload);
      return response.data.data;
    } catch {
      const randomOrderNumber = Math.floor(100000 + Math.random() * 900000).toString();
      const total = payload.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

      return {
        orderId: `ord_${Date.now()}`,
        orderNumber: `#SAL-${randomOrderNumber}`,
        storeId: payload.storeId,
        status: 'pending',
        createdAt: new Date().toISOString(),
        totalAmount: total,
        currency: 'SAR',
        paymentStatus: payload.paymentMethodType === 'cod' ? 'unpaid' : 'paid',
      };
    }
  },
};
