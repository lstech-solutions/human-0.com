import {
  DefaultTheme,
  ThemeProvider as NavigationThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { View } from "react-native";
import "react-native-reanimated";
import "../global.css";

// Initialize i18n - must be imported before any components that use translations
import "@human-0/i18n";
import { ThemeProvider, useTheme } from "../theme/ThemeProvider";
import { ThemeSwitcher } from "../components/ui/theme-switcher";
import { LanguageSwitcher } from "../components/ui/LanguageSwitcher";

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

  // Keep navigation bar consistently dark-themed regardless of app colorScheme
  const navTheme = DarkTheme;
  const headerBg = "#050B10";
  const headerTint = "#00FF9C";

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
              title: "HUMΛN-Ø"
            }} 
          />
          <Stack.Screen
            name="impact"
            options={{
              title: "Impact Tracking",
            }}
          />
          <Stack.Screen
            name="nfts"
            options={{
              title: "NFT Collection",
            }}
          />
          <Stack.Screen
            name="profile"
            options={{
              title: "Profile",
            }}
          />
          <Stack.Screen
            name="canvas"
            options={{
              title: "Business Model",
            }}
          />
          <Stack.Screen
            name="pdf-download"
            options={{
              title: "PDF Downloads",
            }}
          />
        </Stack>
        {/* Navigation bar is dark; use light status bar icons for consistency */}
        <StatusBar style="light" />
      </View>
    </NavigationThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <NavigationStack />
    </ThemeProvider>
  );
}
