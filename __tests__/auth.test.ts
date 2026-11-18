import {
  loginCustomer,
  logoutCustomer,
  registerCustomer,
  restoreAuthSession,
  updateCustomerName,
} from '@/api/auth';

const mockSecureValues = new Map<string, string>();
let mockRandomValue = 0;

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(async (key: string) => mockSecureValues.get(key) ?? null),
  setItemAsync: jest.fn(async (key: string, value: string) => {
    mockSecureValues.set(key, value);
  }),
  deleteItemAsync: jest.fn(async (key: string) => {
    mockSecureValues.delete(key);
  }),
}));

jest.mock('expo-crypto', () => ({
  getRandomBytesAsync: jest.fn(async (byteCount: number) => {
    mockRandomValue += 1;
    return Uint8Array.from({ length: byteCount }, (_, index) => (index + mockRandomValue) % 256);
  }),
}));

describe('persistent customer authentication', () => {
  beforeEach(() => {
    mockSecureValues.clear();
    mockRandomValue = 0;
  });

  it('stores a password verifier and restores the account after sign out', async () => {
    const user = await registerCustomer('Test Customer', 'test@example.com', 'password123');

    expect(await restoreAuthSession()).toEqual(user);
    expect(Array.from(mockSecureValues.values()).join('')).not.toContain('password123');

    await logoutCustomer();
    await expect(restoreAuthSession()).resolves.toBeNull();
    await expect(loginCustomer('TEST@example.com', 'password123')).resolves.toEqual(user);
  });

  it('rejects invalid credentials and duplicate registration', async () => {
    await expect(loginCustomer('nobody@example.com', 'password123')).rejects.toThrow(
      'auth.invalidCredentials'
    );
    await registerCustomer('Test Customer', 'test@example.com', 'password123');
    await expect(loginCustomer('test@example.com', 'wrong-password')).rejects.toThrow(
      'auth.invalidCredentials'
    );
    await expect(
      registerCustomer('Another Customer', 'TEST@example.com', 'password123')
    ).rejects.toThrow('auth.emailExists');
  });

  it('updates the stored account and session name', async () => {
    const user = await registerCustomer('Test Customer', 'test@example.com', 'password123');

    await expect(updateCustomerName(user, 'Updated Customer')).resolves.toMatchObject({
      name: 'Updated Customer',
    });
    await expect(restoreAuthSession()).resolves.toMatchObject({ name: 'Updated Customer' });
  });
});
