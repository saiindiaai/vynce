"use client";

import DropPreviewSheet from "@/components/drops/DropPreviewSheet";
import PostPreviewSheet from "@/components/posts/PostPreviewSheet";
import { fetchSavedDrops } from "@/lib/drops";
import { fetchSavedPosts } from "@/lib/social";
import { useAppStore } from "@/lib/store";
import { Bookmark, Heart, Loader2, MessageCircle, Share2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface SavedPost {
  _id: string;
  content: string;
  author?: {
    username: string;
    displayName: string;
    avatar?: string;
  };
  likes?: { length: number };
  dislikes?: { length: number };
  commentsCount?: number;
  shares?: number;
  createdAt: string;
}

interface SavedDrop {
  _id: string;
  id?: string;
  content: string;
  title?: string;
  author?: {
    username: string;
    displayName: string;
    avatar?: string;
  };
  likes?: { length: number };
  dislikes?: { length: number };
  commentsCount?: number;
  shares?: number;
  createdAt: string;
}

const SavedPage = () => {
  const { toggleSave, setCurrentPage } = useAppStore();
  const router = useRouter();
  const [posts, setPosts] = useState<SavedPost[]>([]);
  const [drops, setDrops] = useState<SavedDrop[]>([]);
  const [allItems, setAllItems] = useState<(SavedPost | SavedDrop)[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [previewPost, setPreviewPost] = useState<SavedPost | null>(null);
  const [previewDrop, setPreviewDrop] = useState<SavedDrop | null>(null);

  const timeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return "now";
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d`;
    const weeks = Math.floor(days / 7);
    return `${weeks}w`;
  };

  const loadSavedContent = async () => {
    try {
      setLoading(true);
      setError(null);
      const [postsData, dropsData] = await Promise.all([
        fetchSavedPosts(page, 20),
        fetchSavedDrops(page, 20),
      ]);

      const newPosts = postsData.posts || [];
      const newDrops = dropsData.drops || [];

      if (page === 1) {
        setPosts(newPosts);
        setDrops(newDrops);
      } else {
        setPosts((prev) => [...prev, ...newPosts]);
        setDrops((prev) => [...prev, ...newDrops]);
      }

      // Merge and sort by date
      const combined = [...newPosts, ...newDrops].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      if (page === 1) {
        setAllItems(combined);
      } else {
        setAllItems((prev) => [
          ...prev,
          ...combined.filter((item) => !prev.some((p) => p._id === item._id)),
        ]);
      }

      setHasMore(
        (postsData.hasMore ?? false) || (dropsData.hasMore ?? false)
      );
    } catch (err) {
      console.error("Failed to load saved content:", err);
      setError("Failed to load saved content");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSavedContent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleUnsave = (itemId: string, type: "post" | "drop") => {
    toggleSave(itemId);
    if (type === "post") {
      setPosts((prev) => prev.filter((p) => p._id !== itemId));
    } else {
      setDrops((prev) => prev.filter((d) => d._id !== itemId));
    }
    setAllItems((prev) => prev.filter((item) => item._id !== itemId));
  };

  const isPost = (item: SavedPost | SavedDrop): item is SavedPost => {
    return !("id" in item && (item as any).id);
  };

  const isDrop = (item: SavedPost | SavedDrop): item is SavedDrop => {
    return "id" in item || (item as any).id;
  };

  if (loading && page === 1) {
    return (
      <div className="animate-fadeIn pb-24 sm:pb-0 w-full">
        <div className="px-4 sm:px-6 py-6 border-b border-slate-700/50 bg-slate-900">
          <h1 className="text-3xl sm:text-4xl font-black text-slate-50 mb-2">Saved</h1>
          <p className="text-sm sm:text-base text-slate-400">Posts you've bookmarked for later</p>
        </div>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="animate-spin text-slate-400" size={40} />
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn pb-24 sm:pb-0 w-full">
      {/* Header */}
      <div className="px-4 sm:px-6 py-6 border-b border-slate-700/50 bg-slate-900">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-50 mb-2">Saved</h1>
        <p className="text-sm sm:text-base text-slate-400">Posts you've bookmarked for later</p>
      </div>

      {/* Saved Items */}
      <div className="max-w-2xl mx-auto w-full px-3 sm:px-6 py-6 space-y-1">
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-red-300 mb-4">
            {error}
          </div>
        )}

        {allItems.length > 0 ? (
          <>
            {allItems.map((item, idx) => {
              const aura = (item.likes?.length || 0) - (item.dislikes?.length || 0);
              const isDropItem = isDrop(item);
              const isPostItem = isPost(item);

              return (
                <article
                  key={item._id}
                  className="clean-card animate-slideIn p-4 cursor-pointer hover:bg-slate-800/40 transition"
                  style={{ animationDelay: `${idx * 100}ms` }}
                  onClick={() => {
                    if (isDropItem) {
                      setPreviewDrop(item as SavedDrop);
                    } else {
                      setPreviewPost(item as SavedPost);
                    }
                  }}
                >
                  {/* Item Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex-shrink-0 flex items-center justify-center text-base font-bold text-white">
                        {item.author?.username?.charAt(0).toUpperCase() || "?"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-sm text-slate-50">
                            {item.author?.displayName || item.author?.username || "Unknown"}
                          </span>
                          {isDropItem && (
                            <span className="text-xs bg-purple-600/30 text-purple-300 px-2 py-0.5 rounded-full">
                              Drop
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-400">
                          <span>@{item.author?.username || "unknown"}</span>
                          <span>·</span>
                          <span>saved {timeAgo(item.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Item Content */}
                  <div className="mb-3">
                    {isDropItem && (item as SavedDrop).title && (
                      <div className="text-xs font-semibold text-purple-300 mb-1">
                        {(item as SavedDrop).title}
                      </div>
                    )}
                    <p className="text-sm text-slate-100 leading-relaxed">
                      {item.content}
                    </p>
                  </div>

                  {/* Engagement Stats */}
                  <div className="text-xs text-slate-400 flex gap-4 mb-3 pb-3 border-b border-slate-700/30">
                    <button className="hover:text-slate-200 transition-colors">{aura} Aura</button>
                    <button className="hover:text-slate-200 transition-colors">
                      {item.commentsCount || 0} Comments
                    </button>
                    <button className="hover:text-slate-200 transition-colors">
                      {item.shares || 0} Shares
                    </button>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between gap-2" onClick={(e) => e.stopPropagation()}>
                    <button className="flex-1 flex items-center justify-center gap-1 py-2 px-1 rounded-md text-slate-400 hover:bg-slate-800/50 hover:text-red-300 transition-all duration-150 text-xs font-medium min-h-[36px] focus:outline-none focus-visible:outline-2 focus-visible:outline-purple-500">
                      <Heart size={14} />
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-1 py-2 px-1 rounded-md text-slate-400 hover:bg-slate-800/50 hover:text-blue-300 transition-all duration-150 text-xs font-medium min-h-[36px] focus:outline-none focus-visible:outline-2 focus-visible:outline-purple-500">
                      <MessageCircle size={14} />
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-1 py-2 px-1 rounded-md text-slate-400 hover:bg-slate-800/50 hover:text-green-300 transition-all duration-150 text-xs font-medium min-h-[36px] focus:outline-none focus-visible:outline-2 focus-visible:outline-purple-500">
                      <Share2 size={14} />
                    </button>
                    <button
                      onClick={() => {
                        // Always check both id and _id for drops, only _id for posts
                        if (isDropItem) {
                          handleUnsave((item as any).id || item._id, "drop");
                        } else {
                          handleUnsave(item._id, "post");
                        }
                      }}
                      className="flex-1 flex items-center justify-center py-2 px-1 rounded-md text-yellow-400 bg-slate-800 hover:bg-slate-700 transition-all duration-150 text-xs font-medium min-h-[36px] min-w-[36px] focus:outline-none focus-visible:outline-2 focus-visible:outline-purple-500"
                    >
                      <Bookmark size={14} fill="currentColor" />
                    </button>
                  </div>
                </article>
              );
            })}

            {hasMore && (
              <div className="flex justify-center pt-4">
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={loading}
                  className="px-6 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-50"
                >
                  {loading ? "Loading..." : "Load More"}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <Bookmark size={32} className="mx-auto text-slate-600 mb-4" />
            <p className="text-slate-300 text-lg font-semibold">No saved items yet</p>
            <p className="text-slate-500 text-sm mt-1">Posts and drops you save will appear here</p>
          </div>
        )}
      </div>

      {/* Post Preview Sheet */}
      <PostPreviewSheet
        open={!!previewPost}
        onClose={() => setPreviewPost(null)}
        post={previewPost}
      />

      {/* Drop Preview Sheet */}
      <DropPreviewSheet
        open={!!previewDrop}
        onClose={() => setPreviewDrop(null)}
        drop={previewDrop}
      />
    </div>
  );
};

export default SavedPage;
