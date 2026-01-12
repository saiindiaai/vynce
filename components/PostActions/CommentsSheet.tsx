"use client";

import { createDropComment, dislikeDropComment, fetchDropCommentsByDrop, likeDropComment } from "@/lib/drops";
import { createComment, dislikeComment, fetchCommentsByPost, likeComment } from "@/lib/social";
import { useAppStore } from "@/lib/store";
import { Heart, HeartOff, Send, ThumbsUp, X } from "lucide-react";
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
  likes?: number;
  dislikes?: number;
  userLiked?: boolean;
  userDisliked?: boolean;
  replies?: Comment[];
  parentComment?: string;
};

interface CommentItemProps {
  comment: Comment;
  onReply: (commentId: string) => void;
  onLike: (commentId: string) => void;
  onDislike: (commentId: string) => void;
  variant: "home" | "drops" | "capsules" | "fight";
}

function CommentItem({ comment, onReply, onLike, onDislike, variant }: CommentItemProps) {
  return (
    <li className={`space-y-2 ${comment.id.startsWith("temp-") ? "opacity-80" : ""}`}>
      <div className="flex gap-3">
        <div
          className="w-10 h-10 rounded-full bg-slate-700 flex-shrink-0"
          aria-hidden
        />
        <div className="flex-1">
          <div className="flex items-center justify-between gap-2">
            <div className="text-sm font-semibold text-slate-50">{comment.author}</div>
            <div className={`text-[11px] text-slate-400`}>{comment.time}</div>
          </div>
          <div className={`mt-1 text-sm text-slate-100 break-words`}>{comment.text}</div>

          {/* Like/Dislike buttons */}
          <div className="flex items-center gap-4 mt-2">
            <button
              onClick={() => onLike(comment.id)}
              disabled={comment.id.startsWith("temp-")}
              className={`flex items-center gap-1 text-xs transition-colors ${comment.id.startsWith("temp-")
                  ? "opacity-50 cursor-not-allowed"
                  : comment.userLiked
                    ? "text-green-400"
                    : "text-slate-400 hover:text-green-400"
                }`}
            >
              <Heart size={14} fill={comment.userLiked ? "currentColor" : "none"} />
              <span>{comment.likes || 0}</span>
            </button>
            <button
              onClick={() => onDislike(comment.id)}
              disabled={comment.id.startsWith("temp-")}
              className={`flex items-center gap-1 text-xs transition-colors ${comment.id.startsWith("temp-")
                  ? "opacity-50 cursor-not-allowed"
                  : comment.userDisliked
                    ? "text-red-400"
                    : "text-slate-400 hover:text-red-400"
                }`}
            >
              <HeartOff size={14} />
              <span>{comment.dislikes || 0}</span>
            </button>
            <button
              onClick={() => onReply(comment.id)}
              disabled={comment.id.startsWith("temp-")}
              className={`text-xs transition-colors ${comment.id.startsWith("temp-")
                  ? "opacity-50 cursor-not-allowed text-slate-500"
                  : "text-slate-400 hover:text-slate-300"
                }`}
            >
              Reply
            </button>
          </div>
        </div>
      </div>

      {/* Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-8 space-y-2 border-l border-slate-700 pl-4">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              onReply={onReply}
              onLike={onLike}
              onDislike={onDislike}
              variant={variant}
            />
          ))}
        </div>
      )}
    </li>
  );
}

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
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
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
      const data = variant === "drops"
        ? await fetchDropCommentsByDrop(postId)
        : await fetchCommentsByPost(postId);

      // Handle both flat and hierarchical comment structures
      const processComments = (comments: any[]): Comment[] => {
        return comments.map((c: any) => ({
          id: c._id || c.id,
          author: c.author?.displayName || c.author?.username || 'Unknown',
          avatar: c.author?.avatar || '👤',
          text: c.content,
          time: timeAgo(c.createdAt),
          likes: c.likes?.length || 0,
          dislikes: c.dislikes?.length || 0,
          userLiked: c.likes?.includes(currentUser?.id),
          userDisliked: c.dislikes?.includes(currentUser?.id),
          replies: c.replies ? processComments(c.replies) : [],
          parentComment: c.parentComment,
        }));
      };

      const commentsArray: any[] = Array.isArray(data) ? data : (data as any).comments || [];
      const mappedComments = processComments(commentsArray);
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

    // Prevent replying to temporary comments
    if (replyingTo && replyingTo.startsWith("temp-")) {
      alert("Cannot reply to unsaved comments");
      setReplyingTo(null);
      return;
    }

    setSubmitting(true);
    try {
      if (variant === "drops") {
        await createDropComment(postId, trimmed, replyingTo || undefined);
      } else {
        await createComment(postId, trimmed, replyingTo || undefined);
      }

      // Optimistic update
      const newComment: Comment = {
        id: `temp-${Date.now()}`,
        author: currentUser?.displayName || currentUser?.name || currentUser?.username || "You",
        avatar: currentUser?.avatar || "👤",
        text: trimmed,
        time: "now",
        likes: 0,
        dislikes: 0,
        userLiked: false,
        userDisliked: false,
        parentComment: replyingTo || undefined,
      };

      if (replyingTo) {
        // Add as reply to parent comment
        setComments((prev) =>
          prev.map(comment =>
            comment.id === replyingTo
              ? { ...comment, replies: [...(comment.replies || []), newComment] }
              : comment
          )
        );
      } else {
        // Add as top-level comment
        setComments((prev) => [...prev, newComment]);
      }

      setInput("");
      setReplyingTo(null);
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

  const handleLikeComment = async (commentId: string) => {
    if (!currentUser) {
      alert("Please sign in to like comments");
      return;
    }
    if (commentId.startsWith("temp-")) {
      return; // Don't allow liking temporary comments
    }
    try {
      const data = variant === "drops"
        ? await likeDropComment(commentId)
        : await likeComment(commentId);

      setComments(prev => updateCommentLikes(prev, commentId, data));
    } catch (err) {
      console.error("Failed to like comment:", err);
    }
  };

  const handleDislikeComment = async (commentId: string) => {
    if (!currentUser) {
      alert("Please sign in to dislike comments");
      return;
    }
    if (commentId.startsWith("temp-")) {
      return; // Don't allow disliking temporary comments
    }
    try {
      const data = variant === "drops"
        ? await dislikeDropComment(commentId)
        : await dislikeComment(commentId);

      setComments(prev => updateCommentLikes(prev, commentId, data));
    } catch (err) {
      console.error("Failed to dislike comment:", err);
    }
  };

  const updateCommentLikes = (comments: Comment[], commentId: string, data: any): Comment[] => {
    return comments.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          likes: data.likes,
          dislikes: data.dislikes,
          userLiked: data.userLiked,
          userDisliked: data.userDisliked,
        };
      }
      if (comment.replies) {
        return {
          ...comment,
          replies: updateCommentLikes(comment.replies, commentId, data),
        };
      }
      return comment;
    });
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
                    <CommentItem
                      key={c.id}
                      comment={c}
                      onReply={(commentId) => {
                        if (commentId.startsWith("temp-")) {
                          alert("Cannot reply to unsaved comments");
                          return;
                        }
                        setReplyingTo(commentId);
                      }}
                      onLike={handleLikeComment}
                      onDislike={handleDislikeComment}
                      variant={variant}
                    />
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
                {replyingTo && (
                  <div className="flex items-center justify-between mb-2 px-3 py-2 bg-slate-800/50 rounded-lg">
                    <span className="text-xs text-slate-400">
                      Replying to comment
                    </span>
                    <button
                      onClick={() => setReplyingTo(null)}
                      className="text-xs text-slate-400 hover:text-slate-300"
                    >
                      Cancel
                    </button>
                  </div>
                )}
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
                    placeholder={replyingTo ? "Write a reply..." : "Write a comment..."}
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
