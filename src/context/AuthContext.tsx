import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  getAuthErrorMessage,
  loginCustomer,
  logoutCustomer,
  registerCustomer,
  restoreAuthSession,
  updateCustomerName,
} from '@/api/auth';
import { CustomerAccount } from '@/types';

interface AuthContextValue {
  user: CustomerAccount | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  registrationComplete: boolean;
  signIn: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  updateName: (name: string) => Promise<void>;
  clearRegistrationComplete: () => void;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: React.PropsWithChildren) {
  const [user, setUser] = useState<CustomerAccount | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [registrationComplete, setRegistrationComplete] = useState(false);

  useEffect(() => {
    let active = true;

    async function restoreSession() {
      try {
        const storedUser = await restoreAuthSession();
        if (active) {
          setUser(storedUser);
          setIsAuthenticated(Boolean(storedUser));
        }
      } catch (error) {
        if (active) {
          console.error('Unable to restore the customer session:', getAuthErrorMessage(error));
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    restoreSession();
    return () => {
      active = false;
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string, rememberMe: boolean = true) => {
    const account = await loginCustomer(email, password, rememberMe);
    setUser(account);
    setIsAuthenticated(true);
  }, []);

  const signUp = useCallback(async (name: string, email: string, password: string) => {
    const account = await registerCustomer(name, email, password);
    setUser(account);
    setIsAuthenticated(true);
    setRegistrationComplete(true);
  }, []);

  const updateName = useCallback(async (name: string) => {
    if (!user) {
      throw new Error('auth.invalidCredentials');
    }
    const updatedUser = await updateCustomerName(user, name);
    setUser(updatedUser);
  }, [user]);

  const clearRegistrationComplete = useCallback(() => {
    setRegistrationComplete(false);
  }, []);

  const signOut = useCallback(async () => {
    await logoutCustomer();
    setUser(null);
    setIsAuthenticated(false);
    setRegistrationComplete(false);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated,
      isLoading,
      registrationComplete,
      signIn,
      signUp,
      updateName,
      clearRegistrationComplete,
      signOut,
    }),
    [
      user,
      isAuthenticated,
      isLoading,
      registrationComplete,
      signIn,
      signUp,
      updateName,
      clearRegistrationComplete,
      signOut,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
