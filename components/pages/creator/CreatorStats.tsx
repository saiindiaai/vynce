import { api } from "@/lib/api";
import { BarChart3, TrendingUp, Users, Zap } from "lucide-react";
import { useEffect, useState } from "react";

interface CreatorStatsData {
  totalPosts: number;
  totalViews: number;
  totalLikes: number;
  totalShares: number;
  followers: number;
  following: number;
}

export function CreatorStats() {
  const [stats, setStats] = useState<CreatorStatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get("/creator/stats");
      setStats(response.data);
    } catch (error) {
      console.error("Failed to fetch creator stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const statItems = [
    {
      label: "Total Followers",
      value: stats ? stats.followers.toString() : "0",
      change: "+0 this week",
      icon: Users
    },
    {
      label: "Total Aura",
      value: stats ? stats.totalLikes.toString() : "0",
      change: "+0 this week",
      icon: Zap
    },
    {
      label: "Engagement Rate",
      value: stats && stats.totalViews > 0 ? `${((stats.totalLikes / stats.totalViews) * 100).toFixed(1)}%` : "0%",
      change: "+0% this week",
      icon: TrendingUp
    },
    {
      label: "Total Views",
      value: stats ? stats.totalViews.toString() : "0",
      change: "+0 this week",
      icon: BarChart3
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div key={idx} className="clean-card p-4 space-y-2 animate-pulse">
            <div className="h-4 bg-slate-700 rounded"></div>
            <div className="h-8 bg-slate-700 rounded"></div>
            <div className="h-3 bg-slate-700 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {statItems.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div key={idx} className="clean-card p-4 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs sm:text-sm font-semibold text-slate-400">{stat.label}</h3>
              <Icon size={16} className="text-purple-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-50">{stat.value}</div>
            <p className="text-xs text-slate-500">{stat.change}</p>
          </div>
        );
      })}
    </div>
  );
}