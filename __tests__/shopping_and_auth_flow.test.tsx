import {
  loginCustomer,
  logoutCustomer,
  registerCustomer,
  restoreAuthSession,
  getRememberedEmail,
} from '@/api/auth';
import { STORE_CONFIG, getStoreConfigById, STORE_PRESETS } from '../store-configs';
import { sallaMiddlewareApi } from '@/api/middleware';

const mockStorage = new Map<string, string>();
let mockRandomCount = 0;

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(async (key: string) => mockStorage.get(key) ?? null),
  setItemAsync: jest.fn(async (key: string, value: string) => {
    mockStorage.set(key, value);
  }),
  deleteItemAsync: jest.fn(async (key: string) => {
    mockStorage.delete(key);
  }),
}));

jest.mock('expo-crypto', () => ({
  getRandomBytesAsync: jest.fn(async (byteCount: number) => {
    mockRandomCount += 1;
    return Uint8Array.from({ length: byteCount }, (_, index) => (index + mockRandomCount) % 256);
  }),
}));

describe('Complete Customer Experience - Single Store & Authentication Flow', () => {
  beforeEach(() => {
    mockStorage.clear();
    mockRandomCount = 0;
  });

  describe('Single Store Consistency (Requirement 2 & 1)', () => {
    it('provides exactly ONE consistent store configuration without theme preview options', () => {
      expect(STORE_CONFIG).toBeDefined();
      expect(STORE_CONFIG.storeId).toBe('store-main');
      expect(STORE_CONFIG.name.ar).toBe('متجر النخبة للتسوق');
      expect(STORE_CONFIG.name.en).toBe('Elite Store');

      // getStoreConfigById always returns the single store config
      expect(getStoreConfigById('any-id')).toEqual(STORE_CONFIG);
      expect(getStoreConfigById(undefined)).toEqual(STORE_CONFIG);

      // STORE_PRESETS only has the single store
      expect(Object.keys(STORE_PRESETS)).toHaveLength(1);
    });

    it('loads products and categories for the single store', async () => {
      const categories = await sallaMiddlewareApi.getCategories();
      expect(categories.length).toBeGreaterThan(0);

      const productsResponse = await sallaMiddlewareApi.getProducts();
      expect(productsResponse.data.length).toBeGreaterThan(0);

      // Every category has an id and name
      categories.forEach((cat) => {
        expect(cat.id).toBeDefined();
        expect(cat.name).toBeDefined();
      });

      // Products can be retrieved by id
      const firstProduct = productsResponse.data[0];
      const retrieved = await sallaMiddlewareApi.getProductById(firstProduct.id);
      expect(retrieved.id).toBe(firstProduct.id);
      expect(retrieved.name).toBe(firstProduct.name);
    });
  });

  describe('User Authentication - Registration & Login Flow (Requirement 4)', () => {
    it('validates fields during registration', async () => {
      // Short name (< 2 chars)
      await expect(
        registerCustomer('A', 'valid@example.com', 'password123')
      ).rejects.toThrow('auth.shortName');

      // Invalid email
      await expect(
        registerCustomer('Customer Name', 'invalid-email', 'password123')
      ).rejects.toThrow('auth.invalidEmail');

      // Short password (< 8 chars)
      await expect(
        registerCustomer('Customer Name', 'valid@example.com', '123')
      ).rejects.toThrow('auth.shortPassword');
    });

    it('successfully registers a new customer with secure password hashing and session persistence', async () => {
      const customer = await registerCustomer('Ahmed Ali', 'ahmed@example.com', 'SecurePass123');

      expect(customer.name).toBe('Ahmed Ali');
      expect(customer.email).toBe('ahmed@example.com');
      expect(customer.id).toBeDefined();

      // Ensure password is NEVER stored in plain text anywhere in storage
      const allStorageValues = Array.from(mockStorage.values()).join(' ');
      expect(allStorageValues).not.toContain('SecurePass123');

      // Session is restored automatically
      const restored = await restoreAuthSession();
      expect(restored).toEqual(customer);

      // Email is remembered
      expect(await getRememberedEmail()).toBe('ahmed@example.com');
    });

    it('prevents registering duplicate email addresses', async () => {
      await registerCustomer('User One', 'user@example.com', 'password123');

      await expect(
        registerCustomer('User Two', 'USER@EXAMPLE.COM', 'password123')
      ).rejects.toThrow('auth.emailExists');
    });

    it('handles login with correct and incorrect credentials', async () => {
      const user = await registerCustomer('Sara Omar', 'sara@example.com', 'MySecret88');

      // Log out
      await logoutCustomer();
      expect(await restoreAuthSession()).toBeNull();

      // Wrong password fails
      await expect(
        loginCustomer('sara@example.com', 'WrongPass')
      ).rejects.toThrow('auth.invalidCredentials');

      // Non-existent email fails
      await expect(
        loginCustomer('nobody@example.com', 'MySecret88')
      ).rejects.toThrow('auth.invalidCredentials');

      // Correct login succeeds and restores session
      const loggedIn = await loginCustomer('SARA@example.com', 'MySecret88');
      expect(loggedIn).toEqual(user);
      expect(await restoreAuthSession()).toEqual(user);
    });

    it('maintains registered accounts across sign out and reopen', async () => {
      const user = await registerCustomer('Tariq', 'tariq@example.com', 'Password99');

      // Sign out
      await logoutCustomer();

      // Account still exists and can log in again
      const relogged = await loginCustomer('tariq@example.com', 'Password99');
      expect(relogged.id).toBe(user.id);
      expect(relogged.name).toBe('Tariq');
    });
  });
});
