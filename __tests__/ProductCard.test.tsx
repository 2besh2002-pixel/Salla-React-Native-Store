/**
 * @file __tests__/ProductCard.test.tsx
 * Unit & Interaction Tests for White-Label ProductCard Component.
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ProductCard } from '@/components/product/ProductCard';
import { StoreThemeProvider } from '@/theme/ThemeContext';
import { Product } from '@/types';
import { LanguageProvider } from '@/context/LanguageContext';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn().mockResolvedValue(null),
  setItem: jest.fn().mockResolvedValue(null),
}));

const mockProduct: Product = {
  id: 'prod-test-1',
  storeId: 'store-oud-luxury',
  categoryId: 'cat-test',
  categoryName: 'عود طبيعي',
  name: 'مروكي طبيعي فاخر',
  description: 'وصف تجريبي للمنتج',
  sku: 'TEST-SKU-01',
  price: 250,
  regularPrice: 300,
  currency: 'SAR',
  images: ['https://example.com/test.jpg'],
  thumbnail: 'https://example.com/thumb.jpg',
  rating: 4.8,
  reviewsCount: 42,
  stock: 15,
  isAvailable: true,
  hasVariants: false,
  badges: ['bestseller'],
};

async function renderWithTheme(ui: React.ReactElement) {
  return await render(
    <StoreThemeProvider>
      <LanguageProvider>{ui}</LanguageProvider>
    </StoreThemeProvider>
  );
}

describe('ProductCard Component', () => {
  it('renders product title, price, and category properly', async () => {
    const screen = await renderWithTheme(
      <ProductCard product={mockProduct} />
    );

    expect(screen.getByTestId('product-title')).toHaveTextContent('مروكي طبيعي فاخر');
    expect(screen.getByTestId('product-price')).toHaveTextContent('250 SAR');
    expect(screen.getByText('عود طبيعي')).toBeTruthy();
  });

  it('calculates and displays discount percentage badge correctly', async () => {
    const screen = await renderWithTheme(
      <ProductCard product={mockProduct} />
    );

    // (300 - 250) / 300 = 16.66% => -17%
    expect(screen.getByText('-17%')).toBeTruthy();
    expect(screen.getByText('Popular')).toBeTruthy();
  });

  it('triggers onPress callback when card is pressed', async () => {
    const handlePress = jest.fn();
    const screen = await renderWithTheme(
      <ProductCard product={mockProduct} onPress={handlePress} />
    );

    fireEvent.press(screen.getByTestId('product-card'));
    expect(handlePress).toHaveBeenCalledTimes(1);
    expect(handlePress).toHaveBeenCalledWith(mockProduct);
  });

  it('triggers onAddToCart callback when add button is clicked', async () => {
    const handleAddToCart = jest.fn();
    const screen = await renderWithTheme(
      <ProductCard product={mockProduct} onAddToCart={handleAddToCart} />
    );

    const addBtn = screen.getByTestId('add-to-cart-button');
    expect(addBtn).toBeTruthy();

    fireEvent.press(addBtn);
    expect(handleAddToCart).toHaveBeenCalledTimes(1);
    expect(handleAddToCart).toHaveBeenCalledWith(mockProduct);
  });
});
