import { CREATOR_STATS } from "./CreatorConstants";

export function CreatorStats() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {CREATOR_STATS.map((stat, idx) => {
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