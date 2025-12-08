'use client';

import React from 'react';
import { Check, Plus } from 'lucide-react';

interface HouseCardProps {
  house: {
    name: string;
    icon: string;
    members: string;
    online: number | string;
    gradient: string;
    isJoined: boolean;
  };
  onJoin?: () => void;
}

export default function HouseCard({ house, onJoin }: HouseCardProps) {
  return (
    <div className={`relative rounded-2xl p-4 bg-gradient-to-br ${house.gradient} overflow-hidden group cursor-pointer hover:scale-105 transition-transform`}>
      {/* Background blur */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="text-4xl">{house.icon}</div>
          <button
            onClick={onJoin}
            className={`p-2 rounded-full transition-all ${
              house.isJoined
                ? 'bg-green-500/20 border border-green-500'
                : 'bg-white/20 border border-white/30 hover:bg-white/30'
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
