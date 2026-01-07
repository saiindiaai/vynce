export const LOCAL_HOUSES_KEY = "vynce_houses_hierarchical";
export const LOCAL_MESSAGES_KEY = "vynce_house_messages_hierarchical";
export const LOCAL_MEMBERS_KEY = "vynce_house_members_hierarchical";

export interface HouseMember {
  id: string;
  username: string;
  role: "founder" | "admin" | "moderator" | "member";
  joinedAt: number;
  isOnline: boolean;
  influence: number;
  loyalty: number;
  powers: string[];
}