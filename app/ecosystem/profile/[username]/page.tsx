"use client";

import { useTheme } from "@/hooks/useTheme";
import { api } from "@/lib/api";
import { UserPlus, Users, Zap } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function PublicProfilePage() {
  const { theme } = useTheme();
  const { username } = useParams();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/users/public/${username}`);
        setUser(res.data);
      } catch (err) {
        console.log("User not found", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [username]);

  const handleFollow = async () => {
    if (!user || actionLoading) return;

    setActionLoading(true);
    try {
      await api.post("/users/follow", { targetUserId: user._id });
      // Update local state
      if (user.accountType === "private") {
        setUser((prev: any) => ({ ...prev, hasPendingRequest: true }));
      } else {
        setUser((prev: any) => ({ ...prev, isFollowing: true }));
      }
    } catch (error) {
      console.error("Failed to follow user:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleUnfollow = async () => {
    if (!user || actionLoading) return;

    setActionLoading(true);
    try {
      await api.post("/users/unfollow", { targetUserId: user._id });
      // Update local state
      setUser((prev: any) => ({ ...prev, isFollowing: false, hasPendingRequest: false }));
    } catch (error) {
      console.error("Failed to unfollow user:", error);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <div className="px-6 pt-4 text-gray-400">Loading profile...</div>;
  }

  if (!user) {
    return <div className="px-6 pt-4 text-red-400">User not found.</div>;
  }

  return (
    <div className="px-6 pb-28 pt-4">
      {/* Premium Header Card */}
      <div className="mb-6">
        <div className="bg-gradient-to-br from-fuchsia-600/40 via-purple-600/40 to-indigo-600/40 p-[2px] rounded-3xl shadow-xl shadow-purple-900/20">
          <div className="card-matte rounded-3xl p-6 flex items-center gap-5">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-3xl font-bold">
              {(user.displayName || user.username).slice(0, 2).toUpperCase()}
            </div>

            {/* User Info */}
            <div className="flex-1">
              <h2 className={`text-2xl font-bold ${theme.textPrimary}`}>
                {user.displayName || "Unnamed User"}
              </h2>

              <p className={`${theme.textSecondary} text-sm`}>@{user.username}</p>

              <p className="text-xs text-gray-400 mt-1">UID: {user.uid || "—"}</p>

              <p className="text-sm text-gray-300 mt-1">Level {user.level} • Explorer Tier</p>
            </div>

            {/* Follow/Unfollow Button */}
            {!user.isOwnProfile && (
              <div className="flex flex-col items-end gap-2">
                {user.isFollowing ? (
                  <button
                    onClick={handleUnfollow}
                    disabled={actionLoading}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <Users size={16} />
                    <span>In Gang</span>
                  </button>
                ) : user.hasPendingRequest ? (
                  <button
                    disabled
                    className="flex items-center gap-2 px-4 py-2 bg-yellow-600/20 text-yellow-400 rounded-lg cursor-not-allowed"
                  >
                    <UserPlus size={16} />
                    <span>Requested</span>
                  </button>
                ) : (
                  <button
                    onClick={handleFollow}
                    disabled={actionLoading}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
                  >
                    <UserPlus size={16} />
                    <span>Join His Gang</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bio Section */}
      {user.bio && (
        <div className="rounded-2xl p-5 border border-white/10 bg-black/40 mb-6">
          <p className="text-sm text-gray-400 mb-1">Bio</p>
          <p className="text-gray-200 text-base font-medium">{user.bio}</p>
        </div>
      )}

      {/* Energy — Upgraded Display */}
      <div className="rounded-2xl p-5 border border-yellow-400/30 bg-black/30 mb-6 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-yellow-300 text-lg">Vynce Energy</h3>
          <p className="text-gray-400 text-xs mt-1">User engagement power</p>
        </div>

        <div className="flex items-center gap-2">
          <Zap className="w-6 h-6 text-yellow-400" />
          <span className="text-2xl font-bold text-yellow-300">{user.energy}</span>
        </div>
      </div>
    </div>
  );
}
