'use client';

import React, { useState } from 'react';
import { Play, Users, Heart, MessageCircle, Share2, Flame, X } from 'lucide-react';
import { useAppStore } from '@/lib/store';

interface VisualFightViewerProps {
  fight: any;
  onClose?: () => void;
}

export default function VisualFightViewer({ fight, onClose }: VisualFightViewerProps) {
  const { fightVotes, toggleFightVote, showToast } = useAppStore();
  const [liveComments, setLiveComments] = useState([
    { id: 1, user: 'TechViewer', time: '2m ago', text: 'This is insane! 🔥', likes: 234 },
    { id: 2, user: 'FightFan', time: '1m ago', text: 'Team A is dominating!', likes: 156 },
    { id: 3, user: 'StreamWatcher', time: '30s ago', text: 'Plot twist incoming...', likes: 89 },
  ]);
  const [relatedFights] = useState([
    { id: 4, fighter1: 'ProDev', fighter2: 'CloudWizard', viewers: 892, status: 'live', gradient1: 'from-blue-500 to-purple-500', gradient2: 'from-pink-500 to-red-500' },
    { id: 5, fighter1: 'DesignPro', fighter2: 'PixelMaster', viewers: 456, status: 'live', gradient1: 'from-green-500 to-emerald-500', gradient2: 'from-cyan-500 to-blue-500' },
    { id: 6, fighter1: 'CodeGuru', fighter2: 'ByteNinja', viewers: 234, status: 'starting', gradient1: 'from-purple-500 to-pink-500', gradient2: 'from-orange-500 to-yellow-500' },
  ]);

  const [showVotePanel, setShowVotePanel] = useState(false);

  const votes = fightVotes[fight.id] || { teamA: 0, teamB: 0, userVote: undefined };

  return (
    <div className="w-full h-full bg-slate-950 flex flex-col">
      {/* Unified Header - Sticky across all viewports */}
      <div className="sticky top-0 z-30 border-b border-slate-800 p-3 sm:p-4 flex items-center justify-between flex-shrink-0 bg-slate-950">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
            <span className="text-red-400 font-bold text-xs sm:text-sm">LIVE</span>
            <span className="text-slate-400 text-xs hidden sm:inline">{fight.viewers.toLocaleString()} watching</span>
            <span className="text-slate-400 text-xs sm:hidden">{fight.viewers}</span>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 rounded-lg hover:bg-slate-800 text-slate-300 transition-colors flex-shrink-0"
            >
              <X size={16} className="sm:w-5 sm:h-5" />
            </button>
          )}
        </div>

      {/* Main content wrapper - Desktop: flex row, Mobile: flex col */}
      <div className="flex-1 flex flex-col sm:flex-row min-h-0 overflow-auto h-[calc(100vh-56px)] overscroll-contain">
        {/* Mobile/Tablet: Full-width stacked | Desktop: Left side 70% */}
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* Video Player */}
        <div className="relative w-full bg-black flex items-center justify-center flex-shrink-0 aspect-video sm:flex-1 group">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-950 to-black flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 sm:w-24 h-16 sm:h-24 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center mx-auto mb-2 sm:mb-4 group-hover:scale-110 transition-transform">
                <Play size={32} className="text-white ml-1 sm:ml-2" fill="white" />
              </div>
              <p className="text-slate-400 text-xs sm:text-sm">Live Combat Stream</p>
            </div>
          </div>

          {/* Video Controls */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2 sm:p-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex items-center gap-2 sm:gap-3">
              <button className="p-1 sm:p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors flex-shrink-0">
                <Play size={16} className="sm:w-5 sm:h-5 text-white ml-0.5" fill="white" />
              </button>
              <div className="flex-1 h-0.5 sm:h-1 bg-slate-600 rounded-full cursor-pointer hover:bg-red-500">
                <div className="h-full w-1/3 bg-red-500 rounded-full"></div>
              </div>
              <span className="text-white text-xs flex-shrink-0">2:45 / 10:00</span>
            </div>
          </div>
        </div>

        {/* Fight Info & Energy Bars */}
        <div className="p-3 sm:p-4 border-b border-slate-800 flex-shrink-0">
          <div className="flex items-start justify-between gap-2 mb-3">
            <div className="flex-1 min-w-0">
              <h2 className="text-lg sm:text-xl font-bold text-slate-50 mb-0.5 sm:mb-1 truncate">
                {fight.fighter1} vs {fight.fighter2}
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">🎥 Epic Battle • {fight.viewers.toLocaleString()} viewers</p>
            </div>
            <div className="flex items-center gap-1 px-2 sm:px-3 py-1 rounded-lg bg-red-500/20 border border-red-500/50 flex-shrink-0">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
              <span className="text-red-400 text-xs font-bold">LIVE</span>
            </div>
          </div>

          {/* Energy Bars */}
          <div className="space-y-2.5">
            <div>
              <div className="text-xs text-slate-400 flex justify-between mb-1">
                <span className="font-semibold">{fight.fighter1}</span>
                <span className="font-bold text-blue-400">{fight.fighter1Energy} ⚡</span>
              </div>
              <div className="relative h-2 sm:h-2.5 rounded-full bg-slate-700/30 overflow-hidden">
                <div 
                  className={`absolute inset-y-0 left-0 bg-gradient-to-r ${fight.gradient1} rounded-full`}
                  style={{ width: `${(fight.fighter1Energy / 1000) * 100}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="text-xs text-slate-400 flex justify-between mb-1">
                <span className="font-semibold">{fight.fighter2}</span>
                <span className="font-bold text-orange-400">{fight.fighter2Energy} ⚡</span>
              </div>
              <div className="relative h-2 sm:h-2.5 rounded-full bg-slate-700/30 overflow-hidden">
                <div 
                  className={`absolute inset-y-0 right-0 bg-gradient-to-l ${fight.gradient2} rounded-full`}
                  style={{ width: `${(fight.fighter2Energy / 1000) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>


      </div>

      {/* Right Sidebar - Hidden on mobile, visible on sm+ (desktop) | Desktop: 30% width */}
      <div className="hidden sm:flex sm:w-80 bg-slate-900 flex-col border-l border-slate-800 overflow-auto h-full">
        {/* Voting removed from sidebar — use the flame button in the chat input to support a team */}
        <div className="p-3 border-b border-slate-800 flex-shrink-0 text-xs text-slate-400">Voting is available via the flame button in the chat input.</div>

        {/* Live Comments */}
        <div className="flex-1 overflow-y-auto min-h-0 h-full">
          <div className="p-4 space-y-3">
            <h3 className="text-sm font-bold text-slate-50 sticky top-0 bg-slate-900 py-2">Live Chat</h3>
            {liveComments.map((comment) => (
              <div key={comment.id} className="text-sm animate-slideIn">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-slate-300 text-xs">{comment.user}</span>
                  <span className="text-xs text-slate-500">{comment.time}</span>
                </div>
                <p className="text-slate-400 text-xs leading-relaxed break-words">{comment.text}</p>
                <button className="text-xs text-slate-500 hover:text-slate-400 mt-1 flex items-center gap-1">
                  <Heart size={12} /> {comment.likes}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Comment Input */}
        <div className="p-3 border-t border-slate-800 flex-shrink-0 bg-slate-900">
          <div className="relative">
            <div className="flex gap-2 items-end">
              <input
                type="text"
                placeholder="Add a comment..."
                className="flex-1 px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-50 placeholder-slate-500 text-sm outline-none focus:border-slate-600 transition-colors"
              />

              {/* Vote toggle button - opens compact vote panel */}
              <div className="relative">
                <button
                  onClick={() => setShowVotePanel((s) => !s)}
                  aria-expanded={showVotePanel}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors flex items-center justify-center"
                  title="Select team to support"
                >
                  <Flame size={16} />
                </button>

                <div className={`absolute right-0 bottom-full mb-2 w-44 p-2 bg-slate-800 rounded-lg shadow-lg ${showVotePanel ? 'block' : 'hidden'}`}>
                  <div className="text-xs text-slate-300 mb-1">Support a team</div>
                  <div className="flex gap-2">
                      <button
                        onClick={() => {
                          const prev = votes.userVote;
                          toggleFightVote(fight.id, 'teamA');
                          setShowVotePanel(false);
                          showToast(`You now support ${fight.fighter1}`, 'success', 2000, 'Undo', () => {
                            if (prev === undefined) {
                              // remove current vote
                              toggleFightVote(fight.id, 'teamA');
                            } else {
                              toggleFightVote(fight.id, prev);
                            }
                          });
                        }}
                        className="flex-1 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-xs font-semibold"
                      >
                        {fight.fighter1}
                      </button>
                      <button
                        onClick={() => {
                          const prev = votes.userVote;
                          toggleFightVote(fight.id, 'teamB');
                          setShowVotePanel(false);
                          showToast(`You now support ${fight.fighter2}`, 'success', 2000, 'Undo', () => {
                            if (prev === undefined) {
                              toggleFightVote(fight.id, 'teamB');
                            } else {
                              toggleFightVote(fight.id, prev);
                            }
                          });
                        }}
                        className="flex-1 py-2 rounded-lg bg-gradient-to-r from-red-600 to-orange-600 text-white text-xs font-semibold"
                      >
                        {fight.fighter2}
                      </button>
                    </div>
                </div>
              </div>

              <button className="p-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors flex-shrink-0">
                <MessageCircle size={16} />
              </button>
            </div>
          </div>
        </div>


      </div>

      {/* Mobile Chat & Actions - Below video on mobile */}
      </div>

      {/* Mobile Chat & Actions - Below video on mobile */}
      <div className="sm:hidden flex-1 flex flex-col min-h-0 overflow-auto bg-slate-900 h-full">
        {/* Mobile voting removed — use flame button in chat input to support a team */}
        <div className="p-3 border-b border-slate-800 flex-shrink-0 text-xs text-slate-400">Use the flame button in the chat input to support a team.</div>

        {/* Mobile Live Comments */}
        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="p-3 space-y-2">
            <h3 className="text-xs font-bold text-slate-50 sticky top-0 bg-slate-950 py-1">Live Chat</h3>
            {liveComments.map((comment) => (
              <div key={comment.id} className="text-xs animate-slideIn">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="font-semibold text-slate-300 text-xs">{comment.user}</span>
                  <span className="text-xs text-slate-500">{comment.time}</span>
                </div>
                <p className="text-slate-400 text-xs leading-relaxed break-words">{comment.text}</p>
                <button className="text-xs text-slate-500 hover:text-slate-400 mt-0.5 flex items-center gap-0.5">
                  <Heart size={10} /> {comment.likes}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Comment Input */}
        <div className="p-2 border-t border-slate-800 flex-shrink-0 bg-slate-900">
          <div className="relative">
            <div className="flex gap-2 items-end">
              <input
                type="text"
                placeholder="Add a comment..."
                className="flex-1 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-50 placeholder-slate-500 text-xs outline-none focus:border-slate-600 transition-colors"
              />

              <div className="relative">
                <button
                  onClick={() => setShowVotePanel((s) => !s)}
                  aria-expanded={showVotePanel}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors flex items-center justify-center"
                  title="Support a team"
                >
                  <Flame size={14} />
                </button>

                <div className={`absolute right-0 bottom-full mb-2 w-40 p-2 bg-slate-800 rounded-lg shadow-lg ${showVotePanel ? 'block' : 'hidden'}`}>
                  <div className="text-xs text-slate-300 mb-1">Support a team</div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        const prev = votes.userVote;
                        toggleFightVote(fight.id, 'teamA');
                        setShowVotePanel(false);
                        showToast(`You now support ${fight.fighter1}`, 'success', 2000, 'Undo', () => {
                          if (prev === undefined) toggleFightVote(fight.id, 'teamA'); else toggleFightVote(fight.id, prev);
                        });
                      }}
                      className="flex-1 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-xs font-semibold"
                    >
                      {fight.fighter1}
                    </button>
                    <button
                      onClick={() => {
                        const prev = votes.userVote;
                        toggleFightVote(fight.id, 'teamB');
                        setShowVotePanel(false);
                        showToast(`You now support ${fight.fighter2}`, 'success', 2000, 'Undo', () => {
                          if (prev === undefined) toggleFightVote(fight.id, 'teamB'); else toggleFightVote(fight.id, prev);
                        });
                      }}
                      className="flex-1 py-2 rounded-lg bg-gradient-to-r from-red-600 to-orange-600 text-white text-xs font-semibold"
                    >
                      {fight.fighter2}
                    </button>
                  </div>
                </div>
              </div>

              <button className="p-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors flex-shrink-0">
                <MessageCircle size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
