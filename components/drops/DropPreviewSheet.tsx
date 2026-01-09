"use client";

import BottomSheet from "@/components/ui/BottomSheet";
import { useRouter } from "next/navigation";

interface DropPreviewSheetProps {
  open: boolean;
  onClose: () => void;
  drop: any;
}

export default function DropPreviewSheet({ open, onClose, drop }: DropPreviewSheetProps) {
  const router = useRouter();

  if (!drop) return null;

  return (
    <BottomSheet isOpen={open} onClose={onClose} title={drop.title || "Drop"}>
      <div className="space-y-3">
        {drop.thumb && (
          <img src={drop.thumb} alt={drop.title} className="w-full rounded-lg mb-2 max-h-60 object-cover" />
        )}
        <div className="text-base text-slate-100 whitespace-pre-line">{drop.content || drop.title}</div>
        <div className="text-xs text-slate-400">by {drop.user || drop.author?.username || "unknown"}</div>
        <button
          className="mt-4 w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition"
          onClick={() => router.push(`/social/drops/${drop.id}`)}
        >
          Go to Drop
        </button>
      </div>
    </BottomSheet>
  );
}
