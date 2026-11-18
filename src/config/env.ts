/**
 * @file src/config/env.ts
 * Secure Configuration & Runtime Environment Variables.
 *
 * 🛡️ SECURITY POLICY:
 * This mobile application strictly interfaces with the merchant Salla Middleware Proxy.
 * NEVER store Salla API Client Secret, Access Tokens, or Webhook Secrets in this file or mobile bundle.
 */

import Constants from 'expo-constants';
import { getStoreConfigById } from '../../store-configs';
import { StoreConfig } from '@/types';

export interface AppEnvironment {
  isDev: boolean;
  appVersion: string;
  storeId: string;
  apiBaseUrl: string;
  activeStoreConfig: StoreConfig;
}

// The customer app ships one consistent storefront.
const resolvedStoreId = 'store-main';

// 2. Resolve Salla Middleware API base URL
const resolvedApiBaseUrl =
  (Constants.expoConfig?.extra?.apiUrl as string) ||
  process.env.EXPO_PUBLIC_API_URL ||
  'https://api.salla-middleware.example.com/v1';

// 3. Resolve active store configuration
const resolvedConfig = getStoreConfigById(resolvedStoreId);

export const ENV: AppEnvironment = {
  isDev: __DEV__,
  appVersion: Constants.expoConfig?.version || '1.0.0',
  storeId: resolvedStoreId,
  apiBaseUrl: resolvedApiBaseUrl.replace(/\/+$/, ''), // strip trailing slash
  activeStoreConfig: resolvedConfig,
};

/**
 * Security sanity check: verifies no sensitive credentials were accidentally leaked into bundle.
 */
if (__DEV__) {
  const sensitiveKeys = ['SECRET', 'PRIVATE_KEY', 'SALLA_CLIENT_SECRET', 'ACCESS_TOKEN'];
  const envKeys = Object.keys(process.env);
  const leaked = envKeys.filter((key) =>
    sensitiveKeys.some((s) => key.toUpperCase().includes(s))
  );

  if (leaked.length > 0) {
    console.warn(
      `⚠️ [SECURITY WARNING]: Potentially sensitive environment variables detected in bundle: ${leaked.join(
        ', '
      )}. Ensure private secrets are exclusively kept in the backend Salla Middleware proxy.`
    );
  }
}
