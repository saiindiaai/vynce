"use client";

import ShowcaseSelector from "@/components/profile/ShowcaseSelector";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type ShowcaseItem = {
  name?: string;
  [key: string]: any;
};

/* Lucide Icons */
import { ArrowUpRight } from "lucide-react";

const EnergyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className="w-5 h-5">
    <path
      d="M13 2L6 13h5l-1 9 7-11h-5l1-9z"
      stroke="#FFD369"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CelestiumIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className="w-5 h-5">
    <circle cx="12" cy="12" r="9" stroke="#CFCFCF" strokeWidth="2" fill="rgba(255,255,255,0.06)" />
    <text x="12" y="16" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#E5E5E5">
      C
    </text>
  </svg>
);

export default function EcosystemPage() {
  const router = useRouter();

  /** ===========================
   *  ALL HOOKS MUST BE HERE
   *  BEFORE ANY CONDITIONAL RETURN
   =========================== */
  const [user, setUser] = useState<any>(null);

  type ShowcaseCategory = "inventory" | "achievements" | "dares" | null;

  const [showSelector, setShowSelector] = useState<ShowcaseCategory>(null);

  const [showcase, setShowcase] = useState<{
    inventory: ShowcaseItem[];
    achievements: ShowcaseItem[];
    dares: ShowcaseItem[];
  }>({
    inventory: [],
    achievements: [],
    dares: [],
  });

  /** ===========================
   * LOAD USER
   =========================== */
  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          router.push("/auth/login");
          return;
        }

        const res = await api.get("/users/profile-card");
        setUser(res.data);
        setShowcase(res.data.showcase || showcase); // sync showcase
      } catch (err) {
        console.log("Auth failed, checking guest...");

        const guest = localStorage.getItem("guest_mode");

        if (guest === "true") {
          const guestUser = {
            username: "guest_user",
            displayName: "Guest User",
            level: 1,
            xp: 0,
            nextXP: 2000,
            percent: 0,
            energy: 1000,
            celestium: 0,
            showcase: { inventory: [], achievements: [], dares: [] },
          };

          setUser(guestUser);
          setShowcase(guestUser.showcase);
          return;
        }

        router.push("/auth/login");
      }
    };

    loadUser();
  }, [router]);

  /** ===========================
   * FETCH CURRENCIES TO SYNC DATA
   =========================== */
  useEffect(() => {
    if (!user || user.username === "guest_user") return;

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
  }, [user?.username]);

  /** ===========================
   * SHOW LOADING STATE
   =========================== */
  if (!user) {
    return (
      <div className="text-white flex items-center justify-center min-h-screen">Loading...</div>
    );
  }

  /** ===========================
   * XP LOGIC
   =========================== */
  const level = user.level;
  const xp = user.xp;
  const nextXP = user.nextXP;
  const percent = user.percent;

  /** ===========================
   * HANDLE SHOWCASE SELECTION
   =========================== */

  interface ShowcaseItem {
    name?: string;
    [key: string]: any;
  }

  const chooseItem = async (item: ShowcaseItem) => {
    if (!showSelector) return;

    const updated = {
      ...showcase,
      [showSelector]: [...showcase[showSelector], item].slice(-3),
    };

    setShowcase(updated);
    setShowSelector(null);

    await api.patch("/users/profile-card/showcase", updated);
  };

  return (
    <div className="px-4 pb-28 matte-bg">
      {/* =============================
          PROFILE HERO CARD (SILVER)
      ============================== */}
      <div className="mb-12">
        {/* OUTER LIQUID METAL FRAME */}
        <div className="rounded-[28px] p-[2.5px] liquid-metal-border">
          {/* INNER MATTE PANEL */}
          <div className="rounded-[26px] card-matte-dark p-6 shadow-[inset_0_0_8px_rgba(255,255,255,0.05)]">
            {/* TOP ROW */}
            <div className="flex justify-between items-start">
              {/* Avatar + Identity */}
              <div className="flex items-center gap-4">
                <div
                  className="
                  p-[2.5px] rounded-xl
                  bg-gradient-to-br from-[#f8f8f8] via-[#d5d5d5] to-[#9a9a9a]
                  shadow-[0_0_3px_rgba(255,255,255,0.1)]
                "
                >
                  <div
                    className="w-16 h-16 rounded-xl bg-[#131419] flex items-center justify-center
                                  text-xl font-bold text-white"
                  >
                    {(user.displayName || user.username || "VN").slice(0, 2).toUpperCase()}
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-bold text-white">{user.displayName}</h2>
                  <p className="text-gray-400 text-sm">@{user.username}</p>
                  <p className="text-gray-600 text-xs">UID: {user.uid}</p>
                </div>
              </div>

              {/* Currency Card */}
              <div
                className="
                p-[2.5px] rounded-xl
                bg-gradient-to-br from-[#f8f8f8] via-[#d5d5d5] to-[#9a9a9a]
                shadow-[0_0_4px_rgba(255,255,255,0.08)]
              "
              >
                <div className="rounded-xl bg-[#121216] px-4 py-3 flex flex-col gap-2 border border-white/10">
                  <div className="flex items-center justify-between">
                    <EnergyIcon />
                    <span className="text-white font-semibold">{user.energy}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <CelestiumIcon />
                    <span className="text-white font-semibold">{user.celestium}</span>
                  </div>
                </div>
              </div>
            </div>
            {/* LEVEL CARD */}
            <div
              className="
              mt-6 rounded-2xl p-[2px]
              bg-gradient-to-br from-[#f8f8f8] via-[#d5d5d5] to-[#9a9a9a]
              shadow-[0_0_4px_rgba(255,255,255,0.08)]
            "
            >
              <div
                className="
                rounded-2xl bg-[#0D0E11] p-5 border border-white/5
                shadow-[inset_0_0_20px_rgba(255,255,255,0.03)]
              "
              >
                {/* Header */}
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="
                      px-3 py-1 rounded-lg text-black font-semibold text-sm shadow
                      bg-gradient-to-br from-[#eeeeee] to-[#bcbcbc]
                    "
                    >
                      LVL {user.level}
                    </div>
                    <p className="text-white font-medium">Starter Tier</p>
                  </div>

                  <ArrowUpRight className="text-green-400 w-5 h-5" />
                </div>

                {/* XP Bar */}
                <div className="mt-2">
                  <div className="p-[1px] rounded-full bg-gradient-to-r from-[#eaeaea] to-[#b5b5b5]">
                    <div className="w-full h-2 rounded-full bg-[#1A1A1E] overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-400 to-cyan-400 transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                  </div>
                  <p className="text-gray-400 text-xs mt-2">
                    {user.xp} / {nextXP} XP
                  </p>
                </div>
              </div>
            </div>
            {/* ===== SHOWCASE SECTION ===== */}
            <div className="mt-6">
              {/* Tabs */}
              <div className="flex gap-3 mb-4 overflow-x-auto no-scrollbar snap-x snap-mandatory">
                {/* Active */}
                <div
                  className="
      px-4 py-2 rounded-full
      bg-gradient-to-br from-[#f8f8f8] via-[#d5d5d5] to-[#9a9a9a]
      text-black font-semibold text-sm shadow snap-start
    "
                >
                  Inventory showcase
                </div>

                <div
                  className="
      px-4 py-2 rounded-full bg-[#15161A]
      text-white font-semibold text-sm border border-white/10 snap-start
    "
                >
                  Achievement showcase
                </div>

                <div
                  className="
      px-4 py-2 rounded-full bg-[#15161A]
      text-white font-semibold text-sm border border-white/10 snap-start
    "
                >
                  Dare completed
                </div>
              </div>

              {/* Showcase slots */}
              <div className="grid grid-cols-3 gap-3">
                {showcase.inventory.map((item, i) => (
                  <div
                    key={i}
                    className="rounded-2xl p-[2px] liquid-metal-border-soft cursor-pointer"
                    onClick={() => setShowSelector("inventory")}
                  >
                    <div className="h-24 rounded-2xl bg-[#0E0F12] flex items-center justify-center text-gray-300">
                      {item?.name || "Empty"}
                    </div>
                  </div>
                ))}
              </div>
            </div>{" "}
            {/* END showcase section */}
          </div>{" "}
          {/* END profile hero card inner matte */}
        </div>{" "}
        {/* END profile hero outer border */}
      </div>{" "}
      {/* END profile hero wrapper */}
      {/* =============================
          ORBITS (UNCHANGED)
      ============================== */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Your Orbits</h3>
        <div className="flex gap-4">
          <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-2xl text-gray-300">
            +
          </div>
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-600 to-purple-500 rounded-xl relative">
            <span className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 rounded-full"></span>
          </div>
          <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-orange-400 rounded-xl relative">
            <span className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 rounded-full"></span>
          </div>
        </div>
      </div>
      {/* =============================
          CORE APPS (CLEAN / NO TINT)
      ============================== */}
      <h3 className="text-lg font-semibold mb-4">Core Apps</h3>
      <div className="space-y-4 mb-10">
        <div
          className="card-matte no-vignette p-4 rounded-2xl border border-white/10 flex justify-between items-center cursor-pointer"
          onClick={() => router.push("/social")}
        >
          <div>
            <h4 className="font-semibold">Vynce Social</h4>
            <p className="text-gray-400 text-sm">Connect & Share</p>
          </div>
          <span className="text-green-400">95%</span>
        </div>

        <div
          className="card-matte no-vignette p-4 rounded-2xl border border-white/10 flex justify-between items-center cursor-pointer"
          onClick={() => router.push("/ecosystem/connect")}
        >
          <div>
            <h4 className="font-semibold">Vynce Connect</h4>
            <p className="text-gray-400 text-sm">Network Hub</p>
          </div>
          <span className="text-green-400">92%</span>
        </div>

        <div
          className="card-matte no-vignette p-4 rounded-2xl border border-white/10 flex justify-between items-center cursor-pointer"
          onClick={() => router.push("/ecosystem/ai")}
        >
          <div>
            <h4 className="font-semibold">Vynce AI</h4>
            <p className="text-gray-400 text-sm">Smart Assistant</p>
          </div>
          <span className="text-green-400">98%</span>
        </div>
      </div>
      {showSelector && (
        <ShowcaseSelector
          type={showSelector}
          onClose={() => setShowSelector(null)}
          onSelect={chooseItem}
        />
      )}
    </div>
  );
}
