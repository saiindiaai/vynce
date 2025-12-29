"use client";

import { fetchSocialFeed } from "@/lib/social";
import { useEffect, useRef, useState } from "react";

interface Author {
  uid: string;
  username: string;
  displayName?: string;
}

interface Post {
  _id: string;
  content: string;
  createdAt: string;
  author: Author;
}

interface FeedResponse {
  posts: Post[];
  nextCursor: string | null;
  hasMore: boolean;
}

export default function SocialPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const loadPosts = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const data: FeedResponse = await fetchSocialFeed({
        cursor: cursor ?? undefined,
        limit: 5,
      });


      setPosts((prev) => {
        const existing = new Set(prev.map((p) => p._id));
        const toAdd = data.posts.filter((p) => !existing.has(p._id));
        return [...prev, ...toAdd];
      });
      setCursor(data.nextCursor);
      setHasMore(data.hasMore);
    } catch (err) {
      console.error("Feed load error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadPosts();
  }, []);

  // Infinite scroll observer
  useEffect(() => {
    if (!loadMoreRef.current) return;

    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadPosts();
        }
      },
      { threshold: 1 }
    );

    observerRef.current.observe(loadMoreRef.current);

    return () => observerRef.current?.disconnect();
  }, []);

  return (
    <div className="max-w-xl mx-auto py-6 space-y-4">
      <h1 className="text-xl font-semibold">Social Feed</h1>

      {posts.map((post) => (
        <div
          key={post._id}
          className="border rounded-lg p-4 bg-background"
        >
          <div className="text-sm text-muted-foreground">
            @{post.author.username}
          </div>

          <div className="mt-2 text-base">{post.content}</div>

          <div className="mt-2 text-xs text-muted-foreground">
            {new Date(post.createdAt).toLocaleString()}
          </div>
        </div>
      ))}

      {loading && (
        <div className="text-center text-sm text-muted-foreground">
          Loading...
        </div>
      )}

      {!hasMore && (
        <div className="text-center text-sm text-muted-foreground">
          No more posts
        </div>
      )}

      {/* Intersection observer target */}
      <div ref={loadMoreRef} className="h-4" />
    </div>
  );
}
