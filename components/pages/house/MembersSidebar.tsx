import { House } from '@/types';
import { X } from 'lucide-react';
import React from 'react';
import { HouseMember } from './HouseConstants';

interface MembersSidebarProps {
  showMembersSidebar: boolean;
  showMembersDrawer: boolean;
  selectedHouse: House | undefined;
  houseMembers: HouseMember[];
  onCloseSidebar: () => void;
  onCloseDrawer: () => void;
}

export const MembersSidebar: React.FC<MembersSidebarProps> = ({
  showMembersSidebar,
  showMembersDrawer,
  selectedHouse,
  houseMembers,
  onCloseSidebar,
  onCloseDrawer,
}) => {
  if (!selectedHouse) return null;

  const renderMemberCard = (member: HouseMember, isMobile = false) => (
    <div
      key={member.id}
      className={`p-2 rounded-lg hover:bg-slate-800/40 transition-all group bg-slate-800/20 border border-slate-700/20 ${isMobile ? '' : ''}`}
    >
      <div className="flex items-center gap-2 mb-2">
        <div className="relative flex-shrink-0">
          <div className={`rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-xs font-bold text-white ${isMobile ? 'w-8 h-8' : 'w-7 h-7'}`}>
            {member.username.charAt(0)}
          </div>
          {member.isOnline && (
            <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border border-slate-900"></div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className={`font-semibold text-slate-50 truncate ${isMobile ? 'text-xs' : 'text-xs'}`}>
            {member.username}
          </p>
          <p className="text-xs text-purple-300 capitalize">
            {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
          </p>
        </div>
      </div>
      <div className={`space-y-0.5 text-xs ${isMobile ? 'ml-10' : 'ml-9'}`}>
        <div className="flex justify-between">
          <span className="text-slate-500">Influence:</span>
          <span className="text-amber-300 font-semibold">{member.influence}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">Loyalty:</span>
          <div className="flex items-center gap-1">
            <div className={`h-1 bg-slate-700 rounded-full overflow-hidden ${isMobile ? 'w-8' : 'w-12'}`}>
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                style={{ width: `${member.loyalty}%` }}
              ></div>
            </div>
            <span className="text-slate-400 text-xs">{member.loyalty}%</span>
          </div>
        </div>
        {member.powers.length > 0 && (
          <div className="pt-1 border-t border-slate-700/30">
            <p className="text-slate-500 text-xs mb-0.5">Powers:</p>
            <div className="space-y-0.5">
              {member.powers.map((power, i) => (
                <p key={i} className="text-purple-300 text-xs">
                  ✦ {power}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      {showMembersSidebar && (
        <div className="w-56 hidden lg:flex flex-col bg-slate-900/50 rounded-xl border border-slate-700/20 overflow-hidden">
          <div className="p-3 border-b border-slate-700/30 flex-shrink-0">
            <p className="text-xs font-semibold text-slate-400 uppercase mb-3">
              Members ({houseMembers.length})
            </p>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">House Level:</span>
                <span className="text-purple-300 font-semibold">{selectedHouse.level}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Influence:</span>
                <span className="font-semibold text-amber-300">
                  {selectedHouse.influence}
                </span>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 p-2">
            {houseMembers.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-4">No members</p>
            ) : (
              houseMembers.map((member) => renderMemberCard(member))
            )}
          </div>
        </div>
      )}

      {/* Mobile Drawer */}
      {showMembersDrawer && (
        <div className="fixed inset-0 z-50 sm:hidden">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onCloseDrawer}
          />

          <div className={`absolute top-6 right-4 w-[92%] max-w-sm max-h-[80vh] bg-slate-900/95 backdrop-blur-md rounded-xl border border-slate-700/30 shadow-2xl transform transition-transform duration-200 ease-out overflow-hidden flex flex-col`}>
            <div className="p-3 flex items-center justify-between border-b border-slate-700/30 flex-shrink-0">
              <div>
                <p className="text-sm font-semibold text-slate-50 truncate">Members ({houseMembers.length})</p>
                <p className="text-xs text-slate-400">{selectedHouse.name}</p>
              </div>
              <button
                onClick={onCloseDrawer}
                className="p-2 rounded-md text-slate-400 hover:text-slate-50 hover:bg-slate-800/40"
                aria-label="Close members"
                title="Close members"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-3 overflow-y-auto space-y-3 flex-1">
              {houseMembers.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-6">No members</p>
              ) : (
                houseMembers.map((member) => renderMemberCard(member, true))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};