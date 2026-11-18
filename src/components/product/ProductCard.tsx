/**
 * @file src/components/product/ProductCard.tsx
 * White-Label Branded Product Card Component.
 *
 * Injects merchant primary color, card radius, and currency formatting.
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Product } from '@/types';
import { useStoreTheme } from '@/theme/ThemeContext';
import { Badge } from '@/components/common/Badge';
import { useLanguage } from '@/context/LanguageContext';

export interface ProductCardProps {
  product: Product;
  onPress?: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
}

export function ProductCard({ product, onPress, onAddToCart }: ProductCardProps) {
  const { colors, borderRadius, typography, spacing, shadows, storeConfig } = useStoreTheme();
  const { t } = useLanguage();

  const hasDiscount =
    product.regularPrice && product.regularPrice > product.price;
  const discountPercentage = hasDiscount
    ? Math.round(((product.regularPrice! - product.price) / product.regularPrice!) * 100)
    : 0;

  return (
    <TouchableOpacity
      testID="product-card"
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderRadius: borderRadius.md,
          borderColor: colors.borderLight,
          direction: 'ltr',
          ...shadows.sm,
        },
      ]}
      activeOpacity={0.85}
      onPress={() => onPress?.(product)}>
      {/* Product Image and Badges */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: product.thumbnail || product.images[0] }}
          style={[styles.image, { borderTopLeftRadius: borderRadius.md, borderTopRightRadius: borderRadius.md }]}
          resizeMode="cover"
        />

        {/* Badges container */}
        <View
          style={[
            styles.badgeContainer,
            { top: spacing.xs, right: spacing.xs },
          ]}>
          {hasDiscount && (
            <Badge label={`-${discountPercentage}%`} variant="sale" />
          )}
          {product.badges?.includes('bestseller') && (
            <Badge label={t('الأكثر طلباً')} variant="warning" />
          )}
        </View>
      </View>

      {/* Content */}
      <View style={[styles.info, { padding: spacing.sm }]}>
        {product.categoryName && (
          <Text
            style={[
              typography.scale.caption,
              { color: colors.textMuted, marginBottom: 2 },
            ]}
            numberOfLines={1}>
            {t(product.categoryName)}
          </Text>
        )}

        <Text
          testID="product-title"
          style={[
            typography.scale.bodySm,
            styles.title,
            { color: colors.textPrimary, marginBottom: spacing.xs, textAlign: 'left' },
          ]}
          numberOfLines={2}>
          {t(product.name)}
        </Text>

        {/* Rating */}
        <View
          style={[
            styles.ratingRow,
            { marginBottom: spacing.xs },
          ]}>
          <Text style={styles.star}>★</Text>
          <Text style={[typography.scale.caption, { color: colors.textSecondary }]}>
            {product.rating.toFixed(1)} ({product.reviewsCount} {t('تقييم')})
          </Text>
        </View>

        {/* Price & Add to Cart button */}
        <View style={styles.footerRow}>
          <View style={styles.priceContainer}>
            <Text
              testID="product-price"
              style={[
                typography.scale.body,
                styles.price,
                { color: colors.primary },
              ]}>
              {product.price} {product.currency || storeConfig.defaultCurrency}
            </Text>
            {hasDiscount ? (
              <Text
                style={[
                  typography.scale.caption,
                  styles.oldPrice,
                  { color: colors.textMuted },
                ]}>
                {product.regularPrice} {product.currency || storeConfig.defaultCurrency}
              </Text>
            ) : (
              <Text style={[typography.scale.caption, styles.oldPricePlaceholder]} />
            )}
          </View>

          {onAddToCart && (
            <TouchableOpacity
              testID="add-to-cart-button"
              style={[
                styles.addBtn,
                {
                  backgroundColor: colors.primaryLight,
                  borderRadius: borderRadius.sm,
                },
              ]}
              onPress={() => onAddToCart(product)}
              activeOpacity={0.7}>
              <Text style={[styles.addBtnText, { color: colors.primary }]}>+</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '48%',
    borderWidth: 1,
    marginBottom: 12,
    overflow: 'hidden',
    minHeight: 300,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1,
    position: 'relative',
    backgroundColor: '#F1F5F9',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  badgeContainer: {
    position: 'absolute',
    flexDirection: 'column',
    gap: 4,
  },
  info: {
    flex: 1,
    justifyContent: 'space-between',
  },
  title: {
    fontWeight: '600',
    minHeight: 36,
    maxHeight: 36,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  star: {
    color: '#F59E0B',
    fontSize: 12,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    direction: 'ltr',
    marginTop: 6,
  },
  priceContainer: {
    alignItems: 'flex-start',
  },
  price: {
    fontWeight: '700',
  },
  oldPrice: {
    textDecorationLine: 'line-through',
    height: 16,
  },
  oldPricePlaceholder: {
    height: 16,
  },
  addBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnText: {
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 22,
  },
});
