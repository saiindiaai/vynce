'use client';

import React, { useState } from 'react';
import { X, Home, Zap, Bell, User, MessageCircle, ChevronDown, Code, Activity, Bookmark, AlertCircle, Radio } from 'lucide-react';
import { useAppStore } from '@/lib/store';

export default function Sidebar() {
  const { currentPage, setCurrentPage, sidebarOpen, setSidebarOpen } = useAppStore();
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);

  const menuItems = [
    { id: 'home' as const, label: 'Home', icon: Home },
    { id: 'capsules' as const, label: 'Capsules', icon: MessageCircle },
    { id: 'drops' as const, label: 'Drops', icon: MessageCircle },
    { id: 'fight' as const, label: 'Fight', icon: Zap },
    { id: 'vynce_house' as const, label: 'Vynce House', icon: Radio },
    { id: 'explore' as const, label: 'Explore', icon: Home },
    { id: 'profile' as const, label: 'Profile', icon: User },
  ];

  const moreMenuItems = [
    { id: 'creator_hub' as const, label: 'Creator Hub', icon: Code },
    { id: 'activity' as const, label: 'Your Activity', icon: Activity },
    { id: 'saved' as const, label: 'Saved', icon: Bookmark },
    { id: 'report' as const, label: 'Report a Problem', icon: AlertCircle },
  ];

  const handleNavClick = (pageId: typeof currentPage) => {
    setCurrentPage(pageId);
    if (typeof window !== 'undefined' && window.innerWidth < 640) {
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
        className={`${
          sidebarOpen ? 'fixed' : 'hidden sm:block'
        } top-14 left-0 right-0 sm:relative sm:top-0 sm:w-60 w-full h-[calc(100vh-3.5rem-5rem)] sm:h-auto sm:border-r border-b sm:border-b-0 border-slate-700/50 z-30 sm:z-auto bg-slate-900 overflow-y-auto ${
          sidebarOpen ? 'animate-slideInLeft' : ''
        }`}
      >
        <div className="p-4 space-y-6">
          {/* Mobile Close Button */}
          <div className="flex items-center justify-between sm:hidden mb-4">
            <span className="font-black text-lg text-slate-50">Vynce</span>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 rounded-lg hover:bg-slate-800 transition-colors text-slate-300 hover:text-slate-50"
            >
              <X size={20} />
            </button>
          </div>

          {/* Desktop Logo */}
          <div className="hidden sm:flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-md">
              <span className="text-white font-black text-lg">V</span>
            </div>
            <div>
              <span className="font-black text-lg text-slate-50 block">Vynce</span>
              <span className="text-xs text-slate-400">Social</span>
            </div>
          </div>

          {/* Menu Items */}
          <div className="space-y-1">
            {menuItems.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => handleNavClick(id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 min-h-[40px] focus:outline-none focus-visible:outline-2 focus-visible:outline-purple-500 focus-visible:outline-offset-2 ${
                  currentPage === id
                    ? 'bg-slate-800 text-slate-50 shadow-sm'
                    : 'text-slate-300 hover:bg-slate-800/60 hover:text-slate-50'
                }`}
                aria-label={`${label}${currentPage === id ? ' (current)' : ''}`}
              >
                <Icon size={20} className="flex-shrink-0" />
                <span className="font-medium text-sm">{label}</span>
              </button>
            ))}
          </div>

          {/* Divider */}
          <div className="h-px bg-slate-700/30" />

          {/* More Menu */}
          <div className="space-y-1">
            <button
              onClick={() => setMoreMenuOpen(!moreMenuOpen)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 min-h-[40px] focus:outline-none focus-visible:outline-2 focus-visible:outline-purple-500 focus-visible:outline-offset-2 ${
                moreMenuOpen
                  ? 'bg-slate-800 text-slate-50 shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-slate-50'
              }`}
              aria-label="More menu"
            >
              <div className="flex items-center gap-3">
                <span className="font-medium text-sm">More</span>
              </div>
              <ChevronDown
                size={18}
                className={`transition-transform duration-200 ${
                  moreMenuOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* More Menu Items - Collapsible */}
            {moreMenuOpen && (
              <div className="space-y-1 pl-3 animate-slideInUp">
                {moreMenuItems.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => {
                      handleNavClick(id);
                      setMoreMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 min-h-[36px] focus:outline-none focus-visible:outline-2 focus-visible:outline-purple-500 focus-visible:outline-offset-2 ${
                      currentPage === id
                        ? 'bg-slate-700 text-slate-50 shadow-sm'
                        : 'text-slate-400 hover:bg-slate-700/40 hover:text-slate-300'
                    }`}
                    aria-label={`${label}${currentPage === id ? ' (current)' : ''}`}
                  >
                    <Icon size={16} className="flex-shrink-0" />
                    <span className="font-medium text-xs">{label}</span>
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
