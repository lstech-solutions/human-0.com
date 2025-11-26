"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Animated, LayoutChangeEvent, Pressable, View } from "react-native";
import { Bookmark, Home, PlusCircle, Settings, User } from "lucide-react-native";
import { cn } from "../../lib/utils";
import { useTheme } from "../../theme/ThemeProvider";

export type NavItem = {
  id: string | number;
  icon: React.ReactElement;
  label?: string;
  onPress?: () => void;
};

type LimelightNavProps = {
  items?: NavItem[];
  defaultActiveIndex?: number;
  onTabChange?: (index: number) => void;
  className?: string;
  limelightClassName?: string;
  iconContainerClassName?: string;
  iconClassName?: string;
};

const defaultItems: NavItem[] = [
  { id: "home", icon: <Home size={16} />, label: "Home" },
  { id: "bookmark", icon: <Bookmark size={16} />, label: "Bookmarks" },
  { id: "add", icon: <PlusCircle size={16} />, label: "Add" },
  { id: "profile", icon: <User size={16} />, label: "Profile" },
  { id: "settings", icon: <Settings size={16} />, label: "Settings" },
];

export const LimelightNav: React.FC<LimelightNavProps> = ({
  items = defaultItems,
  defaultActiveIndex = 0,
  onTabChange,
  className,
  limelightClassName,
  iconContainerClassName,
  iconClassName,
}) => {
  const { colorScheme } = useTheme();
  const [activeIndex, setActiveIndex] = useState(defaultActiveIndex);
  const [positions, setPositions] = useState<Array<{ x: number; width: number }>>([]);
  const leftAnim = useRef(new Animated.Value(0)).current;
  const widthAnim = useRef(new Animated.Value(36)).current;

  const handleLayout = useCallback(
    (index: number, event: LayoutChangeEvent) => {
      const { x, width } = event.nativeEvent.layout;
      setPositions((prev) => {
        const next = [...prev];
        next[index] = { x, width };
        return next;
      });
    },
    [],
  );

  useEffect(() => {
    const pos = positions[activeIndex];
    if (!pos) return;
    Animated.timing(leftAnim, {
      toValue: pos.x + pos.width / 2 - 18,
      duration: 200,
      useNativeDriver: false,
    }).start();
    Animated.timing(widthAnim, {
      toValue: 36,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [activeIndex, positions, leftAnim, widthAnim]);

  const borderColor = colorScheme === "dark" ? "#00FF9C33" : "#0A162833";
  const bg = colorScheme === "dark" ? "#0A1628" : "#FFFFFF";
  const activeTint = colorScheme === "dark" ? "#00FF9C" : "#0A1628";
  const inactiveTint = colorScheme === "dark" ? "#94A3B8" : "#6B7280";

  const handlePress = (index: number, cb?: () => void) => {
    setActiveIndex(index);
    onTabChange?.(index);
    cb?.();
  };

  const Limelight = useMemo(
    () => (
      <Animated.View
        pointerEvents="none"
        style={{
          position: "absolute",
          top: 0,
          left: leftAnim,
          width: widthAnim,
          height: 4,
          borderRadius: 999,
          backgroundColor: activeTint,
        }}
        className={limelightClassName}
      />
    ),
    [activeTint, leftAnim, limelightClassName, widthAnim],
  );

  return (
    <View
      className={cn(
        "relative inline-flex h-12 items-center rounded-lg border px-1",
        className,
      )}
      style={{ backgroundColor: bg, borderColor, maxWidth: 260 }}
    >
      {items.map((item, index) => {
        const Icon = item.icon;
        const isActive = index === activeIndex;
        return (
          <Pressable
            key={item.id}
            onPress={() => handlePress(index, item.onPress)}
            onLayout={(e) => handleLayout(index, e)}
            className={cn(
              "relative z-20 flex h-full items-center justify-center px-2",
              iconContainerClassName,
            )}
            accessibilityLabel={item.label}
          >
            {React.cloneElement(Icon, {
              size: (Icon.props as any)?.size ?? 16,
              color: isActive ? activeTint : inactiveTint,
              className: cn(
                "transition-opacity",
                isActive ? "opacity-100" : "opacity-50",
                Icon.props.className,
                iconClassName,
              ),
            })}
          </Pressable>
        );
      })}
      {positions.length > 0 && Limelight}
    </View>
  );
};
