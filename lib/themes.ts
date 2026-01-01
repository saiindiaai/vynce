import { Theme } from "@/types";

export const themeCategories: Record<string, Record<string, Theme>> = {
  "Dark Themes": {
    "Monochrome Royale": {
      name: "Monochrome Royale",
      primary: "from-blue-500 to-blue-600",
      secondary: "from-violet-500 to-violet-600",
      accent: "from-gray-300 to-gray-400",
      bg: "from-black via-gray-950 to-black",
      textPrimary: "text-white",
      textSecondary: "text-gray-300",
      textAccent: "text-blue-400",
      borderAccent: "border-blue-500/40",
      hoverBorder: "hover:border-blue-500/70",
      navActive: "bg-gradient-to-br from-blue-500 to-violet-600",
      bgSolid: "bg-gray-950",
      cardBg: "bg-gray-900/60",
      cardBorder: "border-gray-700/50",
    },
    "Galaxy Core": {
      name: "Galaxy Core",
      primary: "from-purple-500 to-purple-600",
      secondary: "from-cyan-400 to-cyan-500",
      accent: "from-yellow-400 to-yellow-500",
      bg: "from-slate-950 via-blue-950 to-slate-950",
      textPrimary: "text-white",
      textSecondary: "text-gray-200",
      textAccent: "text-purple-300",
      borderAccent: "border-purple-400/40",
      hoverBorder: "hover:border-purple-400/70",
      navActive: "bg-gradient-to-br from-purple-500 to-cyan-500",
      bgSolid: "bg-slate-950",
      cardBg: "bg-slate-900/70",
      cardBorder: "border-purple-500/30",
    },
    "Vynce Nebula": {
      name: "Vynce Nebula",
      primary: "from-purple-500 to-blue-500",
      secondary: "from-pink-500 to-purple-500",
      accent: "from-cyan-400 to-blue-400",
      bg: "from-gray-950 via-gray-900 to-gray-950",
      textPrimary: "text-white",
      textSecondary: "text-gray-200",
      textAccent: "text-purple-300",
      borderAccent: "border-purple-400/40",
      hoverBorder: "hover:border-purple-400/70",
      navActive: "bg-gradient-to-br from-purple-500 to-blue-500",
      bgSolid: "bg-gray-950",
      cardBg: "bg-gray-900/60",
      cardBorder: "border-purple-500/30",
    },
    CyberMint: {
      name: "CyberMint",
      primary: "from-teal-400 to-teal-500",
      secondary: "from-cyan-400 to-blue-500",
      accent: "from-emerald-400 to-emerald-500",
      bg: "from-black via-gray-950 to-black",
      textPrimary: "text-white",
      textSecondary: "text-gray-200",
      textAccent: "text-teal-300",
      borderAccent: "border-teal-400/40",
      hoverBorder: "hover:border-teal-400/70",
      navActive: "bg-gradient-to-br from-teal-400 to-cyan-500",
      bgSolid: "bg-gray-950",
      cardBg: "bg-gray-900/60",
      cardBorder: "border-teal-500/30",
    },
  },
  "Light Themes": {
    "Minimal Mono": {
      name: "Minimal Mono",
      primary: "from-gray-700 to-gray-800",
      secondary: "from-gray-600 to-gray-700",
      accent: "from-gray-500 to-gray-600",
      bg: "from-white via-gray-50 to-white",
      textPrimary: "text-gray-900",
      textSecondary: "text-gray-600",
      textAccent: "text-gray-800",
      borderAccent: "border-gray-400",
      hoverBorder: "hover:border-gray-500",
      navActive: "bg-gradient-to-br from-gray-700 to-gray-800",
      bgSolid: "bg-white",
      cardBg: "bg-gray-100",
      cardBorder: "border-gray-300",
    },
    "Lavender Mist": {
      name: "Lavender Mist",
      primary: "from-purple-600 to-purple-700",
      secondary: "from-purple-500 to-purple-600",
      accent: "from-violet-500 to-violet-600",
      bg: "from-[#FBF8FF] via-[#F5F0FF] to-[#FBF8FF]",
      textPrimary: "text-gray-900",
      textSecondary: "text-gray-700",
      textAccent: "text-purple-700",
      borderAccent: "border-purple-300",
      hoverBorder: "hover:border-purple-400",
      navActive: "bg-gradient-to-br from-purple-600 to-purple-700",
      bgSolid: "bg-[#FBF8FF]",
      cardBg: "bg-purple-50",
      cardBorder: "border-purple-200",
    },
  },
};

export const themes: Record<string, Theme> = Object.values(themeCategories).reduce(
  (acc, category) => {
    return { ...acc, ...category };
  },
  {}
);

// Theme helper functions for Vynce Social integration
export function getThemeClasses(themeName: string): any {
  const allThemes = {
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
  return allThemes[themeName as keyof typeof allThemes] || allThemes["Vynce Nebula"];
}

export function getAllThemesArray(): any[] {
  return Object.values(themes);
}

export function getThemeByName(name: string): Theme | undefined {
  return themes[name];
}
