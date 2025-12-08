'use client';

import React from 'react';
import { Heart, MessageCircle, Share2, MoreVertical } from 'lucide-react';

interface DropCardProps {
  drop: any;
  themeClasses: any;
  isLiked?: boolean;
  isDisliked?: boolean;
  isSaved?: boolean;
  onLike?: () => void;
  onDislike?: () => void;
  onComment?: () => void;
  onShare?: () => void;
  onMenu?: () => void;
  variant?: 'default' | 'compact';
}

export default function DropCard({
  drop,
  themeClasses,
  isLiked = false,
  isDisliked = false,
  isSaved = false,
  onLike,
  onDislike,
  onComment,
  onShare,
  onMenu,
  variant = 'default',
}: DropCardProps) {
  const currentAura = isLiked ? drop.aura + 1 : isDisliked ? drop.aura - 1 : drop.aura;

  return (
    <div
      className={`border-b ${themeClasses.cardBorder} ${themeClasses.cardBg} p-4 hover:bg-gray-900/50 transition-colors group`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3 flex-1">
          <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${themeClasses.primary} flex-shrink-0`} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className={`font-bold ${themeClasses.textPrimary}`}>{drop.user}</span>
              {drop.verified && <span className="text-blue-500">✓</span>}
            </div>
            <div className={`text-sm ${themeClasses.textSecondary}`}>
              {drop.username} • {drop.time}
            </div>
          </div>
        </div>
        {onMenu && (
          <button
            onClick={onMenu}
            className={`p-2 rounded-full hover:bg-gray-800/50 transition-colors`}
          >
            <MoreVertical size={18} className={themeClasses.textSecondary} />
          </button>
        )}
      </div>

      {/* Content */}
      <p className={`mb-4 ${themeClasses.textPrimary}`}>{drop.content}</p>

      {/* Stats */}
      <div className={`text-xs ${themeClasses.textSecondary} mb-3 flex gap-4`}>
        <span>{currentAura} Aura</span>
        <span>{drop.comments} Comments</span>
        <span>{drop.shares} Shares</span>
      </div>

      {/* Actions */}
      <div className={`flex items-center justify-between border-t ${themeClasses.cardBorder} pt-3`}>
        {onLike && (
          <button
            onClick={onLike}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition-colors ${
              isLiked ? 'text-red-500' : themeClasses.textSecondary
            } hover:bg-gray-800/50`}
          >
            <Heart size={18} fill={isLiked ? 'currentColor' : 'none'} />
            <span className="text-sm hidden sm:inline">Aura</span>
          </button>
        )}
        {onComment && (
          <button
            onClick={onComment}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition-colors ${themeClasses.textSecondary} hover:bg-gray-800/50`}
          >
            <MessageCircle size={18} />
            <span className="text-sm hidden sm:inline">Comment</span>
          </button>
        )}
        {onShare && (
          <button
            onClick={onShare}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition-colors ${themeClasses.textSecondary} hover:bg-gray-800/50`}
          >
            <Share2 size={18} />
            <span className="text-sm hidden sm:inline">Share</span>
          </button>
        )}
      </div>
    </div>
  );
}
