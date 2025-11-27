"use client";

import { Bell, Zap, Search } from "lucide-react";

export default function EcoHeader() {
  return (
    <div className="w-full bg-[#0d0d15]/95 backdrop-blur-xl border-b border-white/10 px-4 py-4">
      <div className="flex items-center justify-between">
        
        {/* LEFT SIDE — Brand */}
        <div>
          <h1 className="text-4xl font-bold text-blue-400">Vynce</h1>
          <p className="text-sm text-gray-300 -mt-1">
            Your Multi-App Universe
          </p>
        </div>

        {/* RIGHT SIDE — Icons */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <Search className="w-6 h-6 text-gray-300" />

          {/* Energy */}
          <div className="relative">
            <Zap className="w-6 h-6 text-yellow-400" />
            <span className="absolute -top-1 -right-2 bg-yellow-500 text-black text-xs rounded-full px-1">
              5
            </span>
          </div>

          {/* Notifications */}
          <div className="relative">
            <Bell className="w-6 h-6 text-blue-300" />
            <span className="absolute -top-1 -right-2 bg-blue-500 text-white text-xs rounded-full px-1">
              1
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
