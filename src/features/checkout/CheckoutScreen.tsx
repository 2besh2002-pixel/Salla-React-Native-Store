/**
 * @file src/features/checkout/CheckoutScreen.tsx
 * Multi-Step Checkout Flow for Salla Middleware Integration.
 *
 * Handles customer delivery address, shipping provider selection, payment method,
 * and order submission adhering strictly to backend contracts.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useStoreTheme } from '@/theme/ThemeContext';
import { useCartStore } from '@/stores/useCartStore';
import { useCreateOrder } from '@/hooks/useProducts';
import { CustomerAddress, PaymentMethodType, ShippingMethod } from '@/types';
import { useLanguage } from '@/context/LanguageContext';

const SHIPPING_METHODS: ShippingMethod[] = [
  {
    id: 'ship-aramex',
    name: 'أرامكس - شحن سريع للمنزل',
    provider: 'Aramex',
    cost: 28,
    estimatedDelivery: 'خلال 2-3 أيام عمل',
  },
  {
    id: 'ship-smsa',
    name: 'سمسا إكسبريس',
    provider: 'SMSA Express',
    cost: 25,
    estimatedDelivery: 'خلال 1-2 أيام عمل',
  },
  {
    id: 'ship-spl',
    name: 'سبل - البريد السعودي',
    provider: 'SPL',
    cost: 19,
    estimatedDelivery: 'خلال 3-5 أيام عمل',
  },
];

interface PaymentOption {
  type: PaymentMethodType;
  title: string;
  badge?: string;
  icon: string;
}

const PAYMENT_OPTIONS: PaymentOption[] = [
  { type: 'mada', title: 'بطاقة مدى البنكية', badge: 'الأكثر أماناً', icon: '💳' },
  { type: 'apple_pay', title: 'Apple Pay', badge: 'دفع سريع', icon: '🍏' },
  { type: 'credit_card', title: 'البطاقة الائتمانية (Visa / Mastercard)', icon: '💳' },
  { type: 'tamara', title: 'تمارا - قسمها على 4 دفعات بدون فوائد', icon: '✨' },
  { type: 'cod', title: 'الدفع عند الاستلام', badge: 'payment.codFee', icon: '💵' },
];

export function CheckoutScreen() {
  const router = useRouter();
  const { language, isRTL, t, countLabel } = useLanguage();
  const { colors, borderRadius, typography, spacing, shadows, storeConfig } = useStoreTheme();
  const { items, clearCart, coupon, setShippingCost, getTotals } = useCartStore();
  const createOrderMutation = useCreateOrder();

  // Checkout State
  const [address, setAddress] = useState<CustomerAddress>({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    country: language === 'ar' ? 'المملكة العربية السعودية' : 'Saudi Arabia',
    city: language === 'ar' ? 'الرياض' : 'Riyadh',
    street: '',
    buildingNumber: '',
    notes: '',
  });

  const [selectedShippingId, setSelectedShippingId] = useState<string>(SHIPPING_METHODS[0].id);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethodType>('mada');
  const [orderSuccessId, setOrderSuccessId] = useState<string | null>(null);

  // Sync shipping cost with cart store
  const activeShipping =
    SHIPPING_METHODS.find((s) => s.id === selectedShippingId) || SHIPPING_METHODS[0];

  React.useEffect(() => {
    setShippingCost(activeShipping.cost);
  }, [activeShipping, setShippingCost]);

  const totals = getTotals(storeConfig.taxRate);
  const shippingCountry =
    address.country === 'المملكة العربية السعودية' || address.country === 'Saudi Arabia'
      ? t('المملكة العربية السعودية')
      : address.country;
  const shippingCity =
    address.city === 'الرياض' || address.city === 'Riyadh'
      ? t('الرياض')
      : address.city;

  const handleSubmitOrder = async () => {
    // Validation
    if (!address.firstName.trim() || !address.phone.trim() || !address.street.trim()) {
      Alert.alert(t('بيانات غير مكتملة'), t('يرجى إدخال الاسم، رقم الجوال، وعنوان التوصيل للمتابعة.'));
      return;
    }

    try {
      const response = await createOrderMutation.mutateAsync({
        storeId: storeConfig.storeId,
        items: items.map((i) => ({
          productId: i.productId,
          variantId: i.variantId,
          quantity: i.quantity,
          price: i.price,
        })),
        shippingAddress: {
          ...address,
          country: shippingCountry,
          city: shippingCity,
        },
        shippingMethodId: selectedShippingId,
        paymentMethodType: selectedPayment,
        couponCode: coupon?.code,
        customerNotes: address.notes,
      });

      setOrderSuccessId(response.orderNumber || response.orderId);
      clearCart();
    } catch {
      Alert.alert(t('خطأ في إتمام الطلب'), t('تعذر إتمام طلبك في الوقت الحالي. يرجى إعادة المحاولة.'));
    }
  };

  if (orderSuccessId) {
    return (
      <View style={[styles.successContainer, { backgroundColor: colors.background, padding: spacing.xxl }]}>
        <View
          style={[
            styles.successCircle,
            { backgroundColor: colors.primaryLight, borderRadius: borderRadius.xl, marginBottom: spacing.lg },
          ]}>
          <Text style={styles.successIcon}>🎉</Text>
        </View>

        <Text
          style={[
            typography.scale.headline,
            styles.successTitle,
            { color: colors.textPrimary, marginBottom: spacing.xs },
          ]}>
          {t('تم استلام طلبك بنجاح!')}
        </Text>

        <Text
          style={[
            typography.scale.body,
            styles.successSubtitle,
            { color: colors.textSecondary, marginBottom: spacing.lg },
          ]}>
          {t('شكراً لتسوقك من')} {storeConfig.name[language]}. {t('رقم طلبك هو:')}
        </Text>

        <View
          style={[
            styles.orderNumberBox,
            {
              backgroundColor: colors.surfaceVariant,
              borderRadius: borderRadius.md,
              borderColor: colors.border,
              padding: spacing.md,
              marginBottom: spacing.xl,
            },
          ]}>
          <Text style={[typography.scale.title, { color: colors.primary }]}>{orderSuccessId}</Text>
        </View>

        <TouchableOpacity
          style={[
            styles.homeBtn,
            {
              backgroundColor: colors.primary,
              borderRadius: borderRadius.md,
              paddingVertical: spacing.md,
              paddingHorizontal: spacing.xxl,
            },
          ]}
          onPress={() => router.replace('/')}
          activeOpacity={0.85}>
          <Text style={[typography.scale.bodyLg, styles.homeBtnText]}>{t('العودة للرئيسية')}</Text>
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
        {/* Step 1: Customer & Delivery Address */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.card,
              borderRadius: borderRadius.md,
              borderColor: colors.borderLight,
              padding: spacing.lg,
              marginBottom: spacing.md,
              ...shadows.sm,
            },
          ]}>
          <Text
            style={[
              typography.scale.titleSm,
              styles.sectionTitle,
              { color: colors.textPrimary, marginBottom: spacing.md },
            ]}>
            {t('📍 عنوان التوصيل')}
          </Text>

          <View style={styles.formRow}>
            <TextInput
              style={[
                styles.inputHalf,
                {
                  borderColor: colors.border,
                  borderRadius: borderRadius.sm,
                  color: colors.textPrimary,
                  textAlign: language === 'ar' ? 'right' : 'left',
                  writingDirection: language === 'ar' ? 'rtl' : 'ltr',
                },
              ]}
              placeholder={t('الاسم الأول *')}
              placeholderTextColor={colors.textMuted}
              value={address.firstName}
              onChangeText={(text) => setAddress((prev) => ({ ...prev, firstName: text }))}
            />
            <TextInput
              style={[
                styles.inputHalf,
                {
                  borderColor: colors.border,
                  borderRadius: borderRadius.sm,
                  color: colors.textPrimary,
                  textAlign: language === 'ar' ? 'right' : 'left',
                  writingDirection: language === 'ar' ? 'rtl' : 'ltr',
                },
              ]}
              placeholder={t('اسم العائلة')}
              placeholderTextColor={colors.textMuted}
              value={address.lastName}
              onChangeText={(text) => setAddress((prev) => ({ ...prev, lastName: text }))}
            />
          </View>

          <TextInput
            style={[
              styles.inputFull,
              {
                borderColor: colors.border,
                borderRadius: borderRadius.sm,
                color: colors.textPrimary,
                textAlign: language === 'ar' ? 'right' : 'left',
                writingDirection: language === 'ar' ? 'rtl' : 'ltr',
                marginTop: spacing.sm,
              },
            ]}
            placeholder={t('رقم الجوال (05xxxxxxxx) *')}
            placeholderTextColor={colors.textMuted}
            keyboardType="phone-pad"
            value={address.phone}
            onChangeText={(text) => setAddress((prev) => ({ ...prev, phone: text }))}
          />

          <View
            style={[
              styles.formRow,
              { marginTop: spacing.sm },
            ]}>
            <TextInput
              style={[
                styles.inputHalf,
                {
                  borderColor: colors.border,
                  borderRadius: borderRadius.sm,
                  color: colors.textPrimary,
                  textAlign: language === 'ar' ? 'right' : 'left',
                  writingDirection: language === 'ar' ? 'rtl' : 'ltr',
                },
              ]}
              placeholder={t('المدينة *')}
              placeholderTextColor={colors.textMuted}
              value={shippingCity}
              onChangeText={(text) => setAddress((prev) => ({ ...prev, city: text }))}
            />
            <TextInput
              style={[
                styles.inputHalf,
                {
                  borderColor: colors.border,
                  borderRadius: borderRadius.sm,
                  color: colors.textPrimary,
                  textAlign: language === 'ar' ? 'right' : 'left',
                  writingDirection: language === 'ar' ? 'rtl' : 'ltr',
                },
              ]}
              placeholder={t('الحي والشارع *')}
              placeholderTextColor={colors.textMuted}
              value={address.street}
              onChangeText={(text) => setAddress((prev) => ({ ...prev, street: text }))}
            />
          </View>

          <TextInput
            style={[
              styles.inputFull,
              {
                borderColor: colors.border,
                borderRadius: borderRadius.sm,
                color: colors.textPrimary,
                textAlign: language === 'ar' ? 'right' : 'left',
                writingDirection: language === 'ar' ? 'rtl' : 'ltr',
                marginTop: spacing.sm,
              },
            ]}
            placeholder={t('ملاحظات إضافية للتوصيل (اختياري)')}
            placeholderTextColor={colors.textMuted}
            value={address.notes}
            onChangeText={(text) => setAddress((prev) => ({ ...prev, notes: text }))}
          />
        </View>

        {/* Step 2: Shipping Method */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.card,
              borderRadius: borderRadius.md,
              borderColor: colors.borderLight,
              padding: spacing.lg,
              marginBottom: spacing.md,
              ...shadows.sm,
            },
          ]}>
          <Text
            style={[
              typography.scale.titleSm,
              styles.sectionTitle,
              { color: colors.textPrimary, marginBottom: spacing.md },
            ]}>
            {t('🚚 طريقة الشحن')}
          </Text>

          {SHIPPING_METHODS.map((method) => {
            const isSelected = selectedShippingId === method.id;

            return (
              <TouchableOpacity
                key={method.id}
                style={[
                  styles.selectableRow,
                  {
                    borderColor: isSelected ? colors.primary : colors.borderLight,
                    backgroundColor: isSelected ? colors.primaryLight : colors.surface,
                    borderRadius: borderRadius.sm,
                    padding: spacing.md,
                    marginBottom: spacing.sm,
                  },
                ]}
                onPress={() => setSelectedShippingId(method.id)}
                activeOpacity={0.8}>
                <View style={styles.radioContainer}>
                  <View
                    style={[
                      styles.radioCircle,
                      {
                        borderColor: isSelected ? colors.primary : colors.textMuted,
                      },
                    ]}>
                    {isSelected && (
                      <View
                        style={[
                          styles.radioInner,
                          { backgroundColor: colors.primary },
                        ]}
                      />
                    )}
                  </View>
                </View>

                <View style={styles.selectableInfo}>
                  <Text
                    style={[
                      typography.scale.bodySm,
                      { color: colors.textPrimary, fontWeight: isSelected ? '700' : '600' },
                    ]}>
                    {t(method.name)}
                  </Text>
                  <Text style={[typography.scale.caption, { color: colors.textSecondary }]}>
                    {t(method.estimatedDelivery)}
                  </Text>
                </View>

                <Text
                  style={[
                    typography.scale.bodySm,
                    { color: colors.primary, fontWeight: '700' },
                  ]}>
                  {method.cost} {totals.currency}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Step 3: Payment Method */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.card,
              borderRadius: borderRadius.md,
              borderColor: colors.borderLight,
              padding: spacing.lg,
              marginBottom: spacing.md,
              ...shadows.sm,
            },
          ]}>
          <Text
            style={[
              typography.scale.titleSm,
              styles.sectionTitle,
              { color: colors.textPrimary, marginBottom: spacing.md },
            ]}>
            {t('💳 وسيلة الدفع')}
          </Text>

          {PAYMENT_OPTIONS.map((payment) => {
            const isSelected = selectedPayment === payment.type;

            return (
              <TouchableOpacity
                key={payment.type}
                style={[
                  styles.selectableRow,
                  {
                    borderColor: isSelected ? colors.primary : colors.borderLight,
                    backgroundColor: isSelected ? colors.primaryLight : colors.surface,
                    borderRadius: borderRadius.sm,
                    padding: spacing.md,
                    marginBottom: spacing.sm,
                  },
                ]}
                onPress={() => setSelectedPayment(payment.type)}
                activeOpacity={0.8}>
                <View style={styles.radioContainer}>
                  <View
                    style={[
                      styles.radioCircle,
                      {
                        borderColor: isSelected ? colors.primary : colors.textMuted,
                      },
                    ]}>
                    {isSelected && (
                      <View
                        style={[
                          styles.radioInner,
                          { backgroundColor: colors.primary },
                        ]}
                      />
                    )}
                  </View>
                </View>

                <View style={styles.selectableInfo}>
                  <View style={styles.paymentTitleRow}>
                    <Text style={styles.paymentIcon}>{payment.icon}</Text>
                    <Text
                      style={[
                        typography.scale.bodySm,
                        { color: colors.textPrimary, fontWeight: isSelected ? '700' : '600' },
                      ]}>
                      {t(payment.title)}
                    </Text>
                  </View>
                </View>

                {payment.badge && (
                  <Text
                    style={[
                      typography.scale.caption,
                      {
                        color: colors.primary,
                        fontWeight: '700',
                        backgroundColor: colors.surfaceVariant,
                        paddingHorizontal: 6,
                        paddingVertical: 2,
                        borderRadius: 4,
                      },
                    ]}>
                    {t(payment.badge)}
                  </Text>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Order Review Totals */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.card,
              borderRadius: borderRadius.md,
              borderColor: colors.borderLight,
              padding: spacing.lg,
              marginBottom: spacing.xxl,
              ...shadows.sm,
            },
          ]}>
          <Text
            style={[
              typography.scale.titleSm,
              styles.sectionTitle,
              { color: colors.textPrimary, marginBottom: spacing.md },
            ]}>
            {t('موجز الطلب')}
          </Text>

          <View style={styles.summaryLine}>
            <Text style={[typography.scale.body, { color: colors.textPrimary }]}>
              {totals.subtotal.toFixed(2)} {totals.currency}
            </Text>
            <Text style={[typography.scale.body, { color: colors.textSecondary }]}>
              {t('المجموع')} ({countLabel(totals.itemCount, 'منتج', 'منتجات', 'product', 'products')})
            </Text>
          </View>

          {totals.discount > 0 && (
            <View style={styles.summaryLine}>
              <Text style={[typography.scale.body, { color: colors.success, fontWeight: '700' }]}>
                -{totals.discount.toFixed(2)} {totals.currency}
              </Text>
              <Text style={[typography.scale.body, { color: colors.success }]}>{t('الخصم')}</Text>
            </View>
          )}

          <View style={styles.summaryLine}>
            <Text style={[typography.scale.body, { color: colors.textPrimary }]}>
              {totals.shipping.toFixed(2)} {totals.currency}
            </Text>
            <Text style={[typography.scale.body, { color: colors.textSecondary }]}>{t('الشحن')}</Text>
          </View>

          <View style={styles.summaryLine}>
            <Text style={[typography.scale.body, { color: colors.textPrimary }]}>
              {totals.tax.toFixed(2)} {totals.currency}
            </Text>
            <Text style={[typography.scale.body, { color: colors.textSecondary }]}>
              {t('ضريبة القيمة المضافة')} ({storeConfig.taxRate * 100}%)
            </Text>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.borderLight }]} />

          <View style={styles.summaryLine}>
            <Text style={[typography.scale.title, { color: colors.primary }]}>
              {totals.grandTotal.toFixed(2)} {totals.currency}
            </Text>
            <Text style={[typography.scale.titleSm, { color: colors.textPrimary }]}>
              {t('الإجمالي للدفع')}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Submit Button */}
      <View
        style={[
          styles.bottomBar,
          {
            backgroundColor: colors.surface,
            borderTopColor: colors.borderLight,
            padding: spacing.md,
            ...shadows.md,
          },
        ]}>
        <TouchableOpacity
          style={[
            styles.submitBtn,
            {
              backgroundColor: colors.primary,
              borderRadius: borderRadius.md,
              paddingVertical: spacing.md,
            },
          ]}
          onPress={handleSubmitOrder}
          disabled={createOrderMutation.isPending}
          activeOpacity={0.85}>
          {createOrderMutation.isPending ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={[typography.scale.bodyLg, styles.submitBtnText]}>
              {t('تأكيد وإتمام الطلب')} ({totals.grandTotal.toFixed(2)} {totals.currency})
            </Text>
          )}
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
  card: {
    borderWidth: 1,
  },
  sectionTitle: {
    fontWeight: '700',
    textAlign: 'auto',
  },
  formRow: {
    flexDirection: 'row',
    gap: 8,
  },
  inputHalf: {
    flex: 1,
    height: 44,
    borderWidth: 1,
    paddingHorizontal: 12,
    textAlign: 'auto',
    writingDirection: 'auto',
  },
  inputFull: {
    width: '100%',
    height: 44,
    borderWidth: 1,
    paddingHorizontal: 12,
    textAlign: 'auto',
    writingDirection: 'auto',
  },
  selectableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.5,
  },
  radioContainer: {
    marginEnd: 10,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  selectableInfo: {
    flex: 1,
    alignItems: 'flex-start',
  },
  paymentTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  paymentIcon: {
    fontSize: 16,
  },
  summaryLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  divider: {
    height: 1,
    marginVertical: 12,
  },
  bottomBar: {
    borderTopWidth: 1,
  },
  submitBtn: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  successContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successCircle: {
    width: 90,
    height: 90,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successIcon: {
    fontSize: 44,
  },
  successTitle: {
    textAlign: 'center',
  },
  successSubtitle: {
    textAlign: 'center',
    maxWidth: 300,
  },
  orderNumberBox: {
    borderWidth: 1,
    paddingHorizontal: 24,
  },
  homeBtn: {
    minWidth: 180,
    alignItems: 'center',
  },
  homeBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
