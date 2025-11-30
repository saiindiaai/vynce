"use client";

import { Zap, Info, Edit, Globe2, Smartphone } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

export default function ProfileMenu({ user }: any) {
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
                Level {user?.level} • Explorer Tier
              </p>
            </div>
          </div>
        </div>
      </div>


      {/* MENU OPTIONS */}
      <div className="space-y-4">

        {/* ENERGY CARD */}
        <button className="w-full card-matte rounded-2xl p-4 border border-yellow-500/40 flex items-center justify-between hover:border-yellow-500/70 transition-all">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>

            <div className="text-left">
              <h4 className={`font-bold ${theme.textPrimary}`}>Vynce Energy</h4>
              <p className={`text-xs ${theme.textSecondary}`}>1,250 Points</p>
            </div>
          </div>

          <span className={theme.textSecondary}>→</span>
        </button>


        {/* ACCOUNT INFO */}
        <button className={`w-full card-matte rounded-2xl p-4 border ${theme.cardBorder} hover:border-white/20 transition-all flex items-center justify-between`}>
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 bg-gradient-to-br ${theme.primary} rounded-xl flex items-center justify-center`}>
              <Info className="w-6 h-6 text-white" />
            </div>

            <div>
              <h4 className={`font-bold ${theme.textPrimary}`}>Account Info</h4>
              <p className={`text-xs ${theme.textSecondary}`}>Manage your details</p>
            </div>
          </div>

          <span className={theme.textSecondary}>→</span>
        </button>


        {/* YOUR APPS */}
        <button className={`w-full card-matte rounded-2xl p-4 border ${theme.cardBorder} hover:border-white/20 transition-all flex items-center justify-between`}>
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 bg-gradient-to-br ${theme.secondary} rounded-xl flex items-center justify-center`}>
              <Smartphone className="w-6 h-6 text-white" />
            </div>

            <div>
              <h4 className={`font-bold ${theme.textPrimary}`}>Your Apps</h4>
              <p className={`text-xs ${theme.textSecondary}`}>3 apps installed</p>
            </div>
          </div>

          <span className={theme.textSecondary}>→</span>
        </button>


        {/* UPDATE PROFILE */}
        <button className={`w-full card-matte rounded-2xl p-4 border ${theme.cardBorder} hover:border-white/20 transition-all flex items-center justify-between`}>
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 bg-gradient-to-br ${theme.accent} rounded-xl flex items-center justify-center`}>
              <Edit className="w-6 h-6 text-white" />
            </div>

            <div>
              <h4 className={`font-bold ${theme.textPrimary}`}>Update Profile</h4>
              <p className={`text-xs ${theme.textSecondary}`}>Edit your information</p>
            </div>
          </div>

          <span className={theme.textSecondary}>→</span>
        </button>


        {/* GLOBAL BIO */}
        <button className={`w-full card-matte rounded-2xl p-4 border ${theme.cardBorder} hover:border-white/20 transition-all flex items-center justify-between`}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
              <Globe2 className="w-6 h-6 text-white" />
            </div>

            <div>
              <h4 className={`font-bold ${theme.textPrimary}`}>Your Global Bio</h4>
              <p className={`text-xs ${theme.textSecondary}`}>Share your story</p>
            </div>
          </div>

          <span className={theme.textSecondary}>→</span>
        </button>

      </div>
    </div>
  );
}
