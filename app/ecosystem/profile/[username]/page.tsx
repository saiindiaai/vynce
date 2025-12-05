"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import { useTheme } from "@/hooks/useTheme";
import { Zap } from "lucide-react";

export default function PublicProfilePage() {
  const { theme } = useTheme();
  const { username } = useParams();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return <div className="px-6 pt-4 text-gray-400">Loading profile...</div>;
  }

  if (!user) {
    return (
      <div className="px-6 pt-4 text-red-400">
        User not found.
      </div>
    );
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
            <div>
              <h2 className={`text-2xl font-bold ${theme.textPrimary}`}>
                {user.displayName || "Unnamed User"}
              </h2>

              <p className={`${theme.textSecondary} text-sm`}>
                @{user.username}
              </p>

              <p className="text-xs text-gray-400 mt-1">
                UID: {user.uid || "—"}
              </p>

              <p className="text-sm text-gray-300 mt-1">
                Level {user.level} • Explorer Tier
              </p>
            </div>

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
