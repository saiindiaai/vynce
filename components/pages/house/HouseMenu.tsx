"use client";

import { getAllThemes } from "@/config/themes";
import { ToastType, useAppStore } from "@/lib/store";
import { House } from "@/types";
import { Copy, Edit, Flag, LogOut, LucideIcon, Settings, Trash, Users, VolumeX } from "lucide-react";
import { useLayoutEffect, useState } from "react";
import { createPortal } from "react-dom";

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

  type MenuItem = {
    id: string;
    icon: LucideIcon;
    label: string;
    action: () => void;
    danger?: boolean;
  };

  const adminItems: MenuItem[] = [
    { id: 'edit', icon: Edit, label: 'Edit House', action: () => { onClose(); showToast?.('Edit House coming soon', 'info'); } },
    { id: 'manage', icon: Users, label: 'Manage Members', action: () => { onClose(); showToast?.('Manage Members coming soon', 'info'); } },
    { id: 'settings', icon: Settings, label: 'House Settings', action: () => { onClose(); showToast?.('House Settings coming soon', 'info'); } },
    { id: 'mute', icon: VolumeX, label: 'Mute Notifications', action: () => { onClose(); showToast?.('Mute Notifications coming soon', 'info'); } },
    { id: 'copy', icon: Copy, label: 'Copy House Link', action: () => { onClose(); shareHouse('copy'); } },
    { id: 'delete', icon: Trash, label: 'Delete House', danger: true, action: () => { onClose(); if (confirm('Are you sure you want to delete this house? This action cannot be undone.')) { showToast?.('Delete House coming soon', 'info'); } } }
  ];

  const memberItems: MenuItem[] = [
    { id: 'info', icon: Edit, label: 'View House Info', action: () => { onClose(); showToast?.('View House Info coming soon', 'info'); } },
    { id: 'mute', icon: VolumeX, label: 'Mute Notifications', action: () => { onClose(); showToast?.('Mute Notifications coming soon', 'info'); } },
    { id: 'copy', icon: Copy, label: 'Copy House Link', action: () => { onClose(); shareHouse('copy'); } },
    { id: 'leave', icon: LogOut, label: 'Leave House', action: () => { onClose(); showToast?.('Leave House coming soon', 'info'); } },
    { id: 'report', icon: Flag, label: 'Report House', danger: true, action: () => { onClose(); showToast?.('Report House coming soon', 'info'); } }
  ];

  const nonMemberItems: MenuItem[] = [
    { id: 'info', icon: Edit, label: 'View House Info', action: () => { onClose(); showToast?.('View House Info coming soon', 'info'); } },
    { id: 'copy', icon: Copy, label: 'Copy House Link', action: () => { onClose(); shareHouse('copy'); } },
  ];

  const menuItems = selectedHouseRole === 'creator' ? adminItems : selectedHouseRole === 'member' ? memberItems : nonMemberItems;

  const [portalEl] = useState<HTMLDivElement | null>(() => {
    if (typeof document === 'undefined') return null;
    return document.createElement('div');
  });

  useLayoutEffect(() => {
    if (!portalEl) return;
    document.body.appendChild(portalEl);
    return () => {
      if (portalEl && portalEl.parentNode) portalEl.parentNode.removeChild(portalEl);
    };
  }, [portalEl]);

  if (!portalEl) return null;

  return createPortal(
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-fadeIn" onClick={onClose} />

      {/* Bottom Sheet Menu */}
      <div className="fixed inset-x-0 bottom-0 z-50 animate-slideIn max-w-2xl mx-auto p-4">
        <div className={`rounded-3xl ${themeClasses.cardBg} border ${themeClasses.cardBorder} overflow-hidden shadow-2xl`}>
          <div className="divide-y divide-gray-700/50">
            {menuItems.map((item, idx) => (
              <button
                key={item.id}
                onClick={item.action}
                className={`w-full flex items-center gap-4 p-4 transition-all hover:bg-gray-700/30 ${item.danger ? 'hover:bg-red-500/10' : ''}`}
                style={{ animationDelay: `${idx * 30}ms` }}
              >
                <item.icon size={18} className={item.danger ? 'text-red-400' : 'text-white'} />
                <span className={`font-medium ${item.danger ? 'text-red-400' : 'text-white'}`}>{item.label}</span>
              </button>
            ))}
          </div>

          <button
            onClick={onClose}
            className={`w-full p-4 mt-1 border-t ${themeClasses.cardBorder} font-semibold text-white hover:bg-gray-700/30 transition-all`}
          >
            Cancel
          </button>
        </div>
      </div>
    </>,
    portalEl
  );
}

