import { PRODUCTS } from '@/data';
import { cartReducer, getCartTotals } from '@/utils/cart';

describe('cart reducer', () => {
  it('adds a new line to the cart', () => {
    const next = cartReducer({ lines: [] }, { type: 'add', productId: 'p-01', quantity: 2 });
    expect(next.lines).toEqual([{ productId: 'p-01', quantity: 2 }]);
  });

  it('merges quantities when the product is already in the cart', () => {
    const first = cartReducer({ lines: [] }, { type: 'add', productId: 'p-01', quantity: 2 });
    const second = cartReducer(first, { type: 'add', productId: 'p-01', quantity: 3 });
    expect(second.lines).toEqual([{ productId: 'p-01', quantity: 5 }]);
  });

  it('removes a line from the cart', () => {
    const state = { lines: [{ productId: 'p-01', quantity: 1 }] };
    const next = cartReducer(state, { type: 'remove', productId: 'p-01' });
    expect(next.lines).toEqual([]);
  });

  it('removes the line when quantity is set to zero', () => {
    const state = { lines: [{ productId: 'p-01', quantity: 3 }] };
    const next = cartReducer(state, { type: 'setQuantity', productId: 'p-01', quantity: 0 });
    expect(next.lines).toEqual([]);
  });

  it('clears the whole cart', () => {
    const state = { lines: [{ productId: 'p-01', quantity: 1 }] };
    expect(cartReducer(state, { type: 'clear' }).lines).toEqual([]);
  });
});

describe('getCartTotals', () => {
  it('returns zeroed totals for an empty cart', () => {
    const totals = getCartTotals({ lines: [] }, PRODUCTS);
    expect(totals.totalItems).toBe(0);
    expect(totals.subtotal).toBe(0);
    expect(totals.shipping).toBe(0);
    expect(totals.total).toBe(0);
  });

  it('computes subtotal and total items for one line', () => {
    const totals = getCartTotals({ lines: [{ productId: 'p-02', quantity: 2 }] }, PRODUCTS);
    const product = PRODUCTS.find((item) => item.id === 'p-02');
    expect(product).toBeDefined();
    expect(totals.totalItems).toBe(2);
    expect(totals.subtotal).toBe(product!.price * 2);
    expect(totals.total).toBe(totals.subtotal + totals.shipping);
  });

  it('gives free shipping when the subtotal exceeds the threshold', () => {
    const totals = getCartTotals({ lines: [{ productId: 'p-02', quantity: 1 }] }, PRODUCTS);
    expect(totals.subtotal).toBeGreaterThanOrEqual(500);
    expect(totals.shipping).toBe(0);
  });
});
