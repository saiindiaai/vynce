"use client";

import TextDebateViewer from "@/components/pages/fight/TextDebateViewer";
import VisualFightViewer from "@/components/pages/fight/VisualFightViewer";
import { X } from "lucide-react";

function WatchFightModal({
  isOpen,
  onClose,
  fight,
}: {
  isOpen: boolean;
  onClose: () => void;
  fight: any;
}) {
  if (!isOpen || !fight) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black z-50 animate-fadeIn">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
          aria-label="Close"
        >
          <X size={20} className="text-slate-300" />
        </button>

        {/* Show appropriate viewer based on fight type */}
        {fight.fightType === "visual" ? (
          <VisualFightViewer fight={fight} onClose={onClose} />
        ) : (
          <TextDebateViewer fight={fight} onClose={onClose} />
        )}
      </div>
    </>
  );
}

export default WatchFightModal;