"use client";

import ProfileMenu from "@/components/profile/ProfileMenu";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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

  useEffect(() => {
    if (!user) return;

    const fetchCurrencies = async () => {
      try {
        const [energyRes, celestiumRes] = await Promise.all([
          api.get("/users/energy"),
          api.get("/users/celestium")
        ]);

        setUser((prev: any) => ({
          ...prev,
          energy: energyRes.data.energy,
          celestium: celestiumRes.data.celestium || 0,
        }));
      } catch (err) {
        console.log("Currency fetch failed", err);
      }
    };

    fetchCurrencies();
  }, [user]);

  if (!user) {
    return (
      <div className="text-white flex items-center justify-center min-h-screen">Loading...</div>
    );
  }

  return <ProfileMenu user={user} />;
}
