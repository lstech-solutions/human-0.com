import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Platform } from 'react-native';
import { Redirect, Slot } from 'expo-router';

// Client-side only layout for dashboard
export default function DashboardLayout() {
  const [isMounted, setIsMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Only run on client
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      setIsMounted(true);
      
      // Check authentication
      import('../../hooks/useAuth').then(({ useAuth }) => {
        // Simple check - in real app, use the hook properly
        const hasSession = localStorage.getItem('auth_session') || 
                          localStorage.getItem('auth_email');
        setIsAuthenticated(!!hasSession);
        setIsLoading(false);
      });
    } else {
      setIsMounted(true);
      setIsLoading(false);
    }
  }, []);

  if (!isMounted || isLoading) {
    return (
      <View className="flex-1 bg-space-dark items-center justify-center">
        <ActivityIndicator size="large" color="#00FF9C" />
        <Text className="text-white mt-4">Loading dashboard...</Text>
      </View>
    );
  }

  // Redirect to home if not authenticated
  if (!isAuthenticated) {
    return <Redirect href="/?auth=required" />;
  }

  // Render dashboard content
  return <Slot />;
}
