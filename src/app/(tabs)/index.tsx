/**
 * @file src/app/(tabs)/index.tsx
 * Dynamic Modular Home Screen.
 *
 * Implements:
 * 1. Merchant Hero Banners Carousel
 * 2. Horizontal Categories Navigation Scroll
 * 3. Featured Products Grid (2-column responsive)
 * 4. Pull-to-Refresh & Shimmer Skeleton Loading
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useStoreTheme } from '@/theme/ThemeContext';
import { useBanners, useCategories, useProducts } from '@/hooks/useProducts';
import { useCartStore } from '@/stores/useCartStore';
import { ProductCard } from '@/components/product/ProductCard';
import { ProductCardSkeleton } from '@/components/common/LoadingSkeleton';
import { ErrorView } from '@/components/common/ErrorView';
import { Product } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { language, isRTL, t, countLabel } = useLanguage();
  const { colors, borderRadius, typography, spacing, storeConfig } = useStoreTheme();
  const { registrationComplete, clearRegistrationComplete } = useAuth();
  const addItemToCart = useCartStore((state) => state.addItem);

  const { categoryId } = useLocalSearchParams<{ categoryId?: string }>();
  const selectedCategoryId = categoryId || undefined;

  // Queries
  const bannersQuery = useBanners();
  const categoriesQuery = useCategories();
  const productsQuery = useProducts({ categoryId: selectedCategoryId });

  const isRefreshing =
    bannersQuery.isRefetching ||
    categoriesQuery.isRefetching ||
    productsQuery.isRefetching;

  const handleRefresh = async () => {
    await Promise.all([
      bannersQuery.refetch(),
      categoriesQuery.refetch(),
      productsQuery.refetch(),
    ]);
  };

  const handleProductPress = (product: Product) => {
    router.push({
      pathname: '/product/[id]',
      params: { id: product.id },
    });
  };

  const handleAddToCart = (product: Product) => {
    addItemToCart(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        regularPrice: product.regularPrice,
        thumbnail: product.thumbnail || product.images[0],
        maxStock: product.stock,
        sku: product.sku,
      },
      1
    );
  };

  if (productsQuery.isError && !productsQuery.data) {
    return (
      <ErrorView
        error={productsQuery.error}
        onRetry={() => productsQuery.refetch()}
        isRetrying={productsQuery.isFetching}
      />
    );
  }

  const banners = bannersQuery.data || [];
  const categories = categoriesQuery.data || [];
  const products = productsQuery.data?.data || [];

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: colors.background, direction: isRTL ? 'rtl' : 'ltr' },
      ]}
      contentContainerStyle={{ paddingBottom: 64 + insets.bottom + 16 }}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={handleRefresh}
          tintColor={colors.primary}
          colors={[colors.primary]}
        />
      }>
      {/* 1. Merchant Brand Header Greeting */}
      <View
        style={[
          styles.headerGreeting,
          {
            backgroundColor: colors.surface,
            borderBottomColor: colors.borderLight,
            paddingHorizontal: 16,
            paddingTop: Math.max(insets.top, 4),
            paddingBottom: 6,
          },
        ]}>
        <View style={styles.storeBranding}>
          <Text
            style={[
              typography.scale.title,
              { color: colors.textPrimary, textAlign: 'left', lineHeight: 24 },
            ]}>
            {storeConfig.name[language]}
          </Text>
          {storeConfig.tagline && (
            <Text
              style={[
                typography.scale.caption,
                { color: colors.textSecondary, textAlign: 'left', lineHeight: 14, marginTop: -2 },
              ]}>
              {storeConfig.tagline[language]}
            </Text>
          )}
        </View>
        <Image
          source={{ uri: storeConfig.logoUrl }}
          style={[styles.logoImage, { borderRadius: borderRadius.pill }]}
        />
      </View>

      {registrationComplete && (
        <View
          accessibilityRole="alert"
          style={[
            styles.accountCreatedBanner,
            {
              backgroundColor: colors.primaryLight,
              borderRadius: borderRadius.md,
              marginHorizontal: spacing.md,
              marginTop: spacing.md,
            },
          ]}>
          <Text style={[typography.scale.bodySm, { color: colors.primary, flex: 1 }]}>
            {t('auth.accountCreated')} — {t('auth.welcomeMessage')}
          </Text>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel={t('auth.dismiss')}
            onPress={clearRegistrationComplete}
            style={styles.dismissButton}>
            <Text style={[typography.scale.bodySm, { color: colors.primary, fontWeight: '700' }]}>
              {t('auth.dismiss')}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* 2. Promotional Banners Hero Carousel */}
      {banners.length > 0 && (
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[styles.bannersContainer, { paddingHorizontal: spacing.md }]}>
          {banners.map((banner) => (
            <TouchableOpacity
              key={banner.id}
              activeOpacity={0.9}
              style={[
                styles.bannerCard,
                {
                  borderRadius: borderRadius.lg,
                  borderColor: colors.borderLight,
                  backgroundColor: colors.card,
                },
              ]}
              onPress={() => {
                if (banner.actionType === 'category' && banner.actionValue) {
                  router.setParams({ categoryId: banner.actionValue });
                } else if (banner.actionType === 'product' && banner.actionValue) {
                  router.push({
                    pathname: '/product/[id]',
                    params: { id: banner.actionValue },
                  });
                }
              }}>
              <Image
                source={{ uri: banner.imageUrl }}
                style={[styles.bannerImage, { borderRadius: borderRadius.lg }]}
                resizeMode="cover"
              />
              <View
                style={[
                  styles.bannerOverlay,
                  { borderRadius: borderRadius.lg },
                ]}>
                <Text style={[typography.scale.titleSm, styles.bannerTitle]}>
                  {t(banner.title)}
                </Text>
                {banner.subtitle && (
                  <Text style={[typography.scale.caption, styles.bannerSubtitle]}>
                    {t(banner.subtitle)}
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* 3. Horizontal Categories Filter Scroll */}
      <View style={[styles.sectionContainer, { marginTop: spacing.lg }]}>
        <View
          style={[
            styles.sectionHeader,
              { paddingHorizontal: spacing.md, direction: 'ltr' },
          ]}>
          <Text
            style={[
              typography.scale.titleSm,
                { color: colors.textPrimary, fontWeight: '700', textAlign: 'left' },
            ]}>
            {t('التصنيفات المميزة')}
          </Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/categories')}>
              <Text style={[typography.scale.caption, { color: colors.primary, fontWeight: '700', textAlign: 'right' }]}>
                {t('عرض الكل')}
              </Text>
            </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[
            styles.categoriesScroll,
            { paddingHorizontal: spacing.md },
          ]}>
          {/* "All" Category Pill */}
          <TouchableOpacity
            style={[
              styles.categoryPill,
              {
                borderRadius: borderRadius.pill,
                borderColor: !selectedCategoryId ? colors.primary : colors.border,
                backgroundColor: !selectedCategoryId ? colors.primaryLight : colors.surface,
                paddingHorizontal: spacing.md,
                paddingVertical: spacing.xs,
              },
            ]}
            onPress={() => router.setParams({ categoryId: undefined })}>
            <Text
              style={[
                typography.scale.caption,
                {
                  color: !selectedCategoryId ? colors.primary : colors.textPrimary,
                  fontWeight: !selectedCategoryId ? '700' : '500',
                },
              ]}>
              {t('الكل')}
            </Text>
          </TouchableOpacity>

          {categories.map((cat) => {
            const isSelected = selectedCategoryId === cat.id;

            return (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.categoryPill,
                  {
                    borderRadius: borderRadius.pill,
                    borderColor: isSelected ? colors.primary : colors.border,
                    backgroundColor: isSelected ? colors.primaryLight : colors.surface,
                    paddingHorizontal: spacing.md,
                    paddingVertical: spacing.xs,
                  },
                ]}
                onPress={() => router.setParams({ categoryId: cat.id })}>
                <Text
                  style={[
                    typography.scale.caption,
                    {
                      color: isSelected ? colors.primary : colors.textPrimary,
                      fontWeight: isSelected ? '700' : '500',
                    },
                  ]}>
                  {t(cat.name)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* 4. Products Grid Section */}
      <View style={[styles.sectionContainer, { marginTop: spacing.xl, paddingHorizontal: spacing.md }]}>
        <View style={[styles.sectionHeader, { direction: 'ltr' }]}>
          <Text
            style={[
              typography.scale.titleSm,
              { color: colors.textPrimary, fontWeight: '700', textAlign: 'left' },
            ]}>
            {selectedCategoryId
              ? t(categories.find((c) => c.id === selectedCategoryId)?.name || 'المنتجات')
              : t('أحدث المنتجات المختارة')}
          </Text>
          <Text style={[typography.scale.caption, { color: colors.textSecondary, textAlign: 'right' }]}>
            {countLabel(products.length, 'منتج', 'منتجات', 'product', 'products')}
          </Text>
        </View>

        {/* Loading Skeletons */}
        {productsQuery.isLoading ? (
          <View style={styles.productsGrid}>
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
          </View>
        ) : products.length === 0 ? (
          <View style={[styles.emptyProducts, { padding: spacing.xxl }]}>
            <Text style={{ fontSize: 32, marginBottom: 8 }}>🔍</Text>
            <Text style={[typography.scale.body, { color: colors.textSecondary, textAlign: 'center' }]}>
              {t('لا توجد منتجات متوفرة في هذا القسم حالياً.')}
            </Text>
          </View>
        ) : (
          <View style={styles.productsGrid}>
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onPress={handleProductPress}
                onAddToCart={handleAddToCart}
              />
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerGreeting: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
  },
  accountCreatedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
  },
  dismissButton: {
    minHeight: 40,
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  storeBranding: {
    flex: 1,
  },
  logoImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginStart: 10,
  },
  bannersContainer: {
    paddingTop: 12,
    gap: 12,
  },
  bannerCard: {
    width: SCREEN_WIDTH - 32,
    height: 160,
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 1,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  bannerOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    padding: 12,
  },
  bannerTitle: {
    color: '#FFFFFF',
    fontWeight: '700',
    textAlign: 'auto',
  },
  bannerSubtitle: {
    color: '#F1F5F9',
    marginTop: 2,
    textAlign: 'auto',
  },
  sectionContainer: {
    width: '100%',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoriesScroll: {
    flexDirection: 'row',
    gap: 8,
  },
  categoryPill: {
    borderWidth: 1,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  emptyProducts: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
