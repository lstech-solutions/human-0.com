import React from 'react';
import { Platform, View, ScrollView } from 'react-native';
import { Tabs, Stack, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/ThemeProvider';
import { AppFooter } from '../../components/AppFooter';
import { 
  Home, 
  User, 
  Zap, 
  Award, 
  Grid3X3, 
  BarChart3 
} from 'lucide-react-native';

function AuthenticatedWrapper({ children }: { children: React.ReactNode }) {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === 'dark';

  return (
    <View className="flex-1" style={{ backgroundColor: isDark ? '#050B10' : '#FFFFFF' }}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingBottom: 80 // Space for sticky footer
        }}
        showsVerticalScrollIndicator={true}
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled={true}
      >
        {children}
      </ScrollView>
      
      {/* Sticky footer */}
      <View className="absolute bottom-0 left-0 right-0 bg-white/95 dark:bg-[#0d1117]/95 backdrop-blur-sm border-t border-[#d0d7de] dark:border-[#30363d] z-20">
        <AppFooter />
      </View>
    </View>
  );
}

function DesktopNavbar() {
  const { colorScheme } = useTheme();
  const router = useRouter();
  const isDark = colorScheme === 'dark';
  const headerTint = isDark ? '#00FF9C' : '#0A1628';
  const headerBg = isDark ? '#050B10' : '#FFFFFF';

  const navItems = [
    { name: '/(authenticated)/', title: 'Home', icon: Home },
    { name: '/(authenticated)/identity', title: 'Identity', icon: User },
    { name: '/(authenticated)/impact', title: 'Impact', icon: Zap },
    { name: '/(authenticated)/nfts', title: 'NFTs', icon: Grid3X3 },
    { name: '/(authenticated)/dashboard', title: 'Dashboard', icon: BarChart3 },
    { name: '/(authenticated)/profile', title: 'Profile', icon: Award },
  ];

  return (
    <View className="border-b border-gray-200 dark:border-gray-700">
      <View className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <View className="flex justify-between h-16">
          <View className="flex">
            <View className="flex-shrink-0 flex items-center">
              <button
                onClick={() => router.push('/(authenticated)/' as any)}
                className="text-xl font-bold"
                style={{ color: headerTint }}
              >
                HUMΛN-Ø
              </button>
            </View>
            <View className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.name}
                    onClick={() => router.push(item.name as any)}
                    className="inline-flex items-center px-1 pt-1 text-sm font-medium"
                    style={{ color: headerTint }}
                  >
                    <Icon size={16} color={headerTint} />
                    <span className="ml-2">{item.title}</span>
                  </button>
                );
              })}
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

export default function AuthenticatedLayout() {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === 'dark';
  const headerTint = isDark ? '#00FF9C' : '#0A1628';
  const headerBg = isDark ? '#050B10' : '#FFFFFF';

  if (Platform.OS === 'web') {
    // On web, use stack navigation with desktop navbar
    return (
      <View className="flex-1" style={{ backgroundColor: headerBg }}>
        <DesktopNavbar />
        <AuthenticatedWrapper>
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: {
                backgroundColor: 'transparent',
              },
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen name="identity" />
            <Stack.Screen name="impact" />
            <Stack.Screen name="nfts" />
            <Stack.Screen name="dashboard" />
            <Stack.Screen name="profile" />
          </Stack>
        </AuthenticatedWrapper>
      </View>
    );
  }

  // On native, use tabs
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: headerBg }}>
      <AuthenticatedWrapper>
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarStyle: {
              backgroundColor: headerBg,
              borderTopColor: isDark ? '#30363d' : '#e5e7eb',
            },
            tabBarActiveTintColor: '#00FF9C',
            tabBarInactiveTintColor: isDark ? '#9CA3AF' : '#6B7280',
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: 'Home',
              tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
            }}
          />
          <Tabs.Screen
            name="identity"
            options={{
              title: 'Identity',
              tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
            }}
          />
          <Tabs.Screen
            name="impact"
            options={{
              title: 'Impact',
              tabBarIcon: ({ color, size }) => <Zap size={size} color={color} />,
            }}
          />
          <Tabs.Screen
            name="nfts"
            options={{
              title: 'NFTs',
              tabBarIcon: ({ color, size }) => <Grid3X3 size={size} color={color} />,
            }}
          />
          <Tabs.Screen
            name="profile"
            options={{
              title: 'Profile',
              tabBarIcon: ({ color, size }) => <Award size={size} color={color} />,
            }}
          />
          <Tabs.Screen
            name="dashboard"
            options={{
              title: 'Dashboard',
              tabBarIcon: ({ color, size }) => <BarChart3 size={size} color={color} />,
            }}
          />
        </Tabs>
      </AuthenticatedWrapper>
    </SafeAreaView>
  );
}
