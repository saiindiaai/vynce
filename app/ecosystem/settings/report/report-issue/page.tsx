"use client";

import { useTheme } from "@/hooks/useTheme";
import { Flag } from "lucide-react";

export default function ReportIssuePage() {
  const { theme } = useTheme();

  return (
    <div className="px-6 pb-28 pt-4">

      <h1 className={`text-2xl font-bold mb-2 ${theme.textPrimary}`}>
        Report a Problem
      </h1>
      <p className={`text-sm mb-6 ${theme.textSecondary}`}>
        Tell us what went wrong — we monitor reports 24/7.
      </p>

      <div className="card-matte border border-red-500/20 rounded-2xl p-5 space-y-3">
        <div className="flex items-center gap-3">
          <Flag className="w-6 h-6 text-red-400" />
          <p className="text-gray-300">Feature coming soon.</p>
        </div>
        <p className="text-xs text-gray-400">
          You’ll be able to report users, bugs, safety issues and more.
        </p>
      </div>

    </div>
  );
}
