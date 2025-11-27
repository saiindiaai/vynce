'use client';

import { Search, Bell, Zap } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

export default function Header() {
  const { theme } = useTheme();

  return (
    <div className="flex justify-between items-center px-6 py-6">
      <div>
        <h1 className={`text-3xl font-bold bg-gradient-to-r ${theme.primary} text-transparent bg-clip-text`}>
          Vynce
        </h1>
        <p className={`text-xs ${theme.textSecondary} mt-1`}>
          Your Social Universe
        </p>
      </div>

      <div className="flex gap-4 items-center">
        <Search className={`w-5 h-5 ${theme.textSecondary}`} />

        <div className="relative">
          <Zap className="w-5 h-5 text-yellow-500" />
          <span className="absolute -top-1 -right-1 bg-yellow-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
            5
          </span>
        </div>

        <div className="relative">
          <Bell className={`w-5 h-5 ${theme.textSecondary}`} />
          <span className={`absolute -top-1 -right-1 bg-gradient-to-r ${theme.primary} text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold`}>
            1
          </span>
        </div>
      </div>
    </div>
  );
}
