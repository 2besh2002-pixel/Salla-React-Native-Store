import type { Product } from '@/data/types';

/** A single line inside the cart. */
export interface CartLine {
  productId: string;
  quantity: number;
}

export interface CartState {
  lines: CartLine[];
}

export type CartAction =
  | { type: 'add'; productId: string; quantity: number }
  | { type: 'remove'; productId: string }
  | { type: 'setQuantity'; productId: string; quantity: number }
  | { type: 'clear' };

export const FREE_SHIPPING_THRESHOLD = 500;
export const SHIPPING_FEE = 30;

export interface CartTotals {
  lines: { product: Product; quantity: number }[];
  totalItems: number;
  subtotal: number;
  shipping: number;
  total: number;
}

export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'add': {
      const lines = [...state.lines];
      const existing = lines.find((line) => line.productId === action.productId);
      if (existing) {
        existing.quantity += action.quantity;
      } else {
        lines.push({ productId: action.productId, quantity: action.quantity });
      }
      return { lines };
    }
    case 'remove': {
      return { lines: state.lines.filter((line) => line.productId !== action.productId) };
    }
    case 'setQuantity': {
      if (action.quantity <= 0) {
        return { lines: state.lines.filter((line) => line.productId !== action.productId) };
      }
      return {
        lines: state.lines.map((line) =>
          line.productId === action.productId ? { ...line, quantity: action.quantity } : line,
        ),
      };
    }
    case 'clear':
      return { lines: [] };
    default:
      return state;
  }
}

export function getCartTotals(state: CartState, products: Product[]): CartTotals {
  const lines = state.lines
    .map((line) => {
      const product = products.find((item) => item.id === line.productId);
      return product ? { product, quantity: line.quantity } : null;
    })
    .filter((line): line is { product: Product; quantity: number } => line !== null);

  const totalItems = lines.reduce((sum, line) => sum + line.quantity, 0);
  const subtotal = lines.reduce((sum, line) => sum + line.product.price * line.quantity, 0);
  const shipping = subtotal <= 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;

  return { lines, totalItems, subtotal, shipping, total: subtotal + shipping };
}
