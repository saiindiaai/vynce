"use client";

import { useState } from "react";
import { useTheme } from "@/hooks/useTheme";
import { Search } from "lucide-react";
import { api } from "@/lib/api";
import Link from "next/link";

export default function EcosystemSearchPage() {
  const { theme } = useTheme();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);

    try {
      const res = await api.get(`/users/search?q=${query}`);
      setResults(res.data || []);
    } catch (err) {
      console.log("Search failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4 pb-28 pt-4">
      <h1 className={`text-2xl font-bold mb-4 ${theme.textPrimary}`}>Search</h1>

      {/* Search Input */}
      <div className="flex items-center gap-3 mb-6">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search users..."
          className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none"
        />
        <button onClick={handleSearch} className="p-3 rounded-xl bg-blue-600 hover:bg-blue-700">
          <Search className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Results */}
      {loading && <p className="text-gray-400 text-sm">Searching...</p>}

      {!loading && results.length === 0 && query.length > 0 && (
        <p className="text-gray-500 text-sm">No users found</p>
      )}

      {/* Search Results */}
      <div className="space-y-3">
        {results.map((user) => (
          <Link href={`/ecosystem/profile/${user.username}`} key={user._id}>
            <div className="p-4 rounded-2xl card-matte border border-white/10 hover:bg-white/10 transition cursor-pointer">
              <p className={`${theme.textPrimary} font-semibold`}>
                {user.displayName || user.username}
              </p>
              <p className={`${theme.textSecondary} text-sm`}>@{user.username}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
