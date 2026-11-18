/**
 * @file src/types/index.ts
 * Strict TypeScript Models & Contracts for Salla Multi-Store White-Label Application.
 */

// ==========================================
// 1. Store & White-Label Configuration Types
// ==========================================

export type SupportedCurrency = 'SAR' | 'AED' | 'KWD' | 'QAR' | 'BHD' | 'OMR' | 'USD';

export interface ThemeColors {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  surfaceVariant: string;
  card: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  border: string;
  borderLight: string;
  error: string;
  success: string;
  warning: string;
  info: string;
}

export interface StoreTheme {
  name: string;
  colors: {
    light: ThemeColors;
    dark: ThemeColors;
  };
  borderRadius: {
    none: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    pill: number;
  };
  typography: {
    fontFamilyRegular?: string;
    fontFamilyMedium?: string;
    fontFamilyBold?: string;
  };
}

export interface StoreFeatureFlags {
  enableGuestCheckout: boolean;
  enableApplePay: boolean;
  enableWishlist: boolean;
  enableCustomerReviews: boolean;
  enableCouponCodes: boolean;
  enableTaxIncludedPricing: boolean;
  enableMultiLanguage: boolean;
}

export interface StoreConfig {
  storeId: string;
  slug: string;
  name: {
    ar: string;
    en: string;
  };
  tagline?: {
    ar: string;
    en: string;
  };
  logoUrl: string;
  faviconUrl?: string;
  bannerPlaceholderUrl?: string;
  defaultCurrency: SupportedCurrency;
  taxRate: number; // e.g., 0.15 for 15% VAT
  supportEmail: string;
  supportPhone?: string;
  theme: StoreTheme;
  features: StoreFeatureFlags;
  contact?: {
    whatsapp?: string;
    instagram?: string;
    twitter?: string;
  };
}

// ==========================================
// 2. Product & Catalog Types
// ==========================================

export interface Category {
  id: string;
  name: string;
  slug: string;
  imageUrl?: string;
  description?: string;
  parentId?: string | null;
  children?: Category[];
  productsCount?: number;
}

export interface ProductOptionValue {
  id: string;
  name: string;
  displayValue?: string; // hex color or label
  available: boolean;
  priceDelta?: number;
}

export interface ProductOption {
  id: string;
  name: string; // e.g. "Size", "Color"
  type: 'color' | 'select' | 'radio' | 'text';
  values: ProductOptionValue[];
}

export interface ProductVariant {
  id: string;
  sku: string;
  price: number;
  salePrice?: number;
  stock: number;
  options: Record<string, string>; // e.g. { "size": "M", "color": "blue" }
  imageUrl?: string;
}

export interface Product {
  id: string;
  storeId: string;
  categoryId: string;
  categoryName?: string;
  name: string;
  description: string;
  shortDescription?: string;
  sku: string;
  price: number;
  regularPrice?: number;
  salePrice?: number;
  currency: SupportedCurrency;
  images: string[];
  thumbnail: string;
  rating: number;
  reviewsCount: number;
  stock: number;
  isAvailable: boolean;
  hasVariants: boolean;
  options?: ProductOption[];
  variants?: ProductVariant[];
  badges?: ('new' | 'featured' | 'sale' | 'bestseller')[];
  createdAt?: string;
}

export interface Banner {
  id: string;
  title: string;
  subtitle?: string;
  imageUrl: string;
  actionType: 'category' | 'product' | 'external_url' | 'none';
  actionValue?: string;
}

// ==========================================
// 3. Cart & Shopping Types
// ==========================================

export interface SelectedOption {
  optionId: string;
  optionName: string;
  valueId: string;
  valueName: string;
}

export interface CartItem {
  id: string; // generated unique cart item id (e.g., productId + variantId)
  productId: string;
  variantId?: string;
  name: string;
  sku?: string;
  thumbnail: string;
  price: number;
  regularPrice?: number;
  quantity: number;
  selectedOptions?: SelectedOption[];
  maxStock: number;
}

export interface AppliedCoupon {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountAmount: number;
  minimumSpend?: number;
}

export interface CartTotals {
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  grandTotal: number;
  currency: SupportedCurrency;
  itemCount: number;
}

// ==========================================
// 4. Checkout & Order Types
// ==========================================

export interface CustomerAddress {
  id?: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  country: string;
  city: string;
  district?: string;
  street: string;
  buildingNumber?: string;
  postalCode?: string;
  notes?: string;
  isDefault?: boolean;
}

export interface ShippingMethod {
  id: string;
  name: string;
  provider: string; // e.g., 'Aramex', 'SMSA', 'SPL'
  cost: number;
  estimatedDelivery: string;
  logoUrl?: string;
}

export type PaymentMethodType = 'mada' | 'apple_pay' | 'credit_card' | 'tamara' | 'tabby' | 'cod';

export interface PaymentMethod {
  id: string;
  type: PaymentMethodType;
  title: string;
  description?: string;
  fee?: number;
  iconName?: string;
}

export interface OrderPayload {
  storeId: string;
  items: {
    productId: string;
    variantId?: string;
    quantity: number;
    price: number;
  }[];
  shippingAddress: CustomerAddress;
  shippingMethodId: string;
  paymentMethodType: PaymentMethodType;
  couponCode?: string;
  customerNotes?: string;
}

export interface OrderResponse {
  orderId: string;
  orderNumber: string;
  storeId: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  totalAmount: number;
  currency: SupportedCurrency;
  paymentStatus: 'paid' | 'unpaid' | 'pending';
  paymentRedirectUrl?: string; // e.g. for Mada / 3D Secure / Hosted checkout
}

// ==========================================
// 5. API Response Contracts
// ==========================================

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasNextPage: boolean;
  };
}

export interface CustomerAccount {
  id: string;
  name: string;
  email: string;
}

export interface SallaApiError {
  statusCode: number;
  errorCode: string;
  message: string;
  details?: Record<string, string[]>;
}
