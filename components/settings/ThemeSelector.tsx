'use client';

import { Check } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { themeCategories } from '@/lib/themes';
import { TabType } from '@/types';

interface ThemeSelectorProps {
  onNavigate: (tab: TabType) => void;
}

export function ThemeSelector({ onNavigate }: ThemeSelectorProps) {
  const { theme, currentTheme, setTheme } = useTheme();

  return (
    <div className="px-6 pb-24">
      <div className="mb-6">
        <button
          onClick={() => onNavigate('settings')}
          className={`${theme.textAccent} text-sm font-semibold mb-4`}
        >
          ← Back to Settings
        </button>
        <h2 className={`text-2xl font-bold mb-2 ${theme.textPrimary}`}>Themes</h2>
        <p className={`text-sm ${theme.textSecondary}`}>Choose your visual style</p>
      </div>

      <div className="space-y-6">
        {Object.entries(themeCategories).map(([category, categoryThemes]) => (
          <div key={category}>
            <h3 className={`text-lg font-bold mb-3 ${theme.textPrimary}`}>{category}</h3>
            <div className="space-y-3">
              {Object.values(categoryThemes).map((t) => (
                <button
                  key={t.name}
                  onClick={() => setTheme(t.name)}
                  className={`w-full ${t.cardBg} rounded-2xl p-4 border ${
                    currentTheme === t.name ? t.borderAccent : t.cardBorder
                  } hover:${t.borderAccent} transition-all flex items-center justify-between`}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex gap-1">
                      <div className={`w-4 h-12 bg-gradient-to-b ${t.primary} rounded`}></div>
                      <div className={`w-4 h-12 bg-gradient-to-b ${t.secondary} rounded`}></div>
                      <div className={`w-4 h-12 bg-gradient-to-b ${t.accent} rounded`}></div>
                    </div>
                    <div className="text-left">
                      <h4 className={`font-bold ${t.textPrimary}`}>{t.name}</h4>
                      {currentTheme === t.name && (
                        <p className={`text-xs ${t.textSecondary}`}>Current theme</p>
                      )}
                    </div>
                  </div>
                  {currentTheme === t.name && <Check className={`w-5 h-5 ${t.textAccent}`} />}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
