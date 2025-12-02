import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Platform, StyleSheet } from "react-native";
import { useAccount, useConnect, useDisconnect } from 'wagmi';

interface Web3ConnectButtonProps {
  className?: string;
  style?: any;
  children?: React.ReactNode;
}

export function Web3ConnectButton({ className, style, children }: Web3ConnectButtonProps) {
  const { address, isConnected } = useAccount();
  const { connect, connectors, error, isPending } = useConnect();
  const { disconnect } = useDisconnect();

  if (Platform.OS !== 'web') {
    return null;
  }

  const handleConnect = () => {
    if (isConnected) {
      disconnect();
      return;
    }

    const connector = connectors[0];
    if (connector) {
      connect({ connector });
    }
  };

  const formatAddress = (addr: string | undefined, start = 6, end = 4) => {
    if (!addr || addr.length < start + end) return addr || '';
    return `${addr.slice(0, start)}...${addr.slice(-end)}`;
  };

  const buttonText = isConnected 
    ? formatAddress(address)
    : children || 'Connect Wallet';

  return (
    <TouchableOpacity
      onPress={handleConnect}
      disabled={isPending}
      style={[styles.button, style]}
    >
      <Text style={styles.text}>
        {isPending 
          ? 'Connecting...' 
          : buttonText}
      </Text>
      {error && <Text style={styles.error}>{error.message}</Text>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#3182ce',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: 'white',
    fontWeight: '500',
  },
  error: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
  },
});
