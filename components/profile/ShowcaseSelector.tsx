"use client";

import { api } from "@/lib/api";
import { useEffect, useState } from "react";

export default function ShowcaseSelector({ type, onClose, onSelect }: { type: string; onClose: () => void; onSelect: (item: any) => void }) {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const res = await api.get(type === "inventory" ? "/store/inventory" : "/achievements");

      if (type === "inventory") setItems(res.data.inventory || []);
      if (type === "achievements") setItems(res.data || []);
      if (type === "dares") setItems([]); // dares coming later
    };

    load();
  }, [type]);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50">
      <div className="w-80 bg-[#0E0E12] rounded-2xl p-5 border border-white/10">
        <h2 className="text-lg font-semibold mb-4">Select {type}</h2>

        <div className="space-y-3 max-h-80 overflow-y-auto">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10"
              onClick={() => onSelect(item)}
            >
              <p className="font-semibold">{item.name || item.title}</p>
            </div>
          ))}
        </div>

        <button className="mt-4 w-full py-2 rounded-xl bg-red-600 text-white" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}
