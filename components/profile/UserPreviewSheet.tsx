"use client";

import BottomSheet from "@/components/ui/BottomSheet";
import { useRouter } from "next/navigation";

interface UserPreviewSheetProps {
  open: boolean;
  onClose: () => void;
  user: any;
}

const UserPreviewSheet: React.FC<UserPreviewSheetProps> = ({ open, onClose, user }) => {
  const router = useRouter();

  if (!user) return null;

  const displayName = user.name || user.displayName || user.username || "User";
  const username = user.username || "";
  const bio = user.bio || "No bio yet";
  const level = user.level || 1;

  return (
    <BottomSheet isOpen={open} onClose={onClose} title={displayName}>
      <div className="flex flex-col gap-4 pb-24">
        {/* Avatar Section */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-4xl font-bold text-white">
            {user.avatar || displayName.charAt(0).toUpperCase()}
          </div>
          <div className="text-center">
            <h3 className="text-lg font-bold text-slate-100">{displayName}</h3>
            <p className="text-sm text-slate-400">@{username}</p>
          </div>
        </div>

        {/* Bio Section */}
        <div>
          <p className="text-sm text-slate-300">{bio}</p>
        </div>

        {/* Level Badge */}
        <div className="flex items-center justify-center gap-2">
          <div className="px-3 py-1 rounded-full bg-purple-600/20 text-purple-300 text-xs font-semibold border border-purple-600/30">
            Level {level}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-auto pt-4">
          <button
            className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold py-2 px-4 rounded-lg transition border border-slate-700"
            onClick={onClose}
          >
            Close
          </button>
          <button
            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition shadow-lg"
            onClick={() => {
              router.push(`/ecosystem/profile/${user.username || user.id}`);
              onClose();
            }}
          >
            View Profile
          </button>
        </div>
      </div>
    </BottomSheet>
  );
};

export default UserPreviewSheet;
