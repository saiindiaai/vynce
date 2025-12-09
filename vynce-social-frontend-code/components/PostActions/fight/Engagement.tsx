"use client";

import React from "react";
import { Heart, MessageCircle, Share2, Flame } from "lucide-react";

interface FightEngagementProps {
  fightId: number;
  aura: number;
  comments: number;
  shares: number;
  isLiked?: boolean;
  onLike?: () => void;
  onComment?: () => void;
  onShare?: () => void;
  isFight?: boolean;
  onVoteTeamA?: () => void;
  onVoteTeamB?: () => void;
  teamAVotes?: number;
  teamBVotes?: number;
  userVote?: "teamA" | "teamB";
}

export default function FightEngagement({
  fightId,
  aura,
  comments,
  shares,
  isLiked = false,
  onLike,
  onComment,
  onShare,
  isFight = false,
  onVoteTeamA,
  onVoteTeamB,
  teamAVotes = 0,
  teamBVotes = 0,
  userVote,
}: FightEngagementProps) {
  if (isFight) {
    return (
      <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-700/30">
        <button
          onClick={onVoteTeamA}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-2 rounded-lg transition-all duration-200 ${
            userVote === "teamA"
              ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white"
              : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
          }`}
        >
          <Flame size={16} fill={userVote === "teamA" ? "white" : "none"} />
          <span className="text-xs font-semibold">{teamAVotes}</span>
        </button>
        <div className="flex items-center gap-1 text-xs text-slate-500">
          <MessageCircle size={14} />
          <span>{comments}</span>
        </div>
        <button
          onClick={onVoteTeamB}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-2 rounded-lg transition-all duration-200 ${
            userVote === "teamB"
              ? "bg-gradient-to-r from-red-600 to-orange-600 text-white"
              : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
          }`}
        >
          <Flame size={16} fill={userVote === "teamB" ? "white" : "none"} />
          <span className="text-xs font-semibold">{teamBVotes}</span>
        </button>
      </div>
    );
  }

  // Standard engagement for non-fight posts
  return (
    <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-700/30">
      <button
        onClick={onLike}
        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition-colors ${
          isLiked ? "text-red-500" : "text-slate-400 hover:text-slate-200"
        } hover:bg-slate-800/50`}
      >
        <Heart size={16} fill={isLiked ? "currentColor" : "none"} />
        <span className="text-xs">{aura}</span>
      </button>
      <button
        onClick={onComment}
        className="flex-1 flex items-center justify-center gap-2 py-2 text-slate-400 hover:text-slate-200 transition-colors hover:bg-slate-800/50 rounded-lg"
      >
        <MessageCircle size={16} />
        <span className="text-xs">{comments}</span>
      </button>
      <button
        onClick={onShare}
        className="flex-1 flex items-center justify-center gap-2 py-2 text-slate-400 hover:text-slate-200 transition-colors hover:bg-slate-800/50 rounded-lg"
      >
        <Share2 size={16} />
        <span className="text-xs">{shares}</span>
      </button>
    </div>
  );
}
