import { UserMinus, X } from 'lucide-react';
import React from 'react';
import { House } from '../../../types';

interface ManageMembersModalProps {
  isOpen: boolean;
  onClose: () => void;
  house: House | null;
  members: any[]; // Assuming members have _id and username
  currentUserId: string | null;
  onRemoveMember: (memberId: string) => void;
}

export const ManageMembersModal: React.FC<ManageMembersModalProps> = ({
  isOpen,
  onClose,
  house,
  members,
  currentUserId,
  onRemoveMember,
}) => {
  if (!isOpen || !house) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="w-full max-w-md bg-slate-900 rounded-xl border border-slate-700/50 p-6 space-y-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-50">Manage Members</h2>
            <p className="text-xs text-slate-400 mt-1">Manage members of {house.name}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-lg transition-all text-slate-400 hover:text-slate-50"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-3">
          {members.map((member) => (
            <div
              key={member._id || member}
              className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-slate-700/50"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-xs font-bold text-white">
                  {typeof member === 'object' && member ? (member.username || member.name || '?').charAt(0).toUpperCase() : '?'}
                </div>
                <div>
                  <p className="text-slate-50 font-medium">
                    {typeof member === 'object' && member ? (member.username || member.name || 'Unknown') : 'Unknown'}
                  </p>
                  {house.foundedBy === (typeof member === 'object' && member ? member._id : member) && (
                    <p className="text-xs text-purple-400">Creator</p>
                  )}
                </div>
              </div>
              {(typeof member === 'object' && member ? member._id : member) !== house.foundedBy && (typeof member === 'object' && member ? member._id : member) !== currentUserId && (
                <button
                  onClick={() => onRemoveMember(typeof member === 'object' && member ? member._id : member)}
                  className="p-2 hover:bg-red-500/20 rounded-lg transition-all text-slate-400 hover:text-red-400"
                  title="Remove member"
                >
                  <UserMinus size={16} />
                </button>
              )}
            </div>
          ))}
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