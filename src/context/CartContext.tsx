import { createContext, useContext, useMemo, useReducer, type ReactNode } from 'react';

import { cartReducer, getCartTotals, type CartAction, type CartState } from '@/utils/cart';
import { PRODUCTS } from '@/data/products';

export interface CartContextValue {
  state: CartState;
  /** Add a product (merges quantities when the product is already in the cart). */
  addItem: (productId: string, quantity?: number) => void;
  /** Remove a product from the cart. */
  removeItem: (productId: string) => void;
  /** Set the quantity of a product inside the cart. */
  setQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  /** Resolved lines (product + quantity) with computed totals. */
  totals: ReturnType<typeof getCartTotals>;
  totalItems: number;
  subtotal: number;
  shipping: number;
  total: number;
  isInCart: (productId: string) => boolean;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer<CartState, [CartAction]>(cartReducer, { lines: [] });

  const value = useMemo<CartContextValue>(() => {
    const totals = getCartTotals(state, PRODUCTS);

    return {
      state,
      addItem: (productId: string, quantity = 1) => dispatch({ type: 'add', productId, quantity }),
      removeItem: (productId: string) => dispatch({ type: 'remove', productId }),
      setQuantity: (productId: string, quantity: number) => dispatch({ type: 'setQuantity', productId, quantity }),
      clearCart: () => dispatch({ type: 'clear' }),
      totals,
      totalItems: totals.totalItems,
      subtotal: totals.subtotal,
      shipping: totals.shipping,
      total: totals.total,
      isInCart: (productId: string) => state.lines.some((line) => line.productId === productId),
    };
  }, [state]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
