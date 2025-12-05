"use client";

import { useTheme } from "@/hooks/useTheme";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function DeleteAccountPage() {
  const { theme } = useTheme();
  const router = useRouter();

  const handleDelete = async () => {
    const confirmDelete = confirm(
      "This action is permanent and cannot be undone. Delete your account?"
    );

    if (!confirmDelete) return;

    try {
      // Call backend delete endpoint
      await api.delete("/users/me");

      // Remove auth token
      localStorage.removeItem("token");

      // Redirect to login
      router.push("/auth/login");
    } catch (err) {
      console.log("Delete failed", err);
      alert("Failed to delete account. Try again.");
    }
  };

  return (
    <div className="px-6 pb-28 pt-4">
      <h1 className={`text-2xl font-bold mb-2 ${theme.textPrimary}`}>
        Delete Account
      </h1>
      <p className={`text-sm mb-6 ${theme.textSecondary}`}>
        This action is permanent.
      </p>

      <div
        className="
          rounded-2xl p-4
          bg-gradient-to-br from-red-800/50 to-red-600/40
          border border-red-500/40
          space-y-3
        "
      >
        <p className="text-sm text-red-100">
          Your profile, data, and activity will be permanently deleted.
        </p>

        <Button
          type="button"
          onClick={handleDelete}
          className="w-full bg-red-600 hover:bg-red-700"
        >
          I understand, delete my account
        </Button>
      </div>
    </div>
  );
}
