import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

/**
 * Identity status in the PoSH system
 */
export type IdentityStatus = 
  | "disconnected"      // No wallet connected
  | "connected"         // Wallet connected, no identity
  | "registering"       // Registration in progress
  | "registered"        // Has humanId on-chain
  | "error";            // Error state

/**
 * Human identity data from on-chain
 */
export interface HumanIdentity {
  humanId: `0x${string}`;
  wallet: `0x${string}`;
  registrationTime: number;
  externalProofs: `0x${string}`[];
}

/**
 * PoSH score data
 */
export interface PoSHScore {
  totalScore: number;
  level: number; // 0-5
  levelName: string;
  proofCount: number;
  tierBreakdown: {
    tierA: number;
    tierB: number;
    tierC: number;
  };
}

/**
 * Identity store state
 */
interface IdentityState {
  // Connection state
  status: IdentityStatus;
  error: string | null;
  
  // Identity data
  identity: HumanIdentity | null;
  score: PoSHScore | null;
  
  // Actions
  setStatus: (status: IdentityStatus) => void;
  setError: (error: string | null) => void;
  setIdentity: (identity: HumanIdentity | null) => void;
  setScore: (score: PoSHScore | null) => void;
  reset: () => void;
}

const initialState = {
  status: "disconnected" as IdentityStatus,
  error: null,
  identity: null,
  score: null,
};

/**
 * Zustand store for managing human identity state
 * Persisted to localStorage for session continuity
 */
export const useIdentityStore = create<IdentityState>()(
  persist(
    (set) => ({
      ...initialState,
      
      setStatus: (status) => set({ status, error: status === "error" ? undefined : null }),
      
      setError: (error) => set({ error, status: error ? "error" : undefined }),
      
      setIdentity: (identity) => set({ 
        identity, 
        status: identity ? "registered" : "connected" 
      }),
      
      setScore: (score) => set({ score }),
      
      reset: () => set(initialState),
    }),
    {
      name: "human0-identity",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        // Only persist identity data, not transient status
        identity: state.identity,
        score: state.score,
      }),
    }
  )
);

/**
 * Helper to get level name from level number
 */
export function getLevelName(level: number): string {
  const levels = ["None", "Bronze", "Silver", "Gold", "Platinum", "Diamond"];
  return levels[level] ?? "Unknown";
}

/**
 * Helper to format humanId for display
 */
export function formatHumanId(humanId: `0x${string}`): string {
  if (!humanId || humanId.length < 10) return humanId;
  return `${humanId.slice(0, 6)}...${humanId.slice(-4)}`;
}
