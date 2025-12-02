import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase-client';
import type { User, Session, AuthError } from '@supabase/supabase-js';

/**
 * Supabase authentication context value
 */
interface SupabaseAuthContextValue {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signInWithMagicLink: (email: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

/**
 * Create the Supabase authentication context
 */
const SupabaseAuthContext = createContext<SupabaseAuthContextValue | undefined>(undefined);

/**
 * Props for SupabaseAuthProvider
 */
interface SupabaseAuthProviderProps {
  children: ReactNode;
}

/**
 * SupabaseAuthProvider component
 * Manages Supabase authentication state and provides auth methods to children
 * 
 * Requirements: 1.1, 2.1, 4.1, 4.2
 */
export function SupabaseAuthProvider({ children }: SupabaseAuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // If Supabase client is not available, skip initialization
    if (!supabase) {
      console.warn('[SupabaseAuthProvider] Supabase client not available');
      setIsLoading(false);
      return;
    }

    // Check for existing session on mount
    const initializeAuth = async () => {
      try {
        const { data: { session: existingSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('[SupabaseAuthProvider] Error getting session:', error);
        } else if (existingSession) {
          setSession(existingSession);
          setUser(existingSession.user);
        }
      } catch (error) {
        console.error('[SupabaseAuthProvider] Error initializing auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log('[SupabaseAuthProvider] Auth state changed:', event);
        
        setSession(newSession);
        setUser(newSession?.user ?? null);
        
        // Handle session persistence
        if (newSession) {
          // Session is automatically persisted by Supabase client
          console.log('[SupabaseAuthProvider] Session established');
        } else if (event === 'SIGNED_OUT') {
          // Clear session on sign out
          console.log('[SupabaseAuthProvider] Session cleared');
        }
      }
    );

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  /**
   * Sign in with magic link (email)
   * Sends a magic link to the user's email address
   * 
   * Requirement: 1.1
   */
  const signInWithMagicLink = async (email: string): Promise<void> => {
    if (!supabase) {
      throw new Error('Supabase client not available');
    }

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: window.location.origin + '/auth/callback',
        },
      });

      if (error) {
        throw error;
      }

      console.log('[SupabaseAuthProvider] Magic link sent to:', email);
    } catch (error) {
      console.error('[SupabaseAuthProvider] Error sending magic link:', error);
      throw error;
    }
  };

  /**
   * Sign in with Google OAuth
   * Initiates the OAuth flow with Google
   * 
   * Requirement: 2.1
   */
  const signInWithGoogle = async (): Promise<void> => {
    if (!supabase) {
      throw new Error('Supabase client not available');
    }

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/auth/callback',
        },
      });

      if (error) {
        throw error;
      }

      console.log('[SupabaseAuthProvider] OAuth flow initiated');
    } catch (error) {
      console.error('[SupabaseAuthProvider] Error initiating OAuth:', error);
      throw error;
    }
  };

  /**
   * Sign out the current user
   * Clears the session and removes stored tokens
   * 
   * Requirement: 4.4
   */
  const signOut = async (): Promise<void> => {
    if (!supabase) {
      throw new Error('Supabase client not available');
    }

    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        throw error;
      }

      console.log('[SupabaseAuthProvider] User signed out');
    } catch (error) {
      console.error('[SupabaseAuthProvider] Error signing out:', error);
      throw error;
    }
  };

  const value: SupabaseAuthContextValue = {
    user,
    session,
    isLoading,
    signInWithMagicLink,
    signInWithGoogle,
    signOut,
  };

  return (
    <SupabaseAuthContext.Provider value={value}>
      {children}
    </SupabaseAuthContext.Provider>
  );
}

/**
 * Hook to access Supabase authentication context
 * @throws Error if used outside of SupabaseAuthProvider
 */
export function useSupabaseAuth(): SupabaseAuthContextValue {
  const context = useContext(SupabaseAuthContext);
  
  if (context === undefined) {
    throw new Error('useSupabaseAuth must be used within a SupabaseAuthProvider');
  }
  
  return context;
}

/**
 * Export the context for testing purposes
 */
export { SupabaseAuthContext };
