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
