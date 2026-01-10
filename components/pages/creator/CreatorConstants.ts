import { BarChart3, TrendingUp, Users, Zap } from "lucide-react";

export type ContentType = "drop" | "capsule" | "fight";

export type CreatorPost = {
  _id: string;
  contentType: ContentType;
  title: string;
  description: string;
  media?: { url: string; type: "image" | "video" } | null;
  tags: string[];
  visibility?: "public" | "private" | "draft" | "scheduled";
  scheduledAt?: number | null;
  createdAt: string;
  updatedAt?: string;
  // Fight-specific
  opponent?: string;
  fightType?: "visual" | "text";
  // Author info (populated)
  author?: {
    _id: string;
    username: string;
    displayName?: string;
    uid: string;
    avatar?: string;
  };
  // Stats
  views?: number;
  likes?: number;
  shares?: number;
  published?: boolean;
};

export const LOCAL_KEY = "vynce_creator_posts";

export const MAX_FILE_SIZE_BYTES = 40 * 1024 * 1024; // 40MB

export const CREATOR_STATS = [
  { label: "Total Followers", value: "1,234", change: "+12% this week", icon: Users },
  { label: "Total Aura", value: "5,678", change: "+23% this week", icon: Zap },
  { label: "Engagement Rate", value: "8.5%", change: "+2% this week", icon: TrendingUp },
  { label: "Total Views", value: "45.2K", change: "+31% this week", icon: BarChart3 },
];