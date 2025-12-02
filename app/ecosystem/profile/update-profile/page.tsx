"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useTheme } from "@/hooks/useTheme";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function UpdateProfilePage() {
  const router = useRouter();
  const { theme } = useTheme();

  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Load user
  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/auth/me");
        setDisplayName(res.data.displayName || "");
        setUsername(res.data.username || "");
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Submit update
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      await api.patch("/users/update-profile", {
        displayName,
        username,
      });

      setSuccess("Profile updated successfully.");

      setTimeout(() => {
        router.push("/ecosystem/profile");
      }, 1000);
    } catch (err: any) {
      console.log(err);
      setError(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setSaving(false);
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
        Update Profile
      </h1>
      <p className={`text-sm mb-6 ${theme.textSecondary}`}>
        Edit your Vynce identity.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Display Name */}
        <div className="space-y-2">
          <Label className={theme.textSecondary}>Display Name</Label>
          <Input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Enter display name"
            required
          />
        </div>

        {/* Username */}
        <div className="space-y-2">
          <Label className={theme.textSecondary}>Username</Label>
          <Input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
            required
          />
        </div>

        {/* Errors / Success */}
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-emerald-400 text-sm">{success}</p>}

        <Button className="w-full" disabled={saving} type="submit">
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </div>
  );
}
