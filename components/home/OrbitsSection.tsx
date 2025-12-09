"use client";

import { useTheme } from "@/hooks/useTheme";

export default function OrbitsSection() {
  const { theme } = useTheme();

  return (
    <div className="px-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className={`text-lg font-bold ${theme.textPrimary}`}>Your Orbits</h3>
          <p className={`text-xs ${theme.textSecondary}`}>175 connections</p>
        </div>
        <button className={`${theme.textAccent} text-sm font-semibold`}>View All →</button>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        <div className="flex flex-col items-center min-w-[100px]">
          <div
            className={`w-20 h-20 ${theme.cardBg} rounded-2xl flex items-center justify-center mb-2 border ${theme.cardBorder} ${theme.hoverBorder} transition-all`}
          >
            <span className={`text-3xl ${theme.textSecondary}`}>+</span>
          </div>
          <span className={`text-xs ${theme.textSecondary}`}>Add New</span>
        </div>

        <div className="flex flex-col items-center min-w-[100px]">
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl mb-2 shadow-lg"></div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-3 border-white shadow-lg"></div>
          </div>
          <span className={`text-xs font-medium ${theme.textPrimary}`}>Alex_V</span>
          <span className={`text-[10px] ${theme.textAccent}`}>In Orbit</span>
        </div>

        <div className="flex flex-col items-center min-w-[100px]">
          <div className="relative">
            <div
              className={`w-20 h-20 bg-gradient-to-br ${theme.accent} rounded-2xl mb-2 shadow-lg`}
            ></div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-3 border-white shadow-lg"></div>
          </div>
          <span className={`text-xs font-medium ${theme.textPrimary}`}>Maya_X</span>
          <span className={`text-[10px] ${theme.textAccent}`}>Following</span>
        </div>

        <div className="flex flex-col items-center min-w-[100px]">
          <div className="relative">
            <div
              className={`w-20 h-20 bg-gradient-to-br ${theme.secondary} rounded-2xl mb-2 shadow-lg`}
            ></div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gray-400 rounded-full border-3 border-white"></div>
          </div>
          <span className={`text-xs font-medium ${theme.textPrimary}`}>Jay_K</span>
          <span className={`text-[10px] ${theme.textSecondary}`}>Offline</span>
        </div>
      </div>
    </div>
  );
}
