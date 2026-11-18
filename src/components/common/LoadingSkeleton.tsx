/**
 * @file src/components/common/LoadingSkeleton.tsx
 * Reusable Loading Skeleton for Cards, Lists, and Banners.
 */

import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Animated, ViewStyle } from 'react-native';
import { useStoreTheme } from '@/theme/ThemeContext';

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export function Skeleton({ width = '100%', height = 20, borderRadius: customRadius, style }: SkeletonProps) {
  const { colors, borderRadius } = useStoreTheme();
  const [opacity] = useState(() => new Animated.Value(0.3));

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.8,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();

    return () => pulse.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        {
          width: width as any,
          height,
          backgroundColor: colors.surfaceVariant,
          borderRadius: customRadius ?? borderRadius.sm,
          opacity,
        },
        style,
      ]}
    />
  );
}

export function ProductCardSkeleton() {
  const { colors, borderRadius, spacing } = useStoreTheme();

  return (
    <View
      style={[
        styles.cardSkeleton,
        {
          backgroundColor: colors.card,
          borderRadius: borderRadius.md,
          padding: spacing.sm,
          margin: spacing.xs,
        },
      ]}>
      <Skeleton height={140} borderRadius={borderRadius.sm} style={{ marginBottom: spacing.sm }} />
      <Skeleton width="80%" height={16} style={{ marginBottom: spacing.xs }} />
      <Skeleton width="40%" height={14} style={{ marginBottom: spacing.sm }} />
      <Skeleton width="60%" height={20} />
    </View>
  );
}

const styles = StyleSheet.create({
  cardSkeleton: {
    width: '47%',
    borderWidth: 1,
    borderColor: 'transparent',
  },
});
