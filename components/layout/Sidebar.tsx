"use client";

import { useAppStore } from "@/lib/store";
import {
  Activity,
  AlertCircle,
  ArrowLeft,
  Bookmark,
  ChevronDown,
  Code,
  Home,
  MessageCircle,
  Radio,
  User,
  X,
  Zap
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function Sidebar() {
  const { currentPage, setCurrentPage, sidebarOpen, setSidebarOpen } = useAppStore();
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);

  const menuItems = [
    { id: "home" as const, label: "Home", icon: Home },
    { id: "capsules" as const, label: "Capsules", icon: MessageCircle },
    { id: "drops" as const, label: "Drops", icon: MessageCircle },
    { id: "fight" as const, label: "Fight", icon: Zap },
    { id: "vynce_house" as const, label: "Vynce House", icon: Radio },
    { id: "explore" as const, label: "Explore", icon: Home },
    { id: "profile" as const, label: "Profile", icon: User },
  ];

  const moreMenuItems = [
    { id: "creator_hub" as const, label: "Creator Hub", icon: Code },
    { id: "activity" as const, label: "Your Activity", icon: Activity },
    { id: "saved" as const, label: "Saved", icon: Bookmark },
    { id: "report" as const, label: "Report a Problem", icon: AlertCircle },
  ];

  const handleNavClick = (pageId: typeof currentPage) => {
    setCurrentPage(pageId);
    if (typeof window !== "undefined" && window.innerWidth < 640) {
      setSidebarOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 animate-fadeIn sm:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
          role="presentation"
        />
      )}

      {/* Sidebar */}
      <div
        className={`${sidebarOpen ? "fixed" : "hidden sm:block"
          } top-14 left-0 right-0 sm:relative sm:top-0 sm:w-60 w-full h-[calc(100vh-3.5rem-5rem)] sm:h-auto sm:border-r border-b sm:border-b-0 border-slate-700/30 z-30 sm:z-auto bg-gradient-to-b from-slate-900/95 to-slate-900 backdrop-blur-md shadow-2xl sm:shadow-none overflow-y-auto ${sidebarOpen ? "animate-slideInLeft" : ""
          }`}
      >
        <div className="p-5 space-y-6">
          {/* Mobile Close Button */}
          <div className="flex items-center justify-between sm:hidden mb-4">
            <span className="font-black text-lg text-slate-50">Vynce</span>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2.5 rounded-lg hover:bg-slate-700/50 transition-all duration-200 text-slate-300 hover:text-slate-50"
            >
              <X size={20} />
            </button>
          </div>

          {/* Desktop Logo */}
          <div className="hidden sm:flex items-center gap-3 mb-8">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-lg">
              <span className="text-white font-black text-lg">V</span>
            </div>
            <div>
              <span className="font-black text-lg text-slate-50 block">Vynce</span>
              <span className="text-xs text-slate-400 font-medium">Social</span>
            </div>
          </div>

          {/* Back to Ecosystem (visible in Social) */}
          <div className="mb-3">
            <Link
              href="/ecosystem"
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 min-h-[44px] text-slate-300 hover:bg-slate-700/50 hover:text-slate-50 font-medium text-sm"
            >
              <ArrowLeft size={18} />
              <span>Back to Ecosystem</span>
            </Link>
          </div>

          {/* Menu Items */}
          <div className="space-y-1.5">
            {menuItems.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => handleNavClick(id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 min-h-[44px] font-medium text-sm focus:outline-none focus-visible:outline-2 focus-visible:outline-purple-500 focus-visible:outline-offset-2 ${currentPage === id
                  ? "bg-purple-600/30 border border-purple-500/40 text-slate-50 shadow-lg shadow-purple-500/10"
                  : "text-slate-300 hover:bg-slate-700/50 hover:text-slate-50"
                  }`}
                aria-label={`${label}${currentPage === id ? " (current)" : ""}`}
              >
                <Icon size={20} className="flex-shrink-0" />
                <span>{label}</span>
              </button>
            ))}
          </div>

          {/* Divider */}
          <div className="h-px bg-slate-700/40" />

          {/* More Menu */}
          <div className="space-y-1.5">
            <button
              onClick={() => setMoreMenuOpen(!moreMenuOpen)}
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl transition-all duration-200 min-h-[44px] font-medium text-sm focus:outline-none focus-visible:outline-2 focus-visible:outline-purple-500 focus-visible:outline-offset-2 ${moreMenuOpen
                ? "bg-slate-700/50 text-slate-50"
                : "text-slate-300 hover:bg-slate-700/50 hover:text-slate-50"
                }`}
              aria-label="More menu"
            >
              <div className="flex items-center gap-3">
                <span>More</span>
              </div>
              <ChevronDown
                size={18}
                className={`transition-transform duration-300 ${moreMenuOpen ? "rotate-180" : ""}`}
              />
            </button>

            {/* More Menu Items - Collapsible */}
            {moreMenuOpen && (
              <div className="space-y-1.5 pl-1 animate-slideInUp">
                {moreMenuItems.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => {
                      handleNavClick(id);
                      setMoreMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 min-h-[40px] font-medium text-sm focus:outline-none focus-visible:outline-2 focus-visible:outline-purple-500 focus-visible:outline-offset-2 ${currentPage === id
                      ? "bg-purple-600/20 border border-purple-500/30 text-purple-300"
                      : "text-slate-400 hover:bg-slate-700/40 hover:text-slate-300"
                      }`}
                    aria-label={`${label}${currentPage === id ? " (current)" : ""}`}
                  >
                    <Icon size={18} className="flex-shrink-0" />
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
