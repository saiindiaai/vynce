"use client";

import React from "react";
import { Heart, MessageCircle, Share2, ThumbsDown, Bookmark } from "lucide-react";

interface HomeEngagementProps {
  aura: number | string;
  comments: number;
  shares: number;
  isLiked?: boolean;
  isDisliked?: boolean;
  isSaved?: boolean;
  onLike?: () => void;
  onDislike?: () => void;
  onComment?: () => void;
  onShare?: () => void;
  onSave?: () => void;
  themeClasses?: any;
  layout?: "horizontal" | "vertical";
}

export default function HomeEngagement({
  aura,
  comments,
  shares,
  isLiked = false,
  isDisliked = false,
  isSaved = false,
  onLike,
  onDislike,
  onComment,
  onShare,
  onSave,
  themeClasses = {},
  layout = "horizontal",
}: HomeEngagementProps) {
  if (layout === "vertical") {
    return (
      <div className="flex flex-col items-center gap-4 text-center z-30">
        <button
          onClick={onLike}
          aria-label="Give Aura"
          className={`flex flex-col items-center gap-1 transition transform hover:scale-105`}
        >
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isLiked ? "bg-gradient-to-br from-purple-500 to-pink-500 text-white" : "bg-white/5"}`}
          >
            <Heart size={20} className={isLiked ? "fill-white text-white" : "text-gray-200"} />
          </div>
          <span className="text-xs font-semibold">{aura}</span>
          <span className="text-[10px] text-gray-400 uppercase">Aura</span>
        </button>

        <button
          onClick={onDislike}
          aria-label="Call it Lame"
          className={`flex flex-col items-center gap-1 transition transform hover:scale-105`}
        >
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isDisliked ? "bg-gradient-to-br from-orange-500 to-red-500 text-white" : "bg-white/5"}`}
          >
            <ThumbsDown
              size={20}
              className={isDisliked ? "fill-white text-white" : "text-gray-200"}
            />
          </div>
          <span className="text-xs font-semibold">{isDisliked ? "Lame" : ""}</span>
        </button>

        <button
          onClick={onComment}
          aria-label="Comments"
          className="flex flex-col items-center gap-1 transition hover:scale-105"
        >
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-white/5">
            <MessageCircle size={20} className="text-gray-200" />
          </div>
          <span className="text-xs font-semibold">{comments}</span>
        </button>

        <button
          onClick={onShare}
          aria-label="Share"
          className="flex flex-col items-center gap-1 transition hover:scale-105"
        >
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-white/5">
            <Share2 size={20} className="text-gray-200" />
          </div>
          <span className="text-xs font-semibold">{shares}</span>
        </button>

        <button
          onClick={onSave}
          aria-label="Save"
          className="flex flex-col items-center gap-1 transition hover:scale-105"
        >
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center ${isSaved ? "bg-yellow-500/20" : "bg-white/5"}`}
          >
            <Bookmark size={18} className={isSaved ? "text-yellow-400" : "text-gray-200"} />
          </div>
        </button>
      </div>
    );
  }

  return (
    <div
      className={`flex items-center justify-between border-t ${themeClasses.cardBorder || "border-white/10"} pt-3`}
    >
      <button
        onClick={onLike}
        className={`flex items-center gap-2 py-2 px-3 rounded-lg transition-colors ${isLiked ? "text-red-500" : themeClasses.textSecondary || "text-gray-300"} hover:bg-white/5`}
      >
        <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
        <span className="text-sm">{aura}</span>
      </button>
      <button
        onClick={onDislike}
        className={`flex items-center gap-2 py-2 px-3 rounded-lg transition-colors ${isDisliked ? "text-orange-400" : themeClasses.textSecondary || "text-gray-300"} hover:bg-white/5`}
      >
        <ThumbsDown size={18} />
        <span className="text-sm">Lame</span>
      </button>
      <button
        onClick={onComment}
        className={`flex items-center gap-2 py-2 px-3 rounded-lg transition-colors ${themeClasses.textSecondary || "text-gray-300"} hover:bg-white/5`}
      >
        <MessageCircle size={18} />
        <span className="text-sm">{comments}</span>
      </button>
      <button
        onClick={onShare}
        className={`flex items-center gap-2 py-2 px-3 rounded-lg transition-colors ${themeClasses.textSecondary || "text-gray-300"} hover:bg-white/5`}
      >
        <Share2 size={18} />
        <span className="text-sm">{shares}</span>
      </button>
      <button
        onClick={onSave}
        className={`flex items-center gap-2 py-2 px-3 rounded-lg transition-colors ${isSaved ? "text-yellow-400" : themeClasses.textSecondary || "text-gray-300"} hover:bg-white/5`}
      >
        <Bookmark size={18} />
      </button>
    </div>
  );
}
