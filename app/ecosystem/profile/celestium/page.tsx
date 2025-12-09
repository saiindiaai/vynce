"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
type Transaction = {
  type: "earned" | "spent" | string; // expandable
  amount: number;
  message?: string;
  date?: string;
};

export default function CelestiumPage() {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await api.get("/users/celestium");

        setBalance(res.data.celestium || 0);
        setTransactions(res.data.celestiumTransactions || []);
      } catch (err) {
        console.log("Celestium fetch error:", err);
      }
      setLoading(false);
    };

    loadData();
  }, []);

  const filteredList =
    filter === "all" ? transactions : transactions.filter((t) => t.type === filter);

  return (
    <div className="px-5 py-6 pb-28 matte-bg min-h-screen">
      {/* PAGE HEADER */}
      <h1 className="text-2xl font-bold text-white mb-2">Celestium</h1>
      <p className="text-gray-400 text-sm mb-6">Your premium cosmic currency</p>

      {/* BALANCE CARD */}
      <div className="card-matte rounded-2xl p-5 border border-gray-400/20 mb-6">
        <h2 className="text-lg font-semibold text-white mb-1">Balance</h2>
        <p className="text-3xl font-bold text-white">{balance} C</p>

        <p className="text-gray-500 text-xs mt-2">
          Used for upgrades, purchases & marketplace features
        </p>
      </div>

      {/* FILTER TABS */}
      <div className="flex gap-3 mb-5 overflow-x-auto no-scrollbar">
        {["all", "earned", "spent"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`
              px-4 py-2 rounded-full text-sm font-semibold transition
              ${
                filter === f
                  ? "bg-white text-black"
                  : "bg-white/5 text-gray-300 border border-white/10"
              }
            `}
          >
            {f === "all" && "All"}
            {f === "earned" && "Earned"}
            {f === "spent" && "Spent"}
          </button>
        ))}
      </div>

      {/* TRANSACTION LIST */}
      <div className="space-y-3">
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : filteredList.length === 0 ? (
          <p className="text-gray-500 text-sm">No transactions here yet.</p>
        ) : (
          filteredList.map((t, index) => (
            <div
              key={index}
              className="card-matte rounded-xl p-4 border border-white/10 flex justify-between items-center"
            >
              <div>
                <p className="text-white font-semibold text-sm">{t.note}</p>
                <p className="text-gray-500 text-xs">{new Date(t.date).toLocaleDateString()}</p>
              </div>

              <span
                className={`text-lg font-bold ${
                  t.type === "earned" ? "text-green-400" : "text-red-400"
                }`}
              >
                {t.type === "earned" ? "+" : "-"} {t.amount}C
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
