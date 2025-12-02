"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useTheme } from "@/hooks/useTheme";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function GlobalBioPage() {
  const { theme } = useTheme();

  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // Load existing bio
  useEffect(() => {
    const loadBio = async () => {
      try {
        const res = await api.get("/auth/me"); // same endpoint, bio included
        setBio(res.data.bio || "");
      } catch (err) {
        console.log("Failed to load bio");
      } finally {
        setLoading(false);
      }
    };
    loadBio();
  }, []);

  const handleSave = async (e: any) => {
    e.preventDefault();
    setSaving(true);

    try {
      await api.patch("/users/bio", { bio });
      setMessage("Saved successfully ✓");
    } catch (err) {
      setMessage("Failed to save bio");
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(""), 2000);
    }
  };

  if (loading) {
    return (
      <div className="px-6 pb-28 pt-4 text-gray-300">Loading...</div>
    );
  }

  return (
    <div className="px-6 pb-28 pt-4">
      <h1 className={`text-2xl font-bold mb-2 ${theme.textPrimary}`}>
        Your Global Bio
      </h1>

      <p className={`text-sm mb-6 ${theme.textSecondary}`}>
        This appears across the Vynce ecosystem.
      </p>

      <form onSubmit={handleSave} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <textarea
            id="bio"
            rows={4}
            className="w-full rounded-md bg-black/40 border border-white/10 px-3 py-2 text-sm outline-none focus:border-white/30"
            placeholder="Write something about yourself..."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
        </div>

        {message && (
          <p className="text-sm text-green-400">{message}</p>
        )}

        <Button type="submit" className="w-full" disabled={saving}>
          {saving ? "Saving..." : "Save Bio"}
        </Button>
      </form>
    </div>
  );
}
