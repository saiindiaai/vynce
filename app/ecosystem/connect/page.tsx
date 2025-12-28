"use client";

import { ArrowLeft, Zap } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ConnectPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-900/95 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="mb-8 flex justify-center">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-2xl">
            <Zap size={48} className="text-white" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-slate-50 mb-4">Vynce Connect</h1>

        {/* Under Construction Message */}
        <div className="mb-8 space-y-4">
          <p className="text-lg text-slate-300">
            🚀 This app is under construction
          </p>
          <p className="text-sm text-slate-400 leading-relaxed">
            We're working hard to bring Connect to you. This feature will allow you to connect with friends, share moments, and build your community.
          </p>
          <p className="text-xs text-slate-500 mt-6">
            Check back soon for updates!
          </p>
        </div>

        {/* Go Back Button */}
        <button
          onClick={() => router.back()}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-purple-600/50"
        >
          <ArrowLeft size={20} />
          Go back to Ecosystem
        </button>

        {/* Alternative Link to Ecosystem */}
        <button
          onClick={() => router.push("/ecosystem")}
          className="w-full mt-3 py-3 px-4 rounded-xl bg-slate-800/60 border border-slate-700/40 text-slate-300 font-semibold transition-all duration-200 hover:bg-slate-700/60 hover:text-slate-100"
        >
          Return to Ecosystem Home
        </button>
      </div>
    </div>
  );
}
