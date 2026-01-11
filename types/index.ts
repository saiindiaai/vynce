export interface Theme {
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  bg: string;
  textPrimary: string;
  textSecondary: string;
  textAccent: string;
  borderAccent: string;
  hoverBorder: string;
  navActive: string;
  bgSolid: string;
  cardBg: string;
  cardBorder: string;
}

export type TabType = "home" | "profile" | "settings" | "themes";

// Vynce Social Types
export interface ThemeConfig {
  name: string;
  root?: string;
  primary: string;
  secondary: string;
  accent: string;
  bg: string;
  textPrimary: string;
  textSecondary: string;
  textAccent: string;
  borderAccent: string;
  hoverBorder: string;
  navActive: string;
  bgSolid: string;
  cardBg: string;
  cardBorder: string;
  style?: "flat" | "glossy" | "premium" | "cosmos" | "cosmic-retro";
  neonGlow?: string;
  gridColor?: string;
}

export interface ThemeCategories {
  [category: string]: string[];
}

export interface Story {
  username: string;
  isYou?: boolean;
  gradient: string;
  hasNew?: boolean;
}

export interface Post {
  id: number;
  userId: string;
  user: string;
  username: string;
  verified: boolean;
  time: string;
  content: string;
  aura: number;
  comments: number;
  shares: number;
  type: "text" | "image" | "video";
  tags?: string[];
  likes?: number;
  liked?: boolean;
  saved?: boolean;
}

// Chat Types
export type HouseType = "group_chat" | "community" | "house" | "broadcast";

export interface House {
  _id: string;
  name: string;
  description: string;
  purpose: string;
  type: "group_chat" | "community" | "house" | "broadcast";
  level: number;
  influence: number;
  members: any[]; // Array of populated user objects or IDs
  isPrivate: boolean;
  isPinned: boolean;
  createdAt: string;
  foundedBy: string | any; // Can be string or populated user object
  crest?: string;
  channels: Channel[];
  allyHouses: string[];
  rivalHouses: string[];
  history: string[];
}

export interface Channel {
  _id: string;
  houseId: string;
  name: string;
  description?: string;
  createdAt: string;
  createdBy: string;
}

export interface HouseMessage {
  _id: string;
  houseId: string;
  channelId: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: string;
}

export interface Conversation {
  _id: string;
  participants: User[];
  lastMessage?: SocialMessage;
  lastMessageTime: string;
  createdAt: string;
  updatedAt: string;
}

export interface SocialMessage {
  _id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  read: boolean;
  delivered: boolean;
  reactions?: { type: string; by: string; byName: string }[];
  replyTo?: SocialMessage;
  imageUrl?: string;
  edited?: boolean;
  editedAt?: string;
  deleted?: boolean;
}

export interface User {
  _id: string;
  username: string;
  displayName?: string;
}
