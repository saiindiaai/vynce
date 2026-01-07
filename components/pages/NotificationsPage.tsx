"use client";

import { api } from "@/lib/api";
import { Bell, Heart, MessageCircle, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";

type Notification = {
  _id: string;
  type: string;
  title: string;
  message: string;
  priority: string;
  pinned: boolean;
  isRead: boolean;
  createdAt: string;
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await api.get("/notifications");
        setNotifications(res.data);
        // Mark all as read when viewing
        if (res.data.some((n: Notification) => !n.isRead)) {
          await api.put("/notifications/read-all");
        }
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "POST_LIKED":
        return <Heart size={16} className="fill-current" />;
      case "COMMENT_ON_POST":
        return <MessageCircle size={16} />;
      case "NEW_FOLLOWER":
        return <UserPlus size={16} />;
      case "HOUSE_JOIN_REQUEST":
      case "HOUSE_JOIN_APPROVED":
        return <Bell size={16} />;
      default:
        return "•";
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "POST_LIKED":
        return "text-purple-400 bg-slate-800";
      case "COMMENT_ON_POST":
        return "text-cyan-400 bg-slate-800";
      case "NEW_FOLLOWER":
        return "text-blue-400 bg-slate-800";
      case "HOUSE_JOIN_REQUEST":
      case "HOUSE_JOIN_APPROVED":
        return "text-red-400 bg-slate-800";
      default:
        return "text-slate-400 bg-slate-800";
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  if (loading) {
    return (
      <div className="animate-fadeIn pb-24 sm:pb-0 w-full flex items-center justify-center">
        <div className="text-slate-400">Loading notifications...</div>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn pb-24 sm:pb-0 w-full">
      {/* Notifications List */}
      <div className="max-w-2xl mx-auto w-full space-y-1 px-3 sm:px-4 pt-1 sm:pt-2">
        {notifications.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-slate-400">No notifications yet</div>
          </div>
        ) : (
          notifications.map((notif, idx) => (
            <div
              key={notif._id}
              className={`clean-card px-4 py-3 cursor-pointer animate-slideIn ${!notif.isRead ? "bg-slate-800/60" : ""}`}
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className="flex items-start gap-3">
                {/* Avatar + Icon */}
                <div className="relative flex-shrink-0">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex-shrink-0" />
                  <div
                    className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-lg flex items-center justify-center text-xs font-bold ${getNotificationColor(notif.type)}`}
                  >
                    {getNotificationIcon(notif.type)}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pt-0.5">
                  <p className="text-sm text-slate-50">
                    <span className="font-semibold">{notif.title}</span>
                    <span className="text-slate-500 mx-1">·</span>
                    <span className="text-slate-400">{notif.message}</span>
                  </p>
                  <p className="text-xs text-slate-500 mt-1">{formatTime(notif.createdAt)}</p>
                </div>

                {!notif.isRead && (
                  <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-1.5" />
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
