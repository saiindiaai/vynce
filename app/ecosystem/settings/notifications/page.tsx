"use client";

import { useState } from "react";
import { useTheme } from "@/hooks/useTheme";
import { Label } from "@/components/ui/label";

export default function NotificationsPage() {
  const { theme } = useTheme();

  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [systemEnabled, setSystemEnabled] = useState(true);

  return (
    <div className="px-6 pb-28 pt-4">
      <h1 className={`text-2xl font-bold mb-2 ${theme.textPrimary}`}>
        Notifications
      </h1>
      <p className={`text-sm mb-6 ${theme.textSecondary}`}>
        Control how Vynce alerts you.
      </p>

      <div className="space-y-4">

        {/* PUSH */}
        <div
          className={`card-matte rounded-2xl p-4 border flex items-center justify-between ${theme.cardBorder}`}
        >
          <div>
            <p className={`text-sm font-semibold ${theme.textPrimary}`}>
              Push notifications
            </p>
            <p className={`text-xs ${theme.textSecondary}`}>
              Mentions, follows, alerts.
            </p>
          </div>

          <input
            type="checkbox"
            checked={pushEnabled}
            onChange={() => setPushEnabled(!pushEnabled)}
            className="w-5 h-5 accent-blue-500"
          />
        </div>

        {/* EMAIL */}
        <div
          className={`card-matte rounded-2xl p-4 border flex items-center justify-between ${theme.cardBorder}`}
        >
          <div>
            <p className={`text-sm font-semibold ${theme.textPrimary}`}>
              Email updates
            </p>
            <p className={`text-xs ${theme.textSecondary}`}>
              Account, product and update emails.
            </p>
          </div>

          <input
            type="checkbox"
            checked={emailEnabled}
            onChange={() => setEmailEnabled(!emailEnabled)}
            className="w-5 h-5 accent-blue-500"
          />
        </div>

        {/* SYSTEM ALERTS */}
        <div
          className={`card-matte rounded-2xl p-4 border flex items-center justify-between ${theme.cardBorder}`}
        >
          <div>
            <p className={`text-sm font-semibold ${theme.textPrimary}`}>
              System alerts
            </p>
            <p className={`text-xs ${theme.textSecondary}`}>
              Login & security notifications.
            </p>
          </div>

          <input
            type="checkbox"
            checked={systemEnabled}
            onChange={() => setSystemEnabled(!systemEnabled)}
            className="w-5 h-5 accent-blue-500"
          />
        </div>

      </div>
    </div>
  );
}
