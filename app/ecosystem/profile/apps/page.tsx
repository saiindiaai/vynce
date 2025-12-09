"use client";

import { Smartphone } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

export default function YourAppsPage() {
  const { theme } = useTheme();

  const apps = [
    {
      name: "Vynce Social",
      desc: "Connect & Share",
      status: "Installed",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      name: "Vynce Connect",
      desc: "Network Hub",
      status: "Installed",
      gradient: "from-indigo-500 to-blue-500",
    },
    {
      name: "Vynce AI",
      desc: "Smart Assistant",
      status: "Installed",
      gradient: "from-cyan-500 to-blue-500",
    },
  ];

  return (
    <div className="px-6 pb-28 pt-4">
      {/* Heading */}
      <h1 className={`text-2xl font-bold mb-2 ${theme.textPrimary}`}>Your Apps</h1>

      <p className={`text-sm mb-6 ${theme.textSecondary}`}>
        These are the apps available in your Vynce ecosystem.
      </p>

      {/* App list */}
      <div className="space-y-4">
        {apps.map((app) => (
          <div
            key={app.name}
            className="card-matte rounded-2xl p-4 border border-white/10 hover:border-white/20 transition-all flex items-center justify-between cursor-pointer"
          >
            {/* App Icon + Info */}
            <div className="flex items-center gap-4">
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${app.gradient} flex items-center justify-center`}
              >
                <Smartphone className="w-6 h-6 text-white" />
              </div>

              <div>
                <p className={`font-semibold ${theme.textPrimary}`}>{app.name}</p>
                <p className={`text-xs ${theme.textSecondary}`}>{app.desc}</p>
              </div>
            </div>

            {/* Status */}
            <span className="text-emerald-400 text-sm">{app.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
