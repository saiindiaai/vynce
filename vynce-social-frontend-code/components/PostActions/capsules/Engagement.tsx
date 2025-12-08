'use client';

import React from 'react';
import { Heart, MessageCircle, Share2 } from 'lucide-react';

interface CapsulesEngagementProps {
  aura: number;
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
}

export default function CapsulesEngagement({
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
}: CapsulesEngagementProps) {
  return (
    <div className={`flex items-center justify-between border-t border-slate-700 pt-3`}>
      <button
        onClick={onLike}
        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition-colors focus:outline-none focus-visible:outline-2 focus-visible:outline-purple-500 ${
          isLiked ? 'text-red-500' : 'text-slate-400'
        } hover:bg-slate-800/50`}
        aria-label={isLiked ? "Remove like" : "Like this"}
      >
        <Heart size={18} fill={isLiked ? 'currentColor' : 'none'} />
        <span className="text-sm">{aura}</span>
      </button>
      <button
        onClick={onComment}
        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition-colors focus:outline-none focus-visible:outline-2 focus-visible:outline-purple-500 text-slate-400 hover:bg-slate-800/50`}
        aria-label="View comments"
      >
        <MessageCircle size={18} />
        <span className="text-sm">{comments}</span>
      </button>
      <button
        onClick={onShare}
        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition-colors focus:outline-none focus-visible:outline-2 focus-visible:outline-purple-500 text-slate-400 hover:bg-slate-800/50`}
        aria-label="Share this"
      >
        <Share2 size={18} />
        <span className="text-sm">{shares}</span>
      </button>
    </div>
  );
}
