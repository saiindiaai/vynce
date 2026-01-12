"use client";

import { useTheme } from "@/hooks/useTheme";
import { api } from "@/lib/api";
import { useEffect, useState } from "react";

export default function PrivacyPage() {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [privacy, setPrivacy] = useState({
    visibility: "public",
    searchable: true,
    showActivity: true,
    showLastSeen: false,
    dataConsent: true,
  });

  useEffect(() => {
    const loadPrivacy = async () => {
      try {
        const res = await api.get("/users/me");
        if (res.data.privacy) {
          setPrivacy(res.data.privacy);
        }
      } catch (err) {
        console.log("Failed to load privacy settings", err);
      } finally {
        setLoading(false);
      }
    };
    loadPrivacy();
  }, []);

  const savePrivacy = async (updates: Partial<typeof privacy>) => {
    setSaving(true);
    try {
      const newPrivacy = { ...privacy, ...updates };
      await api.patch("/users/privacy", newPrivacy);
      setPrivacy(newPrivacy);
    } catch (err) {
      console.log("Failed to save privacy settings", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="px-6 pb-28 pt-4">
        <div className="text-gray-400">Loading privacy settings...</div>
      </div>
    );
  }

  return (
    <div className="px-6 pb-28 pt-4">
      <h1 className={`text-2xl font-bold mb-2 ${theme.textPrimary}`}>Privacy</h1>
      <p className={`text-sm mb-6 ${theme.textSecondary}`}>
        Control who can see you and how your data is used.
      </p>

      <div className="space-y-4">
        <div className={`card-matte rounded-2xl p-4 border ${theme.cardBorder}`}>
          <p className={`text-xs ${theme.textSecondary}`}>Profile visibility</p>
          <select
            value={privacy.visibility}
            onChange={(e) => savePrivacy({ visibility: e.target.value as any })}
            disabled={saving}
            className={`w-full mt-2 p-2 rounded-lg bg-slate-800 border border-slate-600 text-white ${theme.textPrimary}`}
          >
            <option value="public">Public</option>
            <option value="friends">Friends-only</option>
            <option value="private">Private</option>
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Control who can view your profile and posts.
          </p>
        </div>

        <div className={`card-matte rounded-2xl p-4 border ${theme.cardBorder}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-semibold ${theme.textPrimary}`}>Search visibility</p>
              <p className="text-xs text-gray-500 mt-1">
                Allow others to find you via search and suggestions.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={privacy.searchable}
                onChange={(e) => savePrivacy({ searchable: e.target.checked })}
                disabled={saving}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>

        <div className={`card-matte rounded-2xl p-4 border ${theme.cardBorder}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-semibold ${theme.textPrimary}`}>Show activity status</p>
              <p className="text-xs text-gray-500 mt-1">
                Let others see when you're online.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={privacy.showActivity}
                onChange={(e) => savePrivacy({ showActivity: e.target.checked })}
                disabled={saving}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>

        <div className={`card-matte rounded-2xl p-4 border ${theme.cardBorder}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-semibold ${theme.textPrimary}`}>Show last seen</p>
              <p className="text-xs text-gray-500 mt-1">
                Display when you were last active.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={privacy.showLastSeen}
                onChange={(e) => savePrivacy({ showLastSeen: e.target.checked })}
                disabled={saving}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>

        <div className={`card-matte rounded-2xl p-4 border ${theme.cardBorder}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-semibold ${theme.textPrimary}`}>Data consent</p>
              <p className="text-xs text-gray-500 mt-1">
                Allow data collection for analytics and improvements.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={privacy.dataConsent}
                onChange={(e) => savePrivacy({ dataConsent: e.target.checked })}
                disabled={saving}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
