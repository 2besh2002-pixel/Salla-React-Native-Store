/**
 * @file src/app/(tabs)/categories.tsx
 * Categories List Screen.
 */

import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useCategories } from '@/hooks/useProducts';
import { useStoreTheme } from '@/theme/ThemeContext';
import { ErrorView } from '@/components/common/ErrorView';
import { Category } from '@/types';
import { useLanguage } from '@/context/LanguageContext';

export default function CategoriesScreen() {
  const router = useRouter();
  const { isRTL, countLabel, t } = useLanguage();
  const { colors, borderRadius, typography, spacing, shadows } = useStoreTheme();
  const categoriesQuery = useCategories();

  if (categoriesQuery.isError) {
    return (
      <ErrorView
        error={categoriesQuery.error}
        onRetry={() => categoriesQuery.refetch()}
        isRetrying={categoriesQuery.isFetching}
      />
    );
  }

  const categories = categoriesQuery.data || [];

  const handleSelectCategory = (category: Category) => {
    router.push({
      pathname: '/(tabs)',
      params: { categoryId: category.id },
    });
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background, direction: isRTL ? 'rtl' : 'ltr' },
      ]}>
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.listContent, { padding: spacing.md }]}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.categoryCard,
              {
                backgroundColor: colors.card,
                borderRadius: borderRadius.md,
                borderColor: colors.borderLight,
                padding: spacing.md,
                marginBottom: spacing.sm,
                ...shadows.sm,
              },
            ]}
            onPress={() => handleSelectCategory(item)}
            activeOpacity={0.8}>
            {item.imageUrl && (
              <Image
                source={{ uri: item.imageUrl }}
                style={[styles.categoryImage, { borderRadius: borderRadius.sm }]}
              />
            )}
            <View
              style={[
                styles.textContainer,
              ]}>
              <Text
                style={[
                  typography.scale.titleSm,
                  styles.categoryName,
                  { color: colors.textPrimary },
                ]}>
                {t(item.name)}
              </Text>
              {item.productsCount !== undefined && (
                <Text
                  style={[
                    typography.scale.caption,
                    styles.productsCount,
                    { color: colors.textSecondary },
                  ]}>
                  {countLabel(item.productsCount, 'منتج متاح', 'منتجات متاحة', 'product available', 'products available')}
                </Text>
              )}
            </View>
            <Text style={[styles.arrow, { color: colors.textMuted }]}>{isRTL ? '‹' : '›'}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 40,
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    gap: 12,
  },
  categoryImage: {
    width: 60,
    height: 60,
  },
  textContainer: {
    flex: 1,
    alignItems: 'flex-start',
  },
  categoryName: {
    fontWeight: '700',
  },
  productsCount: {
    marginTop: 2,
  },
  arrow: {
    fontSize: 24,
    marginStart: 8,
  },
});
