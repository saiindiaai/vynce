"use client";

import React, { useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { useAppStore } from "@/lib/store";
import { getThemeClasses } from "@/lib/theme";

// Import layout components
import TopBar from "@/components/layout/TopBar";
import BottomNav from "@/components/layout/BottomNav";
import Sidebar from "@/components/layout/Sidebar";
import Toast from "@/components/ui/Toast";

// Import page components
import DropsPage from "@/components/pages/DropsPage";
import FightPage from "@/components/pages/FightPage";
import ExplorePage from "@/components/pages/ExplorePage";
import NotificationsPage from "@/components/pages/NotificationsPage";
import ProfilePage from "@/components/pages/ProfilePage";
import MessagesPage from "@/components/pages/MessagesPage";
import CreatorHubPage from "@/components/pages/CreatorHubPage";
import YourActivityPage from "@/components/pages/YourActivityPage";
import SavedPage from "@/components/pages/SavedPage";
import ReportProblemPage from "@/components/pages/ReportProblemPage";
import VynceHousePage from "@/components/pages/VynceHousePage";

// Dynamic imports for pages not yet created
const HomePage = dynamic(() => import("@/components/pages/HomePage"), {
  ssr: false,
  loading: () => <div>Loading...</div>,
});
const CapsulesPage = dynamic(() => import("@/components/pages/CapsulesPage"), {
  ssr: false,
  loading: () => <div>Loading...</div>,
});

// Dynamic import for ThemeSelector
const ThemeSelector = dynamic(() => import("@/components/theme/ThemeSelector"), { ssr: false });

export default function VynceSocialUI() {
  const {
    currentPage,
    currentTheme,
    showThemeSelector,
    toggleSidebar,
    setSidebarOpen,
    toast,
    hideToast,
  } = useAppStore();
  const themeClasses = getThemeClasses(currentTheme);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Mobile swipe gesture handler
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchStartX.current = e.changedTouches[0].screenX;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      touchEndX.current = e.changedTouches[0].screenX;
      const swipeDistance = touchStartX.current - touchEndX.current;
      const isSwipeLeft = swipeDistance > 50; // Swipe left threshold
      const isSwipeRight = swipeDistance < -50; // Swipe right threshold

      // Only on mobile (max-width: 640px)
      if (window.innerWidth < 640) {
        // Swipe right = open sidebar
        if (isSwipeRight) {
          setSidebarOpen(true);
        }
        // Swipe left = close sidebar (if open)
        else if (isSwipeLeft) {
          setSidebarOpen(false);
        }
      }
    };

    document.addEventListener("touchstart", handleTouchStart, false);
    document.addEventListener("touchend", handleTouchEnd, false);

    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [setSidebarOpen]);

  return (
    <div className={`min-h-screen transition-colors duration-500 ${themeClasses.bgSolid}`}>
      {/* Top Bar - Fixed at top */}
      <TopBar />

      {/* Main Layout Container - Account for TopBar height */}
      <div className="pt-14 pb-20 sm:pb-0">
        <div className="flex flex-col sm:flex-row h-full">
          {/* Sidebar (desktop only, can be toggled on mobile) */}
          <Sidebar />

          {/* Main Content */}
          <div className="flex-1">
            {/* Page Rendering */}
            <div className="animate-fadeIn w-full">
              {currentPage === "home" && <HomePage />}
              {currentPage === "capsules" && <CapsulesPage />}
              {currentPage === "drops" && <DropsPage />}
              {currentPage === "messages" && <MessagesPage />}
              {currentPage === "fight" && <FightPage />}
              {currentPage === "explore" && <ExplorePage />}
              {currentPage === "notifications" && <NotificationsPage />}
              {currentPage === "profile" && <ProfilePage />}
              {currentPage === "creator_hub" && <CreatorHubPage />}
              {currentPage === "activity" && <YourActivityPage />}
              {currentPage === "saved" && <SavedPage />}
              {currentPage === "report" && <ReportProblemPage />}
              {currentPage === "vynce_house" && <VynceHousePage />}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />

      {/* Theme Selector Modal */}
      {showThemeSelector && <ThemeSelector />}

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
          actionLabel={toast.actionLabel}
          onAction={toast.action ?? null}
        />
      )}
    </div>
  );
}
