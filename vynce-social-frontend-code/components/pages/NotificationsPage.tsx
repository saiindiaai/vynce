"use client";

import React from "react";
import { Heart, MessageCircle, UserPlus, AtSign } from "lucide-react";
import { useAppStore } from "@/lib/store";

type Notification = {
  type: string;
  user: string;
  username: string;
  action: string;
  time: string;
  isNew?: boolean;
};

const notifications: Notification[] = [
  {
    type: "aura",
    user: "Alex Orbit",
    username: "alex_orbit",
    action: "gave you Aura on your drop",
    time: "5m ago",
    isNew: true,
  },
  {
    type: "lame",
    user: "Negative Nancy",
    username: "negative_nancy",
    action: "called your drop Lame",
    time: "12m ago",
  },
  {
    type: "follow",
    user: "Sarah Vynce",
    username: "sarah_vynce",
    action: "started following you",
    time: "1h ago",
  },
  {
    type: "comment",
    user: "Tech Mike",
    username: "tech_mike",
    action: "commented on your post",
    time: "2h ago",
  },
  {
    type: "mention",
    user: "Creative Jane",
    username: "creative_jane",
    action: "mentioned you in a drop",
    time: "3h ago",
  },
  {
    type: "aura",
    user: "Design Pro",
    username: "design_pro",
    action: "gave you Aura on your drop",
    time: "4h ago",
  },
  {
    type: "follow",
    user: "Code Ninja",
    username: "code_ninja",
    action: "started following you",
    time: "5h ago",
  },
  {
    type: "comment",
    user: "UI Wizard",
    username: "ui_wizard",
    action: "commented on your post",
    time: "6h ago",
  },
  {
    type: "aura",
    user: "Vynce Fan",
    username: "vynce_fan",
    action: "gave you Aura on your drop",
    time: "8h ago",
  },
  {
    type: "mention",
    user: "Dev Master",
    username: "dev_master",
    action: "mentioned you in a drop",
    time: "10h ago",
  },
];

export default function NotificationsPage() {
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "aura":
        return <Heart size={16} className="fill-current" />;
      case "lame":
        return "👎";
      case "follow":
        return <UserPlus size={16} />;
      case "comment":
        return <MessageCircle size={16} />;
      case "mention":
        return <AtSign size={16} />;
      default:
        return "•";
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "aura":
        return "text-purple-400 bg-slate-800";
      case "lame":
        return "text-orange-400 bg-slate-800";
      case "follow":
        return "text-blue-400 bg-slate-800";
      case "comment":
        return "text-cyan-400 bg-slate-800";
      case "mention":
        return "text-pink-400 bg-slate-800";
      default:
        return "text-slate-400 bg-slate-800";
    }
  };

  return (
    <div className="animate-fadeIn pb-24 sm:pb-0 w-full">
      {/* Notifications List */}
      <div className="max-w-2xl mx-auto w-full space-y-1 px-3 sm:px-4 pt-1 sm:pt-2">
        {notifications.map((notif, idx) => (
          <div
            key={idx}
            className={`clean-card px-4 py-3 cursor-pointer animate-slideIn ${notif.isNew ? "bg-slate-800/60" : ""}`}
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
                  <span className="font-semibold">{notif.user}</span>
                  <span className="text-slate-500 mx-1">·</span>
                  <span className="text-slate-400">{notif.action}</span>
                </p>
                <p className="text-xs text-slate-500 mt-1">{notif.time}</p>
              </div>

              {notif.isNew && (
                <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-1.5" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
