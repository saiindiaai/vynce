"use client";

import CommentsSheet from "@/components/PostActions/CommentsSheet";
import PostMenu from "@/components/PostActions/PostMenu";
import ShareSheet from "@/components/PostActions/ShareSheet";
import { fetchDropFeed, toggleDropDislike, toggleDropLike } from "@/lib/drops";
import { useAppStore } from "@/lib/store";
import { Bookmark, Heart, MessageCircle, MoreVertical, Share2, ThumbsDown } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

interface Author {
  uid: string;
  username: string;
  displayName?: string;
}

interface Drop {
  _id: string;
  content: string;
  createdAt: string;
  author: Author;
  media?: { url: string; type: string };
  aura: number;
  isLikedByMe: boolean;
  isDislikedByMe: boolean;
  commentsCount?: number;
}

interface DropFeedResponse {
  drops: Drop[];
  nextCursor: string | null;
  hasMore: boolean;
}

const DropsPage = () => {
  const { likedPosts, dislikedPosts, savedPosts, toggleLike, toggleDislike, toggleSave } = useAppStore();
  const searchParams = useSearchParams();
  const dropRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const [drops, setDrops] = useState<any[]>([]);
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const timeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return "now";
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    return `${days}d`;
  };

  const loadDrops = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const data: DropFeedResponse = await fetchDropFeed({
        cursor: cursor ?? undefined,
        limit: 5,
      });
      const mappedDrops = data.drops.map((d, index) => ({
        id: d._id,
        _id: d._id,
        user: d.author?.displayName || d.author?.username || "Unknown User",
        username: d.author?.username || "unknown",
        author: d.author, // Preserve the full author object
        verified: false,
        time: timeAgo(d.createdAt),
        avatar: "👤",
        content: d.content,
        media: d.media,
        aura: d.aura,
        isLikedByMe: d.isLikedByMe,
        isDislikedByMe: d.isDislikedByMe,
        comments: d.commentsCount || 0,
        shares: 0,
        tags: [], // For now, no tags
      }));
      setDrops((prev) => {
        const existing = new Set(prev.map((d) => d._id));
        const toAdd = mappedDrops.filter((d) => !existing.has(d._id));
        return [...prev, ...toAdd];
      });
      // Update liked posts state from backend data
      const newLikedPosts: Record<string, boolean> = {};
      mappedDrops.forEach((drop) => {
        newLikedPosts[drop.id] = drop.isLikedByMe;
      });
      // Note: We need to handle dislikedPosts similarly, but for now let's focus on likes
      setCursor(data.nextCursor || undefined);
      setHasMore(data.hasMore);
    } catch (err) {
      console.error("Drop feed load error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadDrops();
  }, []);

  // Scroll to drop if ?post=ID is present
  useEffect(() => {
    const postId = searchParams.get("post");
    if (postId) {
      // Check if drop is already loaded
      if (dropRefs.current[postId]) {
        dropRefs.current[postId]?.scrollIntoView({ behavior: "smooth", block: "center" });
        // Highlight the drop
        dropRefs.current[postId]?.classList.add("ring-4", "ring-purple-500");
        setTimeout(() => {
          dropRefs.current[postId]?.classList.remove("ring-4", "ring-purple-500");
        }, 1600);
      } else {
        // If drop not found in current list, load more drops until we find it
        const checkAndLoadMore = async () => {
          let attempts = 0;
          const maxAttempts = 10; // Prevent infinite loop

          while (!dropRefs.current[postId] && hasMore && attempts < maxAttempts) {
            attempts++;
            await new Promise(resolve => setTimeout(resolve, 100)); // Wait a bit for state update
            await loadDrops();
          }

          // After loading attempts, try to scroll if found
          if (dropRefs.current[postId]) {
            setTimeout(() => {
              dropRefs.current[postId]?.scrollIntoView({ behavior: "smooth", block: "center" });
              dropRefs.current[postId]?.classList.add("ring-4", "ring-purple-500");
              setTimeout(() => {
                dropRefs.current[postId]?.classList.remove("ring-4", "ring-purple-500");
              }, 1600);
            }, 300);
          }
        };

        checkAndLoadMore();
      }
    }
  }, [drops, searchParams]);

  // Infinite scroll observer
  useEffect(() => {
    if (!loadMoreRef.current) return;
    if (observerRef.current) {
      observerRef.current.disconnect();
    }
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadDrops();
        }
      },
      { threshold: 1 }
    );
    observerRef.current.observe(loadMoreRef.current);
    return () => observerRef.current?.disconnect();
  }, [hasMore, loading]);

  const [activeComments, setActiveComments] = useState<number | null>(null);
  const [activeShare, setActiveShare] = useState<number | null>(null);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const updateDropComments = (dropId: string | number, newCount: number) => {
    setDrops((prev) => prev.map((d) => (d.id === dropId ? { ...d, comments: newCount } : d)));
  };

  const handleToggleLike = async (dropId: string) => {
    // Optimistic update
    setDrops((prev) => prev.map((d) => {
      if (d.id === dropId) {
        const wasLiked = d.isLikedByMe;
        const wasDisliked = d.isDislikedByMe;
        let newAura = d.aura;
        if (!wasLiked) {
          newAura += 1;
          if (wasDisliked) newAura += 1; // remove dislike
        } else {
          newAura -= 1;
        }
        return {
          ...d,
          isLikedByMe: !wasLiked,
          isDislikedByMe: false,
          aura: newAura,
        };
      }
      return d;
    }));

    try {
      const response = await toggleDropLike(dropId);
      // Update with server response
      setDrops((prev) => prev.map((d) =>
        d.id === dropId ? { ...d, aura: response.aura, isLikedByMe: response.liked, isDislikedByMe: false } : d
      ));
    } catch (error) {
      // Revert optimistic update
      setDrops((prev) => prev.map((d) => {
        if (d.id === dropId) {
          const wasLiked = !d.isLikedByMe; // revert
          const wasDisliked = d.isDislikedByMe;
          let newAura = d.aura;
          if (wasLiked) {
            newAura -= 1;
            if (wasDisliked) newAura -= 1;
          } else {
            newAura += 1;
          }
          return {
            ...d,
            isLikedByMe: wasLiked,
            isDislikedByMe: wasDisliked,
            aura: newAura,
          };
        }
        return d;
      }));
      console.error("Failed to toggle like:", error);
    }
  };

  const handleToggleDislike = async (dropId: string) => {
    // Optimistic update
    setDrops((prev) => prev.map((d) => {
      if (d.id === dropId) {
        const wasLiked = d.isLikedByMe;
        const wasDisliked = d.isDislikedByMe;
        let newAura = d.aura;
        if (!wasDisliked) {
          newAura -= 1;
          if (wasLiked) newAura -= 1; // remove like
        } else {
          newAura += 1;
        }
        return {
          ...d,
          isDislikedByMe: !wasDisliked,
          isLikedByMe: false,
          aura: newAura,
        };
      }
      return d;
    }));

    try {
      const response = await toggleDropDislike(dropId);
      // Update with server response
      setDrops((prev) => prev.map((d) =>
        d.id === dropId ? { ...d, aura: response.aura, isDislikedByMe: response.disliked, isLikedByMe: false } : d
      ));
    } catch (error) {
      // Revert optimistic update
      setDrops((prev) => prev.map((d) => {
        if (d.id === dropId) {
          const wasDisliked = !d.isDislikedByMe; // revert
          const wasLiked = d.isLikedByMe;
          let newAura = d.aura;
          if (wasDisliked) {
            newAura += 1;
            if (wasLiked) newAura += 1;
          } else {
            newAura -= 1;
          }
          return {
            ...d,
            isDislikedByMe: wasDisliked,
            isLikedByMe: wasLiked,
            aura: newAura,
          };
        }
        return d;
      }));
      console.error("Failed to toggle dislike:", error);
    }
  };

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
          const isLiked = drop.isLikedByMe;
          const isDisliked = drop.isDislikedByMe;
          const isSaved = savedPosts[drop.id];
          const currentAura = drop.aura;

          return (
            <article
              key={drop.id}
              ref={el => { dropRefs.current[drop.id] = el as HTMLDivElement | null; }}
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
                    {drop.tags.map((tag: string) => (
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

              {/* Media Display */}
              {drop.media && (
                <div className="px-5 pb-3">
                  {drop.media.type === "image" ? (
                    <img
                      src={drop.media.url}
                      alt="Drop media"
                      className="w-full rounded-xl max-h-96 object-cover shadow-lg"
                    />
                  ) : drop.media.type === "video" ? (
                    <video
                      src={drop.media.url}
                      controls
                      className="w-full rounded-xl max-h-96 object-cover shadow-lg"
                    />
                  ) : null}
                </div>
              )}

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
                  onClick={() => handleToggleLike(drop.id)}
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
                  onClick={() => handleToggleDislike(drop.id)}
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
                  onClick={() => toggleSave(drop.id.toString(), "drops")}
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

      {/* Load More Trigger */}
      {hasMore && (
        <div ref={loadMoreRef} className="flex justify-center py-8">
          {loading ? (
            <div className="text-slate-400">Loading more drops...</div>
          ) : (
            <div className="text-slate-500">Scroll for more</div>
          )}
        </div>
      )}

      {/* Sheets */}
      {activeComments !== null && (
        <CommentsSheet
          isOpen={true}
          onClose={() => setActiveComments(null)}
          postId={activeComments}
          commentsCount={drops.find((d) => d.id === activeComments)?.comments || 0}
          variant="drops"
          updateCommentsCount={updateDropComments}
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
          post={drops.find(d => d.id === activeMenu)}
          isOwnPost={false}
          variant="drops"
        />
      )}
    </div>
  );
};

export default DropsPage;

