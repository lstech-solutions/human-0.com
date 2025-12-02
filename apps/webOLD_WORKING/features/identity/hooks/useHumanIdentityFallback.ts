import { useState, useEffect } from "react";
import { Platform } from "react-native";
import { useIdentityStore, getLevelName, type HumanIdentity, type PoSHScore } from "../stores/identityStore";

// Define proper types for the fallback
interface FallbackIdentityData {
  isConnected: boolean;
  isRegistered: boolean;
  isRegistering: boolean;
  hasContracts: boolean;
  identity: HumanIdentity | null;
  score: PoSHScore | null;
  address: string | null;
  register: () => Promise<any>;
  refresh: () => void;
  isLoading: boolean;
  error: string | null;
}

/**
 * Fallback hook for when Web3 is not available
 * Provides basic identity functionality without wagmi/viem imports
 */
export function useHumanIdentityFallback(): FallbackIdentityData {
  const { 
    status, 
    error, 
    identity, 
    score,
    setStatus, 
    setError, 
    setIdentity, 
    setScore,
    reset 
  } = useIdentityStore();

  // Basic fallback data
  const [isWeb3Available, setIsWeb3Available] = useState(false);

  useEffect(() => {
    // Check if Web3 is available
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      setIsWeb3Available(true);
    }
  }, []);

  return {
    // Basic connection status
    isConnected: false,
    address: null,
    
    // Identity status
    isRegistered: false,
    isRegistering: false,
    hasContracts: false,
    
    // Identity data
    identity: null,
    score: null,
    
    // Store functions
    setStatus,
    setError,
    setIdentity,
    setScore,
    reset,
    
    // Web3 availability
    isWeb3Available,
    
    // Contract functions (no-ops for fallback)
    register: () => Promise.resolve(null),
    refresh: () => {},
    
    // Loading states
    isLoading: false,
    error: null,
  };
}
