"use client";

import React, { useEffect, useRef, useState } from "react";
import { Send, X } from "lucide-react";
import { useAppStore } from "@/lib/store";

interface TeamChatProps {
  isOpen: boolean;
  onClose: () => void;
  fightId: number;
  team: "teamA" | "teamB";
  teamName: string;
  teamColor: string;
}

export default function TeamChat({
  isOpen,
  onClose,
  fightId,
  team,
  teamName,
  teamColor,
}: TeamChatProps) {
  const { currentUser, teamMessages, addTeamMessage } = useAppStore();
  const [input, setInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter messages for this team
  const fightTeamMessages = teamMessages.filter(
    (msg) => msg.fightId === fightId && msg.team === team
  );

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
      inputRef.current?.focus();
    }
  }, [isOpen, fightTeamMessages.length]);

  const handleSubmit = async () => {
    const trimmed = input.trim();
    if (!trimmed || submitting) return;

    setSubmitting(true);
    setInput("");

    // Simulate network delay
    setTimeout(() => {
      addTeamMessage(fightId, team, trimmed);
      setSubmitting(false);
    }, 200);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-40 animate-fadeIn" onClick={onClose} />

      {/* Chat Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
        <div className="clean-card rounded-lg max-w-md w-full max-h-[85vh] overflow-hidden flex flex-col animate-slideIn">
          {/* Header */}
          <div className={`bg-gradient-to-r ${teamColor} p-4 flex items-center justify-between`}>
            <div>
              <h2 className="text-xl font-bold text-white">{teamName} Chat</h2>
              <p className="text-xs text-white/70">Team Discussion</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white"
              aria-label="Close chat"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {fightTeamMessages.length === 0 ? (
              <div className="h-full flex items-center justify-center text-center">
                <div>
                  <p className="text-slate-400 text-sm mb-2">No messages yet</p>
                  <p className="text-slate-500 text-xs">Be the first to chat with your team!</p>
                </div>
              </div>
            ) : (
              fightTeamMessages.map((msg) => (
                <div key={msg.id} className="animate-slideIn">
                  <div className="text-xs text-slate-400 mb-1">
                    <span className="font-semibold text-slate-300">{msg.sender}</span>
                    <span className="ml-2">{msg.timestamp}</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-3 text-sm text-slate-100 break-words">
                    {msg.text}
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-slate-700/30 p-3 bg-slate-800/30">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
                placeholder="Send a message..."
                className="flex-1 px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-50 placeholder-slate-500 text-sm outline-none focus:border-slate-600 transition-colors disabled:opacity-50"
                disabled={submitting}
              />
              <button
                onClick={handleSubmit}
                disabled={!input.trim() || submitting}
                className={`p-2 rounded-lg transition-all ${
                  input.trim() && !submitting
                    ? `bg-gradient-to-r ${teamColor} text-white hover:opacity-90`
                    : "bg-slate-700 text-slate-400 cursor-not-allowed"
                }`}
                aria-label="Send message"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
