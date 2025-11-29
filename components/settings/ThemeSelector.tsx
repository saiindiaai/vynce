"use client";

import { Check } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { themeCategories } from "@/lib/themes";
import Link from "next/link";
import { api } from "@/lib/api";

export function ThemeSelector() {
  const updateTheme = async (name) => {
  try {
    await api.put("/themes", { theme: name });
    setTheme(name); // frontend + backend synced
  } catch (e) {
    console.log("Theme update failed");
  }
};

  return (
    <div className="px-4 pb-24">

      {/* Back Button */}
      <Link
        href="/ecosystem/settings"
        className={`text-sm font-semibold ${theme.textAccent}`}
      >
        ← Back to Settings
      </Link>

      <h2 className={`text-2xl font-bold mt-4 mb-1 ${theme.textPrimary}`}>
        Themes
      </h2>
      <p className={`${theme.textSecondary} text-sm`}>
        Choose your visual style
      </p>

      <div className="space-y-8 mt-6">
        {Object.entries(themeCategories).map(([category, categoryThemes]) => (
          <div key={category}>
            <h3 className={`text-lg font-bold mb-3 ${theme.textPrimary}`}>
              {category}
            </h3>

            <div className="space-y-4">
              {Object.values(categoryThemes).map((t) => (
                <button
                  key={t.name}
                  onClick={() => setTheme(t.name)}
                  className={`
                    w-full p-4 rounded-2xl border flex items-center justify-between 
                    transition-all ${t.cardBg} ${
                    currentTheme === t.name ? t.borderAccent : t.cardBorder
                  }
                  `}
                >
                  <div className="flex items-center gap-4">
                    {/* 3 color bars */}
                    <div className="flex gap-1">
                      <div className={`w-3 h-10 bg-gradient-to-b ${t.primary} rounded-md`} />
                      <div className={`w-3 h-10 bg-gradient-to-b ${t.secondary} rounded-md`} />
                      <div className={`w-3 h-10 bg-gradient-to-b ${t.accent} rounded-md`} />
                    </div>

                    <div>
                      <h4 className={`font-semibold ${t.textPrimary}`}>{t.name}</h4>

                      {currentTheme === t.name && (
                        <p className={`text-xs ${t.textSecondary}`}>Current theme</p>
                      )}
                    </div>
                  </div>

                  {currentTheme === t.name && (
                    <Check className={`w-5 h-5 ${t.textAccent}`} />
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
