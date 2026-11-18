import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useLanguage, AppLanguage } from '@/context/LanguageContext';
import { useStoreTheme } from '@/theme/ThemeContext';

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  const { colors, borderRadius } = useStoreTheme();

  return (
    <View
      accessibilityRole="radiogroup"
      style={[
        styles.container,
        { backgroundColor: colors.surfaceVariant, borderRadius: borderRadius.pill },
      ]}>
      {(['en', 'ar'] as const).map((option: AppLanguage) => {
        const selected = language === option;
        const label = option.toUpperCase();

        return (
          <TouchableOpacity
            key={option}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
            onPress={() => setLanguage(option)}
            style={[
              styles.option,
              selected && { backgroundColor: colors.primary, borderRadius: borderRadius.pill },
            ]}>
            <Text style={[styles.label, { color: selected ? '#FFFFFF' : colors.textSecondary }]}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    padding: 3,
    gap: 2,
  },
  option: {
    minWidth: 76,
    minHeight: 36,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
  },
});
