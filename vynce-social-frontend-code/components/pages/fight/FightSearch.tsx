'use client';

import React, { useState } from 'react';
import { Search, Filter, TrendingUp, Zap, Clock, CheckCircle, X } from 'lucide-react';
import { Flame } from 'lucide-react';
import { useAppStore } from '@/lib/store';

interface FightSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectFight: (fight: any) => void;
}

const mockFights = [
  { id: 1, fighter1: 'TechWarrior', fighter2: 'CodeNinja', status: 'live', viewers: 1234, type: 'visual', energy1: 950, energy2: 890 },
  { id: 2, fighter1: 'DesignMaster', fighter2: 'CreativeGenius', status: 'starting', viewers: 856, type: 'text', energy1: 1000, energy2: 1000 },
  { id: 3, fighter1: 'AlphaVynce', fighter2: 'BetaOrbit', status: 'live', viewers: 2341, type: 'visual', energy1: 450, energy2: 780 },
  { id: 4, fighter1: 'ProDev', fighter2: 'CloudWizard', status: 'live', viewers: 892, type: 'text', energy1: 720, energy2: 650 },
  { id: 5, fighter1: 'DesignPro', fighter2: 'PixelMaster', status: 'live', viewers: 456, type: 'visual', energy1: 800, energy2: 750 },
  { id: 6, fighter1: 'CodeGuru', fighter2: 'ByteNinja', status: 'starting', viewers: 234, type: 'text', energy1: 1000, energy2: 1000 },
  { id: 7, fighter1: 'ReactMaster', fighter2: 'VueExpert', status: 'live', viewers: 1567, type: 'text', energy1: 880, energy2: 920 },
  { id: 8, fighter1: 'DataWizard', fighter2: 'DatabasePro', status: 'starting', viewers: 421, type: 'text', energy1: 1000, energy2: 1000 },
];

export default function FightSearch({ isOpen, onClose, onSelectFight }: FightSearchProps) {
  const { toggleFightVote, showToast } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'live' | 'starting'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'visual' | 'text'>('all');

  if (!isOpen) return null;

  const filtered = mockFights.filter((fight) => {
    const matchSearch = 
      fight.fighter1.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fight.fighter2.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === 'all' || fight.status === statusFilter;
    const matchType = typeFilter === 'all' || fight.type === typeFilter;
    return matchSearch && matchStatus && matchType;
  });

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40 animate-fadeIn sm:hidden" onClick={onClose} />
      {/* Mobile: Bottom Sheet | Desktop: Centered Modal */}
      <div className="fixed bottom-0 left-0 right-0 sm:inset-0 z-50 sm:flex sm:items-center sm:justify-center sm:p-4 animate-slideInUp sm:animate-fadeIn">
        <div className="clean-card rounded-t-xl sm:rounded-lg w-full sm:w-full sm:max-w-2xl max-h-[90vh] sm:max-h-[85vh] overflow-hidden flex flex-col animate-slideInUp sm:animate-slideIn">
          {/* Header */}
          <div className="p-3 sm:p-4 border-b border-slate-700/50 bg-gradient-to-r from-purple-600/10 to-blue-600/10 flex-shrink-0">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-50">Browse Fights</h2>
              <button
                onClick={onClose}
                className="sm:hidden p-2 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X size={20} className="text-slate-300" />
              </button>
            </div>
            
            {/* Search Bar */}
            <div className="relative mb-3 sm:mb-4">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search fighters..."
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-sm sm:text-base text-slate-50 placeholder-slate-500 outline-none focus:border-slate-600 transition-colors"
              />
            </div>

            {/* Filters - Stacked on mobile */}
            <div className="space-y-2 sm:grid sm:grid-cols-2 sm:gap-3">
              <div>
                <label className="text-xs text-slate-400 font-semibold mb-1.5 block">Status</label>
                <div className="flex gap-1.5 sm:gap-2">
                  {['all', 'live', 'starting'].map((status) => (
                    <button
                      key={status}
                      onClick={() => setStatusFilter(status as any)}
                      className={`flex-1 px-2 sm:px-3 py-1.5 sm:py-1 rounded text-xs font-semibold transition-all whitespace-nowrap ${
                        statusFilter === status
                          ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                          : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      {status === 'all' ? 'All' : status === 'live' ? '🔴 Live' : '🟡 Start'}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-400 font-semibold mb-1.5 block">Type</label>
                <div className="flex gap-1.5 sm:gap-2">
                  {['all', 'visual', 'text'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setTypeFilter(type as any)}
                      className={`flex-1 px-2 sm:px-3 py-1.5 sm:py-1 rounded text-xs font-semibold transition-all whitespace-nowrap ${
                        typeFilter === type
                          ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                          : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      {type === 'all' ? 'All' : type === 'visual' ? '🎥' : '💬'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Fight List */}
          <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-2 sm:py-4 space-y-2 sm:space-y-3">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-8">
                <Search size={32} className="text-slate-500 mb-2" />
                <p className="text-slate-400">No fights found</p>
                <p className="text-xs text-slate-500">Try adjusting your filters</p>
              </div>
            ) : (
              filtered.map((fight) => (
                <button
                  key={fight.id}
                  onClick={() => {
                    onSelectFight(fight);
                    onClose();
                  }}
                  className="w-full text-left p-2.5 sm:p-4 rounded-lg bg-slate-800/50 hover:bg-slate-800/80 border border-slate-700/50 hover:border-slate-700 transition-all animate-slideIn"
                >
                  {/* Fighter Names - Stacked and Truncated on Mobile */}
                  <div className="mb-2">
                    <p className="font-semibold text-slate-50 text-sm sm:text-base truncate">{fight.fighter1}</p>
                    <div className="flex items-center justify-between text-xs sm:text-sm text-slate-400 mb-1">
                      <span>{fight.energy1} ⚡</span>
                      <span className="font-bold">vs</span>
                      <span>{fight.energy2} ⚡</span>
                    </div>
                    <p className="font-semibold text-slate-50 text-sm sm:text-base truncate">{fight.fighter2}</p>
                  </div>

                  {/* Status and Info - Single Row */}
                  <div className="flex items-center gap-2 sm:gap-3 text-xs text-slate-400 flex-wrap">
                    <div className="flex items-center gap-0.5">
                      {fight.status === 'live' ? (
                        <>
                          <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
                          <span className="text-red-400 font-semibold">LIVE</span>
                        </>
                      ) : (
                        <>
                          <Clock size={12} />
                          <span className="text-yellow-400 font-semibold">STARTING</span>
                        </>
                      )}
                    </div>
                    <span className="text-slate-500">•</span>
                    <span className="truncate">👁️ {fight.viewers.toLocaleString()}</span>
                    <span className="text-slate-500">•</span>
                    <span>{fight.type === 'visual' ? '🎥' : '💬'}</span>
                  </div>
                </button>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-slate-700/50 text-center">
            <p className="text-xs text-slate-500">
              Showing {filtered.length} of {mockFights.length} fights
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
