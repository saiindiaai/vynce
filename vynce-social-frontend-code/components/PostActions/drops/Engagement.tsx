'use client';

import React from 'react';
import { Heart, MessageCircle, Share2 } from 'lucide-react';

interface DropsEngagementProps {
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
  themeClasses: any;
}

export default function DropsEngagement({
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
  themeClasses,
}: DropsEngagementProps) {
  return (
    <div className={`flex items-center justify-between border-t ${themeClasses.cardBorder} pt-3`}>
      <button
        onClick={onLike}
        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition-colors ${
          isLiked ? 'text-red-500' : themeClasses.textSecondary
        } hover:bg-gray-800/50`}
      >
        <Heart size={18} fill={isLiked ? 'currentColor' : 'none'} />
        <span className="text-sm">{aura}</span>
      </button>
      <button
        onClick={onComment}
        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition-colors ${themeClasses.textSecondary} hover:bg-gray-800/50`}
      >
        <MessageCircle size={18} />
        <span className="text-sm">{comments}</span>
      </button>
      <button
        onClick={onShare}
        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition-colors ${themeClasses.textSecondary} hover:bg-gray-800/50`}
      >
        <Share2 size={18} />
        <span className="text-sm">{shares}</span>
      </button>
    </div>
  );
}
