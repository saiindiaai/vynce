"use client";

import { getAllThemes } from "@/config/themes";
import { ToastType, useAppStore } from "@/lib/store";
import { House } from "@/types";
import { Copy, Edit, LucideIcon } from "lucide-react";
import { useEffect, useRef } from "react";

type Props = {
  selectedHouse: House | undefined | null;
  selectedHouseRole: string | null;
  onClose: () => void;
  shareHouse: (opt: string) => void;
  showToast?: (message: string, type: ToastType, duration?: number, actionLabel?: string, action?: () => void) => void;
};

export default function HouseMenu({ selectedHouse, selectedHouseRole, onClose, shareHouse, showToast }: Props) {
  if (!selectedHouse) return null;
  const { currentTheme } = useAppStore();
  const themeClasses = getAllThemes()[currentTheme];
  const menuRef = useRef<HTMLDivElement>(null);

  type MenuItem = {
    id: string;
    icon: LucideIcon;
    label: string;
    action: () => void;
  };

  const memberItems: MenuItem[] = [
    { id: 'info', icon: Edit, label: 'View House Info', action: () => { onClose(); showToast?.('View House Info coming soon', 'info'); } },
    { id: 'copy', icon: Copy, label: 'Copy House Link', action: () => { onClose(); shareHouse('copy'); } },
  ];

  const menuItems = memberItems; // For now, only showing member items as requested

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <div
      ref={menuRef}
      className="absolute right-0 top-full mt-2 w-56 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50"
    >
      <div className="py-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={item.action}
            className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm text-slate-200 hover:bg-slate-700 hover:text-white transition-colors"
          >
            <item.icon size={16} className="text-slate-400" />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

