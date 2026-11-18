/**
 * @file src/theme/ThemeContext.tsx
 * Single-store Theme Provider & Consumer Hook.
 *
 * Provides the configured storefront's design tokens and color palette.
 */

import React, { createContext, useContext, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { StoreConfig, ThemeColors } from '@/types';
import { ENV } from '@/config/env';
import { getStoreConfigById } from '../../store-configs';
import { SPACING, TYPOGRAPHY, SHADOWS } from './tokens';

export interface ThemeContextValue {
  storeConfig: StoreConfig;
  colors: ThemeColors;
  isDark: boolean;
  spacing: typeof SPACING;
  typography: typeof TYPOGRAPHY;
  shadows: typeof SHADOWS;
  borderRadius: StoreConfig['theme']['borderRadius'];
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function StoreThemeProvider({ children }: React.PropsWithChildren) {
  const systemColorScheme = useColorScheme();
  const storeConfig = useMemo(
    () => getStoreConfigById(ENV.storeId),
    []
  );

  const isDark = systemColorScheme === 'dark';

  const colors = useMemo(() => {
    return isDark ? storeConfig.theme.colors.dark : storeConfig.theme.colors.light;
  }, [isDark, storeConfig]);

  const value = useMemo<ThemeContextValue>(() => {
    return {
      storeConfig,
      colors,
      isDark,
      spacing: SPACING,
      typography: TYPOGRAPHY,
      shadows: SHADOWS,
      borderRadius: storeConfig.theme.borderRadius,
    };
  }, [storeConfig, colors, isDark]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useStoreTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useStoreTheme must be used within a StoreThemeProvider');
  }
  return context;
}
