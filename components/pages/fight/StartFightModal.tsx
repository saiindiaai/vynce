"use client";

import { useAppStore } from "@/lib/store";
import { X, Zap } from "lucide-react";
import { useState } from "react";

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
                    className={`flex-1 py-2 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all ${fightType === "visual"
                        ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white"
                        : "bg-slate-800/50 text-slate-400 hover:bg-slate-800"
                      }`}
                  >
                    🎥 Visual
                  </button>
                  <button
                    onClick={() => setFightType("text")}
                    className={`flex-1 py-2 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all ${fightType === "text"
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

export default StartFightModal;