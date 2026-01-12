"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTheme } from "@/hooks/useTheme";
import { api } from "@/lib/api";
import { useEffect, useState } from "react";

export default function AccountInfoPage() {
  const { theme } = useTheme();
  const [user, setUser] = useState<any>(null);
  const [displayName, setDisplayName] = useState("");
  const [message, setMessage] = useState("");
  const [isPrivateAccount, setIsPrivateAccount] = useState(false);

  // Load user data
  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/users/me");
        setUser(res.data);
        setDisplayName(res.data.displayName || "");
      } catch (err) {
        console.log("Failed to load user");
      }
    };
    load();
  }, []);

  // Update display name
  const updateDisplayName = async () => {
    try {
      await api.patch("/users/displayname", { displayName });
      setMessage("Display name updated!");
    } catch (err) {
      setMessage("Failed to update name");
    }
  };

  return (
    <div className="px-6 pb-28 pt-4">
      <h1 className={`text-2xl font-bold mb-2 ${theme.textPrimary}`}>Account Info</h1>

      <p className={`text-sm mb-6 ${theme.textSecondary}`}>
        Basic details about your Vynce account.
      </p>

      <div className="space-y-3">
        {/* DISPLAY NAME — editable */}
        <div className="card-matte rounded-2xl p-4 border border-white/10">
          <p className={`text-xs ${theme.textSecondary}`}>Display Name</p>

          <Input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="mt-1 bg-white/5 border border-white/10"
          />

          <Button className="mt-3 w-full" onClick={updateDisplayName}>
            Save Changes
          </Button>

          {message && <p className="text-center text-xs mt-2 text-green-400">{message}</p>}
        </div>

        {/* USERNAME */}
        <div className="card-matte rounded-2xl p-4 border border-white/10">
          <p className={`text-xs ${theme.textSecondary}`}>Username</p>
          <p className={`text-base font-semibold ${theme.textPrimary}`}>
            @{user?.username ?? "---"}
          </p>
        </div>

        {/* UID */}
        <div className="card-matte rounded-2xl p-4 border border-white/10">
          <p className={`text-xs ${theme.textSecondary}`}>UID</p>
          <p className={`text-base font-semibold ${theme.textPrimary}`}>{user?.uid ?? "---"}</p>
        </div>

        {/* ACCOUNT TYPE */}
        <div className="card-matte rounded-2xl p-4 border border-white/10">
          <p className={`text-xs ${theme.textSecondary}`}>Account Type</p>
          <p className={`text-base font-semibold ${theme.textPrimary}`}>
            {user?.accountType ?? "standard"}
          </p>
        </div>

        {/* ACCOUNT PRIVACY */}
        <div className="card-matte rounded-2xl p-4 border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <p className={`text-xs font-semibold ${theme.textSecondary}`}>Account Privacy</p>
            <span className={`text-xs px-2 py-1 rounded-full ${isPrivateAccount ? 'bg-red-500/20 text-red-300' : 'bg-green-500/20 text-green-300'}`}>
              {isPrivateAccount ? 'Private Account' : 'Personal Account'}
            </span>
          </div>
          <p className={`text-sm mb-3 ${theme.textSecondary}`}>Control who can follow you</p>

          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className={`text-sm font-medium ${theme.textPrimary}`}>Private Account</p>
              <p className={`text-xs ${theme.textSecondary}`}>When enabled, only people you approve can follow you</p>
            </div>
            <button
              onClick={() => setIsPrivateAccount(!isPrivateAccount)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${isPrivateAccount ? 'bg-red-600' : 'bg-gray-600'
                }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isPrivateAccount ? 'translate-x-6' : 'translate-x-1'
                  }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
