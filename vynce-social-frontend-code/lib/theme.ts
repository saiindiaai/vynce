import { getAllThemes } from '@/config/themes';

export function getThemeClasses(themeName: string): any {
  const allThemes = getAllThemes();
  return allThemes[themeName] || allThemes['Vynce Nebula'];
}

export function getAllThemesArray(): any[] {
  const allThemes = getAllThemes();
  return Object.values(allThemes);
}

export function getThemeByName(name: string): any {
  const allThemes = getAllThemes();
  return allThemes[name];
}
