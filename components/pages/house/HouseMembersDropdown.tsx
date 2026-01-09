"use client";

import { getAllThemes } from "@/config/themes";
import { ToastType, useAppStore } from "@/lib/store";
import { House } from "@/types";
import { Crown, Edit, LogOut, Settings, Trash, User, Users } from "lucide-react";
import { useEffect, useRef } from "react";
import { HouseMember } from "./HouseConstants";

type Props = {
  selectedHouse: House | undefined | null;
  houseMembers: HouseMember[];
  selectedHouseRole: string | null;
  onClose: () => void;
  showToast?: (message: string, type: ToastType, duration?: number, actionLabel?: string, action?: () => void) => void;
};

export default function HouseMembersDropdown({ selectedHouse, houseMembers, selectedHouseRole, onClose, showToast }: Props) {
  if (!selectedHouse) return null;
  const { currentTheme } = useAppStore();
  const themeClasses = getAllThemes()[currentTheme];
  const menuRef = useRef<HTMLDivElement>(null);
  const { currentUser } = useAppStore();

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  // Sort members: creator first, then members A-Z
  const sortedMembers = [...houseMembers].sort((a, b) => {
    if (a.role === 'founder') return -1;
    if (b.role === 'founder') return 1;
    return a.username.localeCompare(b.username);
  });

  const creator = houseMembers.find(member => member.role === 'founder');

  const handleLeaveHouse = () => {
    const confirmed = confirm('Are you sure you want to leave this house? This action cannot be undone.');
    if (confirmed) {
      onClose();
      showToast?.('Leave House coming soon', 'info');
      // TODO: Implement actual leave house logic
    }
  };

  const handleViewProfile = (member: HouseMember) => {
    onClose();
    showToast?.(`View ${member.username}'s profile coming soon`, 'info');
    // TODO: Implement view profile logic
  };

  const handleManageMembers = () => {
    onClose();
    showToast?.('Manage Members coming soon', 'info');
    // TODO: Implement manage members logic
  };

  const handleEditHouse = () => {
    onClose();
    showToast?.('Edit House coming soon', 'info');
    // TODO: Implement edit house logic
  };

  const handleHouseSettings = () => {
    onClose();
    showToast?.('House Settings coming soon', 'info');
    // TODO: Implement house settings logic
  };

  const handleDeleteHouse = () => {
    const confirmed = confirm('This will permanently delete the house. This cannot be undone.');
    if (confirmed) {
      onClose();
      showToast?.('Delete House coming soon', 'info');
      // TODO: Implement actual delete house logic
    }
  };

  return (
    <div
      ref={menuRef}
      className="absolute right-0 top-full mt-2 w-80 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50 max-h-96"
    >
      {/* House Overview Section */}
      <div className="p-4 border-b border-slate-700/50">
        <div className="space-y-2">
          <h3 className="font-semibold text-slate-50 text-sm">{selectedHouse.name}</h3>
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Level {selectedHouse.level || 1}</span>
            <span>{houseMembers.length} members</span>
          </div>
          {creator && (
            <div className="flex items-center gap-2 text-xs">
              <Crown size={12} className="text-yellow-500" />
              <span className="text-slate-300">{creator.username}</span>
              <span className="text-yellow-500 font-medium">Creator</span>
            </div>
          )}
        </div>
      </div>

      {/* Members List */}
      <div className="max-h-64 overflow-y-auto">
        <div className="p-2">
          {sortedMembers.length === 0 ? (
            <div className="text-center py-4 text-slate-500 text-sm">
              No members yet
            </div>
          ) : (
            sortedMembers.map((member) => (
              <div
                key={member.id}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-700/30 transition-colors group"
              >
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-xs font-bold text-white">
                    {member.username.charAt(0).toUpperCase()}
                  </div>
                  {member.isOnline && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-800"></div>
                  )}
                </div>

                {/* Member Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-slate-50 text-sm truncate">
                      {member.username}
                    </p>
                    {member.role === 'founder' && (
                      <Crown size={12} className="text-yellow-500 flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-slate-400 capitalize">
                    {member.role === 'founder' ? 'Creator' : member.role}
                  </p>
                </div>

                {/* Actions */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  {member.id === currentUser?.id.toString() ? (
                    <button
                      onClick={handleLeaveHouse}
                      className="p-1.5 text-red-400 hover:bg-red-500/10 rounded transition-colors"
                      title="Leave House"
                    >
                      <LogOut size={14} />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleViewProfile(member)}
                      className="p-1.5 text-slate-400 hover:bg-slate-600/50 rounded transition-colors"
                      title="View Profile"
                    >
                      <User size={14} />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Admin Actions Section (Creator Only) */}
      {selectedHouseRole === 'creator' && (
        <div className="border-t border-slate-700/50">
          <div className="p-3">
            <h4 className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-2">
              Admin Actions
            </h4>
            <div className="space-y-1">
              <button
                onClick={handleManageMembers}
                className="w-full flex items-center gap-3 px-3 py-2 text-left text-sm text-slate-200 hover:bg-slate-700/30 rounded-lg transition-colors"
              >
                <Users size={16} className="text-slate-400" />
                <span className="font-medium">Manage Members</span>
              </button>
              <button
                onClick={handleEditHouse}
                className="w-full flex items-center gap-3 px-3 py-2 text-left text-sm text-slate-200 hover:bg-slate-700/30 rounded-lg transition-colors"
              >
                <Edit size={16} className="text-slate-400" />
                <span className="font-medium">Edit House</span>
              </button>
              <button
                onClick={handleHouseSettings}
                className="w-full flex items-center gap-3 px-3 py-2 text-left text-sm text-slate-200 hover:bg-slate-700/30 rounded-lg transition-colors"
              >
                <Settings size={16} className="text-slate-400" />
                <span className="font-medium">House Settings</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Leave House Button (only for current user if they're a member) */}
      {currentUser && houseMembers.some(member => member.id === currentUser.id.toString()) && (
        <div className="p-3 border-t border-slate-700/50">
          <button
            onClick={handleLeaveHouse}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-red-600/10 hover:bg-red-600/20 border border-red-600/20 rounded-lg text-red-400 hover:text-red-300 transition-colors text-sm font-medium"
          >
            <LogOut size={14} />
            Leave House
          </button>
        </div>
      )}

      {/* Delete House Button (Creator Only) */}
      {selectedHouseRole === 'creator' && (
        <div className="p-3 border-t border-slate-700/50">
          <button
            onClick={handleDeleteHouse}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-red-600/10 hover:bg-red-600/20 border border-red-600/20 rounded-lg text-red-400 hover:text-red-300 transition-colors text-sm font-medium"
          >
            <Trash size={14} />
            Delete House
          </button>
        </div>
      )}
    </div>
  );
}