"use client";

import SettingsSection from "@/components/settings/SettingsSection";
import { useTheme } from "@/hooks/useTheme";

export default function SettingsPage() {
  const { theme } = useTheme();

  return (
    <div className={`min-h-screen px-4 pb-28 ${theme.pageBg}`}>
      <SettingsSection />
    </div>
  );
}
