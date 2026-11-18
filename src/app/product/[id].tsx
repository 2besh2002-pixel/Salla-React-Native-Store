/**
 * @file src/app/product/[id].tsx
 * Dynamic Product Details Screen.
 *
 * Implements:
 * 1. Image Gallery / Slider with Pager Dots
 * 2. Variant and Options Matrix Selector (e.g., Size, Weight, Grind)
 * 3. Dynamic Price Calculation based on selected variant deltas
 * 4. Quantity Adjustments & "Add to Cart" action
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useProduct } from '@/hooks/useProducts';
import { useStoreTheme } from '@/theme/ThemeContext';
import { useCartStore } from '@/stores/useCartStore';
import { VariantSelector } from '@/components/product/VariantSelector';
import { Badge } from '@/components/common/Badge';
import { ErrorView } from '@/components/common/ErrorView';
import { ProductOptionValue, SelectedOption } from '@/types';
import { useLanguage } from '@/context/LanguageContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { isRTL, t } = useLanguage();
  const { colors, borderRadius, typography, spacing, shadows, storeConfig } = useStoreTheme();
  const addItemToCart = useCartStore((state) => state.addItem);

  const productQuery = useProduct(id);

  // Local state for options & quantity
  const [userSelectedValues, setUserSelectedValues] = useState<Record<string, string>>({});
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAddedFeedback, setIsAddedFeedback] = useState(false);

  const product = productQuery.data;

  // Compute default values and merge with user selections without cascading effect setState
  const selectedValues = React.useMemo(() => {
    const defaults: Record<string, string> = {};
    if (product?.options) {
      product.options.forEach((opt) => {
        const firstAvailable = opt.values.find((v) => v.available) || opt.values[0];
        if (firstAvailable) {
          defaults[opt.name] = firstAvailable.name;
        }
      });
    }
    return { ...defaults, ...userSelectedValues };
  }, [product, userSelectedValues]);

  if (productQuery.isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (productQuery.isError || !product) {
    return (
      <ErrorView
        error={productQuery.error}
        onRetry={() => productQuery.refetch()}
        isRetrying={productQuery.isFetching}
      />
    );
  }

  // Calculate dynamic price based on selected option deltas or matched variant
  let currentPrice = product.price;
  let matchedVariantId: string | undefined = undefined;

  if (product.options) {
    product.options.forEach((opt) => {
      const selectedName = selectedValues[opt.name];
      const valObj = opt.values.find((v) => v.name === selectedName);
      if (valObj?.priceDelta) {
        currentPrice += valObj.priceDelta;
      }
    });
  }

  if (product.variants && product.variants.length > 0) {
    const matched = product.variants.find((v) => {
      return Object.entries(selectedValues).every(([key, value]) => v.options[key] === value);
    });
    if (matched) {
      currentPrice = matched.price;
      matchedVariantId = matched.id;
    }
  }

  const handleSelectOption = (optionName: string, value: ProductOptionValue) => {
    setUserSelectedValues((prev) => ({
      ...prev,
      [optionName]: value.name,
    }));
  };

  const handleAddToCart = () => {
    // Format selected options
    const selectedOptionsList: SelectedOption[] = Object.entries(selectedValues).map(
      ([optionName, valueName]) => ({
        optionId: optionName,
        optionName,
        valueId: valueName,
        valueName,
      })
    );

    addItemToCart(
      {
        id: product.id,
        name: product.name,
        price: currentPrice,
        regularPrice: product.regularPrice,
        thumbnail: product.thumbnail || product.images[0],
        maxStock: product.stock,
        sku: product.sku,
      },
      quantity,
      matchedVariantId,
      selectedOptionsList
    );

    setIsAddedFeedback(true);
    setTimeout(() => setIsAddedFeedback(false), 2000);

    Alert.alert(
      t('تمت الإضافة بنجاح'),
      `${t('تمت إضافة العنصر إلى سلة المشتريات.')} "${t(product.name)}"`,
      [
        { text: t('مواصلة التسوق'), style: 'cancel' },
        { text: t('الذهاب للسلة'), onPress: () => router.push('/(tabs)/cart') },
      ]
    );
  };

  const images = product.images.length > 0 ? product.images : [product.thumbnail];

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background, direction: isRTL ? 'rtl' : 'ltr' },
      ]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* 1. Image Slider */}
        <View style={styles.galleryContainer}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={(e) => {
              const slide = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
              setActiveImageIndex(slide);
            }}
            scrollEventThrottle={16}>
            {images.map((imgUri, index) => (
              <Image
                key={index}
                source={{ uri: imgUri }}
                style={styles.productImage}
                resizeMode="cover"
              />
            ))}
          </ScrollView>

          {/* Pagination dots */}
          {images.length > 1 && (
            <View style={styles.paginationDots}>
              {images.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.dot,
                    {
                      backgroundColor:
                        index === activeImageIndex ? colors.primary : 'rgba(255,255,255,0.6)',
                      borderRadius: borderRadius.pill,
                    },
                  ]}
                />
              ))}
            </View>
          )}

          {/* Badges Overlay */}
          <View
            style={[
              styles.badgesContainer,
              { top: spacing.md, [isRTL ? 'left' : 'right']: spacing.md },
            ]}>
            {product.regularPrice && product.regularPrice > product.price && (
              <Badge label={t('خصم خاص')} variant="sale" />
            )}
            {product.badges?.includes('bestseller') && (
              <Badge label={t('الأكثر مبيعاً')} variant="warning" />
            )}
          </View>
        </View>

        {/* 2. Product Information Card */}
        <View
          style={[
            styles.infoCard,
            {
              backgroundColor: colors.card,
              borderTopLeftRadius: borderRadius.xl,
              borderTopRightRadius: borderRadius.xl,
              padding: spacing.lg,
              ...shadows.md,
            },
          ]}>
          {product.categoryName && (
            <Text
              style={[
                typography.scale.caption,
                { color: colors.textMuted, textAlign: 'auto', marginBottom: 4 },
              ]}>
              {t(product.categoryName)}
            </Text>
          )}

          <Text
            style={[
              typography.scale.headline,
              styles.productTitle,
              { color: colors.textPrimary, marginBottom: spacing.xs },
            ]}>
            {t(product.name)}
          </Text>

          {/* Rating and Stock */}
          <View style={[styles.metaRow, { marginBottom: spacing.md }]}>
            <View
              style={[
                styles.stockBadge,
                {
                  backgroundColor: product.stock > 0 ? colors.surfaceVariant : '#FEE2E2',
                  borderRadius: borderRadius.pill,
                  paddingHorizontal: spacing.sm,
                  paddingVertical: 2,
                },
              ]}>
              <Text
                style={[
                  typography.scale.caption,
                  { color: product.stock > 0 ? colors.success : colors.error, fontWeight: '700' },
                ]}>
                {product.stock > 0
                  ? `${t('متوفر بالمخزون')} (${product.stock})`
                  : t('نفذت الكمية')}
              </Text>
            </View>

            <View style={styles.ratingBadge}>
              <Text style={styles.star}>★</Text>
              <Text style={[typography.scale.bodySm, { color: colors.textSecondary }]}>
                {product.rating.toFixed(1)} ({product.reviewsCount} {t('تقييم')})
              </Text>
            </View>
          </View>

          {/* Price Display */}
          <View style={[styles.priceRow, { marginBottom: spacing.lg }]}>
            <View style={styles.priceContainer}>
              <Text style={[typography.scale.display, { color: colors.primary }]}>
                {currentPrice} {product.currency || storeConfig.defaultCurrency}
              </Text>
              {product.regularPrice && (
                <Text
                  style={[
                    typography.scale.body,
                    styles.regularPrice,
                    { color: colors.textMuted },
                  ]}>
                  {product.regularPrice} {product.currency || storeConfig.defaultCurrency}
                </Text>
              )}
            </View>
            <Text style={[typography.scale.caption, { color: colors.textMuted }]}>
              {t('شامل ضريبة القيمة المضافة')} ({storeConfig.taxRate * 100}%)
            </Text>
          </View>

          {/* 3. Variants & Options Selector */}
          {product.options && product.options.length > 0 && (
            <View style={[styles.variantSection, { marginBottom: spacing.lg }]}>
              <VariantSelector
                options={product.options}
                selectedValues={selectedValues}
                onSelectOption={handleSelectOption}
              />
            </View>
          )}

          {/* 4. Description */}
          <View style={[styles.descriptionSection, { marginBottom: spacing.xl }]}>
            <Text
              style={[
                typography.scale.titleSm,
                styles.sectionHeading,
                { color: colors.textPrimary, marginBottom: spacing.xs },
              ]}>
              {t('وصف المنتج')}
            </Text>
            <Text
              style={[
                typography.scale.body,
                styles.descriptionText,
                { color: colors.textSecondary },
              ]}>
              {t(product.description)}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* 5. Sticky Bottom Action Bar with Quantity Selector and Add to Cart */}
      <View
        style={[
          styles.bottomBar,
          {
            backgroundColor: colors.surface,
            borderTopColor: colors.borderLight,
            padding: spacing.md,
            ...shadows.lg,
          },
        ]}>
        {/* Quantity Stepper */}
        <View
          style={[
            styles.quantityStepper,
            {
              backgroundColor: colors.surfaceVariant,
              borderRadius: borderRadius.md,
              borderColor: colors.border,
            },
          ]}>
          <TouchableOpacity
            style={styles.quantityBtn}
            onPress={() => setQuantity((q) => Math.min(q + 1, product.stock))}>
            <Text style={[styles.quantityBtnText, { color: colors.textPrimary }]}>+</Text>
          </TouchableOpacity>
          <Text style={[typography.scale.body, styles.quantityDisplay, { color: colors.textPrimary }]}>
            {quantity}
          </Text>
          <TouchableOpacity
            style={styles.quantityBtn}
            onPress={() => setQuantity((q) => Math.max(1, q - 1))}>
            <Text style={[styles.quantityBtnText, { color: colors.textPrimary }]}>−</Text>
          </TouchableOpacity>
        </View>

        {/* Add to Cart Button */}
        <TouchableOpacity
          style={[
            styles.addToCartBtn,
            {
              backgroundColor: isAddedFeedback ? colors.success : colors.primary,
              borderRadius: borderRadius.md,
              paddingVertical: spacing.md,
            },
          ]}
          onPress={handleAddToCart}
          disabled={product.stock <= 0}
          activeOpacity={0.85}>
          <Text style={[typography.scale.bodyLg, styles.addToCartText]}>
            {isAddedFeedback
              ? t('✓ تمت الإضافة')
              : `${t('إضافة للسلة')} • ${(currentPrice * quantity).toFixed(2)} ${product.currency || storeConfig.defaultCurrency}`}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  galleryContainer: {
    width: SCREEN_WIDTH,
    height: 340,
    position: 'relative',
    backgroundColor: '#000000',
  },
  productImage: {
    width: SCREEN_WIDTH,
    height: 340,
  },
  paginationDots: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
  },
  badgesContainer: {
    position: 'absolute',
    flexDirection: 'column',
    gap: 6,
  },
  infoCard: {
    marginTop: -20,
    minHeight: 400,
  },
  productTitle: {
    textAlign: 'auto',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  star: {
    color: '#F59E0B',
    fontSize: 16,
  },
  stockBadge: {},
  priceRow: {
    alignItems: 'flex-start',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 12,
  },
  regularPrice: {
    textDecorationLine: 'line-through',
  },
  variantSection: {
    width: '100%',
  },
  descriptionSection: {
    width: '100%',
  },
  sectionHeading: {
    fontWeight: '700',
    textAlign: 'auto',
  },
  descriptionText: {
    textAlign: 'auto',
    lineHeight: 24,
  },
  bottomBar: {
    borderTopWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  quantityStepper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderWidth: 1,
  },
  quantityBtn: {
    width: 40,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityBtnText: {
    fontSize: 20,
    fontWeight: '700',
  },
  quantityDisplay: {
    minWidth: 28,
    textAlign: 'center',
    fontWeight: '700',
  },
  addToCartBtn: {
    flex: 1,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addToCartText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
