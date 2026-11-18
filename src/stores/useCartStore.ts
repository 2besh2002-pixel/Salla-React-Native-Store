/**
 * @file src/stores/useCartStore.ts
 * Zustand Cart Store with Local Persistence and Server Synchronization.
 *
 * Persists cart items per merchant store and calculates live totals (Subtotal, VAT, Coupons, Shipping).
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppliedCoupon, CartItem, CartTotals, SelectedOption, SupportedCurrency } from '@/types';

export interface CartStoreState {
  items: CartItem[];
  coupon: AppliedCoupon | null;
  shippingCost: number;
  isSyncing: boolean;
  currency: SupportedCurrency;

  // Actions
  addItem: (
    product: {
      id: string;
      name: string;
      price: number;
      regularPrice?: number;
      thumbnail: string;
      maxStock: number;
      sku?: string;
    },
    quantity?: number,
    variantId?: string,
    selectedOptions?: SelectedOption[]
  ) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (coupon: AppliedCoupon | null) => void;
  setShippingCost: (cost: number) => void;
  setCurrency: (currency: SupportedCurrency) => void;

  // Computed Selectors
  getItemCount: () => number;
  getSubtotal: () => number;
  getDiscount: () => number;
  getTax: (taxRate?: number) => number;
  getGrandTotal: (taxRate?: number) => number;
  getTotals: (taxRate?: number) => CartTotals;
}

export const useCartStore = create<CartStoreState>()(
  persist(
    (set, get) => ({
      items: [],
      coupon: null,
      shippingCost: 0,
      isSyncing: false,
      currency: 'SAR',

      addItem: (product, quantity = 1, variantId, selectedOptions) => {
        // Generate a composite ID for unique product + variant option combinations
        const uniqueCartId = variantId ? `${product.id}_${variantId}` : product.id;

        set((state) => {
          const existingIndex = state.items.findIndex((item) => item.id === uniqueCartId);

          if (existingIndex > -1) {
            const updatedItems = [...state.items];
            const currentItem = updatedItems[existingIndex];
            const newQty = Math.min(currentItem.quantity + quantity, product.maxStock || 99);
            updatedItems[existingIndex] = {
              ...currentItem,
              quantity: newQty,
            };
            return { items: updatedItems };
          } else {
            const newItem: CartItem = {
              id: uniqueCartId,
              productId: product.id,
              variantId,
              name: product.name,
              sku: product.sku,
              thumbnail: product.thumbnail,
              price: product.price,
              regularPrice: product.regularPrice,
              quantity: Math.min(quantity, product.maxStock || 99),
              selectedOptions,
              maxStock: product.maxStock || 99,
            };
            return { items: [...state.items, newItem] };
          }
        });
      },

      removeItem: (itemId: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== itemId),
        }));
      },

      updateQuantity: (itemId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(itemId);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.id === itemId
              ? { ...item, quantity: Math.min(quantity, item.maxStock || 99) }
              : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [], coupon: null, shippingCost: 0 });
      },

      applyCoupon: (coupon: AppliedCoupon | null) => {
        set({ coupon });
      },

      setShippingCost: (cost: number) => {
        set({ shippingCost: Math.max(0, cost) });
      },

      setCurrency: (currency: SupportedCurrency) => {
        set({ currency });
      },

      getItemCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      },

      getDiscount: () => {
        const subtotal = get().getSubtotal();
        const coupon = get().coupon;
        if (!coupon || subtotal <= 0) return 0;

        if (coupon.discountType === 'percentage') {
          return (subtotal * coupon.discountAmount) / 100;
        }
        return Math.min(subtotal, coupon.discountAmount);
      },

      getTax: (taxRate = 0.15) => {
        const subtotal = get().getSubtotal();
        const discount = get().getDiscount();
        const taxableAmount = Math.max(0, subtotal - discount);
        return taxableAmount * taxRate;
      },

      getGrandTotal: (taxRate = 0.15) => {
        const subtotal = get().getSubtotal();
        const discount = get().getDiscount();
        const tax = get().getTax(taxRate);
        const shipping = get().shippingCost;
        return Math.max(0, subtotal - discount + tax + shipping);
      },

      getTotals: (taxRate = 0.15): CartTotals => {
        const subtotal = get().getSubtotal();
        const discount = get().getDiscount();
        const tax = get().getTax(taxRate);
        const shipping = get().shippingCost;
        const grandTotal = Math.max(0, subtotal - discount + tax + shipping);

        return {
          subtotal,
          discount,
          tax,
          shipping,
          grandTotal,
          currency: get().currency,
          itemCount: get().getItemCount(),
        };
      },
    }),
    {
      name: 'salla_mobile_cart_store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        items: state.items,
        coupon: state.coupon,
        currency: state.currency,
      }),
    }
  )
);
