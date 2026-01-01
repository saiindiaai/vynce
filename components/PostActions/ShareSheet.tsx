"use client";

import React from "react";
import { X, Copy, MessageCircle, Mail, Link2, Share2 } from "lucide-react";

interface ShareSheetProps {
  isOpen: boolean;
  onClose: () => void;
  postId: number;
  variant?: "home" | "drops" | "capsules" | "fight";
}

export default function ShareSheet({ isOpen, onClose, postId, variant = "home" }: ShareSheetProps) {
  if (!isOpen) return null;

  const shareOptions = [
    { id: "copy", label: "Copy Link", icon: Copy, color: "from-blue-500 to-cyan-500" },
    { id: "dm", label: "Send DM", icon: MessageCircle, color: "from-purple-500 to-pink-500" },
    { id: "email", label: "Email", icon: Mail, color: "from-orange-500 to-red-500" },
    { id: "share", label: "More Options", icon: Share2, color: "from-green-500 to-cyan-500" },
  ];

  const handleShare = (option: string) => {
    switch (option) {
      case "copy":
        navigator.clipboard.writeText(`${window.location.origin}?post=${postId}`);
        break;
      case "dm":
        // Open DM modal
        break;
      case "email":
        window.location.href = `mailto:?subject=Check this out&body=Check out this post: ${window.location.origin}?post=${postId}`;
        break;
      case "share":
        if (navigator.share) {
          navigator.share({
            title: "Vynce Social",
            text: "Check out this post!",
            url: `${window.location.origin}?post=${postId}`,
          });
        }
        break;
    }
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-fadeIn"
        onClick={onClose}
      />

      {/* Sheet */}
      <div className={`fixed inset-x-0 bottom-0 z-50 animate-slideIn max-w-2xl mx-auto p-4`}>
        <div
          className={`rounded-3xl bg-slate-800 border border-slate-700 overflow-hidden shadow-2xl`}
        >
          {/* Header */}
          <div className={`flex items-center justify-between p-4 border-b border-slate-700`}>
            <h3 className={`text-lg font-bold text-slate-50`}>Share Post</h3>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg hover:bg-slate-700/50 transition-colors focus:outline-none focus-visible:outline-2 focus-visible:outline-purple-500`}
            >
              <X size={20} className={`text-slate-400`} />
            </button>
          </div>

          {/* Share Options */}
          <div className="p-4 grid grid-cols-2 gap-3">
            {shareOptions.map((option) => {
              const Icon = option.icon;
              return (
                <button
                  key={option.id}
                  onClick={() => handleShare(option.id)}
                  className={`flex flex-col items-center gap-3 p-4 rounded-2xl transition-all hover:scale-105 bg-slate-700/30 hover:bg-slate-700/50 border border-slate-600/50 focus:outline-none focus-visible:outline-2 focus-visible:outline-purple-500`}
                >
                  <div className={`p-3 rounded-full bg-gradient-to-br ${option.color}`}>
                    <Icon size={24} className="text-white" />
                  </div>
                  <span className={`text-sm font-semibold text-slate-50 text-center`}>
                    {option.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Link Input */}
          <div className={`p-4 border-t border-slate-700`}>
            <label className={`block text-sm font-semibold text-slate-400 mb-2`}>Post Link</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={`${typeof window !== "undefined" ? window.location.origin : ""}?post=${postId}`}
                readOnly
                className={`flex-1 px-4 py-2 rounded-lg bg-slate-700 border border-slate-600 text-slate-50 outline-none min-h-[40px]`}
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`${window.location.origin}?post=${postId}`);
                }}
                className={`px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold hover:scale-105 transition-transform focus:outline-none focus-visible:outline-2 focus-visible:outline-purple-500`}
              >
                Copy
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
