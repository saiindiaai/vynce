"use client";

import { getAllThemes } from "@/config/themes";
import { api } from "@/lib/api";
import { ToastType, useAppStore } from "@/lib/store";
import { House } from "@/types";
import { Crown, LogOut, User, X } from "lucide-react";
import { HouseMember } from "./HouseConstants";

interface HouseMembersDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  selectedHouse: House | undefined | null;
  houseMembers: HouseMember[];
  selectedHouseRole: string | null;
  showToast?: (message: string, type: ToastType, duration?: number, actionLabel?: string, action?: () => void) => void;
}

export default function HouseMembersDropdown({
  isOpen,
  onClose,
  selectedHouse,
  houseMembers,
  selectedHouseRole,
  showToast,
}: HouseMembersDropdownProps) {
  const { currentTheme, currentUser } = useAppStore();
  const allThemes = getAllThemes();
  const themeClasses = allThemes[currentTheme];

  if (!isOpen || !selectedHouse) return null;

  // Sort members: creator first, then members A-Z
  const sortedMembers = [...houseMembers].sort((a, b) => {
    if (a.role === "founder") return -1;
    if (b.role === "founder") return 1;
    return a.username.localeCompare(b.username);
  });

  const creator = houseMembers.find((member) => member.role === "founder");

  const handleLeaveHouse = () => {
    const confirmed = window.confirm(
      "Are you sure you want to leave this house? This action cannot be undone."
    );
    if (!confirmed) return;
    (async () => {
      try {
        await api.post(`/houses/${selectedHouse._id}/leave`);
        onClose();
        showToast?.("You left the house", "info");
        setTimeout(() => window.location.reload(), 400);
      } catch (err) {
        console.error(err);
        showToast?.("Failed to leave house", "error");
      }
    })();
  };

  const handleRemoveMember = (memberId: string) => {
    const confirmed = window.confirm("Remove this member from the house?");
    if (!confirmed) return;
    (async () => {
      try {
        await api.post(`/houses/${selectedHouse._id}/members/${memberId}/remove`);
        onClose();
        showToast?.("Member removed", "info");
        setTimeout(() => window.location.reload(), 400);
      } catch (err) {
        console.error(err);
        showToast?.("Failed to remove member", "error");
      }
    })();
  };

  const handleViewProfile = (member: HouseMember) => {
    onClose();
    showToast?.(`View ${member.username}'s profile coming soon`, "info");
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-fadeIn"
        onClick={onClose}
      />

      {/* Members Sheet */}
      <div className="fixed inset-x-0 bottom-0 z-50 animate-slideIn max-w-2xl mx-auto p-4">
        <div
          className={`rounded-3xl ${themeClasses.cardBg} border ${themeClasses.cardBorder} overflow-hidden shadow-2xl`}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-700">
            <div>
              <h3 className="text-lg font-bold text-slate-50">
                {selectedHouse.name}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {houseMembers.length} members
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-slate-700/50 transition-colors text-slate-400 hover:text-slate-50"
            >
              <X size={20} />
            </button>
          </div>

          {/* Members List */}
          <div className="max-h-96 overflow-y-auto divide-y divide-gray-700/50">
            {sortedMembers.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-sm">
                No members yet
              </div>
            ) : (
              sortedMembers.map((member) => (
                <button
                  key={member.id}
                  onClick={() => handleViewProfile(member)}
                  className="w-full flex items-center gap-4 p-4 transition-all hover:bg-gray-700/30 animate-slideIn text-left"
                >
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-xs font-bold text-white">
                      {member.username.charAt(0).toUpperCase()}
                    </div>
                    {member.isOnline && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-800"></div>
                    )}
                  </div>

                  {/* Member Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-slate-50 text-sm">
                        {member.username}
                      </p>
                      {member.role === "founder" && (
                        <Crown
                          size={14}
                          className="text-yellow-500 flex-shrink-0"
                        />
                      )}
                    </div>
                    <p className="text-xs text-slate-400 capitalize">
                      {member.role === "founder" ? "Creator" : member.role}
                    </p>
                  </div>

                  {/* Action Icon */}
                  {member.id === currentUser?.id.toString() ? (
                    <LogOut size={18} className="text-red-400" />
                  ) : (
                    <User size={18} className={themeClasses.textPrimary} />
                  )}
                </button>
              ))
            )}
          </div>

          {/* Cancel Button */}
          <button
            onClick={onClose}
            className={`w-full p-4 mt-1 border-t ${themeClasses.cardBorder} font-semibold ${themeClasses.textSecondary} hover:bg-gray-700/30 transition-all`}
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
}