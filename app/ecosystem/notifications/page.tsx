"use client";

import { useEffect, useState } from "react";
import { useTheme } from "@/hooks/useTheme";
import { api } from "@/lib/api";
import { Bell, Check, X } from "lucide-react";
import { useAppStore } from "@/lib/store";

export default function NotificationsPage() {
  const { theme } = useTheme();
  const { showToast } = useAppStore();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeNotificationId, setActiveNotificationId] = useState<string | null>(null);

  const handleNotificationClick = (notification: any, index: number) => {
    if (notification.type === 'house_join_request') {
      // Toggle active state - clicking same notification again cancels
      setActiveNotificationId(activeNotificationId === `${index}` ? null : `${index}`);
    }
  };

  const handleApprove = () => {
    showToast("Approved (UI only)", "success");
    setActiveNotificationId(null);
  };

  const handleReject = () => {
    showToast("Rejected (UI only)", "error");
    setActiveNotificationId(null);
  };

  const handleOutsideClick = () => {
    setActiveNotificationId(null);
  };

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
    <div className="px-4 pb-28 pt-4" onClick={handleOutsideClick}>
      <h1 className={`text-2xl font-bold mb-3 ${theme.textPrimary}`}>Notifications</h1>

      {loading && <p className="text-sm text-gray-400">Loading...</p>}

      <div className="space-y-4 mt-4">
        {notifications.map((n, i) => {
          const isActive = activeNotificationId === `${i}`;
          const isJoinRequest = n.type === 'house_join_request';
          const isBlurred = activeNotificationId !== null && !isActive;

          return (
            <div
              key={i}
              className={`card-matte p-4 rounded-2xl border border-white/10 flex items-center gap-4 transition-all duration-200 cursor-pointer ${
                isActive ? 'ring-2 ring-purple-500 shadow-xl scale-[1.02]' : ''
              } ${
                isBlurred ? 'blur-sm opacity-40' : ''
              }`}
              onClick={(e) => {
                e.stopPropagation();
                handleNotificationClick(n, i);
              }}
            >
              <Bell className="w-6 h-6 text-blue-400 flex-shrink-0" />

              <div className="flex-1">
                <p className={`${theme.textPrimary} font-semibold`}>{n.title}</p>
                <p className={`${theme.textSecondary} text-xs`}>{n.message}</p>
              </div>

              {/* Approve/Reject buttons for active house join request */}
              {isActive && isJoinRequest && (
                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleApprove();
                    }}
                    className="flex items-center gap-1 px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded-lg transition-colors"
                  >
                    <Check size={12} />
                    Approve
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleReject();
                    }}
                    className="flex items-center gap-1 px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded-lg transition-colors"
                  >
                    <X size={12} />
                    Reject
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {!loading && notifications.length === 0 && (
        <p className="text-gray-500 text-sm mt-6">No notifications yet.</p>
      )}
    </div>
  );
}
