"use client";

import CommentsSheet from "@/components/PostActions/CommentsSheet";
import PostMenu from "@/components/PostActions/PostMenu";
import ShareSheet from "@/components/PostActions/ShareSheet";
import { useAppStore } from "@/lib/store";
import { Bookmark, Heart, MessageCircle, MoreVertical, Share2, ThumbsDown } from "lucide-react";
import { useState } from "react";

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
  const {
    likedPosts,
    dislikedPosts,
    savedPosts,
    toggleLike,
    toggleDislike,
    toggleSave,
    currentCapsuleIndex,
    setCurrentCapsuleIndex,
    setCurrentPage,
  } = useAppStore();

  const [activeComments, setActiveComments] = useState<number | null>(null);
  const [activeShare, setActiveShare] = useState<number | null>(null);
  const [activeMenu, setActiveMenu] = useState<number | null>(null);

  return (
    <div className="animate-fadeIn pb-24 sm:pb-0 w-full">
      {/* Stories Bar - Improved */}
      <div className="border-b border-slate-700/20 px-4 py-6 bg-gradient-to-b from-slate-800 to-slate-900/80 backdrop-blur-sm">
        <div className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory">
          {stories.map((story, idx) => (
            <button
              key={idx}
              onClick={() => {
                setCurrentCapsuleIndex(idx);
                setCurrentPage("capsules");
              }}
              className="flex-shrink-0 snap-center group focus:outline-none transition-all duration-200 hover:scale-105"
              aria-label={`View story from ${story.username}`}
            >
              {/* Gradient Ring - Rectangular Format */}
              <div
                className={`relative w-20 h-24 rounded-xl bg-gradient-to-br ${story.gradient} p-0.5 shadow-lg hover:shadow-xl transition-all duration-200`}
              >
                {/* Inner Avatar Container */}
                <div className="relative w-full h-full rounded-[10px] bg-slate-900 flex items-center justify-center text-3xl font-bold border-2 border-slate-900 flex-col gap-1">
                  <span>{story.isYou ? "👤" : story.username.charAt(0).toUpperCase()}</span>

                  {/* New Story Indicator */}
                  {story.hasNew && (
                    <div className="absolute top-1 right-1 w-3 h-3 rounded-full bg-blue-500 border border-white shadow-md animate-pulse" />
                  )}
                </div>
              </div>

              {/* Username below */}
              <span className="text-xs text-center mt-3 block text-slate-400 group-hover:text-slate-300 transition-colors truncate w-20 font-medium">
                {story.isYou ? "Your story" : story.username.split("_")[0]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Posts Feed */}
      <div className="max-w-2xl mx-auto w-full space-y-4 px-3 sm:px-4 pt-4 sm:pt-6">
        {posts.map((post, idx) => {
          const isLiked = likedPosts[post.id];
          const isDisliked = dislikedPosts[post.id];
          const isSaved = savedPosts[post.id];
          const currentAura = isLiked ? post.aura + 1 : isDisliked ? post.aura - 1 : post.aura;

          return (
            <article
              key={post.id}
              className="animate-slideIn bg-slate-800/60 backdrop-blur-sm border border-slate-700/40 rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all duration-300"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              {/* Post Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex-shrink-0 flex items-center justify-center text-lg font-bold shadow-md">
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
                  className="p-2.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-700/60 transition-all duration-200 flex-shrink-0 min-h-[40px] min-w-[40px] focus:outline-none focus-visible:outline-2 focus-visible:outline-purple-500 focus-visible:outline-offset-2"
                  aria-label={`More options for ${post.user}'s post`}
                >
                  <MoreVertical size={18} />
                </button>
              </div>

              {/* Post Content */}
              <div className="mb-4">
                <p className="text-sm text-slate-100 leading-relaxed">{post.content}</p>
              </div>

              {/* Engagement Stats */}
              <div className="text-xs text-slate-400 flex gap-6 mb-4 pb-4 border-b border-slate-600/30">
                <button className="hover:text-slate-200 transition-colors font-medium">
                  <span className="text-purple-400">{currentAura}</span> Aura
                </button>
                <button className="hover:text-slate-200 transition-colors font-medium">
                  <span className="text-blue-400">{post.comments}</span> Replies
                </button>
                <button className="hover:text-slate-200 transition-colors font-medium">
                  <span className="text-green-400">{post.shares}</span> Shares
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-2">
                {/* Aura - Improved Styling */}
                <button
                  onClick={() => {
                    toggleLike(post.id);
                    // TODO: Implement XP system
                    // if (!isLiked) {
                    //   earnXp(useAppStore.getState(), getXpReward("like_post"), "Post Liked");
                    // }
                  }}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg transition-all duration-200 text-xs font-semibold min-h-[44px] focus:outline-none focus-visible:outline-2 focus-visible:outline-purple-500 focus-visible:outline-offset-1 ${isLiked
                    ? "bg-purple-600/30 border border-purple-500/50 text-purple-300 shadow-lg shadow-purple-500/20"
                    : "bg-slate-700/40 border border-slate-600/30 text-slate-300 hover:bg-purple-600/20 hover:border-purple-500/40 hover:text-purple-300"
                    }`}
                  aria-label={
                    isLiked
                      ? `Remove Aura from ${post.user}'s post`
                      : `Give Aura to ${post.user}'s post`
                  }
                  title="Aura"
                >
                  <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
                  <span className="hidden sm:inline">{currentAura}</span>
                </button>

                {/* Lame - Improved Styling */}
                <button
                  onClick={() => toggleDislike(post.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg transition-all duration-200 text-xs font-semibold min-h-[44px] focus:outline-none focus-visible:outline-2 focus-visible:outline-purple-500 focus-visible:outline-offset-1 ${isDisliked
                    ? "bg-orange-600/30 border border-orange-500/50 text-orange-300 shadow-lg shadow-orange-500/20"
                    : "bg-slate-700/40 border border-slate-600/30 text-slate-300 hover:bg-orange-600/20 hover:border-orange-500/40 hover:text-orange-300"
                    }`}
                  aria-label={
                    isDisliked
                      ? `Remove Lame from ${post.user}'s post`
                      : `Mark ${post.user}'s post as Lame`
                  }
                  title="Lame"
                >
                  <ThumbsDown size={18} fill={isDisliked ? "currentColor" : "none"} />
                </button>

                {/* Reply */}
                <button
                  onClick={() => setActiveComments(post.id)}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-slate-300 hover:bg-blue-600/20 hover:text-blue-300 hover:border-blue-500/40 bg-slate-700/40 border border-slate-600/30 transition-all duration-200 text-xs font-semibold min-h-[44px] focus:outline-none focus-visible:outline-2 focus-visible:outline-purple-500 focus-visible:outline-offset-1"
                  aria-label={`Reply to post by ${post.user}`}
                  title="Reply"
                >
                  <MessageCircle size={18} />
                </button>

                {/* Share */}
                <button
                  onClick={() => setActiveShare(post.id)}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-slate-300 hover:bg-green-600/20 hover:text-green-300 hover:border-green-500/40 bg-slate-700/40 border border-slate-600/30 transition-all duration-200 text-xs font-semibold min-h-[44px] focus:outline-none focus-visible:outline-2 focus-visible:outline-purple-500 focus-visible:outline-offset-1"
                  aria-label={`Share post by ${post.user}`}
                  title="Share"
                >
                  <Share2 size={18} />
                </button>

                {/* Save */}
                <button
                  onClick={() => toggleSave(post.id)}
                  className={`flex-1 flex items-center justify-center py-2.5 px-3 rounded-lg transition-all duration-200 text-xs font-semibold min-h-[44px] focus:outline-none focus-visible:outline-2 focus-visible:outline-purple-500 focus-visible:outline-offset-1 ${isSaved
                    ? "bg-yellow-600/30 border border-yellow-500/50 text-yellow-300 shadow-lg shadow-yellow-500/20"
                    : "bg-slate-700/40 border border-slate-600/30 text-slate-300 hover:bg-yellow-600/20 hover:border-yellow-500/40 hover:text-yellow-300"
                    }`}
                  aria-label={isSaved ? "Remove from saved" : "Save this post"}
                  title="Save"
                >
                  <Bookmark size={18} fill={isSaved ? "currentColor" : "none"} />
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
