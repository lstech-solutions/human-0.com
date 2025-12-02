import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

/**
 * Supabase client configuration
 */
interface SupabaseConfig {
  url: string;
  anonKey: string;
  redirectUrl: string;
}

/**
 * Get environment-specific redirect URL
 * @returns The appropriate redirect URL based on the current environment
 */
function getRedirectUrl(): string {
  // Check if we're in development mode
  const isDevelopment = __DEV__ || process.env.NODE_ENV === 'development';
  
  if (isDevelopment) {
    // For development, use localhost
    return 'http://localhost:8081/auth/callback';
  }
  
  // For production, use the production domain
  // This should be configured via environment variable
  const productionUrl = process.env.EXPO_PUBLIC_APP_URL || 'https://human-0.com';
  return `${productionUrl}/auth/callback`;
}

/**
 * Validate Supabase configuration
 * @param config The configuration to validate
 * @returns true if valid, false otherwise
 */
function validateConfig(config: Partial<SupabaseConfig>): config is SupabaseConfig {
  if (!config.url) {
    console.warn('[Supabase] Missing SUPABASE_URL environment variable');
    return false;
  }
  
  if (!config.anonKey) {
    console.warn('[Supabase] Missing SUPABASE_ANON_KEY environment variable');
    return false;
  }
  
  // Validate URL format
  try {
    new URL(config.url);
  } catch (error) {
    console.warn('[Supabase] Invalid SUPABASE_URL format:', config.url);
    return false;
  }
  
  return true;
}

/**
 * Get Supabase configuration from environment variables
 * @returns Supabase configuration object or null if invalid
 */
function getSupabaseConfig(): SupabaseConfig | null {
  const config: Partial<SupabaseConfig> = {
    url: process.env.SUPABASE_URL,
    anonKey: process.env.SUPABASE_ANON_KEY,
    redirectUrl: getRedirectUrl(),
  };
  
  if (!validateConfig(config)) {
    console.error('[Supabase] Invalid configuration. Authentication will not be available.');
    return null;
  }
  
  return config;
}

/**
 * Initialize and export Supabase client
 */
const config = getSupabaseConfig();

export const supabase = config
  ? createClient(config.url, config.anonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        flowType: 'pkce',
      },
    })
  : null;

/**
 * Export configuration for testing purposes
 */
export { getRedirectUrl, validateConfig, getSupabaseConfig };
