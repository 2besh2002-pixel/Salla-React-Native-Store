/**
 * @file src/features/cart/CartScreen.tsx
 * Cart & Shopping Totals Screen.
 *
 * Implements item quantity adjustments, removal, live coupon discounts,
 * VAT calculation, and transition to Checkout.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useCartStore } from '@/stores/useCartStore';
import { useStoreTheme } from '@/theme/ThemeContext';
import { CartItem } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Minus, Plus, X } from 'lucide-react-native';

export function CartScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isRTL, t, countLabel } = useLanguage();
  const { colors, borderRadius, typography, spacing, shadows, storeConfig } = useStoreTheme();
  const {
    items,
    updateQuantity,
    removeItem,
    clearCart,
    applyCoupon,
    coupon,
    getTotals,
  } = useCartStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);

  const totals = getTotals(storeConfig.taxRate);

  const handleApplyCoupon = () => {
    setCouponError(null);
    const code = couponInput.trim().toUpperCase();
    if (!code) return;

    if (code === 'SALLA10' || code === 'SAVE10') {
      applyCoupon({
        code,
        discountType: 'percentage',
        discountAmount: 10,
      });
      setCouponInput('');
    } else if (code === 'VIP50') {
      applyCoupon({
        code,
        discountType: 'fixed',
        discountAmount: 50,
      });
      setCouponInput('');
    } else {
      setCouponError('auth.couponInvalid');
    }
  };

  const handleRemoveCoupon = () => {
    applyCoupon(null);
  };

  const handleProceedToCheckout = () => {
    if (items.length === 0) return;
    router.push('/checkout');
  };

  if (items.length === 0) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: colors.background }]}>
        <View
          style={[
            styles.emptyIconCircle,
            { backgroundColor: colors.surfaceVariant, borderRadius: borderRadius.xl },
          ]}>
          <Text style={styles.emptyIcon}>🛒</Text>
        </View>
        <Text
          style={[
            typography.scale.title,
            styles.emptyTitle,
            { color: colors.textPrimary, marginBottom: spacing.xs },
          ]}>
          {t('سلة المشتريات فارغة')}
        </Text>
        <Text
          style={[
            typography.scale.body,
            styles.emptySubtitle,
            { color: colors.textSecondary, marginBottom: spacing.xl },
          ]}>
          {t('تصفح تشكيلة منتجاتنا المميزة وأضف مشترياتك إلى السلة.')}
        </Text>
        <TouchableOpacity
          style={[
            styles.shopNowBtn,
            {
              backgroundColor: colors.primary,
              borderRadius: borderRadius.md,
              paddingHorizontal: spacing.xxl,
              paddingVertical: spacing.md,
            },
          ]}
          onPress={() => router.push('/')}
          activeOpacity={0.8}>
          <Text style={[typography.scale.bodySm, styles.shopNowBtnText]}>{t('تسوق الآن')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background, direction: isRTL ? 'rtl' : 'ltr' },
      ]}>
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { padding: spacing.md }]}
        showsVerticalScrollIndicator={false}>
        {/* Header summary */}
        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={() =>
              Alert.alert(t('تفريغ السلة'), t('هل أنت متأكد من حذف جميع المنتجات من السلة؟'), [
                { text: t('إلغاء'), style: 'cancel' },
                { text: t('تفريغ'), style: 'destructive', onPress: clearCart },
              ])
            }>
            <Text style={[typography.scale.caption, { color: colors.error }]}>{t('تفريغ السلة')}</Text>
          </TouchableOpacity>
          <Text style={[typography.scale.bodySm, { color: colors.textSecondary }]}>
            {countLabel(totals.itemCount, 'منتج في السلة', 'منتجات في السلة', 'item in cart', 'items in cart')}
          </Text>
        </View>

        {/* Items List */}
        <View style={styles.itemsList}>
          {items.map((item: CartItem) => (
            <View
              key={item.id}
              style={[
                styles.itemCard,
                {
                  backgroundColor: colors.card,
                  borderRadius: borderRadius.md,
                  borderColor: colors.borderLight,
                  padding: spacing.md,
                  marginBottom: spacing.sm,
                  ...shadows.sm,
                },
              ]}>
              <Image
                source={{ uri: item.thumbnail }}
                style={[styles.itemImage, { borderRadius: borderRadius.sm }]}
                resizeMode="cover"
              />

              <View style={styles.itemDetails}>
                <View style={styles.itemTopRow}>
                  <Text
                    style={[
                      typography.scale.bodySm,
                      styles.itemName,
                      { color: colors.textPrimary },
                    ]}
                    numberOfLines={2}>
                    {t(item.name)}
                  </Text>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => removeItem(item.id)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                    <X size={18} color={colors.textMuted} strokeWidth={1.8} />
                  </TouchableOpacity>
                </View>

                {item.selectedOptions && item.selectedOptions.length > 0 && (
                  <View style={styles.optionsRow}>
                    {item.selectedOptions.map((opt) => (
                      <Text
                        key={opt.optionId}
                        style={[typography.scale.caption, { color: colors.textMuted }]}>
                        {t(opt.optionName)}: {t(opt.valueName)}
                      </Text>
                    ))}
                  </View>
                )}

                <View style={styles.itemBottomRow}>
                  {/* Quantity Stepper */}
                  <View
                    style={[
                      styles.stepper,
                      {
                        backgroundColor: colors.surfaceVariant,
                        borderRadius: borderRadius.sm,
                      },
                    ]}>
                    <TouchableOpacity
                      style={styles.stepBtn}
                      onPress={() => updateQuantity(item.id, item.quantity - 1)}>
                      <Minus size={18} color={colors.textPrimary} strokeWidth={1.8} />
                    </TouchableOpacity>
                    <Text style={[typography.scale.bodySm, styles.quantityText, { color: colors.textPrimary }]}>
                      {item.quantity}
                    </Text>
                    <TouchableOpacity
                      style={styles.stepBtn}
                      onPress={() => updateQuantity(item.id, item.quantity + 1)}>
                      <Plus size={18} color={colors.textPrimary} strokeWidth={1.8} />
                    </TouchableOpacity>
                  </View>

                  {/* Price */}
                  <Text
                    style={[
                      typography.scale.body,
                      styles.itemPrice,
                      { color: colors.primary },
                    ]}>
                    {(item.price * item.quantity).toFixed(2)} {totals.currency}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Promo / Coupon Code Section */}
        {storeConfig.features.enableCouponCodes && (
          <View
            style={[
              styles.couponCard,
              {
                backgroundColor: colors.card,
                borderRadius: borderRadius.md,
                padding: spacing.md,
                marginTop: spacing.sm,
                borderColor: colors.borderLight,
                ...shadows.sm,
              },
            ]}>
            <Text
              style={[
                typography.scale.bodySm,
                styles.sectionTitle,
                { color: colors.textPrimary, marginBottom: spacing.xs },
              ]}>
              {t('كوبون الخصم')}
            </Text>

            {coupon ? (
              <View
                style={[
                  styles.appliedCouponRow,
                  {
                    backgroundColor: colors.surfaceVariant,
                    borderRadius: borderRadius.sm,
                    padding: spacing.sm,
                  },
                ]}>
                <TouchableOpacity onPress={handleRemoveCoupon}>
                  <Text style={[typography.scale.caption, { color: colors.error, fontWeight: '700' }]}>
                    {t('إزالة')}
                  </Text>
                </TouchableOpacity>
                <View style={styles.appliedCouponInfo}>
                  <Text style={[typography.scale.bodySm, { color: colors.success, fontWeight: '700' }]}>
                    {t('تم تطبيق الكوبون')} ({coupon.code})
                  </Text>
                  <Text style={[typography.scale.caption, { color: colors.textSecondary }]}>
                    {t('الخصم')} {coupon.discountType === 'percentage' ? `${coupon.discountAmount}%` : `${coupon.discountAmount} ${totals.currency}`}
                  </Text>
                </View>
              </View>
            ) : (
              <View style={styles.couponInputRow}>
                <TextInput
                  style={[
                    styles.couponInput,
                    {
                      borderColor: colors.border,
                      borderRadius: borderRadius.sm,
                      color: colors.textPrimary,
                      textAlign: 'left',
                      writingDirection: 'ltr',
                      paddingHorizontal: spacing.md,
                    },
                  ]}
                  placeholder={t('أدخل رمز الكوبون (مثال: SALLA10)')}
                  placeholderTextColor={colors.textMuted}
                  value={couponInput}
                  onChangeText={setCouponInput}
                  autoCapitalize="characters"
                />
                <TouchableOpacity
                  style={[
                    styles.applyCouponBtn,
                    {
                      backgroundColor: colors.primary,
                      borderRadius: borderRadius.sm,
                      paddingHorizontal: spacing.md,
                    },
                  ]}
                  onPress={handleApplyCoupon}>
                  <Text style={styles.applyCouponBtnText}>{t('تطبيق')}</Text>
                </TouchableOpacity>
              </View>
            )}

            {couponError && (
              <Text
                style={[
                  typography.scale.caption,
                  {
                    color: colors.error,
                    marginTop: spacing.xs,
                    textAlign: 'left',
                  },
                ]}>
                {t(couponError)}
              </Text>
            )}
          </View>
        )}

        {/* Order Totals Summary Card */}
        <View
          style={[
            styles.summaryCard,
            {
              backgroundColor: colors.card,
              borderRadius: borderRadius.md,
              padding: spacing.lg,
              marginTop: spacing.md,
              marginBottom: spacing.xxl,
              borderColor: colors.borderLight,
              ...shadows.sm,
            },
          ]}>
          <Text
            style={[
              typography.scale.titleSm,
              styles.sectionTitle,
              { color: colors.textPrimary, marginBottom: spacing.md },
            ]}>
            {t('تفاصيل الفاتورة')}
          </Text>

          <View style={styles.summaryRow}>
            <Text style={[typography.scale.body, { color: colors.textSecondary }]}>
              {t('المجموع الفرعي')}
            </Text>
            <Text style={[typography.scale.body, { color: colors.textPrimary }]}>
              {totals.subtotal.toFixed(2)} {totals.currency}
            </Text>
          </View>

          {totals.discount > 0 && (
            <View style={styles.summaryRow}>
              <Text style={[typography.scale.body, { color: colors.success }]}>{t('خصم الكوبون')}</Text>
              <Text style={[typography.scale.body, { color: colors.success, fontWeight: '700' }]}>
                -{totals.discount.toFixed(2)} {totals.currency}
              </Text>
            </View>
          )}

          <View style={styles.summaryRow}>
            <Text style={[typography.scale.body, { color: colors.textSecondary }]}>
              {t('ضريبة القيمة المضافة')} ({storeConfig.taxRate * 100}%)
            </Text>
            <Text style={[typography.scale.body, { color: colors.textPrimary }]}>
              {totals.tax.toFixed(2)} {totals.currency}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={[typography.scale.body, { color: colors.textSecondary }]}>
              {t('رسوم الشحن والتوصيل')}
            </Text>
            <Text style={[typography.scale.body, { color: colors.textPrimary }]}>
              {totals.shipping > 0 ? `${totals.shipping.toFixed(2)} ${totals.currency}` : t('يحدد عند إتمام الطلب')}
            </Text>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.borderLight }]} />

          <View style={styles.grandTotalRow}>
            <Text style={[typography.scale.titleSm, { color: colors.textPrimary }]}>
              {t('الإجمالي الكلي')}
            </Text>
            <Text style={[typography.scale.title, { color: colors.primary }]}>
              {totals.grandTotal.toFixed(2)} {totals.currency}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Bottom Action Bar */}
      <View
        style={[
          styles.bottomBar,
          {
            backgroundColor: colors.surface,
            borderTopColor: colors.borderLight,
            padding: spacing.md,
            paddingBottom: Math.max(spacing.md, insets.bottom),
            ...shadows.md,
          },
        ]}>
        <TouchableOpacity
          style={[
            styles.checkoutBtn,
            {
              backgroundColor: colors.primary,
              borderRadius: borderRadius.md,
              paddingVertical: spacing.md,
            },
          ]}
          onPress={handleProceedToCheckout}
          activeOpacity={0.85}>
          <Text style={[typography.scale.bodyLg, styles.checkoutBtnText]}>
            {t('متابعة إتمام الطلب')} ({totals.grandTotal.toFixed(2)} {totals.currency})
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
  scrollContent: {
    paddingBottom: 40,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    direction: 'ltr',
    marginBottom: 12,
  },
  itemsList: {
    width: '100%',
  },
  itemCard: {
    flexDirection: 'row',
    direction: 'ltr',
    borderWidth: 1,
  },
  itemImage: {
    width: 80,
    height: 80,
  },
  itemDetails: {
    flex: 1,
    marginStart: 12,
    justifyContent: 'space-between',
  },
  itemTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    direction: 'ltr',
  },
  itemName: {
    flex: 1,
    fontWeight: '600',
    textAlign: 'left',
  },
  deleteText: {
    fontSize: 14,
    paddingEnd: 8,
  },
  deleteButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 2,
  },
  itemBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    direction: 'ltr',
    marginTop: 8,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 36,
  },
  stepBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepText: {
    fontSize: 16,
    fontWeight: '600',
  },
  quantityText: {
    minWidth: 24,
    textAlign: 'center',
    fontWeight: '700',
  },
  itemPrice: {
    fontWeight: '700',
  },
  couponCard: {
    borderWidth: 1,
  },
  sectionTitle: {
    fontWeight: '700',
    textAlign: 'auto',
  },
  couponInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    direction: 'ltr',
    gap: 8,
  },
  couponInput: {
    flex: 1,
    height: 42,
    borderWidth: 1,
    textAlign: 'auto',
  },
  applyCouponBtn: {
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyCouponBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  appliedCouponRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  appliedCouponInfo: {
    alignItems: 'flex-start',
  },
  summaryCard: {
    borderWidth: 1,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    direction: 'ltr',
    marginBottom: 8,
  },
  divider: {
    height: 1,
    marginVertical: 12,
  },
  grandTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    direction: 'ltr',
    alignItems: 'center',
  },
  bottomBar: {
    borderTopWidth: 1,
  },
  checkoutBtn: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkoutBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyIconCircle: {
    width: 90,
    height: 90,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyIcon: {
    fontSize: 44,
  },
  emptyTitle: {
    textAlign: 'center',
  },
  emptySubtitle: {
    textAlign: 'center',
    maxWidth: 280,
  },
  shopNowBtn: {
    minWidth: 160,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shopNowBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
