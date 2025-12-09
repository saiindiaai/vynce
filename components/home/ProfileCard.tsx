"use client";

import { TrendingUp } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

export default function ProfileCard() {
  const { theme } = useTheme();

  return (
    <div className="mx-6 mb-6">
      <div className={`${theme.cardBg} rounded-2xl p-5 border ${theme.border}`}>
        <div className="flex items-center gap-4">
          <div
            className={`w-16 h-16 bg-gradient-to-br ${theme.primary} rounded-full flex items-center justify-center`}
          >
            {/* Avatar Placeholder */}
            <span className="text-white font-bold text-lg">A</span>
          </div>

          <div className="flex-1">
            <h2 className={`text-xl font-bold ${theme.textPrimary}`}>Aakash</h2>
            <p className={`text-sm ${theme.textSecondary}`}>Level 1 • Rising Star</p>
          </div>

          <TrendingUp className="w-5 h-5 text-green-500" />
        </div>
      </div>
    </div>
  );
}
