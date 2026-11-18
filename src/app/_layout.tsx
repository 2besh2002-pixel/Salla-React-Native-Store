/**
 * @file src/app/_layout.tsx
 * Root Layout implementing Global Providers & Navigation Stack.
 *
 * Configures:
 * 1. TanStack QueryClientProvider
 * 2. Single-store theme provider
 * 3. SafeAreaProvider
 * 4. RTL Language Layout Support
 */

import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StoreThemeProvider, useStoreTheme } from '@/theme/ThemeContext';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { LanguageProvider, useLanguage } from '@/context/LanguageContext';

// Keep splash screen visible until initial setup completes
SplashScreen.preventAutoHideAsync().catch((error: unknown) => {
  console.warn('Unable to hold the splash screen:', error);
});

// Global TanStack QueryClient with default caching strategy
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: Platform.OS === 'web',
    },
  },
});

function RootNavigationStack() {
  const { colors, isDark, storeConfig } = useStoreTheme();
  const { language, t, isLoading: isLanguageLoading } = useLanguage();
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();

  useEffect(() => {
    if (!isAuthLoading && !isLanguageLoading) {
      SplashScreen.hideAsync().catch((error: unknown) => {
        console.warn('Unable to hide the splash screen:', error);
      });
    }
  }, [isAuthLoading, isLanguageLoading]);

  if (isAuthLoading || isLanguageLoading) {
    return null;
  }

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: true,
          headerTintColor: colors.textPrimary,
          headerStyle: {
            backgroundColor: colors.surface,
          },
          headerTitleStyle: {
            fontWeight: '700',
            fontSize: 17,
            color: colors.textPrimary,
          },
          headerShadowVisible: false,
          contentStyle: {
            backgroundColor: colors.background,
            direction: language === 'ar' ? 'rtl' : 'ltr',
          },
        }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Protected guard={!isAuthenticated}>
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="register" options={{ headerShown: false }} />
        </Stack.Protected>
        <Stack.Protected guard={isAuthenticated}>
          <Stack.Screen
            name="(tabs)"
            options={{
              headerShown: false,
              title: storeConfig.name[language],
            }}
          />
          <Stack.Screen
            name="product/[id]"
            options={{
              title: t('تفاصيل المنتج'),
              headerBackTitle: t('رجوع'),
            }}
          />
          <Stack.Screen
            name="products/[categoryId]"
            options={{
              title: t('المنتجات'),
              headerBackTitle: t('رجوع'),
            }}
          />
          <Stack.Screen
            name="checkout"
            options={{
              title: t('إتمام الطلب'),
              headerBackTitle: t('السلة'),
            }}
          />
          <Stack.Screen name="cart" options={{ headerShown: false }} />
          <Stack.Screen name="categories" options={{ headerShown: false }} />
        </Stack.Protected>
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <StoreThemeProvider>
          <LanguageProvider>
            <AuthProvider>
              <RootNavigationStack />
            </AuthProvider>
          </LanguageProvider>
        </StoreThemeProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
