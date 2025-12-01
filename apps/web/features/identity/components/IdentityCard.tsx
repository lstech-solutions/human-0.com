import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, Platform } from "react-native";
import { 
  User, 
  Shield, 
  Award, 
  Fingerprint, 
  CheckCircle2, 
  AlertCircle,
  Sparkles,
  ArrowRight
} from "lucide-react-native";

interface IdentityCardProps {
  onCreateIdentity?: () => void;
}

/**
 * IdentityCard - Displays human identity status and PoSH score
 * 
 * States:
 * - Disconnected: Shows connect account prompt
 * - Connected (no identity): Shows create identity prompt
 * - Registered: Shows identity details and score
 */
export function IdentityCard({ onCreateIdentity }: IdentityCardProps) {
  const [AuthModal, setAuthModal] = useState<any>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [account, setAccount] = useState<string | null>(null);
  const [authMethod, setAuthMethod] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const formatHumanId = (id: string) => `${id.slice(0, 6)}...${id.slice(-4)}`;

  useEffect(() => {
    if (Platform.OS === "web" && typeof window !== "undefined") {
      // Load AuthModal dynamically
      import("../../../components/AuthModal").then(m => {
        setAuthModal(() => m.AuthModal);
      });

      // Check for existing auth
      const email = localStorage.getItem('auth_email');
      const method = localStorage.getItem('auth_method');
      const walletName = localStorage.getItem('wallet_name');
      
      if (email) {
        setAccount(email);
        // Show wallet name if available, otherwise show method
        setAuthMethod(method === 'wallet' && walletName ? walletName : method);
      }
      
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, []);

  const handleAuthSuccess = (acc: string, method: string) => {
    setAccount(acc);
    setAuthMethod(method);
    setShowAuthModal(false);
    
    // Store wallet name if it's a wallet connection
    if (Platform.OS === "web" && typeof window !== "undefined") {
      if (acc.startsWith('0x')) {
        // Detect which wallet is connected
        if ((window as any).ethereum?.isMetaMask) {
          localStorage.setItem('wallet_name', 'MetaMask');
          setAuthMethod('MetaMask');
        } else if ((window as any).ethereum?.isCoinbaseWallet) {
          localStorage.setItem('wallet_name', 'Coinbase Wallet');
          setAuthMethod('Coinbase Wallet');
        } else {
          localStorage.setItem('wallet_name', 'Web3 Wallet');
          setAuthMethod('Web3 Wallet');
        }
      }
    }
    
    onCreateIdentity?.();
  };
  
  const placeholderData = {
    status: account ? 'connected' : 'disconnected' as const,
    identity: {
      humanId: '0x1234567890abcdef' as `0x${string}`,
      registrationTime: Date.now() / 1000,
    } as any,
    score: {
      levelName: 'New Member',
      level: 0,
      totalScore: 0,
      proofCount: 0,
    } as any,
    isConnected: !!account,
    isRegistered: false,
    isRegistering: false,
    hasContracts: false,
    expectedHumanId: '0x1234567890abcdef' as `0x${string}`,
    register: () => {},
    address: account,
  };

  // Loading state
  if (isLoading) {
    return (
      <View className="bg-space-dark border-2 border-neon-green/20 rounded-3xl p-6">
        <View className="items-center py-8">
          <ActivityIndicator size="large" color="#00FF9C" />
          <Text className="text-gray-400 mt-4">Loading...</Text>
        </View>
      </View>
    );
  }

  // Disconnected state
  if (!placeholderData.isConnected) {
    return (
      <View className="bg-space-dark border-2 border-neon-green/20 rounded-3xl p-6">
        <View className="items-center mb-6">
          <View className="bg-neon-green/10 rounded-full p-4 mb-4">
            <Fingerprint size={48} color="#00FF9C" />
          </View>
          <Text className="text-white text-2xl font-bold mb-2 text-center">
            Create Your Identity
          </Text>
          <Text className="text-gray-400 text-center text-sm mb-4">
            Connect your account to create your unique human identity and start building your Proof of Sustainable Humanity.
          </Text>

          <Text className="text-gray-500 text-xs text-center mb-4">
            Choose your preferred authentication method:
          </Text>
          <View className="flex-row flex-wrap justify-center gap-2 mb-6">
            <View className="bg-deep-space px-3 py-1 rounded-full">
              <Text className="text-gray-400 text-xs">🔐 Wallet</Text>
            </View>
            <View className="bg-deep-space px-3 py-1 rounded-full">
              <Text className="text-gray-400 text-xs">📧 Email</Text>
            </View>
            <View className="bg-deep-space px-3 py-1 rounded-full">
              <Text className="text-gray-400 text-xs">🌐 Google</Text>
            </View>
          </View>
        </View>
        
        <TouchableOpacity
          onPress={() => setShowAuthModal(true)}
          className="bg-neon-green rounded-2xl px-6 py-4 flex-row items-center justify-center"
          activeOpacity={0.8}
        >
          <Fingerprint size={24} color="#050B10" />
          <Text className="text-space-dark font-semibold text-lg ml-2">
            Get Started
          </Text>
        </TouchableOpacity>
        
        <View className="mt-6 pt-6 border-t border-neon-green/10">
          <View className="flex-row items-center mb-3">
            <Shield size={16} color="#00FF9C" />
            <Text className="text-gray-400 text-xs ml-2">
              Your identity is pseudonymous and privacy-preserving
            </Text>
          </View>
          <View className="flex-row items-center">
            <Sparkles size={16} color="#00FF9C" />
            <Text className="text-gray-400 text-xs ml-2">
              One account = One unique human identity
            </Text>
          </View>
        </View>

        {/* Auth Modal */}
        {AuthModal && (
          <AuthModal
            visible={showAuthModal}
            onClose={() => setShowAuthModal(false)}
            onSuccess={handleAuthSuccess}
          />
        )}
      </View>
    );
  }

  // Connected but not registered
  if (!placeholderData.isRegistered) {
    return (
      <View className="bg-space-dark border-2 border-neon-green/30 rounded-3xl p-6">
        <View className="items-center mb-6">
          <View className="bg-neon-green/20 rounded-full p-4 mb-4">
            <User size={48} color="#00FF9C" />
          </View>
          <Text className="text-white text-2xl font-bold mb-2 text-center">
            Welcome, Human
          </Text>
          <Text className="text-gray-400 text-center text-sm mb-2">
            Your account is connected. Create your identity to start tracking your sustainable impact.
          </Text>
          
          {/* Show auth method */}
          {authMethod && (
            <View className="bg-deep-space px-3 py-1 rounded-full mb-4">
              <Text className="text-gray-400 text-xs capitalize">
                Connected via {authMethod}
              </Text>
            </View>
          )}
          
          {/* Preview of expected humanId */}
          {placeholderData.expectedHumanId && (
            <View className="bg-deep-space rounded-xl px-4 py-3 w-full mb-4">
              <Text className="text-gray-500 text-xs mb-1">Your Human ID will be:</Text>
              <Text className="text-neon-green font-mono text-sm">
                {formatHumanId(placeholderData.expectedHumanId)}
              </Text>
            </View>
          )}
        </View>

        {!placeholderData.hasContracts ? (
          <View className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-4">
            <View className="flex-row items-center">
              <AlertCircle size={20} color="#EAB308" />
              <Text className="text-yellow-500 text-sm ml-2 flex-1">
                Contracts not deployed on this network. Please switch to Base Sepolia.
              </Text>
            </View>
          </View>
        ) : (
          <TouchableOpacity
            onPress={placeholderData.register}
            disabled={placeholderData.isRegistering}
            className={`bg-neon-green px-6 py-4 rounded-2xl flex-row items-center justify-center ${
              placeholderData.isRegistering ? "opacity-70" : ""
            }`}
            activeOpacity={0.8}
          >
            {placeholderData.isRegistering ? (
              <>
                <ActivityIndicator color="#050B10" size="small" />
                <Text className="text-deep-space font-bold text-lg ml-3">
                  Creating Identity...
                </Text>
              </>
            ) : (
              <>
                <Fingerprint size={24} color="#050B10" />
                <Text className="text-deep-space font-bold text-lg ml-3">
                  Create My Identity
                </Text>
              </>
            )}
          </TouchableOpacity>
        )}

        <Text className="text-gray-500 text-xs text-center mt-4">
          This will create a transaction on-chain. Only gas fees apply.
        </Text>
      </View>
    );
  }

  // Registered - show identity and score
  return (
    <View className="bg-space-dark border-2 border-neon-green rounded-3xl p-6">
      {/* Header */}
      <View className="flex-row items-center justify-between mb-6">
        <View className="flex-row items-center">
          <View className="bg-neon-green/20 rounded-full p-3">
            <CheckCircle2 size={24} color="#00FF9C" />
          </View>
          <View className="ml-3">
            <Text className="text-neon-green text-xs font-semibold uppercase tracking-wider">
              Verified Human
            </Text>
            <Text className="text-white text-lg font-bold">
              {placeholderData.score?.levelName ?? "New Member"}
            </Text>
          </View>
        </View>
        
        {/* Level badge */}
        {placeholderData.score && placeholderData.score.level > 0 && (
          <View className="bg-neon-green/20 px-3 py-1 rounded-full">
            <Text className="text-neon-green font-bold">
              Lvl {placeholderData.score.level}
            </Text>
          </View>
        )}
      </View>

      {/* Human ID */}
      <View className="bg-deep-space rounded-xl p-4 mb-4">
        <Text className="text-gray-500 text-xs mb-1">Human ID</Text>
        <Text className="text-white font-mono text-sm">
          {placeholderData.identity ? formatHumanId(placeholderData.identity.humanId) : "—"}
        </Text>
      </View>

      {/* Stats Grid */}
      <View className="flex-row justify-between mb-6">
        <View className="flex-1 items-center p-3 bg-deep-space rounded-xl mr-2">
          <Text className="text-neon-green text-2xl font-bold">
            {placeholderData.score?.totalScore ?? 0}
          </Text>
          <Text className="text-gray-400 text-xs mt-1">PoSH Score</Text>
        </View>
        
        <View className="flex-1 items-center p-3 bg-deep-space rounded-xl ml-2">
          <Text className="text-neon-green text-2xl font-bold">
            {placeholderData.score?.proofCount ?? 0}
          </Text>
          <Text className="text-gray-400 text-xs mt-1">Proofs</Text>
        </View>
      </View>

      {/* Registration date */}
      {placeholderData.identity?.registrationTime && placeholderData.identity.registrationTime > 0 && (
        <View className="flex-row items-center justify-center">
          <Award size={14} color="#9CA3AF" />
          <Text className="text-gray-400 text-xs ml-2">
            Member since {new Date(placeholderData.identity.registrationTime * 1000).toLocaleDateString()}
          </Text>
        </View>
      )}

      {/* CTA to add proofs */}
      <TouchableOpacity
        className="mt-6 bg-neon-green/10 border border-neon-green/30 rounded-xl p-4 flex-row items-center justify-between"
        activeOpacity={0.8}
      >
        <View className="flex-row items-center">
          <Sparkles size={20} color="#00FF9C" />
          <Text className="text-white font-semibold ml-3">
            Add Sustainable Actions
          </Text>
        </View>
        <ArrowRight size={20} color="#00FF9C" />
      </TouchableOpacity>
    </View>
  );
}

export default IdentityCard;
