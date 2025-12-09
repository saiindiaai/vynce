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
  style: "flat" | "glossy" | "premium" | "cosmos" | "cosmic-retro";
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

export interface House {
  name: string;
  icon: string;
  members: string;
  online: number | string;
  gradient: string;
  isJoined: boolean;
}

export interface Capsule {
  id: number;
  username: string;
  userAvatar: string;
  emoji: string;
  title: string;
  description: string;
  gradient: string;
  timestamp: string;
  likes: number;
  comments: number;
  shares: number;
}

export interface Conversation {
  id: number;
  name: string;
  username: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  online: boolean;
}

export interface Message {
  id: number;
  conversationId: number;
  sender: string;
  text: string;
  timestamp: string;
  read: boolean;
}

export interface Notification {
  id: number;
  type: "like" | "comment" | "follow" | "share" | "mention";
  user: string;
  action: string;
  timestamp: string;
  read: boolean;
}

export interface Theme {
  name: string;
  style: "premium" | "cosmic" | "neon" | "natural" | "vibrant" | "cosmic-retro";
  primary: string;
  secondary: string;
  accent: string;
  bgSolid: string;
  bgGradient: string;
  cardBg: string;
  cardBorder: string;
  textPrimary: string;
  textSecondary: string;
  textAccent: string;
  shadowColor: string;
}

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export type PageType =
  | "home"
  | "capsules"
  | "drops"
  | "fight"
  | "explore"
  | "notifications"
  | "profile"
  | "messages"
  | "saved";

export interface User {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  bio: string;
  verified: boolean;
  followers: number;
  following: number;
  online: boolean;
  lastSeen?: string;
}
