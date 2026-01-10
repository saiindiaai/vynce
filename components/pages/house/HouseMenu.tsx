"use client";

import { getAllThemes } from "@/config/themes";
import { ToastType, useAppStore } from "@/lib/store";
import { House } from "@/types";
import {
  Copy,
  Edit,
  Flag,
  Info,
  LogOut,
  LucideIcon,
  Settings,
  Trash2,
  Users,
  Volume2,
} from "lucide-react";

interface HouseMenuProps {
  isOpen: boolean;
  onClose: () => void;
  selectedHouse: House | undefined | null;
  selectedHouseRole: string | null;
  shareHouse: (opt: string) => void;
  showToast?: (message: string, type: ToastType, duration?: number, actionLabel?: string, action?: () => void) => void;
}

type MenuItem = {
  id: string;
  label: string;
  icon: LucideIcon;
  color: string;
  action: () => void;
};

export default function HouseMenu({
  isOpen,
  onClose,
  selectedHouse,
  selectedHouseRole,
  shareHouse,
  showToast,
}: HouseMenuProps) {
  const { currentTheme } = useAppStore();
  const allThemes = getAllThemes();
  const themeClasses = allThemes[currentTheme];

  if (!isOpen || !selectedHouse) return null;

  const isCreator = selectedHouseRole === "creator" || selectedHouseRole === "founder";

  const memberItems: MenuItem[] = [
    {
      id: "info",
      label: "View House Info",
      icon: Info,
      color: themeClasses.textPrimary,
      action: () => {
        onClose();
        showToast?.("View House Info coming soon", "info");
      },
    },
    {
      id: "mute",
      label: "Mute Notifications",
      icon: Volume2,
      color: themeClasses.textPrimary,
      action: () => {
        onClose();
        showToast?.("House notifications muted", "success");
      },
    },
    {
      id: "report",
      label: "Report House",
      icon: Flag,
      color: "text-red-500",
      action: () => {
        onClose();
        showToast?.("Report submitted. Thanks for keeping Vynce safe!", "info");
      },
    },
    {
      id: "leave",
      label: "Leave House",
      icon: LogOut,
      color: "text-red-500",
      action: () => {
        const confirmed = window.confirm(
          "Are you sure you want to leave this house? This action cannot be undone."
        );
        if (confirmed) {
          onClose();
          showToast?.(
            "You left the house",
            "info",
            3000,
            "Undo",
            () => showToast?.("Undo not yet implemented", "info")
          );
        }
      },
    },
  ];

  const creatorItems: MenuItem[] = [
    {
      id: "edit",
      label: "Edit House",
      icon: Edit,
      color: themeClasses.textPrimary,
      action: () => {
        onClose();
        showToast?.("Edit House coming soon", "info");
      },
    },
    {
      id: "manage",
      label: "Manage Members",
      icon: Users,
      color: themeClasses.textPrimary,
      action: () => {
        onClose();
        showToast?.("Manage Members coming soon", "info");
      },
    },
    {
      id: "settings",
      label: "House Settings",
      icon: Settings,
      color: themeClasses.textPrimary,
      action: () => {
        onClose();
        showToast?.("House Settings coming soon", "info");
      },
    },
    {
      id: "mute",
      label: "Mute Notifications",
      icon: Volume2,
      color: themeClasses.textPrimary,
      action: () => {
        onClose();
        showToast?.("House notifications muted", "success");
      },
    },
    {
      id: "copy",
      label: "Copy House Link",
      icon: Copy,
      color: themeClasses.textPrimary,
      action: () => {
        onClose();
        shareHouse("copy");
      },
    },
    {
      id: "delete",
      label: "Delete House",
      icon: Trash2,
      color: "text-red-500",
      action: () => {
        const confirmed = window.confirm(
          "This will permanently delete the house. This cannot be undone. Are you sure?"
        );
        if (confirmed) {
          onClose();
          showToast?.("Delete House coming soon", "info");
        }
      },
    },
  ];

  const menuItems = isCreator ? creatorItems : memberItems;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-fadeIn"
        onClick={onClose}
      />

      {/* Menu */}
      <div className="fixed inset-x-0 bottom-0 z-50 animate-slideIn max-w-2xl mx-auto p-4">
        <div
          className={`rounded-3xl ${themeClasses.cardBg} border ${themeClasses.cardBorder} overflow-hidden shadow-2xl`}
        >
          <div className="divide-y divide-gray-700/50">
            {menuItems.map((item, idx) => (
              <button
                key={item.id}
                onClick={item.action}
                className={`w-full flex items-center gap-4 p-4 transition-all hover:bg-gray-700/30 animate-slideIn ${item.id === "report" || item.id === "delete" || item.id === "leave"
                  ? "hover:bg-red-500/10"
                  : ""
                  }`}
                style={{ animationDelay: `${idx * 30}ms` }}
              >
                <item.icon size={22} className={item.color} />
                <span className={`font-medium ${item.color}`}>{item.label}</span>
              </button>
            ))}
          </div>

          {/* Cancel Button */}
          <button
            onClick={onClose}
            className={`w-full p-4 mt-1 border-t ${themeClasses.cardBorder} font-semibold ${themeClasses.textSecondary} hover:bg-gray-700/30 transition-all`}
          >
            Cancel
          </button>
        </div>
      </div>
    </>
  );
}

