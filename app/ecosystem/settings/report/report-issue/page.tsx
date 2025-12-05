"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { useTheme } from "@/hooks/useTheme";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function ReportIssuePage() {
  const { theme } = useTheme();

  const [type, setType] = useState<"user" | "issue">("issue");
  const [reportedUsername, setReportedUsername] = useState("");
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const submit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const payload: any = { type, reason, message };
      if (type === "user") payload.reportedUsername = reportedUsername;

      const res = await api.post("/reports", payload);
      setSuccess("Report submitted — thank you. We will review it shortly.");
      setReportedUsername("");
      setReason("");
      setMessage("");
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || "Failed to submit report");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-6 pb-28 pt-4">
      <h1 className={`text-2xl font-bold mb-2 ${theme.textPrimary}`}>Report a Problem / User</h1>
      <p className={`text-sm mb-6 ${theme.textSecondary}`}>
        Choose whether you're reporting an app issue or a user. Provide details so our moderators can act fast.
      </p>

      <form onSubmit={submit} className="space-y-4">
        <div className={`card-matte rounded-2xl p-4 border ${theme.cardBorder}`}>
          <Label>Report Type</Label>
          <div className="flex gap-3 mt-2">
            <label className="flex items-center gap-2">
              <input type="radio" checked={type === "issue"} onChange={() => setType("issue")} />
              <span className="ml-1">App / Bug</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" checked={type === "user"} onChange={() => setType("user")} />
              <span className="ml-1">User</span>
            </label>
          </div>
        </div>

        {type === "user" && (
          <div className={`card-matte rounded-2xl p-4 border ${theme.cardBorder}`}>
            <Label>Username of the user you are reporting</Label>
            <input
              value={reportedUsername}
              onChange={(e) => setReportedUsername(e.target.value)}
              placeholder="victim123 or @victim"
              className="w-full rounded-md bg-black/30 border border-white/10 px-3 py-2 mt-2"
            />
            <p className="text-xs text-gray-400 mt-1">We will attempt to resolve the username to an account.</p>
          </div>
        )}

        <div className={`card-matte rounded-2xl p-4 border ${theme.cardBorder}`}>
          <Label>Reason</Label>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full rounded-md bg-black/30 border border-white/10 px-3 py-2 mt-2"
            required
          >
            <option value="">Select reason</option>
            <option value="harassment">Harassment / Abuse</option>
            <option value="spam">Spam</option>
            <option value="scam">Scam / Fraud</option>
            <option value="nsfw">NSFW without warning</option>
            <option value="impersonation">Impersonation</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className={`card-matte rounded-2xl p-4 border ${theme.cardBorder}`}>
          <Label>Details (optional)</Label>
          <textarea
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Anything else you want to tell us (links, timestamps, etc.)"
            className="w-full rounded-md bg-black/30 border border-white/10 px-3 py-2 mt-2"
          />
        </div>

        {error && <p className="text-red-400">{error}</p>}
        {success && <p className="text-green-400">{success}</p>}

        <div className="flex justify-end">
          <Button type="submit" disabled={loading || !reason}>
            {loading ? 'Sending...' : 'Send Report'}
          </Button>
        </div>
      </form>
    </div>
  );
}
