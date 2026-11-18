/**
 * @file src/app/(tabs)/search.tsx
 * Real-time Product Search Screen with Debounce.
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { useProducts } from '@/hooks/useProducts';
import { useStoreTheme } from '@/theme/ThemeContext';
import { useCartStore } from '@/stores/useCartStore';
import { ProductCard } from '@/components/product/ProductCard';
import { ProductCardSkeleton } from '@/components/common/LoadingSkeleton';
import { Product } from '@/types';
import { useLanguage } from '@/context/LanguageContext';

export default function SearchScreen() {
  const router = useRouter();
  const { language, isRTL, t } = useLanguage();
  const { colors, borderRadius, typography, spacing } = useStoreTheme();
  const addItemToCart = useCartStore((state) => state.addItem);

  const [inputQuery, setInputQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(inputQuery);
    }, 400);

    return () => clearTimeout(handler);
  }, [inputQuery]);

  const productsQuery = useProducts({ search: debouncedQuery });
  const products = productsQuery.data?.data || [];

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background, direction: isRTL ? 'rtl' : 'ltr' },
      ]}>
      {/* Search Input Bar */}
      <View
        style={[
          styles.searchBarContainer,
          {
            backgroundColor: colors.surface,
            borderBottomColor: colors.borderLight,
            padding: spacing.md,
          },
        ]}>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors.surfaceVariant,
              borderRadius: borderRadius.md,
              borderColor: colors.border,
              color: colors.textPrimary,
              paddingHorizontal: spacing.md,
              textAlign: language === 'ar' ? 'right' : 'left',
              writingDirection: language === 'ar' ? 'rtl' : 'ltr',
            },
          ]}
          placeholder={t('ابحث بالاسم، الوصف، أو الرمز...')}
          placeholderTextColor={colors.textMuted}
          value={inputQuery}
          onChangeText={setInputQuery}
          autoFocus={false}
        />
      </View>

      {/* Results */}
      <View style={[styles.resultsContainer, { padding: spacing.md }]}>
        {productsQuery.isLoading ? (
          <View style={styles.grid}>
            <ProductCardSkeleton />
            <ProductCardSkeleton />
          </View>
        ) : products.length === 0 ? (
          <View style={[styles.emptyView, { padding: spacing.xxl }]}>
            <Text style={{ fontSize: 36, marginBottom: 8 }}>🔍</Text>
            <Text
              style={[
                typography.scale.body,
                { color: colors.textSecondary, textAlign: 'center' },
              ]}>
              {inputQuery.trim()
                ? `${t('لا توجد نتائج مطابقة لـ')} "${inputQuery}"`
                : t('اكتب كلمة البحث لاستعراض المنتجات المتاحة.')}
            </Text>
          </View>
        ) : (
          <FlatList
            data={products}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={styles.columnWrapper}
            renderItem={({ item }) => (
              <ProductCard
                product={item}
                onPress={(prod: Product) => {
                  router.push({
                    pathname: '/product/[id]',
                    params: { id: prod.id },
                  });
                }}
                onAddToCart={(prod: Product) => {
                  addItemToCart(
                    {
                      id: prod.id,
                      name: prod.name,
                      price: prod.price,
                      regularPrice: prod.regularPrice,
                      thumbnail: prod.thumbnail,
                      maxStock: prod.stock,
                    },
                    1
                  );
                }}
              />
            )}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBarContainer: {
    borderBottomWidth: 1,
  },
  input: {
    height: 44,
    borderWidth: 1,
  },
  resultsContainer: {
    flex: 1,
  },
  grid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  emptyView: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
  },
});
