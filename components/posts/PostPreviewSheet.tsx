"use client";

import BottomSheet from "@/components/ui/BottomSheet";
import { useAppStore } from "@/lib/store";
import { useRouter } from "next/navigation";

interface PostPreviewSheetProps {
  open: boolean;
  onClose: () => void;
  post: any;
}

const PostPreviewSheet: React.FC<PostPreviewSheetProps> = ({ open, onClose, post }) => {
  const router = useRouter();
  const setCurrentPage = useAppStore((s) => s.setCurrentPage);
  if (!post) return null;

  // Get display text
  const text = post.content || "";
  const displayText = text.length > 200 ? text.slice(0, 200) + "..." : text;

  // Get author name from multiple possible sources
  const authorName = post.author?.displayName || post.author?.username || "unknown";

  return (
    <BottomSheet isOpen={open} onClose={onClose} title="Post">
      <div className="flex flex-col gap-3 pb-24">
        <div className="text-base text-slate-100 whitespace-pre-line">
          {displayText}
        </div>
        <div className="text-xs text-slate-400 mb-2">by {authorName}</div>
        <div className="mt-auto pt-2">
          <button
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition shadow-lg"
            onClick={() => {
              setCurrentPage("drops");
              const postId = post._id;
              if (postId) {
                router.push(`/social?post=${postId}`);
              }
            }}
          >
            Go to Post
          </button>
        </div>
      </div>
    </BottomSheet>
  );
};

export default PostPreviewSheet;
