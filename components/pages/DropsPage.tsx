"use client";

import CommentsSheet from "@/components/PostActions/CommentsSheet";
import PostMenu from "@/components/PostActions/PostMenu";
import ShareSheet from "@/components/PostActions/ShareSheet";
import { useAppStore } from "@/lib/store";
import { Bookmark, Heart, MessageCircle, MoreVertical, Share2, ThumbsDown } from "lucide-react";
import { useState } from "react";

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
    <div className="animate-fadeIn pb-24 sm:pb-0 w-full bg-gradient-to-b from-slate-900 to-slate-900/95">
      {/* Header Section */}
      <div className="max-w-2xl mx-auto w-full px-3 sm:px-4 pt-4 pb-4 border-b border-slate-700/20">
        <h2 className="text-2xl font-bold text-slate-50">Latest Drops</h2>
        <p className="text-sm text-slate-400 mt-1">Curated content from creators you follow</p>
      </div>

      {/* Posts Feed */}
      <div className="max-w-2xl mx-auto w-full space-y-4 px-3 sm:px-4 py-4">
        {drops.map((drop, idx) => {
          const isLiked = likedPosts[drop.id];
          const isDisliked = dislikedPosts[drop.id];
          const isSaved = savedPosts[drop.id];
          const currentAura = isLiked ? drop.aura + 1 : isDisliked ? drop.aura - 1 : drop.aura;

          return (
            <article
              key={drop.id}
              className="animate-slideIn bg-slate-800/60 backdrop-blur-sm border border-slate-700/40 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              {/* Post Header */}
              <div className="px-5 py-4 flex items-center justify-between hover:bg-slate-700/20 transition-colors">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex-shrink-0 shadow-md" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-semibold text-sm text-slate-50">{drop.user}</span>
                      {drop.verified && <span className="text-blue-400 text-xs">✓</span>}
                      <span className="text-xs text-slate-400">@{drop.username}</span>
                      <span className="text-xs text-slate-600">·</span>
                      <span className="text-xs text-slate-400">{drop.time}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setActiveMenu(drop.id)}
                  className="p-2.5 hover:bg-slate-700/60 rounded-lg text-slate-400 hover:text-slate-200 transition-all duration-200 flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  aria-label="More options"
                >
                  <MoreVertical size={18} />
                </button>
              </div>

              {/* Post Content */}
              <div className="px-5 py-3">
                <p className="text-base text-slate-100 leading-relaxed font-medium">{drop.content}</p>
                {drop.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {drop.tags.map((tag) => (
                      <button
                        key={tag}
                        className="text-xs text-purple-400 hover:text-purple-300 transition-colors font-semibold"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Engagement Stats */}
              <div className="px-5 py-3 text-xs text-slate-400 flex gap-6 font-semibold border-t border-slate-700/40">
                <button className="hover:text-slate-200 transition-colors">
                  <span className="text-purple-400">{currentAura}</span> Aura
                </button>
                <button className="hover:text-slate-200 transition-colors">
                  <span className="text-blue-400">{drop.comments}</span> Replies
                </button>
                <button className="hover:text-slate-200 transition-colors">
                  <span className="text-green-400">{drop.shares}</span> Shares
                </button>
              </div>

              {/* Action Buttons */}
              <div className="px-3 py-3 flex items-center justify-between gap-2">
                {/* Aura */}
                <button
                  onClick={() => toggleLike(drop.id)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-lg transition-all duration-200 font-semibold text-xs min-h-[40px] ${isLiked
                      ? "bg-purple-600/30 border border-purple-500/50 text-purple-300 shadow-lg shadow-purple-500/10"
                      : "bg-slate-700/40 border border-slate-600/30 text-slate-300 hover:bg-purple-600/20 hover:border-purple-500/40 hover:text-purple-300"
                    }`}
                  aria-label="Give Aura"
                  title="Aura"
                >
                  <Heart size={17} fill={isLiked ? "currentColor" : "none"} />
                  <span className="hidden sm:inline">{currentAura}</span>
                </button>

                {/* Lame */}
                <button
                  onClick={() => toggleDislike(drop.id)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-lg transition-all duration-200 font-semibold text-xs min-h-[40px] ${isDisliked
                      ? "bg-orange-600/30 border border-orange-500/50 text-orange-300 shadow-lg shadow-orange-500/10"
                      : "bg-slate-700/40 border border-slate-600/30 text-slate-300 hover:bg-orange-600/20 hover:border-orange-500/40 hover:text-orange-300"
                    }`}
                  aria-label="Lame"
                  title="Lame"
                >
                  <ThumbsDown size={17} fill={isDisliked ? "currentColor" : "none"} />
                </button>

                {/* Reply */}
                <button
                  onClick={() => setActiveComments(drop.id)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-lg text-slate-300 hover:bg-blue-600/20 hover:text-blue-300 hover:border-blue-500/40 bg-slate-700/40 border border-slate-600/30 transition-all duration-200 font-semibold text-xs min-h-[40px]"
                  aria-label="Reply"
                  title="Reply"
                >
                  <MessageCircle size={17} />
                </button>

                {/* Share */}
                <button
                  onClick={() => setActiveShare(drop.id)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-lg text-slate-300 hover:bg-green-600/20 hover:text-green-300 hover:border-green-500/40 bg-slate-700/40 border border-slate-600/30 transition-all duration-200 font-semibold text-xs min-h-[40px]"
                  aria-label="Share"
                  title="Share"
                >
                  <Share2 size={17} />
                </button>

                {/* Save */}
                <button
                  onClick={() => toggleSave(drop.id)}
                  className={`flex-1 flex items-center justify-center py-2.5 px-2 rounded-lg transition-all duration-200 font-semibold text-xs min-h-[40px] ${isSaved
                      ? "text-yellow-300 bg-yellow-600/30 border border-yellow-500/50 shadow-lg shadow-yellow-500/10"
                      : "text-slate-300 bg-slate-700/40 border border-slate-600/30 hover:text-yellow-300 hover:bg-yellow-600/20 hover:border-yellow-500/40"
                    }`}
                  aria-label="Save"
                  title="Save"
                >
                  <Bookmark size={17} fill={isSaved ? "currentColor" : "none"} />
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
