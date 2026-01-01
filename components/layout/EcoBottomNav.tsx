"use client";

import { Home, Settings, Store, User } from "lucide-react";
import { useRouter } from "next/navigation";

export default function EcoBottomNav() {
  const router = useRouter();

  const navItems = [
    { id: "home", label: "Home", path: "/ecosystem", icon: Home },
    { id: "profile", label: "Profile", path: "/ecosystem/profile", icon: User },
    { id: "store", label: "Store", path: "/ecosystem/store", icon: Store },
    { id: "settings", label: "Settings", path: "/ecosystem/settings", icon: Settings },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40">
      <div className="bg-slate-900 border-t border-slate-700/50">
        <div className="flex items-center justify-around pt-2 pb-4">
          {navItems.map(({ id, label, path, icon: Icon }) => (
            <button
              key={id}
              onClick={() => router.push(path)}
              className="flex flex-col items-center justify-center py-2.5 px-2 rounded-lg transition-all duration-200 gap-0.5 min-h-[44px] text-slate-400 hover:bg-slate-800/60 hover:text-slate-50"
              aria-label={label}
              title={label}
            >
              <Icon size={20} />
              <span className="text-xs font-medium leading-tight text-center">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
