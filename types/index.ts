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

export type TabType = 'home' | 'profile' | 'settings' | 'themes';
