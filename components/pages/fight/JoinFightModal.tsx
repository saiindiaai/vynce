"use client";

import { useAppStore } from "@/lib/store";
import { X, Zap } from "lucide-react";
import { useState } from "react";

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
                className={`flex-1 px-2 sm:px-3 py-1.5 sm:py-1 rounded text-xs font-semibold transition-all whitespace-nowrap ${filterType === type
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
                className={`w-full p-2.5 sm:p-4 rounded-lg text-left transition-all animate-slideIn ${selectedFight === fight.id
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

export default JoinFightModal;