"use client";

import { House, HouseType } from "@/types";
import { Search, X } from "lucide-react";
import React from "react";

type Props = {
  query: string;
  setQuery: (s: string) => void;
  results: House[];
  onClose: () => void;
  joinHouse: (houseId: string) => void;
  getTypeIcon: (t: HouseType) => React.ReactNode;
  getTypeColor: (t: HouseType) => string;
};

export default function GlobalHouseSearch({ query, setQuery, results, onClose, joinHouse, getTypeIcon, getTypeColor }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="w-full max-w-2xl bg-slate-900 rounded-xl border border-slate-700/50 p-6 space-y-6 max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-50">Discover Houses</h2>
            <p className="text-xs text-slate-400 mt-1">Explore and join public houses</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-lg transition-all text-slate-400 hover:text-slate-50"
          >
            <X size={20} />
          </button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input
            type="text"
            placeholder="Search houses by name..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-50 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
            autoFocus
          />
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {results.map((house) => (
            <div
              key={house._id}
              className="p-4 rounded-lg bg-slate-800/30 border border-slate-700/30 hover:border-slate-700/60 transition-all cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-start gap-3 flex-1">
                  <div className={`p-2 rounded-lg flex-shrink-0 ${getTypeColor(house.type)}`}>
                    {getTypeIcon(house.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-bold text-slate-50 truncate">{house.name}</h3>
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-2">{house.description}</p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                      <span>Lv. {house.level}</span>
                      <span>•</span>
                      <span>{(house as any).memberCount ?? (Array.isArray(house.members) ? house.members.length : house.members || 0)} members</span>
                      <span>•</span>
                      <span>⚡ {house.influence}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => joinHouse(house._id)}
                  className="ml-2 px-3 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white text-xs font-bold rounded-lg transition-all flex-shrink-0"
                >
                  Join
                </button>
              </div>
            </div>
          ))}
          {query && results.length === 0 && (
            <div className="text-center py-8">
              <p className="text-slate-400">No houses found</p>
              <p className="text-xs text-slate-500 mt-1">Try a different search term</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
