'use client';

import { useTheme } from '@/hooks/useTheme';

export default function CoreApps() {
  const { theme } = useTheme();

  return (
    <div className="px-6 mb-6 pb-24">
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-lg font-bold ${theme.textPrimary}`}>Core Apps</h3>
        <span className={`text-xs ${theme.textSecondary}`}>3 Available</span>
      </div>

      <div className="space-y-3">
        <div
          className={`${theme.cardBg} rounded-2xl p-4 border ${theme.cardBorder} ${theme.hoverBorder} transition-all`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div
                className={`w-14 h-14 bg-gradient-to-br ${theme.primary} rounded-xl flex items-center justify-center shadow-lg`}
              >
                <span className="text-xl">💬</span>
              </div>
              <div>
                <h4 className={`font-bold text-base ${theme.textPrimary}`}>Vynce Social</h4>
                <p className={`text-xs ${theme.textSecondary}`}>Connect & Share</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-bold text-green-500">95%</div>
              <div className={`text-[10px] ${theme.textSecondary}`}>12.5K users</div>
            </div>
          </div>
        </div>

        <div
          className={`${theme.cardBg} rounded-2xl p-4 border ${theme.cardBorder} ${theme.hoverBorder} transition-all`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div
                className={`w-14 h-14 bg-gradient-to-br ${theme.secondary} rounded-xl flex items-center justify-center shadow-lg`}
              >
                <span className="text-xl">🌐</span>
              </div>
              <div>
                <h4 className={`font-bold text-base ${theme.textPrimary}`}>Vynce Connect</h4>
                <p className={`text-xs ${theme.textSecondary}`}>Network Hub</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-bold text-green-500">92%</div>
              <div className={`text-[10px] ${theme.textSecondary}`}>8.3K users</div>
            </div>
          </div>
        </div>

        <div
          className={`${theme.cardBg} rounded-2xl p-4 border ${theme.cardBorder} ${theme.hoverBorder} transition-all`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div
                className={`w-14 h-14 bg-gradient-to-br ${theme.accent} rounded-xl flex items-center justify-center shadow-lg`}
              >
                <span className="text-xl">🤖</span>
              </div>
              <div>
                <h4 className={`font-bold text-base ${theme.textPrimary}`}>Vynce AI</h4>
                <p className={`text-xs ${theme.textSecondary}`}>Smart Assistant</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-bold text-green-500">98%</div>
              <div className={`text-[10px] ${theme.textSecondary}`}>15.7K users</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
