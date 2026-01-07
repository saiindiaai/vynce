"use client";

import { House, HouseType } from "@/types";
import { ChevronRight, Hash, Plus, Search } from "lucide-react";

interface HouseListProps {
  searchQuery: string;
  houses: House[];
  selectedHouseId: string | null;
  selectedChannelId: string | null;
  expandedHouses: Set<string>;
  onSelectHouse: (houseId: string) => void;
  onSelectChannel: (channelId: string) => void;
  onToggleExpand: (houseId: string) => void;
  onClose: () => void;
  onCreateChannel: () => void;
  getTypeIcon: (type: HouseType) => JSX.Element | null;
  getTypeColor: (type: HouseType) => string;
}

function HouseList({
  searchQuery,
  houses,
  selectedHouseId,
  selectedChannelId,
  expandedHouses,
  onSelectHouse,
  onSelectChannel,
  onToggleExpand,
  onClose,
  onCreateChannel,
  getTypeIcon,
  getTypeColor,
}: HouseListProps) {
  return (
    <div className="h-full flex flex-col">
      {/* Search */}
      <div className="p-3 border-b border-slate-700/30 flex-shrink-0">
        <div className="relative">
          <Search
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500"
            size={16}
          />
          <input
            type="text"
            placeholder="Find a house..."
            value={searchQuery}
            onChange={(e) => { }}
            className="w-full pl-8 pr-3 py-1.5 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-50 text-sm placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20 transition-all"
          />
        </div>
      </div>

      {/* Houses & Channels List */}
      <div className="flex-1 overflow-y-auto space-y-1 p-2 min-h-0">
        {houses.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-xs text-slate-400">No houses yet</p>
            <p className="text-xs text-slate-500 mt-1">Create one to get started!</p>
          </div>
        ) : (
          houses.map((house) => (
            <div key={house._id}>
              {/* House Item */}
              <button
                onClick={() => onSelectHouse(house._id)}
                className={`w-full flex items-start gap-2 px-3 py-2 rounded-lg transition-all text-left text-sm font-medium ${selectedHouseId === house._id
                  ? "bg-purple-600/30 text-purple-200"
                  : "text-slate-300 hover:bg-slate-800/60 hover:text-slate-100"
                  }`}
              >
                <ChevronRight
                  size={16}
                  className={`transition-transform flex-shrink-0 mt-0.5 ${expandedHouses.has(house._id) ? "rotate-90" : ""
                    }`}
                />
                <div className={`p-1 rounded flex-shrink-0 mt-0.5 ${getTypeColor(house.type)}`}>
                  {getTypeIcon(house.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="truncate">{house.name}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-slate-500">Lv. {house.level}</span>
                    <span className="text-xs text-slate-500">Influence: {house.influence}</span>
                  </div>
                </div>
              </button>

              {/* Channels (expandable) */}
              {expandedHouses.has(house._id) && (
                <div className="ml-4 space-y-0.5 py-1 border-l border-slate-700/30 pl-2">
                  {house.channels.map((channel) => (
                    <button
                      key={channel._id}
                      onClick={() => onSelectChannel(channel._id)}
                      className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-xs transition-all text-left ${selectedChannelId === channel._id
                        ? "bg-purple-600/20 text-purple-200"
                        : "text-slate-400 hover:bg-slate-800/40 hover:text-slate-300"
                        }`}
                    >
                      <Hash size={14} />
                      <span className="truncate flex-1">{channel.name}</span>
                    </button>
                  ))}

                  {/* Create Channel Button */}
                  {selectedHouseId === house._id && (
                    <button
                      onClick={onCreateChannel}
                      className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-xs text-slate-500 hover:bg-slate-800/40 hover:text-slate-400 transition-all text-left"
                    >
                      <Plus size={14} />
                      <span>Add channel</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default HouseList;