"use client";

import { createComment, fetchCommentsByPost } from "@/lib/social";
import { useAppStore } from "@/lib/store";
import { Send, ThumbsUp, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

interface CommentsSheetProps {
  isOpen: boolean;
  onClose: () => void;
  postId: string | number;
  commentsCount?: number;
  variant?: "home" | "drops" | "capsules" | "fight";
  updateCommentsCount?: (postId: string | number, count: number) => void;
}

type Comment = {
  id: string;
  author: string;
  avatar?: string;
  text: string;
  time: string;
};

export default function CommentsSheet({
  isOpen,
  onClose,
  postId,
  commentsCount = 0,
  variant = "home",
  updateCommentsCount,
}: CommentsSheetProps) {
  const { currentUser } = useAppStore();
  const [comments, setComments] = useState<Comment[]>([]);
  const [input, setInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // fight/vote state
  const [teams] = useState(() => [
    { id: "a", name: "Team Alpha", votes: 124, color: "from-purple-500 to-pink-500" },
    { id: "b", name: "Team Beta", votes: 98, color: "from-cyan-500 to-blue-500" },
  ]);
  const [myVote, setMyVote] = useState<string | null>(null);
  const [voteCounts, setVoteCounts] = useState({ a: teams[0].votes, b: teams[1].votes });

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

  const loadComments = async () => {
    try {
      const data = await fetchCommentsByPost(postId);
      const mappedComments = data.map((c: any) => ({
        id: c._id || c.id,
        author: c.author?.displayName || c.author?.username || 'Unknown',
        avatar: c.author?.avatar || '👤',
        text: c.content,
        time: timeAgo(c.createdAt),
      }));
      setComments(mappedComments);
      updateCommentsCount?.(postId, mappedComments.length);
    } catch (err) {
      console.error("Failed to load comments:", err);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadComments();
    }
  }, [isOpen, postId]);

  if (!isOpen) return null;

  const isFight = variant === "fight";

  const handleSubmit = async () => {
    const trimmed = input.trim();
    if (!trimmed || submitting) return;
    setSubmitting(true);
    try {
      await createComment(postId, trimmed);
      // Optimistic update
      const newComment: Comment = {
        id: `temp-${Date.now()}`,
        author: currentUser?.displayName || currentUser?.name || currentUser?.username || "You",
        avatar: currentUser?.avatar || "👤",
        text: trimmed,
        time: "now",
      };
      setComments((prev) => [...prev, newComment]);
      setInput("");
      updateCommentsCount?.(postId, comments.length + 1);
    } catch (e) {
      console.error("Failed to send comment", e);
    } finally {
      setSubmitting(false);
      inputRef.current?.focus();
    }
  };

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleVote = (teamId: "a" | "b") => {
    if (!currentUser) {
      // optimistic guest feedback
      alert("Please sign in to vote");
      return;
    }
    if (myVote === teamId) {
      // unvote
      setMyVote(null);
      setVoteCounts((prev) => ({ ...prev, [teamId]: prev[teamId] - 1 }));
      return;
    }
    // switch or vote
    setVoteCounts((prev) => {
      const next = { ...prev };
      if (myVote) next[myVote as "a" | "b"] = Math.max(0, next[myVote as "a" | "b"] - 1);
      next[teamId] = next[teamId] + 1;
      return next;
    });
    setMyVote(teamId);
    // TODO: send vote to API
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
        onClick={onClose}
        aria-hidden="true"
        role="presentation"
      />

      <div className={`fixed inset-x-0 bottom-0 z-50`}>
        <div className={`max-w-2xl mx-auto px-3 sm:px-4`}>
          <div
            className={`rounded-3xl bg-slate-800 border border-slate-700 max-h-[85vh] flex flex-col shadow-2xl`}
          >
            <div className={`flex items-center justify-between p-4 border-b border-slate-700`}>
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full bg-gradient-to-br ${variant === "drops" ? "from-amber-500 to-orange-500" : "from-purple-600 to-blue-600"} flex items-center justify-center shadow-md`}
                  aria-hidden
                >
                  <ThumbsUp size={18} className="text-white" />
                </div>
                <div>
                  <div className={`text-base font-bold text-slate-50`}>
                    {isFight ? "Vote" : "Comments"}
                  </div>
                  <div className={`text-xs text-slate-400`}>
                    {isFight
                      ? "Pick a side — results update instantly"
                      : `${commentsCount} replies`}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {currentUser && (
                  <div className="text-xs text-right">
                    <div className={`font-semibold text-slate-50`}>
                      {currentUser.displayName || currentUser.name || currentUser.username}
                    </div>
                    <div className={`text-[11px] text-slate-400`}>Active</div>
                  </div>
                )}
                <button
                  onClick={onClose}
                  aria-label="Close"
                  className="p-2 rounded-full hover:bg-slate-700/50 focus:outline-none focus-visible:outline-2 focus-visible:outline-purple-500"
                >
                  <X size={18} className={`text-slate-400`} />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {isFight ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-3">
                    <button
                      onClick={() => handleVote("a")}
                      className={`flex-1 p-4 rounded-2xl flex items-center gap-3 transition-all ${myVote === "a" ? `bg-gradient-to-br ${teams[0].color} text-white shadow-lg` : `bg-slate-800 border border-slate-700`}`}
                    >
                      <div
                        className={`w-12 h-12 rounded-full bg-gradient-to-br ${teams[0].color}`}
                      />
                      <div className="text-left">
                        <div className="font-semibold text-slate-50">{teams[0].name}</div>
                        <div className={`text-xs text-slate-400`}>{voteCounts.a} votes</div>
                      </div>
                    </button>

                    <button
                      onClick={() => handleVote("b")}
                      className={`flex-1 p-4 rounded-2xl flex items-center gap-3 transition-all ${myVote === "b" ? `bg-gradient-to-br ${teams[1].color} text-white shadow-lg` : `bg-slate-800 border border-slate-700`}`}
                    >
                      <div
                        className={`w-12 h-12 rounded-full bg-gradient-to-br ${teams[1].color}`}
                      />
                      <div className="text-left">
                        <div className="font-semibold text-slate-50">{teams[1].name}</div>
                        <div className={`text-xs text-slate-400`}>{voteCounts.b} votes</div>
                      </div>
                    </button>
                  </div>

                  <div className={`text-xs text-slate-400 text-center`}>
                    Voting is anonymous. Refresh to see latest results.
                  </div>
                </div>
              ) : (
                <ul role="list" className="space-y-3">
                  {comments.map((c) => (
                    <li
                      key={c.id}
                      className={`flex gap-3 ${c.id.startsWith("temp-") ? "opacity-80" : ""}`}
                    >
                      <div
                        className="w-10 h-10 rounded-full bg-slate-700 flex-shrink-0"
                        aria-hidden
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <div className="text-sm font-semibold text-slate-50">{c.author}</div>
                          <div className={`text-[11px] text-slate-400`}>{c.time}</div>
                        </div>
                        <div className={`mt-1 text-sm text-slate-100 break-words`}>{c.text}</div>
                      </div>
                    </li>
                  ))}
                  {comments.length === 0 && (
                    <li className={`text-center text-sm text-slate-400 py-6`}>
                      Be the first to comment
                    </li>
                  )}
                </ul>
              )}
            </div>

            {/* Footer / Input for non-fight */}
            {!isFight && (
              <div className={`p-3 border-t border-slate-700`}>
                <div
                  className={`flex items-center gap-2 px-3 py-2 rounded-2xl bg-slate-800 border border-slate-700`}
                >
                  <img
                    className="w-9 h-9 rounded-full object-cover"
                    src={currentUser?.avatar || "/default-avatar.png"}
                    alt={currentUser?.username || "You"}
                  />
                  <input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKey}
                    placeholder="Write a reply..."
                    className={`flex-1 bg-transparent outline-none text-sm text-slate-50 placeholder-slate-500`}
                    aria-label="Write a comment"
                  />
                  <button
                    onClick={handleSubmit}
                    disabled={submitting || input.trim().length === 0}
                    className={`p-2 rounded-full ${input.trim().length > 0 ? `bg-purple-600 text-white` : "bg-slate-700 text-slate-400"} transition-all`}
                    aria-label="Send comment"
                  >
                    <Send size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
