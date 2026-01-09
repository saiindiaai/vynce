"use client";

import BottomSheet from "@/components/ui/BottomSheet";
import { useAppStore } from "@/lib/store";
import { useRouter } from "next/navigation";

interface DropPreviewSheetProps {
  open: boolean;
  onClose: () => void;
  drop: any;
}

const DropPreviewSheet: React.FC<DropPreviewSheetProps> = ({ open, onClose, drop }) => {
  const router = useRouter();
  const setCurrentPage = useAppStore((s) => s.setCurrentPage);
  if (!drop) return null;

  // Determine if there is an image
  const hasImage = !!drop.thumb && !/placehold/.test(drop.thumb);
  const text = drop.content || drop.title || "";
  // If image, show half text (truncate to 120 chars), else show all
  const displayText = hasImage && text.length > 120 ? text.slice(0, 120) + "..." : text;

  return (
    <BottomSheet isOpen={open} onClose={onClose} title={drop.title || "Drop"}>
      <div className="flex flex-col gap-3 pb-24"> {/* pb-24 to avoid bottom nav */}
        {hasImage && (
          <img src={drop.thumb} alt={drop.title} className="w-full rounded-lg max-h-60 object-cover mb-2" />
        )}
        <div className={`text-base text-slate-100 whitespace-pre-line ${hasImage ? 'max-h-32 overflow-y-auto' : ''}`}>
          {displayText}
        </div>
        <div className="text-xs text-slate-400 mb-2">by {drop.user || drop.author?.username || "unknown"}</div>
        <div className="mt-auto pt-2">
          <button
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition shadow-lg"
            onClick={() => {
              setCurrentPage("drops");
              router.push(`/social?post=${drop.id || drop._id}`);
            }}
          >
            Go to Drop
          </button>
        </div>
      </div>
    </BottomSheet>
  );
};

export default DropPreviewSheet;
