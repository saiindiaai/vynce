"use client";

import CommentsSheet from "@/components/PostActions/CommentsSheet";
import PostMenu from "@/components/PostActions/PostMenu";
import ShareSheet from "@/components/PostActions/ShareSheet";
import FightSearch from "@/components/pages/fight/FightSearch";
import { useAppStore } from "@/lib/store";
import {
  Flame,
  Play,
  Search,
  Users,
  Zap
} from "lucide-react";
import { useState } from "react";
import { fights } from "./fight/FightConstants";
import JoinFightModal from "./fight/JoinFightModal";
import StartFightModal from "./fight/StartFightModal";
import WatchFightModal from "./fight/WatchFightModal";


// Join Fight Modal - Enhanced

export default function FightPage() {
  const { userEnergy, fightVotes, toggleFightVote, showToast } = useAppStore();
  const [votePanelFor, setVotePanelFor] = useState<number | null>(null);

  const [showStartFight, setShowStartFight] = useState(false);
  const [showJoinFight, setShowJoinFight] = useState(false);
  const [showWatchFight, setShowWatchFight] = useState(false);
  const [showFightSearch, setShowFightSearch] = useState(false);
  const [selectedFight, setSelectedFight] = useState<any>(null);
  const [activeComments, setActiveComments] = useState<number | null>(null);
  const [activeShare, setActiveShare] = useState<number | null>(null);
  const [activeMenu, setActiveMenu] = useState<number | null>(null);

  const handleVote = (fightId: number, team: "teamA" | "teamB") => {
    const prev = fightVotes[fightId]?.userVote;
    toggleFightVote(fightId, team);
    showToast(`Voted for Team ${team === "teamA" ? "A" : "B"}! 🔥`, "success", 2000, "Undo", () => {
      if (prev === undefined) toggleFightVote(fightId, team);
      else toggleFightVote(fightId, prev);
    });
  };

  const handleWatchFight = (fight: any) => {
    setSelectedFight(fight);
    setShowWatchFight(true);
  };

  const handleSearchSelectFight = (fight: any) => {
    setSelectedFight(fight);
    setShowWatchFight(true);
  };

  return (
    <div className="animate-fadeIn pb-20">
      {/* Energy Display + Search */}
      <div className="clean-card p-4 border-b border-slate-700/50">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-2xl font-bold text-slate-50">Fight Arena</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFightSearch(true)}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-2 min-w-[120px] justify-center text-sm font-semibold"
            >
              <Search size={16} />
              Search Fights
            </button>
            <div className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold flex items-center gap-2 shadow-md">
              <Zap size={18} fill="white" />
              <span>{userEnergy}</span>
            </div>
          </div>
        </div>
        <p className="text-sm text-slate-400">
          Challenge others or watch epic battles • Thousands of fights happening live!
        </p>
      </div>

      {/* Action Buttons */}
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          onClick={() => setShowStartFight(true)}
          className="py-4 rounded-lg font-bold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all shadow-md flex items-center justify-center gap-2"
        >
          <Zap size={20} fill="white" />
          Start a Fight
        </button>
        <button
          onClick={() => setShowJoinFight(true)}
          className="py-4 rounded-lg font-bold text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 transition-all shadow-md flex items-center justify-center gap-2"
        >
          <Users size={20} />
          Join a Fight
        </button>
      </div>

      {/* Live Fights */}
      <div className="px-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
          <h3 className="text-lg font-bold text-slate-50">Live Fights</h3>
        </div>

        <div className="space-y-4">
          {fights.map((fight, idx) => {
            const votes = fightVotes[fight.id] || { teamA: 0, teamB: 0, userVote: undefined };

            return (
              <div
                key={fight.id}
                className="clean-card rounded-lg p-6 relative overflow-hidden hover:scale-[1.01] transition-all group animate-slideIn"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                {/* Flame quick vote button (compact) */}
                <div className="absolute top-3 right-3 z-10">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setVotePanelFor((id) => (id === fight.id ? null : fight.id));
                    }}
                    className="p-2 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200"
                    title="Support a team"
                  >
                    <Flame size={16} />
                  </button>

                  {votePanelFor === fight.id && (
                    <div className="absolute right-0 mt-2 w-44 p-2 bg-slate-800 rounded-lg shadow-lg z-50">
                      <div className="text-xs text-slate-300 mb-1">Support a team</div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            const prev = fightVotes[fight.id]?.userVote;
                            toggleFightVote(fight.id, "teamA");
                            showToast(
                              `You now support ${fight.fighter1}`,
                              "success",
                              1800,
                              "Undo",
                              () => {
                                if (prev === undefined) toggleFightVote(fight.id, "teamA");
                                else toggleFightVote(fight.id, prev);
                              }
                            );
                            setVotePanelFor(null);
                          }}
                          className="flex-1 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-xs font-semibold"
                        >
                          {fight.fighter1}
                        </button>
                        <button
                          onClick={() => {
                            const prev = fightVotes[fight.id]?.userVote;
                            toggleFightVote(fight.id, "teamB");
                            showToast(
                              `You now support ${fight.fighter2}`,
                              "success",
                              1800,
                              "Undo",
                              () => {
                                if (prev === undefined) toggleFightVote(fight.id, "teamB");
                                else toggleFightVote(fight.id, prev);
                              }
                            );
                            setVotePanelFor(null);
                          }}
                          className="flex-1 py-2 rounded-lg bg-gradient-to-r from-red-600 to-orange-600 text-white text-xs font-semibold"
                        >
                          {fight.fighter2}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                {/* Status Badge + Fight Type */}
                <div className="flex items-center gap-2 mb-4">
                  {fight.status === "live" && (
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-red-500/20 border border-red-500/50">
                      <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                      <span className="text-red-400 text-xs font-bold uppercase">Live Now</span>
                    </div>
                  )}
                  {fight.status === "starting" && (
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-yellow-500/20 border border-yellow-500/50">
                      <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></div>
                      <span className="text-yellow-400 text-xs font-bold uppercase">
                        Starting Soon
                      </span>
                    </div>
                  )}
                  <div className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-800/50 border border-slate-700">
                    <span className="text-xs text-slate-400">
                      {fight.fightType === "visual" ? "🎥 Visual" : "💬 Text"}
                    </span>
                  </div>
                </div>

                {/* Fighters */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex-1">
                    <div
                      className={`w-16 h-16 rounded-lg bg-gradient-to-br ${fight.gradient1} mx-auto mb-2 group-hover:scale-110 transition-transform`}
                    ></div>
                    <div className="text-center font-bold text-sm text-slate-50 mb-1">
                      {fight.fighter1}
                    </div>
                    {votes.userVote === "teamA" && (
                      <div className="mt-1 text-xs inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-600/20 text-blue-300">
                        <Flame size={12} /> You
                      </div>
                    )}
                    <div className="text-center text-xs text-slate-400">
                      {fight.fighter1Energy} ⚡
                    </div>
                  </div>

                  <div className="flex flex-col items-center px-4">
                    <div className="text-3xl font-bold text-slate-300 mb-2">VS</div>
                    <div className="flex items-center gap-1 text-xs text-slate-400">
                      <Users size={14} />
                      <span>{fight.viewers}</span>
                    </div>
                  </div>

                  <div className="flex-1">
                    <div
                      className={`w-16 h-16 rounded-lg bg-gradient-to-br ${fight.gradient2} mx-auto mb-2 group-hover:scale-110 transition-transform`}
                    ></div>
                    <div className="text-center font-bold text-sm text-slate-50 mb-1">
                      {fight.fighter2}
                    </div>
                    {votes.userVote === "teamB" && (
                      <div className="mt-1 text-xs inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-600/20 text-red-300">
                        <Flame size={12} /> You
                      </div>
                    )}
                    <div className="text-center text-xs text-slate-400">
                      {fight.fighter2Energy} ⚡
                    </div>
                  </div>
                </div>

                {/* Energy Bars */}
                <div className="space-y-2 mb-4">
                  <div className="relative h-2 rounded-full bg-slate-700/30 overflow-hidden">
                    <div
                      className={`absolute inset-y-0 left-0 bg-gradient-to-r ${fight.gradient1} rounded-full transition-all duration-1000`}
                      style={{ width: `${(fight.fighter1Energy / 1000) * 100}%` }}
                    ></div>
                  </div>
                  <div className="relative h-2 rounded-full bg-slate-700/30 overflow-hidden">
                    <div
                      className={`absolute inset-y-0 right-0 bg-gradient-to-l ${fight.gradient2} rounded-full transition-all duration-1000`}
                      style={{ width: `${(fight.fighter2Energy / 1000) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Voting moved to chat input (use the flame button in Watch view) */}
                <div className="bg-slate-800/20 rounded-lg p-2 mb-4 text-xs text-slate-400">
                  Support teams from the fight viewer: use the flame button in the chat input to
                  pick a side.
                </div>

                {/* Watch Button */}
                <button
                  onClick={() => handleWatchFight(fight)}
                  className="w-full py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all flex items-center justify-center gap-2"
                >
                  <Play size={18} fill="white" />
                  Watch Fight
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* How It Works */}
      <div className="p-4 mt-6">
        <div className="clean-card rounded-lg p-6">
          <h3 className="text-lg font-bold text-slate-50 mb-4">How Fights Work</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white font-bold flex-shrink-0 text-sm">
                1
              </div>
              <div>
                <div className="font-semibold text-sm text-slate-50 mb-1">Start a Fight</div>
                <div className="text-xs text-slate-400">
                  Use 100 Vynce Energy to challenge someone
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white font-bold flex-shrink-0 text-sm">
                2
              </div>
              <div>
                <div className="font-semibold text-sm text-slate-50 mb-1">Battle Live</div>
                <div className="text-xs text-slate-400">Others can watch and support with Aura</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white font-bold flex-shrink-0 text-sm">
                3
              </div>
              <div>
                <div className="font-semibold text-sm text-slate-50 mb-1">Win Rewards</div>
                <div className="text-xs text-slate-400">
                  Winners earn Energy and exclusive badges
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <StartFightModal isOpen={showStartFight} onClose={() => setShowStartFight(false)} />
      <JoinFightModal isOpen={showJoinFight} onClose={() => setShowJoinFight(false)} />
      <FightSearch
        isOpen={showFightSearch}
        onClose={() => setShowFightSearch(false)}
        onSelectFight={handleSearchSelectFight}
      />
      <WatchFightModal
        isOpen={showWatchFight}
        onClose={() => setShowWatchFight(false)}
        fight={selectedFight}
      />

      {/* Sheets */}
      {activeComments !== null && (
        <CommentsSheet
          isOpen={true}
          onClose={() => setActiveComments(null)}
          postId={activeComments}
          commentsCount={0}
          variant="fight"
        />
      )}

      {activeShare !== null && (
        <ShareSheet
          isOpen={true}
          onClose={() => setActiveShare(null)}
          postId={activeShare}
          variant="fight"
        />
      )}

      {activeMenu !== null && (
        <PostMenu isOpen={true} onClose={() => setActiveMenu(null)} postId={activeMenu} />
      )}
    </div>
  );
}
