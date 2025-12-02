import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { X, Mail, Chrome } from 'lucide-react-native';
import { useConnect, useAccount, useDisconnect } from 'wagmi';
import { Web3ModalButton } from './Web3ModalButton';

type AuthMethod = 'wallet' | 'email' | 'otp' | 'social';

interface AuthModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: (account: string, method: AuthMethod) => void;
}

export function AuthModal({ visible, onClose, onSuccess }: AuthModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<AuthMethod | null>(null);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [hasBrowserWallet, setHasBrowserWallet] = useState(false);

  const { connectAsync, connectors, isPending } = useConnect();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const [web3ModalOpen, setWeb3ModalOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== 'undefined') {
      setHasBrowserWallet(!!(window as any).ethereum);
    }
  }, []);

  // Listen for Web3Modal connection changes
  useEffect(() => {
    if (isConnected && address && isLoading) {
      // Web3Modal connected successfully
      setIsLoading(false);
      if (typeof window !== 'undefined') {
        localStorage.setItem('wallet_name', 'Web3Modal Wallet');
        localStorage.setItem('auth_email', address);
        localStorage.setItem('auth_method', 'wallet');
      }
      onSuccess?.(address, 'wallet');
      onClose();
    }
  }, [isConnected, address, isLoading, onSuccess, onClose]);

  if (!isMounted) {
    return null;
  }

  const handleWeb3ModalConnect = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // For now, show a message that Web3Modal is coming soon
      // This avoids the build issues while keeping the UI
      setError('Web3Modal integration coming soon! Please use MetaMask or other injected wallets for now.');
      setIsLoading(false);
    } catch (err: any) {
      setError(err.message || 'Failed to open wallet modal');
      setIsLoading(false);
    }
  };

  const handleWalletConnect = async (connectorId: string) => {
    setIsLoading(true);
    setError(null);

    const timeoutId = setTimeout(() => {
      setIsLoading((prev) => {
        if (prev) {
          setError('Connection timed out. Please try again.');
          return false;
        }
        return prev;
      });
    }, 15000);

    try {
      let connector = connectors.find((c: any) => c.id === connectorId);

      if (!connector && connectorId === 'walletConnect') {
        connector = connectors.find((c: any) =>
          c.id === 'walletConnect' || c.name?.toLowerCase().includes('walletconnect')
        );
      }

      if (!connector && connectorId === 'injected' && hasBrowserWallet) {
        if (typeof window !== 'undefined') {
          const ethereum = (window as any).ethereum;
          if (ethereum) {
            try {
              const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
              if (accounts && accounts.length > 0) {
                const walletName = ethereum.isMetaMask ? 'MetaMask' :
                  ethereum.isCoinbaseWallet ? 'Coinbase Wallet' : 'Browser Wallet';
                localStorage.setItem('wallet_name', walletName);
                localStorage.setItem('auth_email', accounts[0]);
                localStorage.setItem('auth_method', 'wallet');

                clearTimeout(timeoutId);
                setIsLoading(false);
                onSuccess?.(accounts[0], 'wallet');
                onClose();
                return;
              }
            } catch (err: any) {
              clearTimeout(timeoutId);
              setIsLoading(false);
              if (err.code === 4001) {
                setError('Connection request was rejected');
              } else {
                setError(err.message || 'Failed to connect wallet');
              }
              return;
            }
          }
        }
      }

      if (!connector) {
        clearTimeout(timeoutId);
        setIsLoading(false);
        setError('Connector not available. Please ensure your wallet is installed.');
        return;
      }

      const data = await connectAsync({ connector });

      clearTimeout(timeoutId);
      if (typeof window !== 'undefined') {
        localStorage.setItem('wallet_name', connector.name);
        localStorage.setItem('auth_email', data.accounts[0]);
        localStorage.setItem('auth_method', 'wallet');
      }
      setIsLoading(false);
      onSuccess?.(data.accounts[0], 'wallet');
      onClose();

    } catch (err: any) {
      clearTimeout(timeoutId);
      setIsLoading(false);
      if (err.message?.includes('User rejected')) {
        setError('Connection request was rejected');
      } else {
        setError(err.message || 'Failed to connect wallet');
      }
    }
  };

  const handleEmailMagicLink = async () => {
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/magic-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Failed to send magic link');
      }

      setMagicLinkSent(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send magic link');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPVerify = async () => {
    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit code');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });

      if (!response.ok) {
        throw new Error('Invalid verification code');
      }

      const data = await response.json();
      onSuccess?.(data.userId, 'otp');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to verify code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (typeof window !== 'undefined') {
        window.location.href = '/api/auth/google';
      }
    } catch (err: any) {
      setError(err.message || 'Failed to initiate Google login');
      setIsLoading(false);
    }
  };

  const renderMethodSelection = () => (
    <View className="space-y-4">
      <Text className="text-2xl font-bold text-center text-human-text-light dark:text-human-text-dark mb-2">
        Connect Your Account
      </Text>
      <Text className="text-sm text-center text-human-muted-light dark:text-human-muted-dark mb-6">
        Choose your preferred authentication method
      </Text>

      <TouchableOpacity
        onPress={() => setSelectedMethod('wallet')}
        className="bg-human-surface-light dark:bg-human-bg-dark border-2 border-gray-200 dark:border-human-primary/30 rounded-2xl p-4 flex-row items-center"
        activeOpacity={0.7}
      >
        <View className="bg-human-primary/20 p-3 rounded-xl">
          <Text className="text-2xl">🦊</Text>
        </View>
        <View className="flex-1 ml-4">
          <Text className="text-lg font-semibold text-human-text-light dark:text-human-text-dark">
            Web3 Wallet
          </Text>
          <Text className="text-sm text-human-muted-light dark:text-human-muted-dark">
            MetaMask, Coinbase Wallet, WalletConnect
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => setSelectedMethod('email')}
        className="bg-human-surface-light dark:bg-human-bg-dark border-2 border-gray-200 dark:border-blue-500/30 rounded-2xl p-4 flex-row items-center"
        activeOpacity={0.7}
      >
        <View className="bg-blue-500/20 p-3 rounded-xl">
          <Mail size={24} color="#3B82F6" />
        </View>
        <View className="flex-1 ml-4">
          <Text className="text-lg font-semibold text-human-text-light dark:text-human-text-dark">
            Email Magic Link
          </Text>
          <Text className="text-sm text-human-muted-light dark:text-human-muted-dark">
            Passwordless login via email
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleGoogleLogin}
        disabled={isLoading}
        className="bg-human-surface-light dark:bg-human-bg-dark border-2 border-gray-200 dark:border-red-500/30 rounded-2xl p-4 flex-row items-center"
        activeOpacity={0.7}
      >
        <View className="bg-red-500/20 p-3 rounded-xl">
          <Chrome size={24} color="#EF4444" />
        </View>
        <View className="flex-1 ml-4">
          <Text className="text-lg font-semibold text-human-text-light dark:text-human-text-dark">
            Google Account
          </Text>
          <Text className="text-sm text-human-muted-light dark:text-human-muted-dark">
            Sign in with Google
          </Text>
        </View>
      </TouchableOpacity>

      {error && (
        <View className="bg-red-50 dark:bg-red-500/10 border border-red-300 dark:border-red-500/30 rounded-xl p-3">
          <Text className="text-red-600 dark:text-red-400 text-sm text-center">{error}</Text>
        </View>
      )}
    </View>
  );

  const getConnectorIcon = (connectorName: string) => {
    const name = connectorName.toLowerCase();
    if (name.includes('metamask')) return '🦊';
    if (name.includes('coinbase')) return '🔵';
    if (name.includes('walletconnect')) return '🔗';
    if (name.includes('injected')) return '🔐';
    return '💼';
  };

  const getConnectorDescription = (connectorName: string) => {
    const name = connectorName.toLowerCase();
    if (name.includes('metamask')) return 'Browser extension wallet';
    if (name.includes('coinbase')) return 'Coinbase Wallet app';
    if (name.includes('walletconnect')) return 'Mobile wallet via QR code';
    if (name.includes('injected')) return 'Browser extension wallet';
    return 'Web3 wallet';
  };

  const renderWalletOptions = () => {
    const hasConnectors = connectors.length > 0;

    return (
      <ScrollView className="max-h-96">
        <View className="space-y-4">
          <TouchableOpacity
            onPress={() => setSelectedMethod(null)}
            className="flex-row items-center mb-4"
          >
            <Text className="text-human-muted-light dark:text-human-muted-dark">← Back</Text>
          </TouchableOpacity>

          <Text className="text-2xl font-bold text-center text-human-text-light dark:text-human-text-dark mb-2">
            Connect Wallet
          </Text>
          <Text className="text-sm text-center text-human-muted-light dark:text-human-muted-dark mb-6">
            Choose your preferred wallet
          </Text>

          {hasConnectors ? (
            <>
              {/* Web3Modal Option */}
              <Web3ModalButton
                onPress={handleWeb3ModalConnect}
                disabled={isLoading || isPending}
                isLoading={isLoading || isPending}
              />

              {/* Divider */}
              <View className="flex-row items-center my-4">
                <View className="flex-1 h-px bg-gray-300 dark:bg-gray-600" />
                <Text className="px-3 text-sm text-gray-500 dark:text-gray-400">Or connect directly</Text>
                <View className="flex-1 h-px bg-gray-300 dark:bg-gray-600" />
              </View>

              {/* Existing WalletConnect Connectors */}
              {connectors.map((connector: any) => (
                <TouchableOpacity
                  key={connector.id}
                  onPress={() => handleWalletConnect(connector.id)}
                  disabled={isLoading || isPending}
                  className="bg-human-surface-light dark:bg-human-bg-dark border-2 border-gray-200 dark:border-human-primary/30 rounded-2xl p-4 flex-row items-center"
                  activeOpacity={0.7}
                >
                  <View className="bg-human-primary/20 p-3 rounded-xl">
                    <Text className="text-2xl">{getConnectorIcon(connector.name)}</Text>
                  </View>
                  <View className="flex-1 ml-4">
                    <Text className="text-lg font-semibold text-human-text-light dark:text-human-text-dark">
                      {connector.name}
                    </Text>
                    <Text className="text-sm text-human-muted-light dark:text-human-muted-dark">
                      {getConnectorDescription(connector.name)}
                    </Text>
                  </View>
                  {(isLoading || isPending) && <ActivityIndicator color="#00FF9C" />}
                </TouchableOpacity>
              ))}
            </>
          ) : hasBrowserWallet ? (
            <TouchableOpacity
              onPress={() => handleWalletConnect('injected')}
              disabled={isLoading || isPending}
              className="bg-human-surface-light dark:bg-human-bg-dark border-2 border-gray-200 dark:border-human-primary/30 rounded-2xl p-4 flex-row items-center"
              activeOpacity={0.7}
            >
              <View className="bg-human-primary/20 p-3 rounded-xl">
                <Text className="text-2xl">
                  {(window as any).ethereum?.isMetaMask ? '🦊' :
                    (window as any).ethereum?.isCoinbaseWallet ? '🔵' : '🔐'}
                </Text>
              </View>
              <View className="flex-1 ml-4">
                <Text className="text-lg font-semibold text-human-text-light dark:text-human-text-dark">
                  {(window as any).ethereum?.isMetaMask ? 'MetaMask' :
                    (window as any).ethereum?.isCoinbaseWallet ? 'Coinbase Wallet' : 'Browser Wallet'}
                </Text>
                <Text className="text-sm text-human-muted-light dark:text-human-muted-dark">
                  Browser extension wallet
                </Text>
              </View>
              {(isLoading || isPending) && <ActivityIndicator color="#00FF9C" />}
            </TouchableOpacity>
          ) : (
            <>
              {/* Web3Modal Option - Always available */}
              <Web3ModalButton
                onPress={handleWeb3ModalConnect}
                disabled={isLoading || isPending}
                isLoading={isLoading || isPending}
              />

              <View className="bg-yellow-50 dark:bg-yellow-500/10 border border-yellow-300 dark:border-yellow-500/30 rounded-xl p-4">
                <Text className="text-yellow-700 dark:text-yellow-400 text-sm text-center">
                  No browser wallet detected. Use Web3Modal above to connect mobile wallets or install MetaMask.
                </Text>
              </View>
            </>
          )}

          {error && (
            <View className="bg-red-50 dark:bg-red-500/10 border border-red-300 dark:border-red-500/30 rounded-xl p-3 mt-4">
              <Text className="text-red-600 dark:text-red-400 text-sm text-center">{error}</Text>
            </View>
          )}
        </View>
      </ScrollView>
    );
  };

  const renderEmailForm = () => (
    <View className="space-y-4">
      <TouchableOpacity
        onPress={() => {
          setSelectedMethod(null);
          setMagicLinkSent(false);
          setEmail('');
        }}
        className="flex-row items-center mb-4"
      >
        <Text className="text-human-muted-light dark:text-human-muted-dark">← Back</Text>
      </TouchableOpacity>

      <Text className="text-2xl font-bold text-center text-human-text-light dark:text-human-text-dark mb-2">
        {magicLinkSent ? 'Check Your Email' : 'Email Magic Link'}
      </Text>

      {magicLinkSent ? (
        <View className="space-y-4">
          <View className="bg-human-primary/10 border border-human-primary/30 rounded-xl p-4">
            <Text className="text-center text-human-text-light dark:text-human-text-dark mb-2">
              We've sent a magic link to:
            </Text>
            <Text className="text-center text-human-primary font-semibold">
              {email}
            </Text>
          </View>
          <Text className="text-sm text-center text-human-muted-light dark:text-human-muted-dark">
            Click the link in your email to complete sign in.
          </Text>
          <TouchableOpacity
            onPress={() => setSelectedMethod('otp')}
            className="mt-4"
          >
            <Text className="text-center text-human-primary">
              Enter verification code instead
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View className="space-y-4">
          <Text className="text-sm text-center text-human-muted-light dark:text-human-muted-dark mb-4">
            Enter your email to receive a secure login link
          </Text>

          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="your@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            className="bg-gray-100 dark:bg-human-bg-dark border-2 border-gray-200 dark:border-human-primary/30 rounded-xl px-4 py-3 text-human-text-light dark:text-human-text-dark"
            placeholderTextColor="#9CA3AF"
          />

          <TouchableOpacity
            onPress={handleEmailMagicLink}
            disabled={isLoading}
            className="bg-human-primary rounded-xl py-4 flex-row items-center justify-center"
            activeOpacity={0.8}
          >
            {isLoading ? (
              <ActivityIndicator color="#050B10" />
            ) : (
              <Text className="text-human-bg-dark font-semibold text-lg">
                Send Magic Link
              </Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      {error && (
        <View className="bg-red-500/10 border border-red-500/30 rounded-xl p-3">
          <Text className="text-red-500 text-sm text-center">{error}</Text>
        </View>
      )}
    </View>
  );

  const renderOTPForm = () => (
    <View className="space-y-4">
      <TouchableOpacity
        onPress={() => setSelectedMethod('email')}
        className="flex-row items-center mb-4"
      >
        <Text className="text-human-muted-light dark:text-human-muted-dark">← Back</Text>
      </TouchableOpacity>

      <Text className="text-2xl font-bold text-center text-human-text-light dark:text-human-text-dark mb-2">
        Enter Verification Code
      </Text>
      <Text className="text-sm text-center text-human-muted-light dark:text-human-muted-dark mb-4">
        Enter the 6-digit code sent to {email}
      </Text>

      <TextInput
        value={otp}
        onChangeText={(text) => setOtp(text.replace(/[^0-9]/g, '').slice(0, 6))}
        placeholder="000000"
        keyboardType="number-pad"
        maxLength={6}
        className="bg-gray-100 dark:bg-human-bg-dark border-2 border-gray-200 dark:border-human-primary/30 rounded-xl px-4 py-3 text-human-text-light dark:text-human-text-dark text-center text-2xl tracking-widest"
        placeholderTextColor="#9CA3AF"
      />

      <TouchableOpacity
        onPress={handleOTPVerify}
        disabled={isLoading || otp.length !== 6}
        className={`rounded-xl py-4 flex-row items-center justify-center ${otp.length === 6 ? 'bg-human-primary' : 'bg-gray-400'
          }`}
        activeOpacity={0.8}
      >
        {isLoading ? (
          <ActivityIndicator color="#050B10" />
        ) : (
          <Text className="text-human-bg-dark font-semibold text-lg">
            Verify Code
          </Text>
        )}
      </TouchableOpacity>

      {error && (
        <View className="bg-red-500/10 border border-red-500/30 rounded-xl p-3">
          <Text className="text-red-500 text-sm text-center">{error}</Text>
        </View>
      )}
    </View>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-center items-center p-4">
        <View className="bg-human-surface-light dark:bg-human-surface-dark rounded-3xl p-6 w-full max-w-md relative">
          <TouchableOpacity
            onPress={onClose}
            className="absolute top-4 right-4 z-10 bg-gray-200 dark:bg-human-bg-dark rounded-full p-2"
            activeOpacity={0.7}
          >
            <X size={20} color="#6B7280" />
          </TouchableOpacity>

          {!selectedMethod && renderMethodSelection()}
          {selectedMethod === 'wallet' && renderWalletOptions()}
          {selectedMethod === 'email' && renderEmailForm()}
          {selectedMethod === 'otp' && renderOTPForm()}
        </View>
      </View>
    </Modal>
  );
}
