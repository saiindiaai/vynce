"use client";

import { useTheme } from "@/hooks/useTheme";

export default function PrivacyPage() {
  const { theme } = useTheme();

  return (
    <div className="px-6 pb-28 pt-4">
      <h1 className={`text-2xl font-bold mb-2 ${theme.textPrimary}`}>Privacy</h1>
      <p className={`text-sm mb-6 ${theme.textSecondary}`}>
        Control who can see you and how your data is used.
      </p>

      <div className="space-y-4">
        <div className={`card-matte rounded-2xl p-4 border ${theme.cardBorder}`}>
          <p className={`text-xs ${theme.textSecondary}`}>Profile visibility</p>
          <p className={`text-sm font-semibold ${theme.textPrimary}`}>Public (coming soon)</p>
          <p className="text-xs text-gray-500 mt-1">
            You’ll be able to switch between Public, Friends-only, and Private.
          </p>
        </div>

        <div className={`card-matte rounded-2xl p-4 border ${theme.cardBorder}`}>
          <p className={`text-xs ${theme.textSecondary}`}>Search visibility</p>
          <p className={`text-sm font-semibold ${theme.textPrimary}`}>Discoverable by username</p>
          <p className="text-xs text-gray-500 mt-1">
            Control if people can find you via search and suggestions.
          </p>
        </div>

        <div className={`card-matte rounded-2xl p-4 border ${theme.cardBorder}`}>
          <p className={`text-xs ${theme.textSecondary}`}>Data controls</p>
          <p className="text-xs text-gray-400">
            Export / delete data and consent controls will live here.
          </p>
        </div>
      </div>
    </div>
  );
}
