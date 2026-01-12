"use client";

import { getAllThemes } from "@/config/themes";
import { deleteDrop, toggleBookmark as toggleDropBookmark, toggleDropDislike, toggleDropLike } from "@/lib/drops";
import { deletePost, followUser, reportPost, toggleBookmark, toggleDislike, toggleLike } from "@/lib/social";
import { useAppStore } from "@/lib/store";
import { Bookmark, EyeOff, Flag, Link2, Star, UserPlus, XCircle } from "lucide-react";

interface PostMenuProps {
  isOpen: boolean;
  onClose: () => void;
  post?: any; // Full post object to access author info
  postId?: string | number; // fallback when only id is provided
  isOwnPost?: boolean;
  variant?: "home" | "drops" | "fight";
}

export default function PostMenu({ isOpen, onClose, post, postId, isOwnPost = false, variant = "home" }: PostMenuProps) {
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
          const id = post?._id ?? postId;
          if (!id) {
            console.error("No post id available for delete action");
            onClose();
            return;
          }
          try {
            if (variant === "drops") {
              await deleteDrop(id);
            } else {
              await deletePost(id);
            }
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
          const id = post?._id ?? postId;
          if (id) navigator.clipboard.writeText(`${window.location.origin}?post=${id}`);
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
          const id = post?._id ?? postId;
          if (!id) {
            console.error("No post id available to like");
            onClose();
            return;
          }
          try {
            if (variant === "drops") {
              await toggleDropLike(id);
            } else {
              await toggleLike(id);
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
          const id = post?._id ?? postId;
          if (!id) {
            console.error("No post id available to dislike");
            onClose();
            return;
          }
          try {
            if (variant === "drops") {
              await toggleDropDislike(id);
            } else {
              await toggleDislike(id);
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
          const authorUid = post?.author?.uid ?? post?.author?._id;
          if (!authorUid) {
            console.error("No author info available to follow");
            onClose();
            return;
          }
          try {
            await followUser(authorUid);
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
          const id = post?._id ?? postId;
          if (!id) {
            console.error("No post id available to save");
            onClose();
            return;
          }
          try {
            if (variant === "drops") {
              await toggleDropBookmark(id);
            } else {
              await toggleBookmark(id);
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
          const id = post?._id ?? postId;
          if (id) navigator.clipboard.writeText(`${window.location.origin}?post=${id}`);
          onClose();
        },
      },
      {
        id: "report",
        label: "Order Violation",
        icon: Flag,
        color: "text-red-500",
        action: async () => {
          const id = post?._id ?? postId;
          if (!id) {
            console.error("No post id available to report");
            onClose();
            return;
          }
          try {
            await reportPost(id, "Order Violation");
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
