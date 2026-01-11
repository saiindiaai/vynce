"use client";

import { getAllThemes } from "@/config/themes";
import { deleteDrop, toggleBookmark as toggleDropBookmark } from "@/lib/drops";
import { deletePost, toggleLike, toggleDislike, toggleBookmark, followUser, reportPost } from "@/lib/social";
import { toggleDropLike, toggleDropDislike } from "@/lib/drops";
import { useAppStore } from "@/lib/store";
import { Bookmark, EyeOff, Flag, Link2, Star, UserPlus, XCircle } from "lucide-react";

interface PostMenuProps {
  isOpen: boolean;
  onClose: () => void;
  post: any; // Full post object to access author info
  isOwnPost?: boolean;
  variant?: "home" | "drops" | "fight";
}

export default function PostMenu({ isOpen, onClose, post, isOwnPost = false, variant = "home" }: PostMenuProps) {
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
        action: async () => {
          try {
            if (variant === "drops") {
              await deleteDrop(post._id);
            } else {
              await deletePost(post._id);
            }
            // TODO: Remove post from UI or refresh feed
            console.log("Post deleted");
          } catch (error) {
            console.error("Failed to delete post:", error);
          }
          onClose();
        },
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
        action: () => {
          navigator.clipboard.writeText(`${window.location.origin}?post=${post._id}`);
          onClose();
        },
      },
    ]
    : [
      {
        id: "interested",
        label: "This matches my Aura",
        icon: Star,
        color: themeClasses.textPrimary,
        action: async () => {
          try {
            if (variant === "drops") {
              await toggleDropLike(post._id);
            } else {
              await toggleLike(post._id);
            }
            console.log("Liked post");
          } catch (error) {
            console.error("Failed to like post:", error);
          }
          onClose();
        },
      },
      {
        id: "not-interested",
        label: "This doesn't match my Aura",
        icon: EyeOff,
        color: themeClasses.textPrimary,
        action: async () => {
          try {
            if (variant === "drops") {
              await toggleDropDislike(post._id);
            } else {
              await toggleDislike(post._id);
            }
            console.log("Disliked post");
          } catch (error) {
            console.error("Failed to dislike post:", error);
          }
          onClose();
        },
      },
      {
        id: "follow",
        label: "Add to In Gang",
        icon: UserPlus,
        color: themeClasses.textPrimary,
        action: async () => {
          try {
            await followUser(post.author.uid || post.author._id);
            console.log("Followed user");
          } catch (error) {
            console.error("Failed to follow user:", error);
          }
          onClose();
        },
      },
      {
        id: "save",
        label: "Save",
        icon: Bookmark,
        color: themeClasses.textPrimary,
        action: async () => {
          try {
            if (variant === "drops") {
              await toggleDropBookmark(post._id);
            } else {
              await toggleBookmark(post._id);
            }
            console.log("Saved post");
          } catch (error) {
            console.error("Failed to save post:", error);
          }
          onClose();
        },
      },
      {
        id: "copy-link",
        label: "Copy Link",
        icon: Link2,
        color: themeClasses.textPrimary,
        action: () => {
          navigator.clipboard.writeText(`${window.location.origin}?post=${post._id}`);
          onClose();
        },
      },
      {
        id: "report",
        label: "Order Violation",
        icon: Flag,
        color: "text-red-500",
        action: async () => {
          try {
            await reportPost(post._id, "Order Violation");
            console.log("Reported post");
          } catch (error) {
            console.error("Failed to report post:", error);
          }
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
                className={`w-full flex items-center gap-4 p-4 transition-all hover:bg-gray-700/30 animate-slideIn ${item.id === "report" || item.id === "delete" ? "hover:bg-red-500/10" : ""
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
