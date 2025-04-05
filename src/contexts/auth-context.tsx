// src/contexts/auth-context.tsx
'use client';

import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@chakra-ui/react'; // Change this import
import { login as loginService } from '@/services/auth-service';
import { APP_ROUTES, ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/constants';
import { getUserFromToken, isTokenExpired } from '@/utils/jwt-utils';

type User = {
  username: string;
  role: string;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const toast = useToast(); // Move this outside the login function

  // Check if user is already logged in
  useEffect(() => {
    setIsLoading(true);

    try {
      const storedToken = localStorage.getItem('token');

      // If token exists and is valid, extract user data from it
      if (storedToken && !isTokenExpired(storedToken)) {
        const userData = getUserFromToken(storedToken);

        if (userData) {
          setToken(storedToken);
          // Only redirect if not already on shows page
          if (window.location.pathname !== APP_ROUTES.SHOWS) {
            router.push(APP_ROUTES.SHOWS);
          }
        } else {
          // Token is invalid or expired
          localStorage.removeItem('token');
        }
      }
    } catch (error) {
      console.error('Error loading auth state:', error);
      localStorage.removeItem('token');
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await loginService({ username, password });

      if (response.status === 'ERROR') {
        throw new Error(response.message || ERROR_MESSAGES.INVALID_CREDENTIALS);
      }

      // Store token and user data
      localStorage.setItem('token', response.data.token);

      setToken(response.data.token);

      toast({
        title: 'Success',
        description: SUCCESS_MESSAGES.LOGIN_SUCCESS,
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'bottom'
      });
      // Redirect to shows page
      router.push(APP_ROUTES.SHOWS);
    } catch (err: any) {
      console.error('Login error:', err);

      // Handle specific error types
      if (err.statusCode === 400) {
        setError(ERROR_MESSAGES.INVALID_REQUEST);
      }
      else if (err.statusCode === 401) {
        // For 401, use the exact message from the API
        setError(err.message);
      }
      else if (err.isNetworkError) {
        setError(ERROR_MESSAGES.NETWORK_ERROR);
      }
      else {
        // Default fallback
        setError(err.message || ERROR_MESSAGES.GENERIC_ERROR);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    router.push(APP_ROUTES.LOGIN);
  };

  const user = token ? getUserFromToken(token) : null;

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading, error }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
