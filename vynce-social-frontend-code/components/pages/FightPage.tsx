"use client";

import React, { useState } from "react";
import {
  Zap,
  Play,
  Users,
  X,
  Heart,
  ThumbsDown,
  Bookmark,
  MessageCircle,
  Share2,
  MoreVertical,
  Flame,
  Type,
  Search,
} from "lucide-react";
import CommentsSheet from "@/components/PostActions/CommentsSheet";
import ShareSheet from "@/components/PostActions/ShareSheet";
import PostMenu from "@/components/PostActions/PostMenu";
import FightEngagement from "@/components/PostActions/fight/Engagement";
import TeamChat from "@/components/PostActions/fight/TeamChat";
import VisualFightViewer from "@/components/pages/fight/VisualFightViewer";
import TextDebateViewer from "@/components/pages/fight/TextDebateViewer";
import FightSearch from "@/components/pages/fight/FightSearch";
import { useAppStore } from "@/lib/store";

// per-page sheets imported above

const fights = [
  {
    id: 1,
    fighter1: "TechWarrior",
    fighter2: "CodeNinja",
    fighter1Energy: 950,
    fighter2Energy: 890,
    status: "live" as const,
    viewers: 1234,
    gradient1: "from-blue-500 to-cyan-500",
    gradient2: "from-red-500 to-orange-500",
    aura: 3421,
    comments: 567,
    shares: 234,
    fightType: "visual" as const,
  },
  {
    id: 2,
    fighter1: "DesignMaster",
    fighter2: "CreativeGenius",
    fighter1Energy: 1000,
    fighter2Energy: 1000,
    status: "starting" as const,
    viewers: 856,
    gradient1: "from-purple-500 to-pink-500",
    gradient2: "from-yellow-500 to-orange-500",
    aura: 2156,
    comments: 389,
    shares: 178,
    fightType: "text" as const,
  },
  {
    id: 3,
    fighter1: "AlphaVynce",
    fighter2: "BetaOrbit",
    fighter1Energy: 450,
    fighter2Energy: 780,
    status: "live" as const,
    viewers: 2341,
    gradient1: "from-green-500 to-emerald-500",
    gradient2: "from-violet-500 to-purple-500",
    aura: 4892,
    comments: 891,
    shares: 445,
    fightType: "visual" as const,
  },
];

// Start Fight Modal - Enhanced and Mobile-Optimized
function StartFightModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [opponent, setOpponent] = useState("");
  const [fightType, setFightType] = useState<"visual" | "text">("visual");
  const { userEnergy } = useAppStore();
  const suggestedOpponents = ["ProDev", "CloudWizard", "DesignMaster", "CodeNinja", "ByteNinja"];

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40 animate-fadeIn sm:hidden" onClick={onClose} />
      {/* Mobile: Bottom Sheet | Desktop: Centered Modal */}
      <div className="fixed bottom-0 left-0 right-0 sm:inset-0 z-50 sm:flex sm:items-center sm:justify-center sm:p-4 animate-slideInUp sm:animate-fadeIn">
        <div className="clean-card relative overflow-hidden rounded-t-xl sm:rounded-lg p-4 sm:p-6 max-w-2xl w-full max-h-[90vh] sm:max-h-[85vh] overflow-y-auto sm:overflow-visible flex flex-col sm:block animate-slideInUp sm:animate-slideIn">
          <div className="flex items-center justify-between mb-4 sm:mb-6 sticky top-0 bg-slate-900 -m-4 sm:-m-6 p-4 sm:p-6 pb-4 sm:pb-4 z-10 sm:relative sm:m-0 sm:p-0 sm:bg-transparent">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-50">Start a Fight</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-800 rounded-lg transition-colors flex-shrink-0"
            >
              <X size={20} className="text-slate-300" />
            </button>
          </div>

          <div className="space-y-4 sm:grid sm:grid-cols-2 sm:gap-6">
            {/* Left: Create Fight */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-50">Challenge Someone</h3>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-2">
                  Fight Type
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setFightType("visual")}
                    className={`flex-1 py-2 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                      fightType === "visual"
                        ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white"
                        : "bg-slate-800/50 text-slate-400 hover:bg-slate-800"
                    }`}
                  >
                    🎥 Visual
                  </button>
                  <button
                    onClick={() => setFightType("text")}
                    className={`flex-1 py-2 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                      fightType === "text"
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                        : "bg-slate-800/50 text-slate-400 hover:bg-slate-800"
                    }`}
                  >
                    💬 Text
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-2">Username</label>
                <input
                  type="text"
                  value={opponent}
                  onChange={(e) => setOpponent(e.target.value)}
                  placeholder="Enter opponent username..."
                  className="w-full px-4 py-2.5 sm:py-3 rounded-lg bg-slate-800 border border-slate-700 text-slate-50 placeholder-slate-500 outline-none focus:border-slate-600 transition-colors text-sm"
                />
              </div>

              <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700 text-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-400">Energy Cost:</span>
                  <span className="font-bold flex items-center gap-1 text-slate-50">
                    <Zap size={14} /> 100
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Your Energy:</span>
                  <span
                    className={`font-bold text-xs sm:text-sm ${userEnergy >= 100 ? "text-green-400" : "text-red-400"}`}
                  >
                    {userEnergy}
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 py-2.5 sm:py-3 rounded-lg font-semibold bg-slate-800 border border-slate-700 text-slate-50 hover:bg-slate-700 transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  disabled={!opponent.trim() || userEnergy < 100}
                  className="flex-1 py-2.5 sm:py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  Challenge
                </button>
              </div>
            </div>

            {/* Right: Suggested Opponents */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-50">Suggested Opponents</h3>
              <div className="space-y-2 max-h-72 overflow-y-auto">
                {suggestedOpponents.map((opp, idx) => (
                  <button
                    key={opp}
                    onClick={() => setOpponent(opp)}
                    className="w-full text-left p-2.5 sm:p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 border border-slate-700 transition-all"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {opp.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-50 truncate">{opp}</p>
                        <p className="text-xs text-slate-500">Rank #{idx + 1}</p>
                      </div>
                      <span className="text-xs bg-slate-700/50 px-2 py-1 rounded text-slate-400 whitespace-nowrap">
                        Online
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Enhanced Watch Fight Modal with Viewer Components
function WatchFightModal({
  isOpen,
  onClose,
  fight,
}: {
  isOpen: boolean;
  onClose: () => void;
  fight: any;
}) {
  if (!isOpen || !fight) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black z-50 animate-fadeIn">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
          aria-label="Close"
        >
          <X size={20} className="text-slate-300" />
        </button>

        {/* Show appropriate viewer based on fight type */}
        {fight.fightType === "visual" ? (
          <VisualFightViewer fight={fight} onClose={onClose} />
        ) : (
          <TextDebateViewer fight={fight} onClose={onClose} />
        )}
      </div>
    </>
  );
}

// Join Fight Modal - Enhanced
function JoinFightModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [selectedFight, setSelectedFight] = useState<number | null>(null);
  const [filterType, setFilterType] = useState<"all" | "visual" | "text">("all");
  const { userEnergy } = useAppStore();

  const availableFights = [
    {
      id: 101,
      fighter1: "TechPro",
      fighter2: "CodeMaster",
      viewers: 234,
      type: "visual",
      status: "starting",
    },
    {
      id: 102,
      fighter1: "DesignWizard",
      fighter2: "UIEngineer",
      viewers: 156,
      type: "text",
      status: "starting",
    },
    {
      id: 103,
      fighter1: "ReactGuru",
      fighter2: "VueExpert",
      viewers: 89,
      type: "text",
      status: "starting",
    },
    {
      id: 104,
      fighter1: "DataNinja",
      fighter2: "DatabaseMaster",
      viewers: 312,
      type: "visual",
      status: "starting",
    },
  ];

  const filtered =
    filterType === "all" ? availableFights : availableFights.filter((f) => f.type === filterType);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40 animate-fadeIn sm:hidden" onClick={onClose} />
      {/* Mobile: Bottom Sheet | Desktop: Centered Modal */}
      <div className="fixed bottom-0 left-0 right-0 sm:inset-0 z-50 sm:flex sm:items-center sm:justify-center sm:p-4 animate-slideInUp sm:animate-fadeIn">
        <div className="clean-card rounded-t-xl sm:rounded-lg p-4 sm:p-6 max-w-2xl w-full max-h-[90vh] sm:max-h-[85vh] overflow-hidden flex flex-col animate-slideInUp sm:animate-slideIn">
          <div className="flex items-center justify-between mb-3 sm:mb-4 flex-shrink-0">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-50">Join a Fight</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-800 rounded-lg transition-colors flex-shrink-0"
            >
              <X size={20} className="text-slate-300" />
            </button>
          </div>

          <p className="text-xs sm:text-sm text-slate-400 mb-3 sm:mb-4">
            Accept a challenge and battle live
          </p>

          {/* Filters - Responsive */}
          <div className="flex gap-1.5 sm:gap-2 mb-3 sm:mb-4 flex-shrink-0">
            {["all", "visual", "text"].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type as any)}
                className={`flex-1 px-2 sm:px-3 py-1.5 sm:py-1 rounded text-xs font-semibold transition-all whitespace-nowrap ${
                  filterType === type
                    ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                    : "bg-slate-800/50 text-slate-400 hover:bg-slate-800"
                }`}
              >
                {type === "all" ? "All" : type === "visual" ? "🎥" : "💬"}
              </button>
            ))}
          </div>

          {/* Fight List */}
          <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6 flex-1 overflow-y-auto">
            {filtered.map((fight) => (
              <button
                key={fight.id}
                onClick={() => setSelectedFight(fight.id)}
                className={`w-full p-2.5 sm:p-4 rounded-lg text-left transition-all animate-slideIn ${
                  selectedFight === fight.id
                    ? "bg-slate-700 border-2 border-purple-500"
                    : "bg-slate-800/50 border border-slate-700 hover:bg-slate-800"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5 sm:mb-2 gap-2">
                  <span className="font-bold text-xs sm:text-sm text-slate-50 truncate">
                    {fight.fighter1} vs {fight.fighter2}
                  </span>
                  <span className="text-xs text-yellow-400 font-bold whitespace-nowrap flex-shrink-0">
                    STARTING
                  </span>
                </div>
                <div className="text-xs text-slate-400 flex gap-2">
                  <span>👁️ {fight.viewers}</span>
                  <span>•</span>
                  <span>{fight.type === "visual" ? "🎥" : "💬"}</span>
                </div>
              </button>
            ))}
          </div>

          <div className="clean-card p-3 sm:p-4 mb-4 sm:mb-6 flex-shrink-0 text-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-xs sm:text-sm">Energy Cost:</span>
              <span className="font-bold flex items-center gap-1 text-xs sm:text-sm text-slate-50">
                <Zap size={14} className="sm:w-4 sm:h-4" /> 100
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-xs sm:text-sm">Your Energy:</span>
              <span
                className={`font-bold text-xs sm:text-sm ${userEnergy >= 100 ? "text-green-400" : "text-red-400"}`}
              >
                {userEnergy}
              </span>
            </div>
          </div>

          <div className="flex gap-3 flex-shrink-0">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 sm:py-3 rounded-lg font-semibold bg-slate-800 border border-slate-700 text-slate-50 hover:bg-slate-700 transition-colors text-sm"
            >
              Cancel
            </button>
            <button
              disabled={!selectedFight || userEnergy < 100}
              className="flex-1 py-2.5 sm:py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              Join
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

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
