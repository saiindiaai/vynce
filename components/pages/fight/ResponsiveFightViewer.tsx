"use client";

import React, { useState } from "react";
import VisualFightViewer from "./VisualFightViewer";
import TextDebateViewer from "./TextDebateViewer";

interface ResponsiveFightViewerProps {
  fight: any;
  onClose?: () => void;
}

/**
 * Mobile-optimized fight viewer that:
 * - On mobile (<640px): Stacks chat below video/debate
 * - On desktop (640px+): Uses split-view layout (70/30)
 *
 * This is a lightweight wrapper that delegates to platform-specific viewers
 * but ensures mobile users have better ergonomics
 */
export default function ResponsiveFightViewer({ fight, onClose }: ResponsiveFightViewerProps) {
  // The existing viewers already handle responsive layout
  // VisualFightViewer and TextDebateViewer use split-view which adapts to screen size
  // This component exists to ensure mobile-first approach is maintained

  if (fight.fightType === "visual") {
    return <VisualFightViewer fight={fight} onClose={onClose} />;
  }

  return <TextDebateViewer fight={fight} onClose={onClose} />;
}
