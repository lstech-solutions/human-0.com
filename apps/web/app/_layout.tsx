import {
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import "../global.css";

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

export default function RootLayout() {
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

  return (
    <ThemeProvider value={DarkTheme}>
      <Stack
        screenOptions={({ route }) => ({
          headerShown: !route.name.startsWith("tempobook"),
          headerStyle: {
            backgroundColor: "#050B10",
          },
          headerTintColor: "#00FF9C",
          headerTitleStyle: {
            fontWeight: "bold",
          },
          contentStyle: {
            backgroundColor: "#050B10",
          },
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
      </Stack>
      <StatusBar style="light" />
    </ThemeProvider>
  );
}
