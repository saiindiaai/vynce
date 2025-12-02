"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { themes } from "@/lib/themes";

interface ThemeStore {
  currentTheme: string;
  theme: any;
  setTheme: (themeName: string) => void;
}

export const useTheme = create<ThemeStore>()(
  persist(
    (set) => ({
      currentTheme: "Monochrome Royale",
      theme: themes["Monochrome Royale"],
      setTheme: (themeName: string) =>
        set({
          currentTheme: themeName,
          theme: themes[themeName],
        }),
    }),
    { name: "vynce-theme" }
  )
);
