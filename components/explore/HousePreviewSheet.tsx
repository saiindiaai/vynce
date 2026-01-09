"use client";

import BottomSheet from "@/components/ui/BottomSheet";
import { useAppStore } from "@/lib/store";
import { Users } from "lucide-react";
import { useRouter } from "next/navigation";

interface HousePreviewSheetProps {
  open: boolean;
  onClose: () => void;
  house: any;
}

const HousePreviewSheet: React.FC<HousePreviewSheetProps> = ({ open, onClose, house }) => {
  const router = useRouter();
  const setCurrentPage = useAppStore((s) => s.setCurrentPage);

  if (!house) return null;

  // Get house details - use real data from backend
  const houseName = house.name || "House";
  const houseImage = house.image || null;
  const housePurpose = house.purpose || "Community";
  const houseDescription = house.description || "Join this vibrant community.";
  const memberCount = house.memberCount || house.members?.length || 0;

  const handleGoToHouse = () => {
    // Navigate to the vynce_house page with house name for discovery search
    setCurrentPage("vynce_house");
    // Pass the house name as a search query parameter to auto-open discovery and search
    router.push(`/social?discover=${encodeURIComponent(house.name)}`);
    onClose();
  };

  return (
    <BottomSheet isOpen={open} onClose={onClose} title={houseName}>
      <div className="flex flex-col gap-4 pb-24">
        {/* House Image */}
        {houseImage && (
          <img
            src={houseImage}
            alt={houseName}
            className="w-full rounded-lg max-h-60 object-cover"
          />
        )}

        {/* House Purpose/Type */}
        <div className="flex items-center gap-2 px-1">
          <span className="text-lg">🏠</span>
          <span className="text-sm font-semibold text-purple-400">{housePurpose}</span>
        </div>

        {/* House Description */}
        <div className="px-1">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest mb-2">
            About
          </h3>
          <p className="text-sm text-slate-100 leading-relaxed whitespace-pre-line">
            {houseDescription}
          </p>
        </div>

        {/* Member Count */}
        <div className="flex items-center gap-2 px-1 py-3 bg-slate-800/40 rounded-lg border border-slate-700/40">
          <Users size={18} className="text-purple-400" />
          <div className="flex-1">
            <p className="text-xs text-slate-400">Members</p>
            <p className="text-lg font-bold text-slate-100">{memberCount.toLocaleString()}</p>
          </div>
        </div>

        {/* Go to House Button */}
        <div className="mt-auto pt-4">
          <button
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg transition shadow-lg"
            onClick={handleGoToHouse}
          >
            Explore House
          </button>
        </div>
      </div>
    </BottomSheet>
  );
};

export default HousePreviewSheet;
