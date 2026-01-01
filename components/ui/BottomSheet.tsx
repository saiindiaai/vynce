"use client";

import React from "react";
import { X } from "lucide-react";

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxHeight?: string;
}

export default function BottomSheet({
  isOpen,
  onClose,
  title,
  children,
  maxHeight = "max-h-[80vh]",
}: BottomSheetProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-40 animate-fadeIn sm:hidden" onClick={onClose} />

      {/* Bottom Sheet on Mobile, Centered Modal on Desktop */}
      <div className="fixed bottom-0 left-0 right-0 sm:inset-0 z-40 sm:flex sm:items-center sm:justify-center sm:p-4 animate-fadeIn">
        <div
          className={`
          w-full sm:w-full sm:max-w-2xl
          bg-slate-900 sm:clean-card
          rounded-t-xl sm:rounded-lg
          ${maxHeight} sm:max-h-[85vh]
          overflow-hidden sm:overflow-auto
          flex flex-col
          animate-slideInUp sm:animate-slideIn
        `}
        >
          {/* Header */}
          <div className="sticky top-0 z-10 bg-slate-900 border-b border-slate-700/50 px-4 py-3 sm:py-4 flex items-center justify-between flex-shrink-0">
            <h2 className="text-lg sm:text-2xl font-bold text-slate-50">{title}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-300 hover:text-slate-50 flex-shrink-0"
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6">{children}</div>
        </div>
      </div>
    </>
  );
}
