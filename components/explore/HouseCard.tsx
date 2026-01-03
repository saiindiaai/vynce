"use client";

import { getHouseRankFullForm } from "@/lib/houseRanks";
import { Check, Plus } from "lucide-react";


interface HouseCardProps {
  house: {
    name: string;
    icon: string;
    members: string;
    online: number | string;
    gradient: string;
    isJoined: boolean;
    rank?: string; // e.g. 'SS', 'A', etc.
  };
  onJoin?: () => void;
}

export default function HouseCard({ house, onJoin }: HouseCardProps) {
  const rankLetter = house.rank;
  const rankFull = getHouseRankFullForm(rankLetter);
  return (
    <div
      className={`relative rounded-2xl p-4 bg-gradient-to-br ${house.gradient} overflow-hidden group cursor-pointer hover:scale-105 transition-transform`}
    >
      {/* Background blur */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="text-4xl">{house.icon}</div>
          <button
            onClick={onJoin}
            className={`p-2 rounded-full transition-all ${house.isJoined
              ? "bg-green-500/20 border border-green-500"
              : "bg-white/20 border border-white/30 hover:bg-white/30"
              }`}
          >
            {house.isJoined ? (
              <Check size={20} className="text-green-400" />
            ) : (
              <Plus size={20} className="text-white" />
            )}
          </button>
        </div>

        <h3 className="text-xl font-bold text-white mb-2">{house.name}</h3>

        {/* House Rank Display */}
        {rankLetter && rankFull ? (
          <div className="mb-2">
            <span className="text-lg font-extrabold text-white mr-2 align-middle">{rankLetter}</span>
            <span className="text-xs text-white/80 align-middle">{rankFull}</span>
          </div>
        ) : null}

        <div className="flex items-center gap-4 text-sm text-white/80">
          <span>{house.members} members</span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-400" />
            {house.online} online
          </span>
        </div>
      </div>
    </div>
  );
}
