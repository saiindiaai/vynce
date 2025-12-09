"use client";

import Link from "next/link";
import { useTheme } from "@/hooks/useTheme";
import { ShieldAlert, FileText } from "lucide-react";

export default function ReportPage() {
  const { theme } = useTheme();

  return (
    <div className="px-6 pb-28 pt-4">
      <h1 className={`text-2xl font-bold mb-2 ${theme.textPrimary}`}>Policies & Reports</h1>
      <p className={`text-sm mb-6 ${theme.textSecondary}`}>The boring but important stuff.</p>

      <div className="space-y-4">
        {/* PRIVACY POLICY */}
        <Link href="/ecosystem/settings/report/privacy-policy" className="block">
          <div className="rounded-3xl p-4 bg-[#0b0f17]/80 border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Privacy Policy</h3>
                <p className="text-gray-400 text-sm">How we handle your data.</p>
              </div>
            </div>
            <span className="text-gray-400">{">"}</span>
          </div>
        </Link>

        {/* REPORT ISSUE / USER */}
        <Link href="/ecosystem/settings/report/report-issue" className="block">
          <div className="rounded-3xl p-4 bg-[#0b0f17]/80 border border-red-400/30 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
                <ShieldAlert className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Report</h3>
                <p className="text-gray-400 text-sm">Report issues or a user.</p>
              </div>
            </div>
            <span className="text-gray-400">{">"}</span>
          </div>
        </Link>
      </div>
    </div>
  );
}
