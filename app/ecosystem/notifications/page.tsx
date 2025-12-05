"use client";

import { useEffect, useState } from "react";
import { useTheme } from "@/hooks/useTheme";
import { api } from "@/lib/api";
import { Bell } from "lucide-react";

export default function NotificationsPage() {
  const { theme } = useTheme();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/users/notifications");
        setNotifications(res.data || []);
      } catch (e) {
        console.log("Failed loading notifications");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="px-4 pb-28 pt-4">
      <h1 className={`text-2xl font-bold mb-3 ${theme.textPrimary}`}>
        Notifications
      </h1>

      {loading && <p className="text-sm text-gray-400">Loading...</p>}

      <div className="space-y-4 mt-4">
        {notifications.map((n, i) => (
          <div
            key={i}
            className="card-matte p-4 rounded-2xl border border-white/10 flex items-center gap-4"
          >
            <Bell className="w-6 h-6 text-blue-400" />

            <div>
              <p className={`${theme.textPrimary} font-semibold`}>
                {n.title}
              </p>
              <p className={`${theme.textSecondary} text-xs`}>
                {n.message}
              </p>
            </div>
          </div>
        ))}
      </div>

      {!loading && notifications.length === 0 && (
        <p className="text-gray-500 text-sm mt-6">
          No notifications yet.
        </p>
      )}
    </div>
  );
}
