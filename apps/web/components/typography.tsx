"use client";

import { Text, TextProps } from "react-native";

const mergeClassName = (base: string, extra?: string) =>
  [base, extra].filter(Boolean).join(" ");

export const H1 = (props: TextProps) => (
  <Text
    {...props}
    className={mergeClassName(
      "text-3xl font-space-semibold text-human-text-light dark:text-human-text-dark",
      (props as any).className,
    )}
  />
);

export const Body = (props: TextProps) => (
  <Text
    {...props}
    className={mergeClassName(
      "text-base font-inter text-human-muted-light dark:text-human-muted-dark",
      (props as any).className,
    )}
  />
);
