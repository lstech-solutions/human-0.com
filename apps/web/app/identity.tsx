import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, Platform, ActivityIndicator } from "react-native";
import { Shield, Fingerprint, Zap, Globe, Lock } from "lucide-react-native";
import { useTheme } from "../theme/ThemeProvider";
import { AppFooter } from "../components/AppFooter";
import { AnimatedBackground } from "../components/AnimatedBackground";

export default function IdentityScreen() {
  const { colorScheme } = useTheme();
  const [account, setAccount] = useState<string | null>(null);
  const [authMethod, setAuthMethod] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [AuthModal, setAuthModal] = useState<any>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    if (Platform.OS === "web" && typeof window !== "undefined") {
      // Load AuthModal dynamically
      import("../components/AuthModal").then(m => {
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
      // Try to detect wallet name from account format or connector
      if (acc.startsWith('0x')) {
        // Check which wallet is connected
        if ((window as any).ethereum?.isMetaMask) {
          localStorage.setItem('wallet_name', 'MetaMask');
        } else if ((window as any).ethereum?.isCoinbaseWallet) {
          localStorage.setItem('wallet_name', 'Coinbase Wallet');
        } else {
          localStorage.setItem('wallet_name', 'Web3 Wallet');
        }
      }
    }
  };

  const handleDisconnect = async () => {
    if (Platform.OS === "web" && typeof window !== "undefined") {
      try {
        // Disconnect from MetaMask/wallet if connected
        const ethereum = (window as any).ethereum;
        if (ethereum) {
          // Request wallet to disconnect (not all wallets support this, but MetaMask does)
          try {
            // Clear wagmi connection state
            await ethereum.request({
              method: "wallet_revokePermissions",
              params: [{ eth_accounts: {} }]
            });
          } catch (err) {
            // If revoke permissions not supported, just clear local state
            console.log('Wallet disconnect not supported, clearing local state');
          }
        }
      } catch (err) {
        console.warn('Failed to disconnect wallet:', err);
      }

      // Clear all auth-related storage
      localStorage.removeItem('auth_session');
      localStorage.removeItem('auth_email');
      localStorage.removeItem('auth_method');
      localStorage.removeItem('wallet_name');

      // Clear wagmi storage
      localStorage.removeItem('wagmi.store');
      localStorage.removeItem('wagmi.cache');
      localStorage.removeItem('wagmi.wallet');
    }

    setAccount(null);
    setAuthMethod(null);

    // Reload page to ensure clean state
    if (Platform.OS === "web" && typeof window !== "undefined") {
      window.location.reload();
    }
  };

  const formatAddress = (addr: string) => {
    if (!addr) return '';
    if (addr.startsWith('0x')) {
      return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
    }
    if (addr.includes('@')) {
      return addr.split('@')[0];
    }
    return addr;
  };

  const isDark = colorScheme === "dark";

  const renderContent = () => (
    <>
      {/* Header */}
          <View className="mb-8">
            <Text className="text-[#0A1628] dark:text-[#00FF9C] text-4xl font-bold mb-2">
              Your Identity
            </Text>
            <Text className="text-gray-600 dark:text-gray-400 text-base">
              Create your unique human identity and start building your Proof of Sustainable Humanity.
            </Text>
          </View>

          {/* Authentication Card */}
          <View className="mb-8 bg-white dark:bg-[#0A1628] border-2 border-gray-300 dark:border-[#00FF9C]/20 rounded-3xl p-6">
            {Platform.OS === "web" ? (
              <>
                {isLoading ? (
                  <View className="items-center py-8">
                    <ActivityIndicator size="large" color={isDark ? "#00FF9C" : "#0A1628"} />
                    <Text className="text-gray-600 dark:text-gray-400 mt-4">Loading...</Text>
                  </View>
                ) : !account ? (
                  <View className="items-center">
                    <Fingerprint size={48} color={isDark ? "#00FF9C" : "#0A1628"} />
                    <Text className="text-[#0A1628] dark:text-white text-xl font-bold mt-4 text-center">
                      Connect Your Account
                    </Text>
                    <Text className="text-gray-600 dark:text-gray-400 text-center mt-2 mb-6">
                      Choose your preferred authentication method to create your PoSH identity
                    </Text>

                    <View className="w-full max-w-sm">
                      <button
                        onClick={() => setShowAuthModal(true)}
                        className="w-full px-6 py-3 bg-[#00FF9C] hover:bg-[#00FF9C]/90 text-[#0A1628] font-mono text-sm rounded-lg transition-all flex items-center justify-center"
                      >
                        <span className="mr-2">🔐</span>
                        GET STARTED
                      </button>
                    </View>

                    <View className="mt-6 pt-6 border-t border-gray-200 dark:border-[#00FF9C]/10 w-full">
                      <Text className="text-gray-500 dark:text-gray-400 text-xs text-center mb-3">
                        Multiple authentication options:
                      </Text>
                      <View className="flex-row flex-wrap justify-center gap-2">
                        <View className="bg-gray-100 dark:bg-[#050B10] px-3 py-1 rounded-full">
                          <Text className="text-gray-700 dark:text-gray-400 text-xs">🔐 Wallet</Text>
                        </View>
                        <View className="bg-gray-100 dark:bg-[#050B10] px-3 py-1 rounded-full">
                          <Text className="text-gray-700 dark:text-gray-400 text-xs">📧 Email</Text>
                        </View>
                        <View className="bg-gray-100 dark:bg-[#050B10] px-3 py-1 rounded-full">
                          <Text className="text-gray-700 dark:text-gray-400 text-xs">🌐 Google</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                ) : (
                  <View className="items-center">
                    <Shield size={48} color="#00FF9C" />
                    <Text className="text-[#0A1628] dark:text-white text-xl font-bold mt-4 text-center">
                      Account Connected
                    </Text>
                    <View className="bg-gray-100 dark:bg-[#050B10] px-3 py-1 rounded-full mt-2 mb-2">
                      <Text className="text-gray-700 dark:text-gray-400 text-xs capitalize">
                        via {authMethod || 'unknown'}
                      </Text>
                    </View>
                    <Text className="text-gray-600 dark:text-gray-400 text-center mt-2 font-mono text-sm">
                      {formatAddress(account)}
                    </Text>
                    <View className="mt-6 w-full space-y-3 max-w-sm">
                      <button
                        className="w-full px-6 py-3 bg-[#00FF9C] hover:bg-[#00FF9C]/90 text-[#0A1628] font-mono text-sm rounded-lg transition-all"
                      >
                        CREATE IDENTITY
                      </button>
                      <button
                        onClick={handleDisconnect}
                        className="w-full px-6 py-3 bg-transparent border border-gray-300 dark:border-[#00FF9C]/30 text-[#0A1628] dark:text-white font-mono text-sm rounded-lg hover:border-[#00FF9C] transition-all"
                      >
                        DISCONNECT
                      </button>
                    </View>
                  </View>
                )}
              </>
            ) : (
              <View className="items-center">
                <Fingerprint size={48} color="#00FF9C" />
                <Text className="text-white text-xl font-bold mt-4 text-center">
                  Identity Available on Web
                </Text>
                <Text className="text-gray-400 text-center mt-2">
                  Please use the web version to create your identity.
                </Text>
              </View>
            )}
          </View>

          {/* Auth Modal */}
          {AuthModal && (
            <AuthModal
              visible={showAuthModal}
              onClose={() => setShowAuthModal(false)}
              onSuccess={handleAuthSuccess}
            />
          )}

          {/* What is PoSH Section */}
          <View className="mb-8">
            <Text className="text-[#0A1628] dark:text-white text-xl font-bold mb-4">
              What is Proof of Sustainable Humanity?
            </Text>

            <View className="bg-white dark:bg-[#0A1628] border border-gray-300 dark:border-[#00FF9C]/20 rounded-2xl p-5 mb-4">
              <View className="mb-4">
                <View className="flex-row items-start">
                  <View className="bg-[#00FF9C]/20 rounded-full p-2 mr-3">
                    <Zap size={20} color="#00FF9C" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-[#0A1628] dark:text-white font-semibold mb-1">
                      Action-Based Proof
                    </Text>
                    <Text className="text-gray-600 dark:text-gray-400 text-sm">
                      Unlike PoW or PoS, PoSH is based on your real-world sustainable actions.
                    </Text>
                  </View>
                </View>
              </View>

              <View className="mb-4">
                <View className="flex-row items-start">
                  <View className="bg-[#00FF9C]/20 rounded-full p-2 mr-3">
                    <Lock size={20} color="#00FF9C" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-[#0A1628] dark:text-white font-semibold mb-1">
                      Privacy-Preserving
                    </Text>
                    <Text className="text-gray-600 dark:text-gray-400 text-sm">
                      Prove your impact without exposing personal data.
                    </Text>
                  </View>
                </View>
              </View>

              <View className="mb-4">
                <View className="flex-row items-start">
                  <View className="bg-[#00FF9C]/20 rounded-full p-2 mr-3">
                    <Shield size={20} color="#00FF9C" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-[#0A1628] dark:text-white font-semibold mb-1">
                      Sybil Resistant
                    </Text>
                    <Text className="text-gray-600 dark:text-gray-400 text-sm">
                      One wallet = one identity. Verified through MRV sources.
                    </Text>
                  </View>
                </View>
              </View>

              <View>
                <View className="flex-row items-start">
                  <View className="bg-[#00FF9C]/20 rounded-full p-2 mr-3">
                    <Globe size={20} color="#00FF9C" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-[#0A1628] dark:text-white font-semibold mb-1">
                      Globally Accessible
                    </Text>
                    <Text className="text-gray-600 dark:text-gray-400 text-sm">
                      Works on any device, low bandwidth, no heavy KYC.
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* How It Works */}
          <View className="mb-8">
            <Text className="text-[#0A1628] dark:text-white text-xl font-bold mb-4">
              How It Works
            </Text>

            <View className="space-y-4">
              {[
                { step: "1", title: "Connect Wallet", desc: "Use MetaMask, Coinbase Wallet, or any Web3 wallet" },
                { step: "2", title: "Create Identity", desc: "Register your unique humanId on-chain (only gas fees)" },
                { step: "3", title: "Link MRV Sources", desc: "Connect your smart meter, EV, or renewable energy provider" },
                { step: "4", title: "Build Your Score", desc: "Earn PoSH proofs and mint Soulbound NFTs" },
              ].map((item) => (
                <View key={item.step} className="flex-row items-center mb-3">
                  <View className="bg-[#00FF9C] w-8 h-8 rounded-full items-center justify-center mr-4">
                    <Text className="text-[#0A1628] font-bold">{item.step}</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-[#0A1628] dark:text-white font-semibold">{item.title}</Text>
                    <Text className="text-gray-600 dark:text-gray-400 text-sm">{item.desc}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

      {/* Info Footer */}
      <View className="items-center pt-4 pb-20 border-t border-gray-200 dark:border-[#00FF9C]/10">
        <Text className="text-gray-500 text-xs text-center">
          PoSH is non-extractive. Only network gas fees apply.
        </Text>
      </View>
    </>
  );

  return (
    <AnimatedBackground isDark={isDark}>
      <ScrollView className="flex-1">
        <View className="px-6 py-12 max-w-2xl mx-auto w-full">
          {renderContent()}
        </View>
      </ScrollView>
      <View className="absolute left-0 right-0 bottom-0">
        <AppFooter />
      </View>
    </AnimatedBackground>
  );
}
