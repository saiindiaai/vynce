"use client";

import React from "react";
import { Star, XCircle, Flag, Link2, UserPlus, EyeOff, Bookmark } from "lucide-react";
import { getAllThemes } from "@/config/themes";
import { useAppStore } from "@/lib/store";

interface PostMenuProps {
  isOpen: boolean;
  onClose: () => void;
  postId: number;
  isOwnPost?: boolean;
}

export default function PostMenu({ isOpen, onClose, postId, isOwnPost = false }: PostMenuProps) {
  const { currentTheme } = useAppStore();
  const allThemes = getAllThemes();
  const themeClasses = allThemes[currentTheme];

  if (!isOpen) return null;

  const menuItems = isOwnPost
    ? [
        {
          id: "delete",
          label: "Delete Post",
          icon: XCircle,
          color: "text-red-500",
          action: () => console.log("Delete post"),
        },
        {
          id: "edit",
          label: "Edit Post",
          icon: Star,
          color: themeClasses.textPrimary,
          action: () => console.log("Edit post"),
        },
        {
          id: "copy-link",
          label: "Copy Link",
          icon: Link2,
          color: themeClasses.textPrimary,
          action: () => console.log("Copy link"),
        },
      ]
    : [
        {
          id: "interested",
          label: "Interested",
          icon: Star,
          color: themeClasses.textPrimary,
          action: () => {
            console.log("Interested");
            onClose();
          },
        },
        {
          id: "not-interested",
          label: "Not Interested",
          icon: EyeOff,
          color: themeClasses.textPrimary,
          action: () => {
            console.log("Not interested");
            onClose();
          },
        },
        {
          id: "follow",
          label: "Follow User",
          icon: UserPlus,
          color: themeClasses.textPrimary,
          action: () => {
            console.log("Follow");
            onClose();
          },
        },
        {
          id: "save",
          label: "Save Post",
          icon: Bookmark,
          color: themeClasses.textPrimary,
          action: () => {
            console.log("Save");
            onClose();
          },
        },
        {
          id: "copy-link",
          label: "Copy Link",
          icon: Link2,
          color: themeClasses.textPrimary,
          action: () => {
            console.log("Copy link");
            onClose();
          },
        },
        {
          id: "report",
          label: "Report",
          icon: Flag,
          color: "text-red-500",
          action: () => {
            console.log("Report");
            onClose();
          },
        },
      ];

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
                className={`w-full flex items-center gap-4 p-4 transition-all hover:bg-gray-700/30 animate-slideIn ${
                  item.id === "report" || item.id === "delete" ? "hover:bg-red-500/10" : ""
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
