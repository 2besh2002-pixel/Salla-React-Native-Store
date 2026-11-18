/**
 * @file src/components/common/ErrorView.tsx
 * User-Friendly Error, Offline, and Empty State Component with Retry Action.
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useStoreTheme } from '@/theme/ThemeContext';
import { SallaApiError } from '@/types';
import { useLanguage } from '@/context/LanguageContext';

interface ErrorViewProps {
  error?: Error | SallaApiError | string | null;
  title?: string;
  message?: string;
  onRetry?: () => void;
  isRetrying?: boolean;
}

export function ErrorView({
  error,
  title,
  message,
  onRetry,
  isRetrying = false,
}: ErrorViewProps) {
  const { colors, borderRadius, typography, spacing } = useStoreTheme();
  const { t } = useLanguage();

  // Determine user-friendly title and description
  let displayTitle = t(title || 'عذراً، حدث خطأ غير متوقع');
  let displayMessage =
    (message ? t(message) : undefined) ||
    (typeof error === 'string'
      ? t(error)
      : t((error as SallaApiError)?.message || '') ||
        t('لم نتمكن من إتمام طلبك في الوقت الحالي. يرجى التحقق من اتصالك بالإنترنت والمحاولة مجدداً.'));

  return (
    <View style={[styles.container, { padding: spacing.xxl }]}>
      <View
        style={[
          styles.iconContainer,
          {
            backgroundColor: colors.surfaceVariant,
            borderRadius: borderRadius.xl,
            marginBottom: spacing.lg,
          },
        ]}>
        <Text style={styles.errorEmoji}>⚠️</Text>
      </View>

      <Text
        style={[
          typography.scale.title,
          styles.title,
          { color: colors.textPrimary, marginBottom: spacing.sm },
        ]}>
        {displayTitle}
      </Text>

      <Text
        style={[
          typography.scale.body,
          styles.message,
          { color: colors.textSecondary, marginBottom: spacing.xl },
        ]}>
        {displayMessage}
      </Text>

      {onRetry && (
        <TouchableOpacity
          style={[
            styles.retryButton,
            {
              backgroundColor: colors.primary,
              borderRadius: borderRadius.md,
              paddingHorizontal: spacing.xl,
              paddingVertical: spacing.md,
            },
          ]}
          onPress={onRetry}
          disabled={isRetrying}
          activeOpacity={0.8}>
          {isRetrying ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text style={[typography.scale.bodySm, styles.retryText]}>{t('إعادة المحاولة')}</Text>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  iconContainer: {
    width: 72,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorEmoji: {
    fontSize: 32,
  },
  title: {
    textAlign: 'center',
  },
  message: {
    textAlign: 'center',
    maxWidth: 320,
  },
  retryButton: {
    minWidth: 140,
    alignItems: 'center',
    justifyContent: 'center',
  },
  retryText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
