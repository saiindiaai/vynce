"use client";

import Link from "next/link";
import { Palette, Bell, Lock, FileText, Flag, Trash2 } from "lucide-react";

export default function SettingsSection() {
  return (
    <div className="px-6 pb-28">   {/* SAME AS PROFILE SECTION */}

      {/* SPACE ABOVE CARDS */}
      <div className="mt-6 space-y-4">   {/* NOW CARDS WILL SPACE OUT */}

        {/* THEMES */}
        <Link href="/ecosystem/settings/themes" className="block">
          <div className="rounded-3xl p-4 bg-[#0b0f17]/80 border border-white/10 shadow-[0_0_20px_rgba(0,0,0,0.3)] flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                <Palette className="text-white w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-white text-base">Themes</h3>
                <p className="text-gray-400 text-sm">Current: Monochrome Royale</p>
              </div>
            </div>
            <span className="text-gray-400">→</span>
          </div>
        </Link>

        {/* NOTIFICATIONS */}
        <Link href="/ecosystem/settings/notifications" className="block">
          <div className="rounded-3xl p-4 bg-[#0b0f17]/80 border border-white/10 shadow-[0_0_20px_rgba(0,0,0,0.3)] flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-400 flex items-center justify-center">
                <Bell className="text-white w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-white text-base">Notifications</h3>
                <p className="text-gray-400 text-sm">Manage alerts</p>
              </div>
            </div>
            <span className="text-gray-400">→</span>
          </div>
        </Link>

        {/* PRIVACY */}
        <Link href="/ecosystem/settings/privacy" className="block">
          <div className="rounded-3xl p-4 bg-[#0b0f17]/80 border border-white/10 shadow-[0_0_20px_rgba(0,0,0,0.3)] flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center">
                <Lock className="text-white w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-white text-base">Privacy</h3>
                <p className="text-gray-400 text-sm">Control your data</p>
              </div>
            </div>
            <span className="text-gray-400">→</span>
          </div>
        </Link>

        {/* POLICIES */}
        <Link href="/ecosystem/settings/policies" className="block">
          <div className="rounded-3xl p-4 bg-[#0b0f17]/80 border border-white/10 shadow-[0_0_20px_rgba(0,0,0,0.3)] flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center">
                <FileText className="text-white w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-white text-base">Policies</h3>
                <p className="text-gray-400 text-sm">Terms & conditions</p>
              </div>
            </div>
            <span className="text-gray-400">→</span>
          </div>
        </Link>

        {/* REPORT */}
        <Link href="/ecosystem/settings/report" className="block">
          <div className="rounded-3xl p-4 bg-[#0b0f17]/80 border border-white/10 shadow-[0_0_20px_rgba(0,0,0,0.3)] flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                <Flag className="text-white w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-white text-base">Report</h3>
                <p className="text-gray-400 text-sm">Report issues</p>
              </div>
            </div>
            <span className="text-gray-400">→</span>
          </div>
        </Link>

        {/* DELETE ACCOUNT */}
        <Link href="/ecosystem/settings/delete" className="block">
          <div className="rounded-3xl p-4 bg-gradient-to-br from-red-700/50 to-red-600/40 border border-red-500/30 shadow-[0_0_20px_rgba(255,0,0,0.2)] flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center">
                <Trash2 className="text-white w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-white text-base">
                  Delete Account
                </h3>
                <p className="text-gray-300 text-sm">Permanently remove</p>
              </div>
            </div>
            <span className="text-gray-300">→</span>
          </div>
        </Link>

      </div>
    </div>
  );
}
