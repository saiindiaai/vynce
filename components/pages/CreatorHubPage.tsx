"use client";

import { useAppStore } from "@/lib/store";
import { useEffect, useState } from "react";
import { ContentManager } from "./creator/ContentManager";
import { ContentType, CreatorPost, LOCAL_KEY } from "./creator/CreatorConstants";
import { CreatorForm } from "./creator/CreatorForm";
import { CreatorStats } from "./creator/CreatorStats";

export default function CreatorHubPage() {
  const { showToast } = useAppStore();

  // Form state
  const [contentType, setContentType] = useState<ContentType>("drop");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<"image" | "video" | null>(null);
  const [visibility, setVisibility] = useState<"public" | "private" | "draft">("public");
  const [scheduledAt, setScheduledAt] = useState<string>("");
  const [isPublishing, setIsPublishing] = useState(false);
  const [opponent, setOpponent] = useState("");
  const [fightType, setFightType] = useState<"visual" | "text">("visual");

  const [posts, setPosts] = useState<CreatorPost[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LOCAL_KEY);
      if (raw) setPosts(JSON.parse(raw));
    } catch (err) {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_KEY, JSON.stringify(posts));
    } catch (err) {
      // ignore
    }
  }, [posts]);

  const handlePublish = (post: CreatorPost) => {
    // quick local persist
    setPosts((p) => [post, ...p]);
  };

  const handleClearForm = () => {
    // Additional cleanup if needed
  };

  const removePost = (id: string) => {
    setPosts((p) => p.filter((x) => x.id !== id));
    showToast?.("Post removed", "info");
  };

  const tools = [
    {
      title: "Analytics Dashboard",
      description: "Track your content performance and audience insights",
      cta: "View Analytics",
    },
    {
      title: "Content Planner",
      description: "Plan and schedule your posts in advance",
      cta: "Plan Content",
    },
    {
      title: "Growth Tools",
      description: "Discover new ways to grow your audience",
      cta: "Explore Tools",
    },
    {
      title: "Creator Fund",
      description: "Earn money from your engaging content",
      cta: "Learn More",
    },
  ];

  return (
    <div className="animate-fadeIn pb-24 sm:pb-0 w-full">
      {/* Header */}
      <div className="px-4 sm:px-6 py-6 border-b border-slate-700/50 bg-slate-900">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-50 mb-2">Creator Hub</h1>
        <p className="text-sm sm:text-base text-slate-400">
          Grow your audience and publish content from here
        </p>
      </div>

      <div className="max-w-6xl mx-auto w-full px-3 sm:px-6 py-6 space-y-6">
        {/* Top Stats */}
        <CreatorStats />

        {/* Creator Form + Posts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <CreatorForm
              contentType={contentType}
              setContentType={setContentType}
              title={title}
              setTitle={setTitle}
              description={description}
              setDescription={setDescription}
              tags={tags}
              setTags={setTags}
              mediaPreview={mediaPreview}
              setMediaPreview={setMediaPreview}
              mediaType={mediaType}
              setMediaType={setMediaType}
              visibility={visibility}
              setVisibility={setVisibility}
              scheduledAt={scheduledAt}
              setScheduledAt={setScheduledAt}
              isPublishing={isPublishing}
              setIsPublishing={setIsPublishing}
              opponent={opponent}
              setOpponent={setOpponent}
              fightType={fightType}
              setFightType={setFightType}
              onPublish={handlePublish}
              onClearForm={handleClearForm}
              showToast={showToast}
            />

            <ContentManager
              posts={posts}
              onRemovePost={removePost}
            />
          </div>

          <div className="space-y-4">
            <div className="clean-card p-4">
              <h3 className="text-lg font-bold text-slate-50 mb-3">Content Guide</h3>
              <div className="space-y-3 text-sm">
                <div className="p-2.5 bg-blue-600/10 border border-blue-600/30 rounded">
                  <div className="font-semibold text-blue-300 mb-1">📄 Drops</div>
                  <p className="text-xs text-slate-300">
                    Long-form posts with images. Perfect for breaking news, tutorials, and insights.
                    Can include multiple images.
                  </p>
                </div>
                <div className="p-2.5 bg-purple-600/10 border border-purple-600/30 rounded">
                  <div className="font-semibold text-purple-300 mb-1">📹 Capsules</div>
                  <p className="text-xs text-slate-300">
                    Short vertical videos or stories. Great for behind-the-scenes content, quick
                    tips, and daily moments.
                  </p>
                </div>
                <div className="p-2.5 bg-red-600/10 border border-red-600/30 rounded">
                  <div className="font-semibold text-red-300 mb-1">⚡ Fights</div>
                  <p className="text-xs text-slate-300">
                    Challenges & debates with opponents. Choose Visual (stream-style) or Text
                    (debate-style) formats.
                  </p>
                </div>
              </div>
            </div>

            <div className="clean-card p-4">
              <h3 className="text-lg font-bold text-slate-50 mb-3">Creator Tools</h3>
              <div className="space-y-2">
                <button className="w-full text-left p-2 border border-slate-700/50 rounded hover:bg-slate-800/50 transition-colors">
                  <div className="text-sm font-semibold text-slate-50">📊 Analytics Dashboard</div>
                  <p className="text-xs text-slate-400 mt-1">
                    Track your content performance and audience insights
                  </p>
                </button>
                <button className="w-full text-left p-2 border border-slate-700/50 rounded hover:bg-slate-800/50 transition-colors">
                  <div className="text-sm font-semibold text-slate-50">📅 Content Planner</div>
                  <p className="text-xs text-slate-400 mt-1">
                    Plan and schedule your posts in advance
                  </p>
                </button>
                <button className="w-full text-left p-2 border border-slate-700/50 rounded hover:bg-slate-800/50 transition-colors">
                  <div className="text-sm font-semibold text-slate-50">🚀 Growth Tools</div>
                  <p className="text-xs text-slate-400 mt-1">Discover ways to grow your audience</p>
                </button>
                <button className="w-full text-left p-2 border border-slate-700/50 rounded hover:bg-slate-800/50 transition-colors">
                  <div className="text-sm font-semibold text-slate-50">💰 Creator Fund</div>
                  <p className="text-xs text-slate-400 mt-1">
                    Earn money from your engaging content
                  </p>
                </button>
              </div>
            </div>

            <div className="clean-card p-4 bg-gradient-to-br from-purple-600/10 to-blue-600/10 border border-purple-600/30">
              <h4 className="text-sm font-bold text-slate-50 mb-2">💡 Pro Tip</h4>
              <p className="text-xs text-slate-300">
                Content is stored locally and synced to parent ecosystem if embedded. Use scheduling
                to post when your audience is most active!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
