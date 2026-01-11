import { Calendar, Globe, Lock, Shield, Users, X } from 'lucide-react';
import React from 'react';
import { House } from '../../../types';

interface HouseInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  house: House | null;
}

export const HouseInfoModal: React.FC<HouseInfoModalProps> = ({
  isOpen,
  onClose,
  house,
}) => {
  if (!isOpen || !house) return null;

  const getFounderName = () => {
    if (typeof house.foundedBy === 'string') return 'Unknown';
    return (house.foundedBy as any)?.username || 'Unknown';
  };

  const getMemberCount = () => {
    return Array.isArray(house.members) ? house.members.length : 0;
  };

  const getHouseTypeDisplay = () => {
    const typeMap = {
      group_chat: 'Group Chat',
      community: 'Community',
      house: 'House',
      broadcast: 'Broadcast'
    };
    return typeMap[house.type] || house.type;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="w-full max-w-md bg-slate-900 rounded-xl border border-slate-700/50 p-6 space-y-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-50">House Information</h2>
            <p className="text-xs text-slate-400 mt-1">Details about {house.name}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-lg transition-all text-slate-400 hover:text-slate-50"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          {/* House Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-2">House Name</label>
            <p className="text-slate-50 font-medium text-lg">{house.name}</p>
          </div>

          {/* House Type */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-2">House Type</label>
            <div className="flex items-center gap-2">
              <Shield size={16} className="text-purple-400" />
              <p className="text-slate-300">{getHouseTypeDisplay()}</p>
            </div>
          </div>

          {/* Privacy Status */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-2">Privacy</label>
            <div className="flex items-center gap-2">
              {house.isPrivate ? (
                <>
                  <Lock size={16} className="text-red-400" />
                  <p className="text-slate-300">Private House</p>
                </>
              ) : (
                <>
                  <Globe size={16} className="text-green-400" />
                  <p className="text-slate-300">Public House</p>
                </>
              )}
            </div>
          </div>

          {/* Founder */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-2">Founded By</label>
            <p className="text-slate-300">{getFounderName()}</p>
          </div>

          {/* Members */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-2">Members</label>
            <div className="flex items-center gap-2">
              <Users size={16} className="text-blue-400" />
              <p className="text-slate-300">{getMemberCount()} members</p>
            </div>
          </div>

          {/* Creation Date */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-2">Created</label>
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-slate-400" />
              <p className="text-slate-300">{formatDate(house.createdAt)}</p>
            </div>
          </div>

          {/* Purpose */}
          {house.purpose && (
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-2">Purpose</label>
              <p className="text-slate-300 leading-relaxed">{house.purpose}</p>
            </div>
          )}

          {/* Description */}
          {house.description && (
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-2">Description</label>
              <p className="text-slate-300 leading-relaxed">{house.description}</p>
            </div>
          )}

          {/* Level & Influence */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-2">Level</label>
              <p className="text-slate-300 font-bold text-lg">{house.level}</p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-2">Influence</label>
              <p className="text-slate-300 font-bold text-lg">{house.influence}</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2.5 bg-slate-800/50 hover:bg-slate-800 text-slate-300 font-semibold rounded-lg border border-slate-700/50 transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};