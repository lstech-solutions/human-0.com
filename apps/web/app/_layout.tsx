import {
  DefaultTheme,
  ThemeProvider as NavigationThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { View } from "react-native";
import "react-native-reanimated";

// Polyfills for Viem + WalletConnect in React Native
import 'react-native-get-random-values'
import 'react-native-url-polyfill/auto'
import { Buffer } from 'buffer'

global.Buffer = Buffer

import "../global.css";

// Initialize i18n - must be imported before any components that use translations
import "@human-0/i18n";
import { ThemeProvider, useTheme } from "../theme/ThemeProvider";
import { ThemeSwitcher } from "../components/ui/theme-switcher";
import { LanguageSwitcher } from "../components/ui/LanguageSwitcher";
import { BackButton } from "../components/ui/BackButton";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const DarkTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#00FF9C",
    background: "#050B10",
    card: "#0A1628",
    text: "#FFFFFF",
    border: "#00FF9C33",
  },
};

const LightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#0A1628",
    background: "#FFFFFF",
    card: "#F7F9FC",
    text: "#050B10",
    border: "#0A162833",
  },
};

function ClickableTitle({ color, isHome }: { color: string; isHome?: boolean }) {
  const handleClick = () => {
    try {
      if (isHome) {
        // On home page, scroll to top
        if (typeof window !== 'undefined') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      } else {
        // Use simple window navigation to avoid router issues
        if (typeof window !== 'undefined') {
          window.location.href = '/';
        }
      }
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="text-lg font-bold hover:opacity-80 transition-opacity cursor-pointer"
      style={{ color }}
    >
      HUMΛN-Ø
    </button>
  );
}

function NavigationStack() {
  const { colorScheme } = useTheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  // Use theme-aware navigation bar colors
  const navTheme = colorScheme === "dark" ? DarkTheme : LightTheme;
  const headerBg = colorScheme === "dark" ? "#050B10" : "#FFFFFF";
  const headerTint = colorScheme === "dark" ? "#00FF9C" : "#0A1628";

  return (
    <NavigationThemeProvider value={navTheme}>
      <View className="flex-1 bg-white dark:bg-[#050B10]">
        <Stack
          screenOptions={({ route }) => ({
            headerShown: !route.name.startsWith("tempobook"),
            headerStyle: {
              backgroundColor: headerBg,
            },
            headerTintColor: headerTint,
            headerTitleStyle: {
              fontWeight: "bold",
            },
            contentStyle: {
              // Allow screen content to respect app colorScheme
              backgroundColor: colorScheme === "dark" ? "#050B10" : "#FFFFFF",
            },
            headerBackVisible: false,
            headerBackTitleVisible: false,
            gestureEnabled: true,
            headerRight: () => (
              <View className="flex-row items-center gap-2 mr-2">
                <LanguageSwitcher />
                <ThemeSwitcher />
              </View>
            ),
          })}
        >
          <Stack.Screen
            name="index"
            options={{
              headerShown: true,
              headerTitle: () => <ClickableTitle color={headerTint} isHome />,
              headerLeft: () => null,
            }}
          />
          <Stack.Screen
            name="impact"
            options={{
              headerTitle: () => <ClickableTitle color={headerTint} />,
            }}
          />
          <Stack.Screen
            name="nfts"
            options={{
              headerTitle: () => <ClickableTitle color={headerTint} />,
            }}
          />
          <Stack.Screen
            name="profile"
            options={{
              headerTitle: () => <ClickableTitle color={headerTint} />,
            }}
          />
          <Stack.Screen
            name="identity"
            options={{
              headerTitle: () => <ClickableTitle color={headerTint} />,
            }}
          />
          <Stack.Screen
            name="canvas"
            options={{
              headerTitle: () => <ClickableTitle color={headerTint} />,
            }}
          />
          <Stack.Screen
            name="pdf-download"
            options={{
              title: "PDF Downloads",
            }}
          />
          <Stack.Screen
            name="resources"
            options={{
              title: "Resources",
              headerTitle: () => <ClickableTitle color={headerTint} />,
            }}
          />
          <Stack.Screen
            name="privacy"
            options={{
              title: "Privacy Policy",
              headerLeft: () => <BackButton tintColor={headerTint} />,
            }}
          />
          <Stack.Screen
            name="terms"
            options={{
              title: "Terms of Service",
              headerLeft: () => <BackButton tintColor={headerTint} />,
            }}
          />
        </Stack>
        {/* Theme-aware status bar */}
        <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
      </View>
    </NavigationThemeProvider>
  );
}

import Web3Provider from '../providers/Web3Provider';
import { SupabaseAuthProvider } from '../providers/SupabaseAuthProvider';

// Dynamic import for PoshProvider to avoid import.meta errors on homepage
let PoshProvider: any = null;
let poshConfigReady = false;

if (typeof window !== 'undefined') {
  import('@human-0/posh-sdk/react').then(posh => {
    PoshProvider = posh.PoshProvider;
    poshConfigReady = true;
  }).catch(err => {
    console.warn('Failed to load PoshProvider:', err);
  });
}

export default function RootLayout() {
  // PoSH SDK configuration
  const poshConfig = {
    chainId: 84532, // Base Sepolia
    contracts: {
      humanIdentity: '0x00000000000000000000000000000000000000001' as `0x${string}`,
      humanScore: '0x00000000000000000000000000000000000000004' as `0x${string}`,
      proofRegistry: '0x00000000000000000000000000000000000000002' as `0x${string}`,
      poshNFT: '0x00000000000000000000000000000000000000003' as `0x${string}`,
    },
  };

  return (
    <SupabaseAuthProvider>
      <Web3Provider>
        <ThemeProvider>
          <NavigationStack />
        </ThemeProvider>
      </Web3Provider>
    </SupabaseAuthProvider>
  );
}
