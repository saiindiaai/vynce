"use client";

import { api } from "@/lib/api";
import { Bookmark, Camera, FileText, Heart, Plus, Sparkles, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("drops");
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({ inMyGang: 0, mutualGangs: 0 });
  const [drops, setDrops] = useState([]);
  const [moments, setMoments] = useState([]);
  const [boards, setBoards] = useState([]);

  const profileSections = [
    { id: "drops", label: "Your Drops", icon: FileText, count: drops.length },
    { id: "moments", label: "Moments", icon: Zap, count: moments.length },
    { id: "boards", label: "Boards", icon: Bookmark, count: boards.length },
    { id: "saved", label: "Saved", icon: Heart, count: 234 },
    { id: "aura", label: "Your Aura", icon: Sparkles, count: "12.4K" },
  ];

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const [userRes, statsRes, dropsRes, momentsRes] = await Promise.all([
          api.get("/users/me"),
          api.get("/users/stats"),
          api.get("/social/drops/user"),
          api.get("/social/posts/user"),
        ]);
        setUser(userRes.data.user);
        setStats(statsRes.data);
        setDrops(dropsRes.data);
        setMoments(momentsRes.data);
        // boards placeholder
      } catch (err) {
        console.error("Failed to fetch profile data", err);
      }
    };
    fetchProfileData();
  }, []);

  return (
    <div className="animate-fadeIn pb-20">
      {/* Cover Photo */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-r from-purple-600 to-blue-600">
        <button className="absolute top-4 right-4 p-2 rounded-lg bg-slate-900/60 hover:bg-slate-800 transition-colors text-slate-300">
          <Camera size={20} />
        </button>
      </div>

      <div className="px-4 -mt-16 pb-6">
        {/* Profile Picture */}
        <div className="relative inline-block mb-4 animate-scaleIn">
          <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 ring-4 ring-slate-900 shadow-md" />
          <button className="absolute bottom-0 right-0 p-2 rounded-lg bg-blue-600 border-4 border-slate-900 hover:scale-110 transition-transform text-white">
            <Plus size={18} />
          </button>
        </div>

        {/* Profile Info */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-2xl font-bold text-slate-50">{user?.displayName || "Your Profile"}</h2>
            <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-xs text-white">
              ✓
            </div>
          </div>
          <p className="text-slate-400 mb-3">@{user?.username}</p>
          <p className="text-slate-200 text-sm leading-relaxed">
            {user?.bio || "No bio yet"}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="clean-card p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-yellow-500" />
              <span className="text-xs text-slate-400">In My Gang</span>
            </div>
            <div className="text-2xl font-bold text-slate-50">{stats.inMyGang}</div>
          </div>
          <div className="clean-card p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-purple-500" />
              <span className="text-xs text-slate-400">Mutual Gangs</span>
            </div>
            <div className="text-2xl font-bold text-slate-50">{stats.mutualGangs}</div>
          </div>
        </div>

        {/* Edit Profile Button */}
        <button 
          onClick={() => router.push('/ecosystem/profile/account')}
          className="w-full py-3 rounded-lg font-semibold text-slate-50 mb-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-md"
        >
          Edit Profile
        </button>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide pb-2">
          {profileSections.map((section, idx) => (
            <button
              key={section.id}
              onClick={() => setActiveTab(section.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 animate-slideIn ${
                activeTab === section.id
                  ? "bg-slate-800 text-slate-50"
                  : "bg-slate-800/50 text-slate-300 hover:bg-slate-800/70"
              }`}
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <span className="flex items-center gap-2">
                <section.icon size={16} />
                {section.label}
              </span>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="clean-card p-6 min-h-[400px] flex flex-col items-center justify-center">
          {activeTab === "drops" && (
            <div className="text-center animate-fadeIn w-full">
              <FileText size={64} className="text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-50 mb-2">Your Drops</h3>
              {drops.length > 0 ? (
                <div className="space-y-4">
                  {drops.map((drop: any) => (
                    <div key={drop._id} className="clean-card p-4 text-left">
                      <p className="text-slate-200">{drop.content}</p>
                      <p className="text-slate-400 text-sm mt-2">
                        {new Date(drop.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-400 mb-6">No drops yet...</p>
              )}
            </div>
          )}

          {activeTab === "moments" && (
            <div className="text-center animate-fadeIn">
              <Zap size={64} className="text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-50 mb-2">Moments</h3>
              {moments.length > 0 ? (
                <div className="space-y-4">
                  {moments.map((moment: any) => (
                    <div key={moment._id} className="clean-card p-4 text-left">
                      <p className="text-slate-200">{moment.content}</p>
                      <p className="text-slate-400 text-sm mt-2">
                        {new Date(moment.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-400">No moments yet</p>
              )}
            </div>
          )}

          {activeTab === "boards" && (
            <div className="text-center animate-fadeIn">
              <Bookmark size={64} className="text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-50 mb-2">Boards</h3>
              <p className="text-slate-400">Organize your favorite content</p>
            </div>
          )}

          {activeTab === "saved" && (
            <div className="text-center animate-fadeIn">
              <Heart size={64} className="text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-50 mb-2">Saved</h3>
              <p className="text-slate-400">Your saved drops and moments</p>
            </div>
          )}

          {activeTab === "aura" && (
            <div className="text-center animate-fadeIn w-full">
              <div className="w-32 h-32 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 mx-auto mb-4 flex items-center justify-center">
                <Sparkles size={64} className="text-white" />
              </div>
              <h3 className="text-3xl font-bold text-slate-50 mb-2">12,456</h3>
              <p className="text-slate-400 mb-6">Total Aura Earned</p>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">This Week</span>
                  <span className="font-bold text-slate-50">+234</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">This Month</span>
                  <span className="font-bold text-slate-50">+1,456</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">All Time Rank</span>
                  <span className="font-bold text-purple-400">#127</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
