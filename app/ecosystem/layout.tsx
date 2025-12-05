"use client";

import EcoHeader from "@/components/layout/EcoHeader";
import BottomNav from "@/components/layout/BottomNav";

export default function EcosystemLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen matte-bg text-white relative">

      {/* Fixed Header */}
      <div className="sticky top-0 z-50">
        <EcoHeader />
      </div>

      {/* ⚠️ REMOVE extra background & tint */}
      <main className="pb-28 px-4">
        {children}
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
