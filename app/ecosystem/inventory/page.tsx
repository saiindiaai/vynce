"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useTheme } from "@/hooks/useTheme";

export default function InventoryPage() {
  const { theme } = useTheme();

  const [inventory, setInventory] = useState<any[]>([]);
  const [energy, setEnergy] = useState(0);
  const [celestium, setCelestium] = useState(0);
  const [xp, setXP] = useState(0);
  const [badges, setBadges] = useState([]);

  const loadData = async () => {
    try {
      // ❗ FIXED: correct endpoint
      const res = await api.get("/inventory");

      setInventory(res.data.inventory || []);
      setEnergy(res.data.energy || 0);
      setCelestium(res.data.celestium || 0);
      setXP(res.data.xp || 0);
      setBadges(res.data.badges || []);
    } catch (e) {
      console.log("Inventory error:", e);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="px-4 pb-28 pt-4">
      <h1 className={`text-2xl font-bold mb-4 ${theme.textPrimary}`}>Inventory</h1>

      <div className="space-y-6">
        {/* Balance */}
        <div className="card-matte p-4 rounded-2xl border border-white/10">
          <p>⚡ Energy: {energy}</p>
          <p>💠 Celestium: {celestium}</p>
          <p>⭐ XP: {xp}</p>
        </div>

        {/* Items */}
        <div className="space-y-3">
          {inventory.map((item) => (
            <div
              key={item.key + item.acquiredAt}
              className="card-matte p-4 rounded-2xl border border-white/10"
            >
              <p className="font-semibold">{item.name}</p>
              <p className="text-gray-400 text-sm">{item.permanent ? "Permanent" : "Temporary"}</p>

              {!item.permanent && item.expiresAt && (
                <p className="text-xs text-gray-500 mt-1">
                  Expires: {new Date(item.expiresAt).toLocaleString()}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Badges */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Badges</h2>
          <div className="flex gap-3 flex-wrap">
            {badges.map((b) => (
              <span
                key={b}
                className="px-3 py-1 rounded-xl bg-purple-700/40 border border-purple-500 text-sm"
              >
                {b}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
