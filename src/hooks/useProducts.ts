/**
 * @file src/hooks/useProducts.ts
 * TanStack Query Hooks for Catalog, Products, Categories, and Orders.
 *
 * Implements strict caching policies, store-isolated query keys, and optimistic feedback.
 */

import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { sallaMiddlewareApi, FetchProductsParams } from '@/api/middleware';
import { useStoreTheme } from '@/theme/ThemeContext';
import { OrderPayload, OrderResponse, Product, Category, Banner } from '@/types';

// Query Keys Factory for store data isolation
export const queryKeys = {
  all: ['store'] as const,
  products: (storeId: string, filters?: Record<string, any>) =>
    ['store', storeId, 'products', filters] as const,
  infiniteProducts: (storeId: string, categoryId?: string, search?: string) =>
    ['store', storeId, 'infinite-products', { categoryId, search }] as const,
  productDetail: (storeId: string, productId: string) =>
    ['store', storeId, 'product', productId] as const,
  categories: (storeId: string) => ['store', storeId, 'categories'] as const,
  banners: (storeId: string) => ['store', storeId, 'banners'] as const,
};

/**
 * Hook to fetch paginated products list.
 */
export function useProducts(params: Omit<FetchProductsParams, 'storeId'> = {}) {
  const { storeConfig } = useStoreTheme();
  const storeId = storeConfig.storeId;

  return useQuery({
    queryKey: queryKeys.products(storeId, params),
    queryFn: () => sallaMiddlewareApi.getProducts({ ...params, storeId }),
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });
}

/**
 * Hook for infinite-scrolling product feed (useful for catalog and category pages).
 */
export function useInfiniteProducts(categoryId?: string, search?: string, limit = 6) {
  const { storeConfig } = useStoreTheme();
  const storeId = storeConfig.storeId;

  return useInfiniteQuery({
    queryKey: queryKeys.infiniteProducts(storeId, categoryId, search),
    queryFn: ({ pageParam = 1 }) =>
      sallaMiddlewareApi.getProducts({
        storeId,
        categoryId,
        search,
        page: pageParam,
        limit,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination?.hasNextPage) {
        return lastPage.pagination.currentPage + 1;
      }
      return undefined;
    },
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Hook to fetch a single product by ID with 10 minutes cache.
 */
export function useProduct(productId: string) {
  const { storeConfig } = useStoreTheme();
  const storeId = storeConfig.storeId;

  return useQuery<Product, Error>({
    queryKey: queryKeys.productDetail(storeId, productId),
    queryFn: () => sallaMiddlewareApi.getProductById(productId, storeId),
    enabled: Boolean(productId),
    staleTime: 1000 * 60 * 10,
  });
}

/**
 * Hook to fetch merchant categories.
 */
export function useCategories() {
  const { storeConfig } = useStoreTheme();
  const storeId = storeConfig.storeId;

  return useQuery<Category[], Error>({
    queryKey: queryKeys.categories(storeId),
    queryFn: () => sallaMiddlewareApi.getCategories(storeId),
    staleTime: 1000 * 60 * 30, // 30 minutes cache
  });
}

/**
 * Hook to fetch promotional banners.
 */
export function useBanners() {
  const { storeConfig } = useStoreTheme();
  const storeId = storeConfig.storeId;

  return useQuery<Banner[], Error>({
    queryKey: queryKeys.banners(storeId),
    queryFn: () => sallaMiddlewareApi.getBanners(storeId),
    staleTime: 1000 * 60 * 15,
  });
}

/**
 * Hook to submit checkout orders to Salla Middleware.
 */
export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation<OrderResponse, Error, OrderPayload>({
    mutationFn: (payload: OrderPayload) => sallaMiddlewareApi.createOrder(payload),
    onSuccess: () => {
      // Invalidate products query to reflect updated stock counts
      queryClient.invalidateQueries({
        queryKey: queryKeys.all,
      });
    },
  });
}
