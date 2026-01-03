// Official House Rank mapping for Vynce
// Do not modify these names or letters without product approval

export const HOUSE_RANKS = {
  SSS: "Supreme Strategic Syndicate",
  SS: "Superior Syndicate",
  S: "Strategic Syndicate",
  A: "Advanced Alliance",
  B: "Balanced Brotherhood",
  C: "Core Collective",
  D: "Developing Division",
} as const;

export type HouseRankLetter = keyof typeof HOUSE_RANKS;

export function getHouseRankFullForm(rank: string | undefined): string | undefined {
  if (!rank) return undefined;
  return HOUSE_RANKS[rank as HouseRankLetter];
}
