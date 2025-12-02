"use client";

import { Appearance } from "react-native";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type ThemePreference = "light" | "dark" | "system";
type ColorScheme = "light" | "dark";

interface ThemeContextValue {
  theme: ThemePreference;
  colorScheme: ColorScheme;
  setTheme: (theme: ThemePreference) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

type Storage = {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
};

const fallbackStorage: Storage = {
  getItem: async (key: string) => {
    if (typeof localStorage === "undefined") return null;
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  setItem: async (key: string, value: string) => {
    if (typeof localStorage === "undefined") return;
    try {
      localStorage.setItem(key, value);
    } catch {
      // ignore
    }
  },
};

const getStorage = (): Storage => {
  try {
    // Optional native dependency
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mod = require("@react-native-async-storage/async-storage");
    if (mod?.default?.getItem && mod?.default?.setItem) {
      return mod.default as Storage;
    }
  } catch {
    // module not present, fall back
  }
  return fallbackStorage;
};

const storage = getStorage();

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemePreference>("system");
  const [colorScheme, setColorScheme] = useState<ColorScheme>("light");

  const setTheme = useCallback((next: ThemePreference) => {
    setThemeState(next);
    storage.setItem("theme", next).catch(() => {});
  }, []);

  // Load saved preference
  useEffect(() => {
    storage
      .getItem("theme")
      .then((saved) => {
        if (saved === "light" || saved === "dark" || saved === "system") {
          setThemeState(saved);
        }
      })
      .catch(() => {});
  }, []);

  // Respond to system changes
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      if (theme === "system" && colorScheme) {
        setColorScheme(colorScheme);
      }
    });

    return () => {
      subscription.remove();
    };
  }, [theme]);

  // Compute active colorScheme
  useEffect(() => {
    if (theme === "system") {
      setColorScheme(Appearance.getColorScheme() ?? "light");
    } else {
      setColorScheme(theme);
    }
    storage.setItem("theme", theme).catch(() => {});
  }, [theme]);

  // Sync to web HTML class for Tailwind dark mode
  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(colorScheme);
  }, [colorScheme]);

  const value = useMemo(
    () => ({
      theme,
      colorScheme,
      setTheme,
    }),
    [theme, colorScheme, setTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return ctx;
}
