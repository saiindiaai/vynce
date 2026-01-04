"use client";

import { useAppStore } from "@/lib/store";
import { Gavel, Home, Link as LinkIcon, PlayCircle, Radio } from "lucide-react";

export default function BottomNav() {
  const { currentPage, setCurrentPage } = useAppStore();

  const navItems = [
    { id: "home" as const, label: "Home", icon: Home },
    { id: "capsules" as const, label: "Capsules", icon: PlayCircle },
    { id: "drops" as const, label: "Drops", icon: LinkIcon },
    { id: "vynce_house" as const, label: "House", icon: Radio },
    { id: "fight" as const, label: "Fight", icon: Gavel },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40">
      <div className="bg-slate-900 border-t border-slate-700/50">
        <div className="flex items-center justify-around pt-2 pb-4">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setCurrentPage(id)}
              className={`flex flex-col items-center justify-center py-2.5 px-2 sm:px-3 rounded-lg transition-all duration-200 gap-0.5 min-h-[44px] focus:outline-none focus-visible:outline-2 focus-visible:outline-purple-500 focus-visible:outline-offset-2 ${currentPage === id
                ? "bg-slate-800 text-slate-50"
                : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-50"
                }`}
              aria-label={`${label}${currentPage === id ? " (current page)" : ""}`}
              title={label}
            >
              <Icon size={20} />
              <span className="text-xs sm:text-xs font-medium leading-tight text-center">
                {label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
