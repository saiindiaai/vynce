"use client";

import Link from "next/link";
import { Palette, Bell, Lock, FileText, Flag, Trash2 } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

export default function SettingsSection() {
  const { theme, currentTheme } = useTheme();

  const cards = [
    {
      title: "Themes",
      desc: `Current: ${currentTheme}`,
      icon: <Palette className="text-white w-6 h-6" />,
      href: "/ecosystem/settings/themes",
      bg: "from-blue-500 to-indigo-500",
    },
    {
      title: "Notifications",
      desc: "Manage alerts",
      icon: <Bell className="text-white w-6 h-6" />,
      href: "/ecosystem/settings/notifications",
      bg: "from-cyan-400 to-blue-400",
    },
    {
      title: "Privacy",
      desc: "Control your data",
      icon: <Lock className="text-white w-6 h-6" />,
      href: "/ecosystem/settings/privacy",
      bg: "from-purple-500 to-violet-500",
    },
    {
      title: "Policies",
      desc: "Terms & conditions",
      icon: <FileText className="text-white w-6 h-6" />,
      href: "/ecosystem/settings/policies",
      bg: "from-gray-400 to-gray-500",
    },
    {
      title: "Report",
      desc: "Report issues",
      icon: <Flag className="text-white w-6 h-6" />,
      href: "/ecosystem/settings/report",
      bg: "from-orange-500 to-red-500",
    },
  ];

  return (
    <div className="px-6 pb-28 mt-6 space-y-4">

      {/* LOOP CARDS */}
      {cards.map((card) => (
        <Link key={card.title} href={card.href} className="block">
          <div
            className={`
              rounded-3xl p-4 
              card-matte border ${theme.cardBorder}
              flex items-center justify-between
              transition-all hover:border-white/20
            `}
          >
            <div className="flex items-center gap-4">
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.bg} flex items-center justify-center`}
              >
                {card.icon}
              </div>

              <div>
                <h3 className={`font-semibold ${theme.textPrimary} text-base`}>
                  {card.title}
                </h3>
                <p className={`${theme.textSecondary} text-sm`}>
                  {card.desc}
                </p>
              </div>
            </div>

            <span className={`${theme.textSecondary}`}>⟩</span>
          </div>
        </Link>
      ))}

      {/* DELETE ACCOUNT SEPARATE (RED) */}
      <Link href="/ecosystem/settings/delete" className="block">
        <div
          className={`
            rounded-3xl p-4 
            bg-gradient-to-br from-red-700/40 to-red-600/30
            border border-red-500/30
            shadow-[0_0_20px_rgba(255,0,0,0.25)]
            flex items-center justify-between
          `}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center">
              <Trash2 className="text-white w-6 h-6" />
            </div>

            <div>
              <h3 className="font-semibold text-white text-base">Delete Account</h3>
              <p className="text-gray-300 text-sm">Permanently remove</p>
            </div>
          </div>

          <span className="text-gray-300">⟩</span>
        </div>
      </Link>
    </div>
  );
}
