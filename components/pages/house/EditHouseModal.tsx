import { Lock, X } from 'lucide-react';
import React from 'react';
import { HouseType } from '../../../types';

interface EditHouseModalProps {
  isOpen: boolean;
  onClose: () => void;
  houseName: string;
  setHouseName: (name: string) => void;
  housePurpose: string;
  setHousePurpose: (purpose: string) => void;
  houseDescription: string;
  setHouseDescription: (description: string) => void;
  houseType: HouseType;
  setHouseType: (type: HouseType) => void;
  housePrivate: boolean;
  setHousePrivate: (isPrivate: boolean) => void;
  onEditHouse: () => void;
  getTypeIcon: (type: HouseType) => React.ReactNode;
}

export const EditHouseModal: React.FC<EditHouseModalProps> = ({
  isOpen,
  onClose,
  houseName,
  setHouseName,
  housePurpose,
  setHousePurpose,
  houseDescription,
  setHouseDescription,
  houseType,
  setHouseType,
  housePrivate,
  setHousePrivate,
  onEditHouse,
  getTypeIcon,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="w-full max-w-md bg-slate-900 rounded-xl border border-slate-700/50 p-6 space-y-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-50">Edit House</h2>
            <p className="text-xs text-slate-400 mt-1">Modify your house details and settings.</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-lg transition-all text-slate-400 hover:text-slate-50"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-2">
              House Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(["group_chat", "community", "house", "broadcast"] as HouseType[]).map(
                (type) => (
                  <button
                    key={type}
                    onClick={() => setHouseType(type)}
                    className={`p-3 rounded-lg font-semibold text-sm transition-all border flex flex-col items-center gap-2 ${houseType === type
                      ? "bg-purple-600/40 border-purple-600/50 text-purple-300"
                      : "bg-slate-800/40 border-slate-700/50 text-slate-400 hover:border-slate-600"
                      }`}
                  >
                    {getTypeIcon(type)}
                    <span className="text-xs">
                      {type
                        .split("_")
                        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                        .join(" ")
                        .split(" ")[0]}
                    </span>
                  </button>
                )
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-2">Name</label>
            <input
              type="text"
              placeholder="House name"
              value={houseName}
              onChange={(e) => setHouseName(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-50 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-2">
              Purpose
            </label>
            <textarea
              placeholder="What is your house destiny? (e.g., 'Unite the strongest warriors' or 'Build a sanctuary for artists')"
              value={housePurpose}
              onChange={(e) => setHousePurpose(e.target.value)}
              rows={2}
              maxLength={150}
              className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-50 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all resize-none"
            />
            <p className="text-xs text-slate-500 mt-1">{housePurpose.length}/150</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-2">
              Description
            </label>
            <textarea
              placeholder="Detailed description and history"
              value={houseDescription}
              onChange={(e) => setHouseDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-50 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all resize-none"
            />
          </div>

          <div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={housePrivate}
                onChange={(e) => setHousePrivate(e.target.checked)}
                className="w-4 h-4 rounded border-slate-700 bg-slate-800"
              />
              <span className="text-sm text-slate-300">Private House</span>
              <Lock size={14} className="text-slate-500" />
            </label>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onEditHouse}
            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold rounded-lg transition-all"
          >
            Update House
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-slate-800/50 hover:bg-slate-800 text-slate-300 font-semibold rounded-lg border border-slate-700/50 transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};