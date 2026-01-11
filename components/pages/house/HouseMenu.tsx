"use client";

import { getAllThemes } from "@/config/themes";
import { api } from "@/lib/api";
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
  onEditHouse?: (house: House) => void;
  onManageMembers?: (house: House) => void;
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
  onEditHouse,
  onManageMembers,
}: HouseMenuProps) {
  const { currentTheme, currentUser } = useAppStore();
  const allThemes = getAllThemes();
  const themeClasses = allThemes[currentTheme];

  if (!isOpen || !selectedHouse) return null;

  // Determine creator status: prefer `selectedHouseRole` when provided,
  // otherwise fall back to comparing the current user to `foundedBy`.
  const roleFromProp = selectedHouseRole === "creator" || selectedHouseRole === "founder";
  const userId = currentUser?.id || (typeof window !== 'undefined' ? localStorage.getItem('userId') : null);
  let foundedById: string | null = null;
  if (selectedHouse.foundedBy) {
    if (typeof selectedHouse.foundedBy === 'string') foundedById = selectedHouse.foundedBy;
    else if ((selectedHouse.foundedBy as any)._id) foundedById = (selectedHouse.foundedBy as any)._id;
    else foundedById = String((selectedHouse.foundedBy as any));
  }
  const roleFromComparison = !!userId && !!foundedById && String(userId) === String(foundedById);
  const isCreator = roleFromProp || roleFromComparison;

  // DEBUG: log for troubleshooting
  if (isOpen) {
    console.log("[HouseMenu Debug] selectedHouseRole:", selectedHouseRole);
    console.log("[HouseMenu Debug] currentUser:", currentUser);
    console.log("[HouseMenu Debug] userId (localStorage):", typeof window !== 'undefined' ? localStorage.getItem('userId') : 'N/A');
    console.log("[HouseMenu Debug] selectedHouse.foundedBy:", selectedHouse.foundedBy);
    console.log("[HouseMenu Debug] foundedById:", foundedById);
    console.log("[HouseMenu Debug] roleFromProp:", roleFromProp);
    console.log("[HouseMenu Debug] roleFromComparison:", roleFromComparison);
    console.log("[HouseMenu Debug] isCreator:", isCreator);
  }

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
      action: async () => {
        try {
          const res = await api.post(`/houses/${selectedHouse._id}/mute`);
          onClose();
          showToast?.(res.data.muted ? "House muted" : "House unmuted", "info");
        } catch (err) {
          console.error(err);
          showToast?.("Failed to toggle mute", "error");
        }
      },
    },
    {
      id: "report",
      label: "Report House",
      icon: Flag,
      color: "text-red-500",
      action: async () => {
        try {
          await api.post(`/houses/${selectedHouse._id}/report`, { reason: 'ui_report' });
          onClose();
          showToast?.("Report submitted. Thanks for keeping Vynce safe!", "info");
        } catch (err) {
          console.error(err);
          showToast?.("Failed to submit report", "error");
        }
      },
    },
    {
      id: "leave",
      label: "Leave House",
      icon: LogOut,
      color: "text-red-500",
      action: async () => {
        const confirmed = window.confirm(
          "Are you sure you want to leave this house? This action cannot be undone."
        );
        if (!confirmed) return;
        try {
          await api.post(`/houses/${selectedHouse._id}/leave`);
          onClose();
          showToast?.("You left the house", "info");
          // Optionally refresh or navigate away
          setTimeout(() => window.location.reload(), 400);
        } catch (err) {
          console.error(err);
          showToast?.("Failed to leave house", "error");
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
        if (selectedHouse && onEditHouse) {
          onEditHouse(selectedHouse);
        }
      },
    },
    {
      id: "manage",
      label: "Manage Members",
      icon: Users,
      color: themeClasses.textPrimary,
      action: () => {
        onClose();
        if (selectedHouse && onManageMembers) {
          onManageMembers(selectedHouse);
        }
      },
    },
    {
      id: "settings",
      label: "House Settings",
      icon: Settings,
      color: themeClasses.textPrimary,
      action: () => {
        onClose();
        // For now, house settings can use the same as edit house
        if (selectedHouse && onEditHouse) {
          onEditHouse(selectedHouse);
        }
      },
    },
    {
      id: "mute",
      label: "Mute Notifications",
      icon: Volume2,
      color: themeClasses.textPrimary,
      action: async () => {
        try {
          const res = await api.post(`/houses/${selectedHouse._id}/mute`);
          onClose();
          showToast?.(res.data.muted ? "House muted" : "House unmuted", "info");
        } catch (err) {
          console.error(err);
          showToast?.("Failed to toggle mute", "error");
        }
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
      action: async () => {
        const confirmed = window.confirm(
          "This will permanently delete the house. This cannot be undone. Are you sure?"
        );
        if (!confirmed) return;
        try {
          await api.delete(`/houses/${selectedHouse._id}`);
          onClose();
          showToast?.("House deleted", "info");
          setTimeout(() => window.location.reload(), 400);
        } catch (err) {
          console.error(err);
          showToast?.("Failed to delete house", "error");
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

