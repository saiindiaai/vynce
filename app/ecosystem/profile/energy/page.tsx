"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useTheme } from "@/hooks/useTheme";
import { ArrowLeft, Zap } from "lucide-react";
import Link from "next/link";

export default function EnergyPage() {
  const { theme } = useTheme();
  const [energy, setEnergy] = useState<number | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEnergy = async () => {
      try {
        const res = await api.get("/users/energy");
        setEnergy(res.data.energy);
        setHistory(res.data.energyHistory || []);
      } catch (err) {
        console.log("Energy fetch failed", err);
      } finally {
        setLoading(false);
      }
    };

    loadEnergy();
  }, []);

  if (loading) {
    return (
      <div className="text-white flex items-center justify-center min-h-screen">
        Loading Energy...
      </div>
    );
  }

  return (
    <div className="px-5 pb-20">

      {/* HEADER */}
      <div className="flex items-center gap-3 py-4">
        <Link href="/ecosystem/profile">
          <ArrowLeft className="w-6 h-6 text-white" />
        </Link>
        <h1 className="text-xl font-bold text-white">Vynce Energy</h1>
      </div>

      {/* ENERGY CARD */}
      <div className="bg-gradient-to-br from-yellow-500 to-orange-500 p-[2px] rounded-3xl mb-8">
        <div className="card-matte p-6 rounded-3xl flex flex-col items-center">
          <Zap className="w-12 h-12 text-yellow-400 mb-3" />
          <h2 className="text-4xl font-bold text-white">{energy}</h2>
          <p className="text-sm text-gray-300">Total Energy Points</p>
        </div>
      </div>

      {/* HISTORY TITLE */}
      <h2 className={`text-lg font-semibold mb-3 ${theme.textPrimary}`}>
        Transaction History
      </h2>

      {/* ENERGY HISTORY LIST */}
      <div className="space-y-3">
        {history.length === 0 && (
          <p className="text-gray-400 text-sm">No energy logs yet.</p>
        )}

        {history.map((item, idx) => (
          <div
            key={idx}
            className="card-matte p-4 rounded-2xl border border-white/10 flex justify-between"
          >
            <div>
              <p className="font-medium text-white">
                {item.amount > 0 ? `+${item.amount}` : item.amount} Energy
              </p>
              <p className="text-xs text-gray-400">{item.reason}</p>
            </div>
            <span className="text-xs text-gray-400">
              {new Date(item.date).toLocaleDateString()}
            </span>
          </div>
        ))}
      </div>

    </div>
  );
}
