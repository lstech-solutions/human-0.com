import React from "react";
import { View, Text, Platform } from "react-native";
import { Link } from "expo-router";
import { useTheme } from "../theme/ThemeProvider";
import { useTranslation } from "@human-0/i18n";
import { useLanguagePicker } from "@human-0/i18n/hooks";
import { getDocsUrl } from "../lib/docs-url";
import appPkg from "../package.json";

export function AppFooter() {
  const { colorScheme } = useTheme();
  const { t } = useTranslation();
  const { currentLanguage } = useLanguagePicker();
  const isDark = colorScheme === "dark";
  const APP_VERSION = appPkg.version || "0.0.0";

  return (
    <View className="border-t border-[#d0d7de] bg-white/90 dark:border-[#30363d] dark:bg-[#0d1117]">
      <View className="container mx-auto px-4 lg:px-8 py-3 lg:py-4">
        <View className="flex-row flex-wrap items-center justify-between gap-3">
          <View className="flex-row flex-wrap items-center gap-3 lg:gap-4">
            <Text className="text-[9px] lg:text-[10px] font-mono tracking-[0.18em] uppercase text-[#57606a] dark:text-[#c9d1d9]">
              HUMΛN-Ø
            </Text>
            <Text className="text-purple-600 dark:text-purple-300 text-[9px] lg:text-[10px] font-mono">
              v{APP_VERSION}
            </Text>
            <Text className="hidden lg:inline text-[#57606a] dark:text-[#8b949e]">·</Text>
            <Link 
              href="/privacy" 
              className="text-[#57606a] hover:text-[#24292f] dark:text-[#8b949e] dark:hover:text-[#c9d1d9] text-[9px] lg:text-[10px] underline decoration-dotted underline-offset-2 transition-colors"
            >
              Privacy
            </Link>
            <Text className="hidden lg:inline text-[#57606a] dark:text-[#8b949e]">·</Text>
            <Link 
              href="/terms" 
              className="text-[#57606a] hover:text-[#24292f] dark:text-[#8b949e] dark:hover:text-[#c9d1d9] text-[9px] lg:text-[10px] underline decoration-dotted underline-offset-2 transition-colors"
            >
              Terms
            </Link>
            <Text className="hidden lg:inline text-[#57606a] dark:text-[#8b949e]">·</Text>
            {Platform.OS === "web" && (
              <a 
                href={getDocsUrl('/', currentLanguage, isDark)} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-[#57606a] hover:text-[#24292f] dark:text-[#8b949e] dark:hover:text-[#c9d1d9] text-[9px] lg:text-[10px] underline decoration-dotted underline-offset-2 transition-colors"
              >
                Docs
              </a>
            )}
          </View>

          <View className="flex-row items-center gap-2">
            <View className="flex-row gap-1">
              <View className="w-1 h-1 bg-[#57606a] dark:bg-[#8b949e] rounded-full animate-pulse" />
              <View className="w-1 h-1 bg-[#8b949e] dark:bg-[#6e7681] rounded-full animate-pulse" style={{ animationDelay: '0.2s' } as any} />
              <View className="w-1 h-1 bg-[#d0d7de] dark:bg-[#484f58] rounded-full animate-pulse" style={{ animationDelay: '0.4s' } as any} />
            </View>
            <Text className="hidden lg:inline text-[#57606a] dark:text-[#8b949e] text-[9px] lg:text-[10px] font-mono">
              {t("footer.systemActive")}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
