/**
 * @file src/components/common/Badge.tsx
 * Status & Promotional Badge Component (Sale, New, Bestseller).
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useStoreTheme } from '@/theme/ThemeContext';

interface BadgeProps {
  label: string;
  variant?: 'primary' | 'sale' | 'new' | 'warning' | 'neutral';
}

export function Badge({ label, variant = 'primary' }: BadgeProps) {
  const { colors, borderRadius, typography } = useStoreTheme();

  let bg = colors.primary;
  let text = '#FFFFFF';

  if (variant === 'sale') {
    bg = colors.error;
  } else if (variant === 'new') {
    bg = colors.accent;
  } else if (variant === 'warning') {
    bg = colors.warning;
  } else if (variant === 'neutral') {
    bg = colors.surfaceVariant;
    text = colors.textPrimary;
  }

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: bg,
          borderRadius: borderRadius.pill,
        },
      ]}>
      <Text style={[typography.scale.caption, styles.text, { color: text }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignSelf: 'flex-start',
  },
  text: {
    fontWeight: '700',
    fontSize: 10,
  },
});
