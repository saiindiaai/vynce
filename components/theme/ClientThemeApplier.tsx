// components/theme/ClientThemeApplier.tsx
"use client";

import { useEffect, useRef } from "react";
import { useAppStore } from "@/lib/store";
import { getAllThemes } from "@/config/themes";

/**
 * ClientThemeApplier:
 * - Runs only on client
 * - Reads currentTheme from Zustand
 * - Adds theme.root class (if present) to <body> or to document.documentElement
 * - Cleans up previous class on theme change / unmount
 */

export default function ClientThemeApplier() {
  const currentTheme = useAppStore((s) => s.currentTheme);
  const allThemes = getAllThemes();
  const themeClasses = allThemes[currentTheme] || allThemes["Vynce Nebula"];
  const prevClassRef = useRef<string | null>(null);

  useEffect(() => {
    // Theme classes are applied directly via Tailwind in components
    // This component ensures currentTheme is accessed but doesn't need to manipulate DOM
    return () => {};
  }, [currentTheme, themeClasses]);

  return null; // invisible component
}
