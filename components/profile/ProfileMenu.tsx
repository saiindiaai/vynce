"use client";

import Link from "next/link";
import { Zap, Info, Edit, Globe2, Smartphone } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

type ProfileMenuProps = {
  user: any;
};

export default function ProfileMenu({ user }: ProfileMenuProps) {
  const { theme } = useTheme();

  return (
    <div className="px-6 pb-28">
      {/* TOP PROFILE CARD */}
      <div className="mb-10">
        <div className="bg-gradient-to-br from-pink-500 via-purple-600 to-indigo-600 p-[2px] rounded-3xl">
          <div className="card-matte rounded-3xl p-5 flex items-center gap-4">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-3xl font-bold">
              {user?.displayName?.slice(0, 2).toUpperCase() || "VU"}
            </div>

            {/* User Details */}
            <div>
              <h2 className={`text-2xl font-bold ${theme.textPrimary}`}>
                {user?.displayName || "Loading..."}
              </h2>

              <p className={`text-sm ${theme.textSecondary}`}>
                @{user?.username}
              </p>

              <p className={`text-xs ${theme.textSecondary}`}>
                UID: {user?.uid}
              </p>

              <p className={`text-sm ${theme.textSecondary} mt-1`}>
                Level {user?.level ?? 1} • Explorer Tier
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* PROFILE ACTION CARDS */}
      <div className="space-y-4">

        {/* VYNCE ENERGY */}
        {/* VYNCE ENERGY */}
<Link href="/ecosystem/profile/energy" className="block">
  <div className="card-matte rounded-2xl p-4 border border-yellow-500/30 hover:border-yellow-500/60 transition-all flex items-center justify-between">
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
        <Zap className="w-6 h-6 text-white" />
      </div>

      <div>
        <h4 className="font-bold text-white">Vynce Energy</h4>
        <p className="text-xs text-gray-400">
          {user?.energy ?? "0"} Points
        </p>
      </div>
    </div>
    <span className="text-gray-400">›</span>
  </div>
</Link>

        {/* ACCOUNT INFO */}
        <Link href="/ecosystem/profile/account" className="block">
          <div className="card-matte rounded-2xl p-4 border border-white/10 hover:border-white/20 transition-all flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                <Info className="w-6 h-6 text-white" />
              </div>

              <div>
                <h4 className="font-bold text-white">Account Info</h4>
                <p className="text-xs text-gray-400">Manage your details</p>
              </div>
            </div>
            <span className="text-gray-400">→</span>
          </div>
        </Link>

        {/* YOUR APPS */}
        <Link href="/ecosystem/profile/apps" className="block">
          <div className="card-matte rounded-2xl p-4 border border-white/10 hover:border-white/20 transition-all flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Smartphone className="w-6 h-6 text-white" />
              </div>

              <div>
                <h4 className="font-bold text-white">Your Apps</h4>
                <p className="text-xs text-gray-400">3 apps installed</p>
              </div>
            </div>
            <span className="text-gray-400">→</span>
          </div>
        </Link>

        {/* UPDATE PROFILE */}
        <Link href="/ecosystem/profile/update-profile" className="block">
          <div className="card-matte rounded-2xl p-4 border border-white/10 hover:border-white/20 transition-all flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                <Edit className="w-6 h-6 text-white" />
              </div>

              <div>
                <h4 className="font-bold text-white">Update Profile</h4>
                <p className="text-xs text-gray-400">Edit your information</p>
              </div>
            </div>
            <span className="text-gray-400">→</span>
          </div>
        </Link>

        {/* GLOBAL BIO */}
        <Link href="/ecosystem/profile/global-bio" className="block">
          <div className="card-matte rounded-2xl p-4 border border-white/10 hover:border-white/20 transition-all flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
                <Globe2 className="w-6 h-6 text-white" />
              </div>

              <div>
                <h4 className="font-bold text-white">Your Global Bio</h4>
                <p className="text-xs text-gray-400">Share your story</p>
              </div>
            </div>
            <span className="text-gray-400">→</span>
          </div>
        </Link>

      </div>
    </div>
  );
}
