/**
 * @file store-configs/index.ts
 * Unified Single Store Configuration.
 *
 * Professional, premium shopping experience tailored for customers.
 * All preview options and multi-store switchers have been removed.
 */

import { StoreConfig } from '@/types';

export const STORE_CONFIG: StoreConfig = {
  storeId: 'store-main',
  slug: 'elite-store',
  name: {
    ar: 'متجر النخبة للتسوق',
    en: 'Elite Store',
  },
  tagline: {
    ar: 'وجهتك الأولى لتسوق أرقى المنتجات العصرية',
    en: 'Your premier destination for luxury shopping',
  },
  logoUrl: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=300&q=80',
  bannerPlaceholderUrl: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=1200&q=80',
  defaultCurrency: 'SAR',
  taxRate: 0.15,
  supportEmail: 'support@elitestore.com',
  supportPhone: '+966500000001',
  theme: {
    name: 'Elite Premium Gold & Slate',
    colors: {
      light: {
        primary: '#854D0E', // Amber Gold
        primaryLight: '#FEF3C7',
        primaryDark: '#713F12',
        secondary: '#1E293B', // Slate Charcoal
        accent: '#CA8A04',
        background: '#FDFBF7', // Warm Ivory
        surface: '#FFFFFF',
        surfaceVariant: '#F7F3E9',
        card: '#FFFFFF',
        textPrimary: '#1E293B',
        textSecondary: '#64748B',
        textMuted: '#94A3B8',
        border: '#EAE0D0',
        borderLight: '#F3ECE0',
        error: '#EF4444',
        success: '#10B981',
        warning: '#F59E0B',
        info: '#3B82F6',
      },
      dark: {
        primary: '#FBBF24',
        primaryLight: '#78350F',
        primaryDark: '#F59E0B',
        secondary: '#E2E8F0',
        accent: '#FDE68A',
        background: '#0F172A',
        surface: '#1E293B',
        surfaceVariant: '#334155',
        card: '#1E293B',
        textPrimary: '#F8FAFC',
        textSecondary: '#CBD5E1',
        textMuted: '#64748B',
        border: '#334155',
        borderLight: '#1E293B',
        error: '#F87171',
        success: '#34D399',
        warning: '#FBBF24',
        info: '#60A5FA',
      },
    },
    borderRadius: {
      none: 0,
      sm: 6,
      md: 10,
      lg: 16,
      xl: 24,
      pill: 9999,
    },
    typography: {
      fontFamilyRegular: 'System',
      fontFamilyMedium: 'System',
      fontFamilyBold: 'System',
    },
  },
  features: {
    enableGuestCheckout: false,
    enableApplePay: true,
    enableWishlist: true,
    enableCustomerReviews: true,
    enableCouponCodes: true,
    enableTaxIncludedPricing: true,
    enableMultiLanguage: true,
  },
  contact: {
    whatsapp: '+966500000001',
    instagram: '@elitestore_official',
  },
};

/**
 * Single Store configuration.
 */
export const DEFAULT_STORE_CONFIG: StoreConfig = STORE_CONFIG;

export const STORE_PRESETS: Record<string, StoreConfig> = {
  [STORE_CONFIG.storeId]: STORE_CONFIG,
};

/**
 * Resolves the StoreConfig.
 * In single-store customer mode, this always returns the unified STORE_CONFIG.
 */
export function getStoreConfigById(_storeId?: string): StoreConfig {
  return STORE_CONFIG;
}
