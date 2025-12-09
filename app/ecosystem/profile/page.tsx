"use client";

import { useState, useEffect } from "react";
import ProfileMenu from "@/components/profile/ProfileMenu";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/auth/me");
        setUser(res.data);
      } catch (err) {
        console.log("Auth error");
        router.push("/auth/login");
      }
    };

    load();
  }, [router]);

  if (!user) {
    return (
      <div className="text-white flex items-center justify-center min-h-screen">Loading...</div>
    );
  }

  return <ProfileMenu user={user} />;
}
