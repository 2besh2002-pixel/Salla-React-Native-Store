/**
 * @file src/api/client.ts
 * Salla Middleware API Client with Store ID and Error Interceptors.
 *
 * 🛡️ ARCHITECTURE RULE:
 * This client communicates ONLY with the secure Salla Middleware Proxy.
 * All merchant credentials, secret keys, and webhook signing keys remain securely on the server.
 */

import { create, AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { ENV } from '@/config/env';
import { SallaApiError } from '@/types';

/**
 * Creates or configures the Axios instance for communicating with Salla Middleware.
 */
export function createApiClient(storeId: string = ENV.storeId): AxiosInstance {
  const instance = create({
    baseURL: ENV.apiBaseUrl,
    timeout: 15000,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-Store-ID': storeId,
      'X-App-Version': ENV.appVersion,
      'X-Platform': 'react-native-expo',
    },
  });

  // Request Interceptor: Ensure the current store ID is always attached.
  instance.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      if (!config.headers['X-Store-ID']) {
        config.headers['X-Store-ID'] = storeId;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response Interceptor: Format errors and handle global status codes
  instance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const normalizedError: SallaApiError = {
        statusCode: error.response?.status || 0,
        errorCode: 'UNKNOWN_ERROR',
        message: 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.',
      };

      if (!error.response) {
        // Network timeout / offline
        normalizedError.errorCode = 'NETWORK_OFFLINE';
        normalizedError.message = 'تعذر الاتصال بالخادم. يرجى التحقق من اتصالك بالإنترنت.';
        return Promise.reject(normalizedError);
      }

      const status = error.response.status;
      const responseData = error.response.data as any;

      if (status === 401) {
        normalizedError.errorCode = 'UNAUTHORIZED';
        normalizedError.message = 'انتهت صلاحية الجلسة، يرجى تسجيل الدخول مجدداً.';
      } else if (status === 403) {
        normalizedError.errorCode = 'FORBIDDEN';
        normalizedError.message = 'غير مصرح بالوصول لهذا المتجر أو الخدمة حالياً.';
      } else if (status === 429) {
        normalizedError.errorCode = 'RATE_LIMITED';
        normalizedError.message = 'تم تجاوز عدد الطلبات المسموح به. يرجى الانتظار قليلاً.';
      } else if (status >= 500) {
        normalizedError.errorCode = 'SERVER_ERROR';
        normalizedError.message = 'خوادم المتجر تواجه ضغطاً حالياً. يرجى المحاولة بعد قليل.';
      } else if (responseData?.message) {
        normalizedError.errorCode = responseData.code || 'API_ERROR';
        normalizedError.message = responseData.message;
        normalizedError.details = responseData.details;
      }

      return Promise.reject(normalizedError);
    }
  );

  return instance;
}

export const apiClient = createApiClient();
