"use client";

import React, { useState, useEffect } from "react";
import { Heart, ThumbsDown, Bookmark, MessageCircle, Share2, MoreVertical } from "lucide-react";
import CommentsSheet from "@/components/PostActions/CommentsSheet";
import ShareSheet from "@/components/PostActions/ShareSheet";
import PostMenu from "@/components/PostActions/PostMenu";
import { useAppStore } from "@/lib/store";

const stories = [
  { username: "you", isYou: true, gradient: "from-purple-600 to-blue-600", hasNew: false },
  { username: "alex_orbit", gradient: "from-blue-600 to-cyan-600", hasNew: true },
  { username: "jane_cosmos", gradient: "from-purple-600 to-pink-600", hasNew: false },
  { username: "tech_warrior", gradient: "from-blue-500 to-purple-600", hasNew: true },
  { username: "nova_spark", gradient: "from-purple-500 to-indigo-600", hasNew: false },
];

const posts = [
  {
    id: 1,
    user: "Alex Orbit",
    username: "alex_orbit",
    verified: true,
    time: "2h",
    avatar: "🎵",
    content: "Just dropped a new tune 🎵 Let me know what you think!",
    aura: 342,
    comments: 12,
    shares: 5,
  },
  {
    id: 2,
    user: "Tech Insider",
    username: "techinsider",
    verified: true,
    time: "4h",
    avatar: "🚀",
    content: "Breaking: New AI model shows promising results in real-world testing 🚀",
    aura: 1203,
    comments: 89,
    shares: 45,
  },
  {
    id: 3,
    user: "Nova Spark",
    username: "novaspark",
    verified: false,
    time: "6h",
    avatar: "✨",
    content: "Loving this Friday vibe ✨ What's everyone up to?",
    aura: 567,
    comments: 34,
    shares: 12,
  },
];

export default function HomePage() {
  const { likedPosts, dislikedPosts, savedPosts, toggleLike, toggleDislike, toggleSave, currentCapsuleIndex, setCurrentCapsuleIndex, setCurrentPage } = useAppStore();

  const [activeComments, setActiveComments] = useState<number | null>(null);
  const [activeShare, setActiveShare] = useState<number | null>(null);
  const [activeMenu, setActiveMenu] = useState<number | null>(null);

  return (
    <div className="animate-fadeIn pb-24 sm:pb-0 w-full">
      {/* Instagram Stories Bar */}
      <div className="border-b border-slate-700/50 px-4 py-4 bg-slate-900">
        <div className="flex gap-3 overflow-x-auto scrollbar-hide snap-x snap-mandatory">
          {stories.map((story, idx) => (
            <button
              key={idx}
              onClick={() => {
                setCurrentCapsuleIndex(idx);
                setCurrentPage("capsules");
              }}
              className="flex-shrink-0 snap-center group focus:outline-none transition-all duration-200 hover:opacity-80"
              aria-label={`View story from ${story.username}`}
            >
              {/* Gradient Ring (like Instagram) */}
              <div className={`relative w-16 h-16 rounded-full bg-gradient-to-br ${story.gradient} p-0.5`}>
                {/* Inner Avatar */}
                <div className="relative w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-2xl font-bold border-2 border-slate-900">
                  {story.isYou ? "👤" : story.username.charAt(0).toUpperCase()}
                  
                  {/* Online Status Indicator (like Instagram) */}
                  {story.hasNew && (
                    <div className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-blue-500 border-2 border-slate-900 ring-2 ring-blue-500/30" />
                  )}
                </div>
              </div>
              
              {/* Username below */}
              <span className="text-xs text-center mt-2 block text-slate-400 group-hover:text-slate-300 truncate w-16">
                {story.isYou ? "Your story" : story.username.split("_")[0]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Posts Feed */}
      <div className="max-w-2xl mx-auto w-full space-y-1 px-3 sm:px-4 pt-1 sm:pt-2">
        {posts.map((post, idx) => {
          const isLiked = likedPosts[post.id];
          const isDisliked = dislikedPosts[post.id];
          const isSaved = savedPosts[post.id];
          const currentAura = isLiked ? post.aura + 1 : isDisliked ? post.aura - 1 : post.aura;

          return (
            <article
              key={post.id}
              className="clean-card animate-slideIn p-4"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              {/* Post Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex-shrink-0 flex items-center justify-center text-base font-bold">
                    {post.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-sm text-slate-50">{post.user}</span>
                      {post.verified && <span className="text-blue-400 text-xs">✓</span>}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      <span>@{post.username}</span>
                      <span>·</span>
                      <span>{post.time}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setActiveMenu(post.id)}
                  className="p-2 -mr-2 rounded-lg text-slate-400 hover:text-slate-300 hover:bg-slate-800/50 transition-colors flex-shrink-0 min-h-[40px] min-w-[40px] focus:outline-none focus-visible:outline-2 focus-visible:outline-purple-500 focus-visible:outline-offset-2"
                  aria-label={`More options for ${post.user}'s post`}
                >
                  <MoreVertical size={16} />
                </button>
              </div>

              {/* Post Content */}
              <div className="mb-3">
                <p className="text-sm text-slate-100 leading-relaxed">{post.content}</p>
              </div>

              {/* Engagement Stats */}
              <div className="text-xs text-slate-400 flex gap-4 mb-3 pb-3 border-b border-slate-700/30">
                <button className="hover:text-slate-200 transition-colors">{currentAura} Aura</button>
                <button className="hover:text-slate-200 transition-colors">{post.comments} Replies</button>
                <button className="hover:text-slate-200 transition-colors">{post.shares} Shares</button>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-2">
                {/* Aura */}
                <button
                  onClick={() => {
                    toggleLike(post.id);
                    if (!isLiked) {
                      earnXp(useAppStore.getState(), getXpReward('like_post'), 'Post Liked');
                    }
                  }}
                  className={`flex-1 flex items-center justify-center gap-1 py-2 px-1 rounded-md transition-all duration-150 text-xs font-medium min-h-[36px] focus:outline-none focus-visible:outline-2 focus-visible:outline-purple-500 ${
                    isLiked ? "bg-slate-800 text-purple-400" : "text-slate-400 hover:bg-slate-800/50 hover:text-purple-300"
                  }`}
                  aria-label={isLiked ? `Remove Aura from ${post.user}'s post` : `Give Aura to ${post.user}'s post`}
                  title="Aura"
                >
                  <Heart size={14} fill={isLiked ? "currentColor" : "none"} />
                  <span className="hidden sm:inline">{currentAura}</span>
                </button>

                {/* Lame */}
                <button
                  onClick={() => toggleDislike(post.id)}
                  className={`flex-1 flex items-center justify-center gap-1 py-2 px-1 rounded-md transition-all duration-150 text-xs font-medium min-h-[36px] focus:outline-none focus-visible:outline-2 focus-visible:outline-purple-500 ${
                    isDisliked ? "bg-slate-800 text-orange-400" : "text-slate-400 hover:bg-slate-800/50 hover:text-orange-300"
                  }`}
                  aria-label={isDisliked ? `Remove Lame from ${post.user}'s post` : `Mark ${post.user}'s post as Lame`}
                  title="Lame"
                >
                  <ThumbsDown size={14} />
                </button>

                {/* Reply */}
                <button
                  onClick={() => setActiveComments(post.id)}
                  className="flex-1 flex items-center justify-center gap-1 py-2 px-1 rounded-md text-slate-400 hover:bg-slate-800/50 hover:text-blue-300 transition-all duration-150 text-xs font-medium min-h-[36px] focus:outline-none focus-visible:outline-2 focus-visible:outline-purple-500"
                  aria-label={`Reply to post by ${post.user}`}
                  title="Reply"
                >
                  <MessageCircle size={14} />
                </button>

                {/* Share */}
                <button
                  onClick={() => setActiveShare(post.id)}
                  className="flex-1 flex items-center justify-center gap-1 py-2 px-1 rounded-md text-slate-400 hover:bg-slate-800/50 hover:text-green-300 transition-all duration-150 text-xs font-medium min-h-[36px] focus:outline-none focus-visible:outline-2 focus-visible:outline-purple-500"
                  aria-label={`Share post by ${post.user}`}
                  title="Share"
                >
                  <Share2 size={14} />
                </button>

                {/* Save */}
                <button
                  onClick={() => toggleSave(post.id)}
                  className={`flex-1 flex items-center justify-center py-2 px-1 rounded-md transition-all duration-150 text-xs font-medium min-h-[36px] min-w-[36px] focus:outline-none focus-visible:outline-2 focus-visible:outline-purple-500 ${
                    isSaved ? "text-yellow-400 bg-slate-800" : "text-slate-400 hover:text-yellow-300 hover:bg-slate-800/50"
                  }`}
                  aria-label={isSaved ? "Remove from saved" : "Save this post"}
                  title="Save"
                >
                  <Bookmark size={14} fill={isSaved ? "currentColor" : "none"} />
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
          commentsCount={0}
          variant="home"
        />
      )}

      {activeShare !== null && (
        <ShareSheet
          isOpen={true}
          onClose={() => setActiveShare(null)}
          postId={activeShare}
          variant="home"
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
