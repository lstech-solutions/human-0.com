"use client";

import React, { useMemo } from "react";
import { Pressable, View } from "react-native";
import { Monitor, MoonStar, SunMedium } from "lucide-react-native";
import { useTheme } from "../../theme/ThemeProvider";

type ThemeValue = "light" | "dark" | "system";

const order: ThemeValue[] = ["system", "light", "dark"];
const icons: Record<ThemeValue, typeof Monitor> = {
  system: Monitor,
  light: SunMedium,
  dark: MoonStar,
};

export function ThemeSwitcher() {
  const { theme, setTheme, colorScheme } = useTheme();
  const activeTint = colorScheme === "dark" ? "#00FF9C" : "#0A1628";
  const bg = colorScheme === "dark" ? "#0A1628" : "#FFFFFF";
  const border = colorScheme === "dark" ? "#00FF9C33" : "#0A162833";

  const current: ThemeValue = useMemo(
    () => (order.includes(theme as ThemeValue) ? (theme as ThemeValue) : "system"),
    [theme],
  );

  const next = useMemo(() => {
    const idx = order.indexOf(current);
    return order[(idx + 1) % order.length];
  }, [current]);

  const Icon = icons[current];

  return (
    <Pressable
      onPress={() => setTheme(next)}
      accessibilityLabel="Toggle theme"
      accessibilityHint="Cycles through system, light, and dark modes"
      style={{
        borderColor: border,
        backgroundColor: bg,
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 8,
      }}
    >
      <View style={{ alignItems: "center", justifyContent: "center" }}>
        <Icon size={18} color={activeTint} />
      </View>
    </Pressable>
  );
}
