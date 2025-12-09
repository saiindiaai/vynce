"use client";

import { Bell, Zap, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/hooks/useTheme";

export default function EcoHeader() {
  const router = useRouter();
  const { theme } = useTheme();

  return (
    <div className="w-full bg-[#0d0d15]/95 backdrop-blur-xl border-b border-white/10 px-4 py-4">
      <div className="flex items-center justify-between">
        {/* LEFT — BRAND */}
        <div>
          <h1 className="text-4xl font-bold text-blue-400">Vynce</h1>
          <p className="text-sm text-gray-300 -mt-1">Your Multi-App Universe</p>
        </div>

        {/* RIGHT — ICON ACTIONS */}
        <div className="flex items-center gap-5">
          {/* SEARCH */}
          <button
            onClick={() => router.push("/ecosystem/search")}
            className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
          >
            <Search className="w-6 h-6 text-gray-300" />
          </button>

          {/* ENERGY */}
          <button
            onClick={() => router.push("/ecosystem/profile/energy")}
            className="relative p-2 rounded-xl bg-white/5 border border-yellow-500/20 hover:border-yellow-400 hover:bg-white/10 transition-all"
          >
            <Zap className="w-6 h-6 text-yellow-400" />
            <span className="absolute -top-1 -right-2 bg-yellow-500 text-black text-xs rounded-full px-1">
              5
            </span>
          </button>

          {/* NOTIFICATIONS */}
          <button
            onClick={() => router.push("/ecosystem/notifications")}
            className="relative p-2 rounded-xl bg-white/5 border border-blue-500/20 hover:border-blue-400 hover:bg-white/10 transition-all"
          >
            <Bell className="w-6 h-6 text-blue-300" />
            <span className="absolute -top-1 -right-2 bg-blue-500 text-white text-xs rounded-full px-1">
              1
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
