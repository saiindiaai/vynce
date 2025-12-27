import { ThemeCategories } from "@/types";

export const themes: Record<
  string,
  {
    name: string;
    style: string;
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
> = {
  "Vynce Nebula": {
    name: "Vynce Nebula",
    style: "dark",
    primary: "from-purple-600 to-blue-600",
    secondary: "from-indigo-600 to-purple-600",
    accent: "from-purple-500 to-blue-500",
    bgSolid: "bg-slate-900",
    bgGradient: "bg-slate-900",
    cardBg: "bg-slate-800",
    cardBorder: "border-slate-700",
    textPrimary: "text-slate-50",
    textSecondary: "text-slate-300",
    textAccent: "text-purple-400",
    shadowColor: "shadow-slate-950/40",
  },
};

export const themeCategories: ThemeCategories = {
  Dark: ["Vynce Nebula"],
};

export function getAllThemes() {
  return themes;
}

// Default theme
export const DEFAULT_THEME = "Vynce Nebula";
