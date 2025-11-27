"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <div
      className="
        fixed bottom-0 left-0 w-full
        bg-[#0d0d15]/95 backdrop-blur-xl
        border-t border-white/10
        flex justify-around items-center
        py-3
        z-50
      "
    >
      {/* HOME */}
      <Link href="/ecosystem" className="flex flex-col items-center gap-1">
        <svg
          width="24"
          height="24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={pathname === "/ecosystem" ? "text-blue-400" : "text-gray-400"}
        >
          <path d="M3 10l9-7 9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V10z" />
        </svg>
        <span className="text-xs">Home</span>
      </Link>

      {/* PROFILE */}
      <Link href="/ecosystem/profile" className="flex flex-col items-center gap-1">
        <svg
          width="24"
          height="24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={pathname === "/ecosystem/profile" ? "text-blue-400" : "text-gray-400"}
        >
          <path d="M12 12c2.8 0 5-2.2 5-5s-2.2-5-5-5-5 2.2-5 5 2.2 5 5 5z" />
          <path d="M4 20c0-3.3 3.1-6 8-6s8 2.7 8 6v2H4v-2z" />
        </svg>
        <span className="text-xs">Profile</span>
      </Link>

      {/* SETTINGS */}
      <Link href="/ecosystem/settings" className="flex flex-col items-center gap-1">
        <svg
          width="24"
          height="24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={pathname === "/ecosystem/settings" ? "text-blue-400" : "text-gray-400"}
        >
          <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
          <path d="M19.4 12a7.4 7.4 0 0 0-.2-1.8l2-1.6-2-3.4-2.3.9a7.7 7.7 0 0 0-3-1.7L13 2h-4l-.9 2.4a7.7 7.7 0 0 0-3 1.7L2.8 5.2l-2 3.4 2 1.6a7.4 7.4 0 0 0 0 3.6l-2 1.6 2 3.4 2.3-.9a7.7 7.7 0 0 0 3 1.7L9 22h4l.9-2.4a7.7 7.7 0 0 0 3-1.7l2.3.9 2-3.4-2-1.6c.2-.6.2-1.2.2-1.8z" />
        </svg>
        <span className="text-xs">Settings</span>
      </Link>
    </div>
  );
}
