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
    <div className="px-6 pb-28 mt-8">
      {/* =============================
          ECONOMY SECTION
      ============================== */}
      <div className="space-y-5 mb-10">
        {/* STORE */}
        <Link href="/ecosystem/store">
          <div className="card-matte rounded-2xl p-5 border border-white/10 hover:border-white/20 transition flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Vynce Store</h3>
              <p className="text-gray-400 text-sm">Themes, badges & upgrades</p>
            </div>
            <span className="text-blue-300 text-2xl">🛒</span>
          </div>
        </Link>

        {/* INVENTORY */}
        <Link href="/ecosystem/inventory">
          <div className="card-matte rounded-2xl p-5 border border-white/10 hover:border-white/20 transition flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Your Inventory</h3>
              <p className="text-gray-400 text-sm">Owned themes, items & badges</p>
            </div>
            <span className="text-purple-300 text-2xl">🎒</span>
          </div>
        </Link>

        {/* ACHIEVEMENTS */}
        <Link href="/ecosystem/achievements">
          <div className="card-matte rounded-2xl p-5 border border-white/10 hover:border-white/20 transition flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Achievements</h3>
              <p className="text-gray-400 text-sm">XP, badges & milestones</p>
            </div>
            <span className="text-yellow-300 text-2xl">🏆</span>
          </div>
        </Link>
      </div>

      {/* =============================
          PROFILE ACTION CARDS
      ============================== */}
      <div className="space-y-4">
        {/* VYNCE ENERGY */}
        <Link href="/ecosystem/profile/energy" className="block">
          <div className="card-matte rounded-2xl p-4 border border-yellow-500/30 hover:border-yellow-400 transition flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>

              <div>
                <h4 className="font-bold text-white">Vynce Energy</h4>
                <p className="text-xs text-gray-400">{user?.energy ?? 0} Points</p>
              </div>
            </div>
            <span className="text-gray-400">›</span>
          </div>
        </Link>

        {/* CELESTIUM */}
        <Link href="/ecosystem/profile/celestium" className="block">
          <div className="card-matte rounded-2xl p-4 border border-gray-400/30 hover:border-gray-300/60 transition flex justify-between items-center">
            <div className="flex items-center gap-4">
              {/* Silver Coin Icon */}
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-300 to-gray-500 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="w-7 h-7"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="9"
                    stroke="#E5E5E5"
                    strokeWidth="2"
                    fill="rgba(255,255,255,0.08)"
                  />
                  <text
                    x="12"
                    y="16"
                    textAnchor="middle"
                    fontSize="10"
                    fontWeight="bold"
                    fill="#FFFFFF"
                  >
                    C
                  </text>
                </svg>
              </div>

              <div>
                <h4 className="font-bold text-white">Celestium</h4>
                <p className="text-xs text-gray-400">{user?.celestium ?? 0} Coins</p>
              </div>
            </div>

            <span className="text-gray-400">›</span>
          </div>
        </Link>

        {/* ACCOUNT INFO */}
        <Link href="/ecosystem/profile/account" className="block">
          <div className="card-matte rounded-2xl p-4 border border-white/10 hover:border-white/20 transition flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                <Info className="w-6 h-6 text-white" />
              </div>

              <div>
                <h4 className="font-bold text-white">Account Info</h4>
                <p className="text-xs text-gray-400">Manage your details</p>
              </div>
            </div>
            <span className="text-gray-400">›</span>
          </div>
        </Link>

        {/* YOUR APPS */}
        <Link href="/ecosystem/profile/apps" className="block">
          <div className="card-matte rounded-2xl p-4 border border-white/10 hover:border-white/20 transition flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Smartphone className="w-6 h-6 text-white" />
              </div>

              <div>
                <h4 className="font-bold text-white">Your Apps</h4>
                <p className="text-xs text-gray-400">3 apps installed</p>
              </div>
            </div>
            <span className="text-gray-400">›</span>
          </div>
        </Link>

        {/* UPDATE PROFILE */}
        <Link href="/ecosystem/profile/update-profile" className="block">
          <div className="card-matte rounded-2xl p-4 border border-white/10 hover:border-white/20 transition flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                <Edit className="w-6 h-6 text-white" />
              </div>

              <div>
                <h4 className="font-bold text-white">Update Profile</h4>
                <p className="text-xs text-gray-400">Edit your information</p>
              </div>
            </div>
            <span className="text-gray-400">›</span>
          </div>
        </Link>

        {/* GLOBAL BIO */}
        <Link href="/ecosystem/profile/global-bio" className="block">
          <div className="card-matte rounded-2xl p-4 border border-white/10 hover:border-white/20 transition flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
                <Globe2 className="w-6 h-6 text-white" />
              </div>

              <div>
                <h4 className="font-bold text-white">Your Global Bio</h4>
                <p className="text-xs text-gray-400">Share your story</p>
              </div>
            </div>
            <span className="text-gray-400">›</span>
          </div>
        </Link>
      </div>
    </div>
  );
}
