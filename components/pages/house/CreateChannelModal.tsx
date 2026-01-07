import { Hash, Lock, X } from 'lucide-react';
import React from 'react';

interface CreateChannelModalProps {
  isOpen: boolean;
  onClose: () => void;
  newChannelName: string;
  setNewChannelName: (name: string) => void;
  newChannelDescription: string;
  setNewChannelDescription: (description: string) => void;
  newChannelPrivate: boolean;
  setNewChannelPrivate: (isPrivate: boolean) => void;
  onCreateChannel: () => void;
}

export const CreateChannelModal: React.FC<CreateChannelModalProps> = ({
  isOpen,
  onClose,
  newChannelName,
  setNewChannelName,
  newChannelDescription,
  setNewChannelDescription,
  newChannelPrivate,
  setNewChannelPrivate,
  onCreateChannel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="w-full max-w-md bg-slate-900 rounded-xl border border-slate-700/50 p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black text-slate-50">Create New Channel</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-lg transition-all text-slate-400 hover:text-slate-50"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-2">Name</label>
            <div className="flex items-center gap-2">
              <Hash size={18} className="text-slate-500 flex-shrink-0" />
              <input
                type="text"
                placeholder="channel-name"
                value={newChannelName}
                onChange={(e) => setNewChannelName(e.target.value)}
                className="flex-1 px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-50 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-2">
              Description
            </label>
            <textarea
              placeholder="What's this channel about?"
              value={newChannelDescription}
              onChange={(e) => setNewChannelDescription(e.target.value)}
              rows={2}
              className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-50 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all resize-none"
            />
          </div>

          <div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={newChannelPrivate}
                onChange={(e) => setNewChannelPrivate(e.target.checked)}
                className="w-4 h-4 rounded border-slate-700 bg-slate-800"
              />
              <span className="text-sm text-slate-300">Private Channel</span>
              <Lock size={14} className="text-slate-500" />
            </label>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCreateChannel}
            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold rounded-lg transition-all"
          >
            Create Channel
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