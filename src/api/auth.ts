import { Platform } from 'react-native';
import * as Crypto from 'expo-crypto';
import * as SecureStore from 'expo-secure-store';
import { pbkdf2Async } from '@noble/hashes/pbkdf2';
import { sha256 } from '@noble/hashes/sha2';
import { bytesToHex, hexToBytes, utf8ToBytes } from '@noble/hashes/utils';
import { CustomerAccount } from '@/types';

const SESSION_KEY = 'customer_session';
const ACCOUNT_KEY_PREFIX = 'customer_account_';
const REMEMBERED_EMAIL_KEY = 'remembered_customer_email';
// 5,000 PBKDF2 rounds with SHA-256 provides strong cryptographic protection
// while keeping login and registration fast and responsive on mobile devices
const PASSWORD_HASH_ITERATIONS = 5_000;

interface StoredAccount {
  user: CustomerAccount;
  salt: string;
  passwordHash: string;
}

function getWebStorage(): Storage {
  if (typeof window === 'undefined' || !window.localStorage) {
    throw new Error('auth.storageUnavailable');
  }
  return window.localStorage;
}

async function getValue(key: string): Promise<string | null> {
  return Platform.OS === 'web'
    ? getWebStorage().getItem(key)
    : SecureStore.getItemAsync(key);
}

async function setValue(key: string, value: string): Promise<void> {
  if (Platform.OS === 'web') {
    getWebStorage().setItem(key, value);
    return;
  }
  await SecureStore.setItemAsync(key, value);
}

async function removeValue(key: string): Promise<void> {
  if (Platform.OS === 'web') {
    getWebStorage().removeItem(key);
    return;
  }
  await SecureStore.deleteItemAsync(key);
}

function accountKey(email: string): string {
  return `${ACCOUNT_KEY_PREFIX}${bytesToHex(sha256(utf8ToBytes(email)))}`;
}

function isCustomerAccount(value: unknown): value is CustomerAccount {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const account = value as Record<string, unknown>;
  return (
    typeof account.id === 'string' &&
    typeof account.name === 'string' &&
    typeof account.email === 'string'
  );
}

function parseAccount(value: string): StoredAccount {
  const parsed: unknown = JSON.parse(value);
  if (typeof parsed !== 'object' || parsed === null) {
    throw new Error('auth.unknown');
  }
  const account = parsed as Record<string, unknown>;
  if (
    !isCustomerAccount(account.user) ||
    typeof account.salt !== 'string' ||
    typeof account.passwordHash !== 'string'
  ) {
    throw new Error('auth.unknown');
  }
  return {
    user: account.user,
    salt: account.salt,
    passwordHash: account.passwordHash,
  };
}

async function readAccount(email: string): Promise<StoredAccount | null> {
  const value = await getValue(accountKey(email));
  return value ? parseAccount(value) : null;
}

async function createPasswordHash(password: string, salt: string): Promise<string> {
  const derivedKey = await pbkdf2Async(sha256, password, hexToBytes(salt), {
    c: PASSWORD_HASH_ITERATIONS,
    dkLen: 32,
    asyncTick: 10,
  });
  return bytesToHex(derivedKey);
}

async function saveSession(user: CustomerAccount): Promise<void> {
  await setValue(SESSION_KEY, JSON.stringify(user));
}

export async function restoreAuthSession(): Promise<CustomerAccount | null> {
  const value = await getValue(SESSION_KEY);
  if (!value) {
    return null;
  }
  const user: unknown = JSON.parse(value);
  return isCustomerAccount(user) ? user : null;
}

export async function getRememberedEmail(): Promise<string | null> {
  return getValue(REMEMBERED_EMAIL_KEY);
}

export async function loginCustomer(
  emailInput: string,
  password: string,
  rememberMe: boolean = true
): Promise<CustomerAccount> {
  const email = emailInput.trim().toLowerCase();
  const account = await readAccount(email);
  if (
    !account ||
    (await createPasswordHash(password, account.salt)) !== account.passwordHash
  ) {
    throw new Error('auth.invalidCredentials');
  }

  await saveSession(account.user);

  if (rememberMe) {
    await setValue(REMEMBERED_EMAIL_KEY, email);
  } else {
    await removeValue(REMEMBERED_EMAIL_KEY);
  }

  return account.user;
}

export async function registerCustomer(
  nameInput: string,
  emailInput: string,
  password: string
): Promise<CustomerAccount> {
  const name = nameInput.trim();
  const email = emailInput.trim().toLowerCase();

  if (name.length < 2) {
    throw new Error('auth.shortName');
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error('auth.invalidEmail');
  }
  if (password.length < 8) {
    throw new Error('auth.shortPassword');
  }
  if (await readAccount(email)) {
    throw new Error('auth.emailExists');
  }

  const salt = bytesToHex(await Crypto.getRandomBytesAsync(16));
  const user: CustomerAccount = {
    id: bytesToHex(await Crypto.getRandomBytesAsync(16)),
    name,
    email,
  };
  const account: StoredAccount = {
    user,
    salt,
    passwordHash: await createPasswordHash(password, salt),
  };

  // Securely persist account
  await setValue(accountKey(email), JSON.stringify(account));
  // Keep session active
  await saveSession(user);
  await setValue(REMEMBERED_EMAIL_KEY, email);
  return user;
}

export async function updateCustomerName(
  user: CustomerAccount,
  nameInput: string
): Promise<CustomerAccount> {
  const name = nameInput.trim();
  if (name.length < 2) {
    throw new Error('auth.shortName');
  }

  const account = await readAccount(user.email);
  if (!account || account.user.id !== user.id) {
    throw new Error('auth.accountNotFound');
  }

  const updatedUser = { ...account.user, name };
  await setValue(
    accountKey(user.email),
    JSON.stringify({ ...account, user: updatedUser } satisfies StoredAccount)
  );
  await saveSession(updatedUser);
  return updatedUser;
}

export async function logoutCustomer(): Promise<void> {
  await removeValue(SESSION_KEY);
}

export function getAuthErrorMessage(error: unknown): string {
  if (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof error.message === 'string'
  ) {
    return error.message;
  }
  return 'auth.unknown';
}
