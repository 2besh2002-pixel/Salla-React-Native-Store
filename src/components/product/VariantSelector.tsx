/**
 * @file src/components/product/VariantSelector.tsx
 * Dynamic Product Options & Variant Selector.
 *
 * Handles selection of attributes (e.g. Size, Weight, Color, Grind) with price delta feedback.
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ProductOption, ProductOptionValue } from '@/types';
import { useStoreTheme } from '@/theme/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';

interface VariantSelectorProps {
  options: ProductOption[];
  selectedValues: Record<string, string>; // { [optionName]: valueName }
  onSelectOption: (optionName: string, value: ProductOptionValue) => void;
}

export function VariantSelector({
  options,
  selectedValues,
  onSelectOption,
}: VariantSelectorProps) {
  const { colors, borderRadius, typography, spacing } = useStoreTheme();
  const { isRTL, language, t } = useLanguage();

  if (!options || options.length === 0) return null;

  return (
    <View style={[styles.container, { direction: isRTL ? 'rtl' : 'ltr' }]}>
      {options.map((option) => (
        <View key={option.id} style={[styles.optionGroup, { marginBottom: spacing.md }]}>
          <Text
            style={[
              typography.scale.bodySm,
              styles.optionTitle,
              {
                color: colors.textPrimary,
                marginBottom: spacing.xs,
                textAlign: language === 'ar' ? 'right' : 'left',
              },
            ]}>
            {t(option.name)}:{' '}
            <Text style={{ color: colors.textSecondary }}>
              {t(selectedValues[option.name] || 'اختر...')}
            </Text>
          </Text>

          <View style={styles.valuesList}>
            {option.values.map((val) => {
              const isSelected = selectedValues[option.name] === val.name;

              return (
                <TouchableOpacity
                  key={val.id}
                  style={[
                    styles.valuePill,
                    {
                      borderRadius: borderRadius.md,
                      borderColor: isSelected ? colors.primary : colors.border,
                      backgroundColor: isSelected ? colors.primaryLight : colors.surface,
                      paddingHorizontal: spacing.md,
                      paddingVertical: spacing.sm,
                    },
                    !val.available && styles.disabledPill,
                  ]}
                  onPress={() => onSelectOption(option.name, val)}
                  disabled={!val.available}
                  activeOpacity={0.7}>
                  <Text
                    style={[
                      typography.scale.caption,
                      {
                        color: isSelected
                          ? colors.primary
                          : val.available
                          ? colors.textPrimary
                          : colors.textMuted,
                        fontWeight: isSelected ? '700' : '500',
                      },
                    ]}>
                    {t(val.name)}
                  </Text>
                  {Boolean(val.priceDelta) && (
                    <Text
                      style={[
                        typography.scale.caption,
                        { color: colors.textMuted, fontSize: 9, marginTop: 2 },
                      ]}>
                      +{val.priceDelta}
                    </Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  optionGroup: {
    width: '100%',
  },
  optionTitle: {
    fontWeight: '700',
    textAlign: 'auto',
  },
  valuesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  valuePill: {
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledPill: {
    opacity: 0.4,
  },
});
