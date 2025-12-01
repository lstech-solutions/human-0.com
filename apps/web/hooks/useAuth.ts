import { useState, useEffect, useCallback } from 'react';
import { Platform } from 'react-native';

export type AuthMethod = 'wallet' | 'email' | 'otp' | 'social';

export interface AuthState {
  isAuthenticated: boolean;
  account: string | null;
  method: AuthMethod | null;
  isLoading: boolean;
}

let wagmi: any = null;
if (Platform.OS === 'web' && typeof window !== 'undefined') {
  wagmi = require('wagmi');
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    account: null,
    method: null,
    isLoading: true,
  });

  const address = wagmi?.useAccount?.()?.address;
  const isConnected = wagmi?.useAccount?.()?.isConnected;
  const disconnect = wagmi?.useDisconnect?.()?.disconnect;

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        // Check for wallet connection
        if (isConnected && address) {
          setAuthState({
            isAuthenticated: true,
            account: address,
            method: 'wallet',
            isLoading: false,
          });
          return;
        }

        // Check for session token (from email/social login)
        if (Platform.OS === 'web' && typeof window !== 'undefined') {
          const params = new URLSearchParams(window.location.search);
          const sessionToken = params.get('session');
          const email = params.get('email');

          if (sessionToken && email) {
            // Store session in localStorage
            localStorage.setItem('auth_session', sessionToken);
            localStorage.setItem('auth_email', email);
            localStorage.setItem('auth_method', 'social');

            // Clean URL
            window.history.replaceState({}, '', window.location.pathname);

            setAuthState({
              isAuthenticated: true,
              account: email,
              method: 'social',
              isLoading: false,
            });
            return;
          }

          // Check localStorage for existing session
          const storedSession = localStorage.getItem('auth_session');
          const storedEmail = localStorage.getItem('auth_email');
          const storedMethod = localStorage.getItem('auth_method') as AuthMethod;

          if (storedSession && storedEmail) {
            setAuthState({
              isAuthenticated: true,
              account: storedEmail,
              method: storedMethod || 'email',
              isLoading: false,
            });
            return;
          }
        }

        setAuthState({
          isAuthenticated: false,
          account: null,
          method: null,
          isLoading: false,
        });
      } catch (error) {
        console.error('Session check error:', error);
        setAuthState({
          isAuthenticated: false,
          account: null,
          method: null,
          isLoading: false,
        });
      }
    };

    checkSession();
  }, [isConnected, address]);

  const login = useCallback((account: string, method: AuthMethod) => {
    if (Platform.OS === 'web' && typeof window !== 'undefined' && method !== 'wallet') {
      localStorage.setItem('auth_email', account);
      localStorage.setItem('auth_method', method);
    }

    setAuthState({
      isAuthenticated: true,
      account,
      method,
      isLoading: false,
    });
  }, []);

  const logout = useCallback(() => {
    if (authState.method === 'wallet' && disconnect) {
      disconnect();
    }

    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      localStorage.removeItem('auth_session');
      localStorage.removeItem('auth_email');
      localStorage.removeItem('auth_method');
    }

    setAuthState({
      isAuthenticated: false,
      account: null,
      method: null,
      isLoading: false,
    });
  }, [authState.method, disconnect]);

  return {
    ...authState,
    login,
    logout,
  };
}
