"use client";

import React, { useState } from "react";
import { Heart, ThumbsDown, Bookmark, MessageCircle, Share2, MoreVertical } from "lucide-react";
import CommentsSheet from "@/components/PostActions/CommentsSheet";
import ShareSheet from "@/components/PostActions/ShareSheet";
import PostMenu from "@/components/PostActions/PostMenu";
import { useAppStore } from "@/lib/store";

const drops = [
  {
    id: 1,
    user: "Tech Insider",
    username: "techinsider",
    verified: true,
    time: "2h",
    content: "New AI breakthrough just dropped! This changes everything 🤯",
    aura: 3421,
    comments: 567,
    shares: 234,
    tags: ["#AI", "#tech", "#innovation"],
  },
  {
    id: 2,
    user: "Design Daily",
    username: "designdaily",
    verified: true,
    time: "4h",
    content: "Color theory masterclass: Understanding contrast and harmony in modern UI design 🎨",
    aura: 2156,
    comments: 389,
    shares: 178,
    tags: ["#design", "#UI", "#colors"],
  },
  {
    id: 3,
    user: "Code Academy",
    username: "codeacademy",
    verified: true,
    time: "6h",
    content: "TypeScript vs JavaScript: Which should you learn first in 2025? Full breakdown 👇",
    aura: 4892,
    comments: 891,
    shares: 445,
    tags: ["#webdev", "#typescript", "#javascript"],
  },
  {
    id: 4,
    user: "Creative Studio",
    username: "creativestudio",
    verified: true,
    time: "8h",
    content: "Behind the scenes: How we created this mind-bending animation ✨",
    aura: 5234,
    comments: 1023,
    shares: 567,
    tags: ["#animation", "#3D", "#creative"],
  },
];

export default function DropsPage() {
  const { likedPosts, dislikedPosts, savedPosts, toggleLike, toggleDislike, toggleSave } =
    useAppStore();

  const [activeComments, setActiveComments] = useState<number | null>(null);
  const [activeShare, setActiveShare] = useState<number | null>(null);
  const [activeMenu, setActiveMenu] = useState<number | null>(null);

  return (
    <div className="animate-fadeIn pb-24 sm:pb-0 w-full bg-slate-900">
      {/* Posts Feed */}
      <div className="max-w-2xl mx-auto w-full">
        {drops.map((drop, idx) => {
          const isLiked = likedPosts[drop.id];
          const isDisliked = dislikedPosts[drop.id];
          const isSaved = savedPosts[drop.id];
          const currentAura = isLiked ? drop.aura + 1 : isDisliked ? drop.aura - 1 : drop.aura;

          return (
            <article
              key={drop.id}
              className="border-b border-white/5 animate-slideIn"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              {/* Post Header */}
              <div className="px-4 py-3 flex items-center justify-between hover:bg-white/2 transition-colors">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-semibold text-sm text-white">{drop.user}</span>
                      {drop.verified && <span className="text-blue-400 text-xs">✓</span>}
                      <span className="text-xs text-gray-500">@{drop.username}</span>
                      <span className="text-xs text-gray-600">·</span>
                      <span className="text-xs text-gray-500">{drop.time}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setActiveMenu(drop.id)}
                  className="p-2 -mr-2 hover:bg-white/5 rounded-full text-gray-500 hover:text-gray-300 transition-colors flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  aria-label="More options"
                >
                  <MoreVertical size={16} />
                </button>
              </div>

              {/* Post Content */}
              <div className="px-4 py-3">
                <p className="text-base text-white leading-relaxed font-medium">{drop.content}</p>
                {drop.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {drop.tags.map((tag) => (
                      <button
                        key={tag}
                        className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Engagement Stats */}
              <div className="px-4 py-2 text-xs text-gray-500 flex gap-4 font-medium">
                <button className="hover:text-white transition-colors">{currentAura} Aura</button>
                <button className="hover:text-white transition-colors">
                  {drop.comments} Replies
                </button>
                <button className="hover:text-white transition-colors">{drop.shares} Shares</button>
              </div>

              {/* Action Buttons */}
              <div className="px-3 py-2 flex items-center justify-between border-t border-white/3 gap-1">
                {/* Aura */}
                <button
                  onClick={() => toggleLike(drop.id.toString())}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg transition-all duration-200 font-medium text-xs ${
                    isLiked
                      ? "bg-purple-500/20 text-purple-300"
                      : "text-gray-400 hover:bg-purple-500/10 hover:text-purple-300"
                  }`}
                  aria-label="Give Aura"
                  title="Aura"
                >
                  <Heart size={15} fill={isLiked ? "currentColor" : "none"} />
                  <span>{currentAura}</span>
                </button>

                {/* Lame */}
                <button
                  onClick={() => toggleDislike(drop.id.toString())}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg transition-all duration-200 font-medium text-xs ${
                    isDisliked
                      ? "bg-orange-500/20 text-orange-300"
                      : "text-gray-400 hover:bg-orange-500/10 hover:text-orange-300"
                  }`}
                  aria-label="Lame"
                  title="Lame"
                >
                  <ThumbsDown size={15} />
                </button>

                {/* Reply */}
                <button
                  onClick={() => setActiveComments(drop.id)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-gray-400 hover:bg-blue-500/10 hover:text-blue-300 transition-all duration-200 font-medium text-xs"
                  aria-label="Reply"
                  title="Reply"
                >
                  <MessageCircle size={15} />
                </button>

                {/* Share */}
                <button
                  onClick={() => setActiveShare(drop.id)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-gray-400 hover:bg-green-500/10 hover:text-green-300 transition-all duration-200 font-medium text-xs"
                  aria-label="Share"
                  title="Share"
                >
                  <Share2 size={15} />
                </button>

                {/* Save */}
                <button
                  onClick={() => toggleSave(drop.id.toString())}
                  className={`flex-1 flex items-center justify-center py-2 px-2 rounded-lg transition-all duration-200 font-medium text-xs ${
                    isSaved
                      ? "text-yellow-300 bg-yellow-500/20"
                      : "text-gray-400 hover:text-yellow-300 hover:bg-yellow-500/10"
                  }`}
                  aria-label="Save"
                  title="Save"
                >
                  <Bookmark size={15} fill={isSaved ? "currentColor" : "none"} />
                </button>
              </div>
            </article>
          );
        })}
      </div>

      {/* Sheets */}
      {activeComments !== null && (
        <CommentsSheet
          isOpen={true}
          onClose={() => setActiveComments(null)}
          postId={activeComments}
          commentsCount={drops.find((d) => d.id === activeComments)?.comments || 0}
          variant="drops"
        />
      )}

      {activeShare !== null && (
        <ShareSheet
          isOpen={true}
          onClose={() => setActiveShare(null)}
          postId={activeShare}
          variant="drops"
        />
      )}

      {activeMenu !== null && (
        <PostMenu
          isOpen={true}
          onClose={() => setActiveMenu(null)}
          postId={activeMenu}
          isOwnPost={false}
        />
      )}
    </div>
  );
}
