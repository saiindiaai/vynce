"use client";

import { getAllThemes, themeCategories } from "@/config/themes";
import { useAppStore } from "@/lib/store";
import { getThemeClasses } from "@/lib/themes";
import { Sparkles, X } from "lucide-react";

const ThemeSelector = () => {
  const { currentTheme, setCurrentTheme, setShowThemeSelector } = useAppStore();
  const themeClasses = getThemeClasses(currentTheme);
  const isCosmicRetroTheme = themeClasses?.style === "cosmic-retro";

  return (
    <div className="fixed inset-0 z-50 animate-fadeIn" onClick={() => setShowThemeSelector(false)}>
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>
      <div
        className={`relative w-full h-full ${themeClasses.bgSolid} flex flex-col animate-slideInLeft transition-colors duration-300`}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={`flex-shrink-0 px-4 py-4 border-b ${themeClasses.cardBorder} backdrop-blur-xl ${isCosmicRetroTheme ? "bg-black" : themeClasses.bgSolid}/95 shadow-sm relative overflow-hidden ${isCosmicRetroTheme ? "animate-auroraWave" : ""} animate-pop transition-all duration-300`}
        >
          <div className="flex items-center justify-between relative">
            <h3 className={`text-lg font-bold ${themeClasses.textPrimary}`}>Themes</h3>
            <button
              onClick={() => setShowThemeSelector(false)}
              className="p-2 rounded-full hover:bg-purple-500/30 transition-all duration-200 smooth-press text-purple-300 hover:text-purple-200"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Theme Grid */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
          {Object.entries(themeCategories).map(([category, themeNames]) => (
            <div key={category}>
              <h4
                className={`text-xs font-bold uppercase tracking-widest text-purple-300/60 mb-3 px-1`}
              >
                {category}
              </h4>
              <div className="space-y-2">
                {themeNames.map((themeName) => {
                  const theme = getAllThemes()[themeName];
                  const isSelected = currentTheme === themeName;
                  return (
                    <button
                      key={themeName}
                      onClick={() => {
                        setCurrentTheme(themeName);
                        setShowThemeSelector(false);
                      }}
                      className={`w-full p-4 rounded-2xl border-2 transition-all duration-300 smooth-press glass-effect ${isSelected ? `border-purple-400/50 bg-purple-500/20 scale-105 shadow-lg shadow-purple-500/30 backdrop-blur-xl` : `border-purple-400/20 hover:border-purple-400/40 backdrop-blur-lg hover:bg-purple-500/10`}`}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-10 h-10 rounded-xl bg-gradient-to-br ${theme.primary} shadow-lg ring-2 ring-white/20 flex-shrink-0`}
                        ></div>
                        <div className="text-left">
                          <div className={`text-sm font-bold ${theme.textPrimary} text-purple-100`}>
                            {themeName}
                          </div>
                          <div className={`text-xs text-purple-300/60 capitalize`}>
                            {theme.style}
                          </div>
                        </div>
                        {isSelected && (
                          <Sparkles size={18} className="text-purple-300 ml-auto animate-spin" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ThemeSelector;
