"use client";

import { ToastType } from "@/lib/store";
import { House } from "@/types";
import { Copy, Edit, Flag, LogOut, Settings, Trash, Users, VolumeX } from "lucide-react";

type Props = {
  selectedHouse: House | undefined | null;
  selectedHouseRole: string | null;
  onClose: () => void;
  shareHouse: (opt: string) => void;
  showToast?: (message: string, type: ToastType, duration?: number, actionLabel?: string, action?: () => void) => void;
};

export default function HouseMenu({ selectedHouse, selectedHouseRole, onClose, shareHouse, showToast }: Props) {
  if (!selectedHouse) return null;

  return (
    <div className="absolute right-0 top-full mt-2 w-60 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden">
      <div className="py-1">
        {selectedHouseRole === "creator" && (
          <>
            <button
              onClick={() => { onClose(); showToast?.("Edit House coming soon", "info"); }}
              className="w-full px-4 py-2.5 text-left text-sm text-slate-300 hover:bg-slate-800 hover:text-white flex items-center gap-3 transition-colors"
            >
              <Edit size={16} />
              Edit House
            </button>
            <button
              onClick={() => { onClose(); showToast?.("Manage Members coming soon", "info"); }}
              className="w-full px-4 py-2.5 text-left text-sm text-slate-300 hover:bg-slate-800 hover:text-white flex items-center gap-3 transition-colors"
            >
              <Users size={16} />
              Manage Members
            </button>
            <button
              onClick={() => { onClose(); showToast?.("House Settings coming soon", "info"); }}
              className="w-full px-4 py-2.5 text-left text-sm text-slate-300 hover:bg-slate-800 hover:text-white flex items-center gap-3 transition-colors"
            >
              <Settings size={16} />
              House Settings
            </button>
            <button
              onClick={() => { onClose(); showToast?.("Mute Notifications coming soon", "info"); }}
              className="w-full px-4 py-2.5 text-left text-sm text-slate-300 hover:bg-slate-800 hover:text-white flex items-center gap-3 transition-colors"
            >
              <VolumeX size={16} />
              Mute Notifications
            </button>
            <button
              onClick={() => { onClose(); shareHouse("copy"); }}
              className="w-full px-4 py-2.5 text-left text-sm text-slate-300 hover:bg-slate-800 hover:text-white flex items-center gap-3 transition-colors"
            >
              <Copy size={16} />
              Copy House Link
            </button>
            <div className="my-1 border-t border-slate-700"></div>
            <button
              onClick={() => { onClose(); if (confirm("Are you sure you want to delete this house? This action cannot be undone.")) { showToast?.("Delete House coming soon", "info"); } }}
              className="w-full px-4 py-2.5 text-left text-sm text-red-400 hover:bg-red-900/20 hover:text-red-300 flex items-center gap-3 transition-colors"
            >
              <Trash size={16} />
              Delete House
            </button>
          </>
        )}

        {selectedHouseRole === "member" && (
          <>
            <button
              onClick={() => { onClose(); showToast?.("View House Info coming soon", "info"); }}
              className="w-full px-4 py-2.5 text-left text-sm text-slate-300 hover:bg-slate-800 hover:text-white flex items-center gap-3 transition-colors"
            >
              <Edit size={16} />
              View House Info
            </button>
            <button
              onClick={() => { onClose(); showToast?.("Mute Notifications coming soon", "info"); }}
              className="w-full px-4 py-2.5 text-left text-sm text-slate-300 hover:bg-slate-800 hover:text-white flex items-center gap-3 transition-colors"
            >
              <VolumeX size={16} />
              Mute Notifications
            </button>
            <button
              onClick={() => { onClose(); shareHouse("copy"); }}
              className="w-full px-4 py-2.5 text-left text-sm text-slate-300 hover:bg-slate-800 hover:text-white flex items-center gap-3 transition-colors"
            >
              <Copy size={16} />
              Copy House Link
            </button>
            <div className="my-1 border-t border-slate-700"></div>
            <button
              onClick={() => { onClose(); showToast?.("Leave House coming soon", "info"); }}
              className="w-full px-4 py-2.5 text-left text-sm text-slate-300 hover:bg-slate-800 hover:text-white flex items-center gap-3 transition-colors"
            >
              <LogOut size={16} />
              Leave House
            </button>
            <button
              onClick={() => { onClose(); showToast?.("Report House coming soon", "info"); }}
              className="w-full px-4 py-2.5 text-left text-sm text-red-400 hover:bg-red-900/20 hover:text-red-300 flex items-center gap-3 transition-colors"
            >
              <Flag size={16} />
              Report House
            </button>
          </>
        )}
      </div>
    </div>
  );
}

