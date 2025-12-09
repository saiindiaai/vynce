"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useTheme } from "@/hooks/useTheme";

export default function StorePage() {
  const { theme } = useTheme();

  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadCatalog = async () => {
    try {
      const res = await api.get("/store");
      setItems(res.data);
    } catch (e) {
      console.log("Store load error", e);
    } finally {
      setLoading(false);
    }
  };

  const buy = async (key: string, method: "energy" | "celestium") => {
    const ok = confirm(
      `Purchase ${key} using ${method}? ${
        method === "energy" ? "(Temporary 48h)" : "(Permanent Unlock)"
      }`
    );
    if (!ok) return;

    try {
      const res = await api.post("/store/purchase", { key, method });
      alert("Purchase successful!");
    } catch (e: any) {
      alert(e?.response?.data?.message || "Purchase failed");
    }
  };

  useEffect(() => {
    loadCatalog();
  }, []);

  if (loading) return <p className="px-4 pt-4">Loading Store...</p>;

  return (
    <div className="px-4 pb-28 pt-4">
      <h1 className={`text-2xl font-bold mb-4 ${theme.textPrimary}`}>Vynce Store</h1>
      <p className={`text-sm mb-6 ${theme.textSecondary}`}>
        Buy permanent and temporary cosmetic upgrades.
      </p>

      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.key}
            className="card-matte p-4 rounded-2xl border border-white/10 space-y-2"
          >
            <h3 className="text-lg font-semibold">{item.name}</h3>
            <p className="text-gray-400 text-sm">{item.type.toUpperCase()}</p>

            <div className="flex gap-3 mt-3">
              {item.priceEnergy > 0 && (
                <button
                  onClick={() => buy(item.key, "energy")}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-sm"
                >
                  ⚡ {item.priceEnergy} Energy (48h)
                </button>
              )}

              {item.priceCelestium > 0 && (
                <button
                  onClick={() => buy(item.key, "celestium")}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-sm"
                >
                  💠 {item.priceCelestium} Celestium (Permanent)
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
