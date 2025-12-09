"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { useTheme } from "@/hooks/useTheme";

export default function NotificationsPage() {
  const { theme } = useTheme();

  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [systemEnabled, setSystemEnabled] = useState(true);

  const [loading, setLoading] = useState(true);

  // Load from backend
  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/users/me");

        setPushEnabled(res.data.notifications?.push ?? true);
        setEmailEnabled(res.data.notifications?.email ?? false);
        setSystemEnabled(res.data.notifications?.system ?? true);
      } catch (err) {
        console.log("Failed to load notifications", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  // Save updates to backend
  const save = async (updates: any) => {
    try {
      await api.patch("/users/notifications", updates);
    } catch (e) {
      console.log("Notification save failed", e);
    }
  };

  if (loading) {
    return <div className="px-6 pb-28 pt-4 text-gray-400">Loading notification settings...</div>;
  }

  return (
    <div className="px-6 pb-28 pt-4">
      <h1 className={`text-2xl font-bold mb-2 ${theme.textPrimary}`}>Notifications</h1>
      <p className={`text-sm mb-6 ${theme.textSecondary}`}>Control how Vynce alerts you.</p>

      <div className="space-y-4">
        {/* PUSH */}
        <div
          className={`card-matte rounded-2xl p-4 border flex items-center justify-between ${theme.cardBorder}`}
        >
          <div>
            <p className={`text-sm font-semibold ${theme.textPrimary}`}>Push notifications</p>
            <p className={`text-xs ${theme.textSecondary}`}>Mentions, follows, alerts.</p>
          </div>

          <input
            type="checkbox"
            checked={pushEnabled}
            onChange={() => {
              const newVal = !pushEnabled;
              setPushEnabled(newVal);
              save({
                push: newVal,
                email: emailEnabled,
                system: systemEnabled,
              });
            }}
            className="w-5 h-5 accent-blue-500"
          />
        </div>

        {/* EMAIL */}
        <div
          className={`card-matte rounded-2xl p-4 border flex items-center justify-between ${theme.cardBorder}`}
        >
          <div>
            <p className={`text-sm font-semibold ${theme.textPrimary}`}>Email updates</p>
            <p className={`text-xs ${theme.textSecondary}`}>Account, product and update emails.</p>
          </div>

          <input
            type="checkbox"
            checked={emailEnabled}
            onChange={() => {
              const newVal = !emailEnabled;
              setEmailEnabled(newVal);
              save({
                push: pushEnabled,
                email: newVal,
                system: systemEnabled,
              });
            }}
            className="w-5 h-5 accent-blue-500"
          />
        </div>

        {/* SYSTEM ALERTS */}
        <div
          className={`card-matte rounded-2xl p-4 border flex items-center justify-between ${theme.cardBorder}`}
        >
          <div>
            <p className={`text-sm font-semibold ${theme.textPrimary}`}>System alerts</p>
            <p className={`text-xs ${theme.textSecondary}`}>Login & security notifications.</p>
          </div>

          <input
            type="checkbox"
            checked={systemEnabled}
            onChange={() => {
              const newVal = !systemEnabled;
              setSystemEnabled(newVal);
              save({
                push: pushEnabled,
                email: emailEnabled,
                system: newVal,
              });
            }}
            className="w-5 h-5 accent-blue-500"
          />
        </div>
      </div>
    </div>
  );
}
