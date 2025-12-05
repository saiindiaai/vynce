"use client";

import { Check } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { themeCategories } from "@/lib/themes";
import Link from "next/link";

export function ThemeSelector() {
  const { currentTheme, setTheme, theme } = useTheme();

  // 🔥 Add this here
  const handleTheme = async (name: string) => {
    try {
      // instant UI update
      setTheme(name);

      // sync with backend
      await api.patch("/users/theme", { theme: name });
    } catch (err) {
      console.log("Theme update failed", err);
    }
  };

  return (
    <div className="px-4 pb-28">

      {/* Back */}
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

      {/* Category Loop */}
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
                  onClick={() => handleTheme(t.name)}
                  className={`
                    w-full p-4 rounded-2xl border flex items-center justify-between
                    transition-all bg-black/30
                    ${
                      currentTheme === t.name
                        ? "border-white/40"
                        : "border-white/10"
                    }
                  `}
                >
                  <div className="flex items-center gap-4">
                    {/* Preview color bars */}
                    <div className="flex gap-1">
                      <div className={`w-3 h-10 rounded-md ${t.primary}`} />
                      <div className={`w-3 h-10 rounded-md ${t.secondary}`} />
                      <div className={`w-3 h-10 rounded-md ${t.accent}`} />
                    </div>

                    <div>
                      <h4 className={`font-semibold ${theme.textPrimary}`}>
                        {t.name}
                      </h4>

                      {currentTheme === t.name && (
                        <p className={`text-xs ${theme.textSecondary}`}>
                          Current theme
                        </p>
                      )}
                    </div>
                  </div>

                  {currentTheme === t.name && (
                    <Check className={`w-5 h-5 ${theme.textAccent}`} />
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
