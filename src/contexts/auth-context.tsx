'use client';

import { createContext, useState, useContext, useEffect, ReactNode, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useCustomToast } from '@/app/components/ui/custom-toast';
import { login as loginService } from '@/services/auth-service';
import { APP_ROUTES, ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/constants';
import { getUserFromToken, isTokenExpired } from '@/utils/jwt-utils';
import Cookies from 'js-cookie'

const setTokenCookie = (token: string) => {
  Cookies.set('auth-token', token, { expires: 1, sameSite: 'strict' });
};

const removeTokenCookie = () => {
  Cookies.remove('auth-token');
};

const getTokenFromCookie = () => {
  return Cookies.get('auth-token') || null;
};

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
  isLoggingOut: boolean;  
  error: string | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { showToast } = useCustomToast();
  const logoutTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    router.prefetch(APP_ROUTES.LOGIN);
  }, [router]);

  useEffect(() => {
    setIsLoading(true);
    
    try {
      const storedToken = getTokenFromCookie();
      
      if (storedToken && !isTokenExpired(storedToken)) {
        setToken(storedToken);
      } else {
        removeTokenCookie();
      }
    } catch (error) {
      console.error('Error loading auth state:', error);
      removeTokenCookie();
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

      setTokenCookie(response.data.token);
      setToken(response.data.token);

      showToast({
        type: 'success',
        title: 'Success',
        description: SUCCESS_MESSAGES.LOGIN_SUCCESS,
      });
      
      router.push(APP_ROUTES.SHOWS);
    } catch (err: any) {
      console.error('Login error:', err);
      
      if (err.statusCode === 400) {
        setError(ERROR_MESSAGES.INVALID_REQUEST);
      } 
      else if (err.statusCode === 401) {
        setError(err.message);
      }
      else if (err.isNetworkError) {
        setError(ERROR_MESSAGES.NETWORK_ERROR);
      }
      else {
        setError(err.message || ERROR_MESSAGES.GENERIC_ERROR);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = useCallback(() => {
    setIsLoggingOut(true); 
    
    setToken(null);

    if (logoutTimeoutRef.current) {
      clearTimeout(logoutTimeoutRef.current);
    }

    logoutTimeoutRef.current = setTimeout(() => {
      removeTokenCookie();
      router.push(APP_ROUTES.LOGIN);
      setTimeout(() => {
        setIsLoggingOut(false);
      }, 500);
    }, 50);
  }, [router]);

  const user = token ? getUserFromToken(token) : null;

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading, isLoggingOut, error }}>
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
