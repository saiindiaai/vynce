"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1200); // 1.2s loading
    return () => clearTimeout(t);
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="flex flex-col items-center gap-4 animate-pulse">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 shadow-xl"></div>
          <p className="text-white text-lg font-semibold tracking-wide">Vynce Loading…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
            Vynce Ecosystem
          </h1>
          <p className="text-gray-400 text-sm">Choose how you want to start</p>
        </div>

        <div className="space-y-4">
          <Button asChild className="w-full rounded-md" size="lg">
            <Link href="/auth/login">Login</Link>
          </Button>

          <Button asChild variant="secondary" className="w-full rounded-md" size="lg">
            <Link href="/auth/register">Register</Link>
          </Button>

          <Button asChild variant="outline" className="w-full rounded-md" size="lg">
            <Link href="/guest">Continue as Guest</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
