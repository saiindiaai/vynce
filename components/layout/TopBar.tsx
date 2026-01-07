"use client";

import { api } from "@/lib/api";
import { useAppStore } from "@/lib/store";
import { Bell, Menu, MessageCircle, Plus } from "lucide-react";
import { useEffect, useState } from "react";

export default function TopBar() {
  const { currentPage, setCurrentPage, toggleSidebar } = useAppStore();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const res = await api.get("/notifications");
        const unread = res.data.filter((n: any) => !n.isRead).length;
        setUnreadCount(unread);
      } catch (error) {
        console.error("Failed to fetch unread count:", error);
      }
    };
    fetchUnreadCount();
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-40 bg-slate-900 border-b border-slate-700/50">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Left: Menu Button (mobile only) + App Name (desktop) */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-slate-800 transition-colors text-slate-300 hover:text-slate-50 sm:hidden focus:outline-none focus-visible:outline-2 focus-visible:outline-purple-500 focus-visible:outline-offset-2 flex-shrink-0"
            aria-label="Toggle navigation menu"
          >
            <Menu size={22} />
          </button>

          {/* App Name - Visible on desktop only */}
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-sm font-bold text-slate-50">Vynce Social</span>
          </div>
        </div>

        {/* Center: Empty space for future use */}
        <div className="flex-1" />

        {/* Right: Messages + Notifications + Creator Hub */}
        <div className="flex items-center gap-2">
          {/* Creator Hub (+) Button */}
          <button
            onClick={() => setCurrentPage("creator_hub")}
            className={`p-2 rounded-lg transition-all duration-200 min-h-[40px] min-w-[40px] flex items-center justify-center focus:outline-none focus-visible:outline-2 focus-visible:outline-purple-500 focus-visible:outline-offset-2 ${currentPage === "creator_hub"
              ? "bg-purple-700 text-white"
              : "hover:bg-purple-700/70 text-purple-300 hover:text-white"
              }`}
            aria-label="Creator Hub"
            title="Creator Hub"
          >
            <Plus size={22} />
          </button>

          {/* Messages Button */}
          <button
            onClick={() => setCurrentPage("messages")}
            className={`p-2 rounded-lg transition-all duration-200 relative min-h-[40px] min-w-[40px] flex items-center justify-center focus:outline-none focus-visible:outline-2 focus-visible:outline-purple-500 focus-visible:outline-offset-2 ${currentPage === "messages"
              ? "bg-slate-800 text-slate-50"
              : "hover:bg-slate-800/60 text-slate-300 hover:text-slate-50"
              }`}
            aria-label="Messages - view your conversations"
            title="Messages"
          >
            <MessageCircle size={20} />
            <span
              className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-xs font-bold text-white border-2 border-slate-900 animate-pulse"
              aria-hidden="true"
            >
              3
            </span>
          </button>

          {/* Notifications Button */}
          <button
            onClick={() => setCurrentPage("notifications")}
            className={`p-2 rounded-lg transition-all duration-200 relative min-h-[40px] min-w-[40px] flex items-center justify-center focus:outline-none focus-visible:outline-2 focus-visible:outline-purple-500 focus-visible:outline-offset-2 ${currentPage === "notifications"
              ? "bg-slate-800 text-slate-50"
              : "hover:bg-slate-800/60 text-slate-300 hover:text-slate-50"
              }`}
            aria-label="Notifications - view updates and interactions"
            title="Notifications"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span
                className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold text-white border-2 border-slate-900 animate-pulse"
                aria-hidden="true"
              >
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
