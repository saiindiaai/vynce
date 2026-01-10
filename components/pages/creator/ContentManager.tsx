import { FileText, Flame, Video } from 'lucide-react';
import React from 'react';
import { CreatorPost } from './CreatorConstants';

interface ContentManagerProps {
  posts: CreatorPost[];
  onRemovePost: (id: string) => void;
}

export const ContentManager: React.FC<ContentManagerProps> = ({
  posts,
  onRemovePost,
}) => {
  return (
    <div className="clean-card p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-bold text-slate-50">Your Content</h3>
        {posts.length > 0 && (
          <span className="text-xs text-slate-500">
            {posts.filter((p) => p.contentType === "drop").length} Drops •
            {posts.filter((p) => p.contentType === "capsule").length} Capsules •
            {posts.filter((p) => p.contentType === "fight").length} Fights
          </span>
        )}
      </div>
      <div className="space-y-3">
        {posts.length === 0 && (
          <div className="text-sm text-slate-400">You haven't published anything yet.</div>
        )}
        {posts.map((p) => (
          <div
            key={p._id}
            className="border border-slate-700 rounded-lg p-3 bg-slate-900/40 hover:bg-slate-900/60 transition-colors"
          >
            <div className="flex items-start gap-3">
              {/* Content Type Badge + Media */}
              <div className="flex-shrink-0 flex flex-col gap-2">
                <div
                  className={`w-20 h-20 rounded-lg flex items-center justify-center text-2xl font-bold ${p.contentType === "drop"
                    ? "bg-blue-600/20 text-blue-400"
                    : p.contentType === "capsule"
                      ? "bg-purple-600/20 text-purple-400"
                      : "bg-red-600/20 text-red-400"
                    }`}
                >
                  {p.contentType === "drop" && <FileText size={24} />}
                  {p.contentType === "capsule" && <Video size={24} />}
                  {p.contentType === "fight" && <Flame size={24} />}
                </div>
                {p.media?.type === "image" && (
                  <img
                    src={p.media.url}
                    className="w-20 h-20 object-cover rounded"
                    alt="media"
                  />
                )}
                {p.media?.type === "video" && (
                  <video src={p.media.url} className="w-20 h-20 object-cover rounded" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <div className="font-semibold text-slate-50 truncate">{p.title}</div>
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded ${p.contentType === "drop"
                        ? "bg-blue-600/30 text-blue-300"
                        : p.contentType === "capsule"
                          ? "bg-purple-600/30 text-purple-300"
                          : "bg-red-600/30 text-red-300"
                        }`}
                    >
                      {p.contentType === "fight" && p.opponent
                        ? `vs ${p.opponent}`
                        : p.contentType}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 flex-shrink-0">
                    {new Date(p.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="text-sm text-slate-300 line-clamp-2 mb-1">
                  {p.description}
                </div>
                {p.tags.length > 0 && (
                  <div className="text-xs text-slate-400 mb-2">#{p.tags.join(" #")}</div>
                )}
                {p.fightType && (
                  <div className="text-xs text-slate-400 mb-2">
                    Fight Type: {p.fightType === "visual" ? "🎥 Visual" : "💬 Text Debate"}
                  </div>
                )}
                <div className="flex gap-2 flex-wrap">
                  <span
                    className={`text-xs px-2 py-1 rounded ${p.visibility === "public"
                      ? "bg-green-600/30 text-green-300"
                      : p.visibility === "private"
                        ? "bg-slate-600/30 text-slate-300"
                        : p.visibility === "draft"
                          ? "bg-yellow-600/30 text-yellow-300"
                          : "bg-blue-600/30 text-blue-300"
                      }`}
                  >
                    {p.visibility === "public" && "🌍 Public"}
                    {p.visibility === "private" && "🔒 Private"}
                    {p.visibility === "draft" && "📝 Draft"}
                    {p.visibility === "scheduled" && "📅 Scheduled"}
                  </span>
                  <button
                    onClick={() => navigator.clipboard?.writeText(JSON.stringify(p))}
                    className="text-xs text-purple-400 hover:text-purple-300"
                  >
                    Copy JSON
                  </button>
                  <button
                    onClick={() => onRemovePost(p._id)}
                    className="text-xs text-red-400 hover:text-red-300"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};