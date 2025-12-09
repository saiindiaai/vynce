"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useTheme } from "@/hooks/useTheme";

export default function AchievementPage() {
  const { theme } = useTheme();

  const [catalog, setCatalog] = useState<any[]>([]);
  const [badges, setBadges] = useState<string[]>([]);

  const loadData = async () => {
    const a = await api.get("/achievements");
    const me = await api.get("/users/me");

    setCatalog(a.data);
    setBadges(me.data.badges || []);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="px-4 pb-28 pt-4">
      <h1 className={`text-2xl font-bold mb-4 ${theme.textPrimary}`}>Achievements</h1>

      <div className="space-y-4">
        {catalog.map((a) => {
          const unlocked = badges.includes(a.rewardBadge);

          return (
            <div
              key={a.key}
              className={`
                card-matte p-4 rounded-2xl border
                ${unlocked ? "border-green-400/30" : "border-white/10"}
              `}
            >
              <h3 className="font-semibold">{a.title}</h3>
              <p className="text-gray-400 text-sm">{a.description}</p>

              <p className="text-sm mt-2">
                Reward:
                {a.rewardXP > 0 && ` ⭐ ${a.rewardXP} XP`}
                {a.rewardEnergy > 0 && ` • ⚡ ${a.rewardEnergy} Energy`}
                {a.rewardCelestium > 0 && ` • 💠 ${a.rewardCelestium} Celestium`}
              </p>

              {unlocked && <p className="text-green-400 text-xs mt-2">Unlocked</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
