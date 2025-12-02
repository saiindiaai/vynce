"use client";

import { useTheme } from "@/hooks/useTheme";
import { Button } from "@/components/ui/button";

export default function DeleteAccountPage() {
  const { theme } = useTheme();

  const handleFakeDelete = () => {
    console.log("Delete account clicked (frontend only)");
    // later: call DELETE /api/users/me
  };

  return (
    <div className="px-6 pb-28 pt-4">
      <h1 className={`text-2xl font-bold mb-2 ${theme.textPrimary}`}>
        Delete Account
      </h1>
      <p className={`text-sm mb-6 ${theme.textSecondary}`}>
        This is permanent. Once it’s gone, it’s gone.
      </p>

      <div
        className={`
          rounded-2xl p-4
          bg-gradient-to-br from-red-800/50 to-red-600/40
          border border-red-500/40
          space-y-3
        `}
      >
        <p className="text-sm text-red-100">
          • Your profile, activity and data will be permanently removed.
        </p>
        <p className="text-xs text-red-200">
          • This action cannot be undone.
        </p>

        <Button
          type="button"
          onClick={handleFakeDelete}
          className="w-full bg-red-600 hover:bg-red-700"
        >
          I understand, delete (coming soon)
        </Button>
      </div>
    </div>
  );
}
