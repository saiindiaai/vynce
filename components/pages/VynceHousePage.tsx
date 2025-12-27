"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Users,
  Home,
  Radio,
  MessageSquare,
  Plus,
  Search,
  Settings,
  Send,
  X,
  Star,
  Lock,
  Globe,
  Zap,
  User,
  ChevronDown,
  Phone,
  Video,
  Play,
  Book,
  Edit2,
  Trash2,
  Copy,
  LogOut,
} from "lucide-react";
import { useAppStore } from "@/lib/store";

type HouseType = "group_chat" | "community" | "house" | "broadcast";

interface House {
  id: string;
  name: string;
  description: string;
  type: HouseType;
  members: number;
  image?: string;
  isPrivate: boolean;
  isPinned: boolean;
  createdAt: number;
  creatorId: string;
  unreadCount: number;
}

interface Message {
  id: string;
  houseId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  timestamp: number;
  reactions?: { emoji: string; count: number }[];
}

const LOCAL_HOUSES_KEY = "vynce_houses";
const LOCAL_MESSAGES_KEY = "vynce_house_messages";

export default function VynceHousePage() {
  const { showToast } = useAppStore();
  const [houses, setHouses] = useState<House[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedHouseId, setSelectedHouseId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newHouseName, setNewHouseName] = useState("");
  const [newHouseDescription, setNewHouseDescription] = useState("");
  const [newHouseType, setNewHouseType] = useState<HouseType>("group_chat");
  const [newHousePrivate, setNewHousePrivate] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<HouseType | "all">("all");
  const [showMobileAdvanced, setShowMobileAdvanced] = useState(false);
  const [activeAction, setActiveAction] = useState<null | "call" | "meet" | "play" | "learn">(null);

  // Load from localStorage
  useEffect(() => {
    try {
      const savedHouses = localStorage.getItem(LOCAL_HOUSES_KEY);
      const savedMessages = localStorage.getItem(LOCAL_MESSAGES_KEY);
      if (savedHouses) setHouses(JSON.parse(savedHouses));
      if (savedMessages) setMessages(JSON.parse(savedMessages));
    } catch (err) {
      // ignore
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_HOUSES_KEY, JSON.stringify(houses));
    } catch (err) {
      // ignore
    }
  }, [houses]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_MESSAGES_KEY, JSON.stringify(messages));
    } catch (err) {
      // ignore
    }
  }, [messages]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getTypeIcon = (type: HouseType) => {
    switch (type) {
      case "group_chat":
        return <MessageSquare size={20} />;
      case "community":
        return <Users size={20} />;
      case "house":
        return <Home size={20} />;
      case "broadcast":
        return <Radio size={20} />;
      default:
        return null;
    }
  };

  const getTypeColor = (type: HouseType) => {
    switch (type) {
      case "group_chat":
        return "bg-blue-600/20 text-blue-300 border-blue-600/30";
      case "community":
        return "bg-purple-600/20 text-purple-300 border-purple-600/30";
      case "house":
        return "bg-amber-600/20 text-amber-300 border-amber-600/30";
      case "broadcast":
        return "bg-red-600/20 text-red-300 border-red-600/30";
      default:
        return "bg-slate-600/20 text-slate-300 border-slate-600/30";
    }
  };

  const getTypeLabel = (type: HouseType) => {
    return type
      .split("_")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  };

  const createHouse = () => {
    if (!newHouseName.trim()) {
      showToast?.("Please enter a house name", "warning");
      return;
    }

    const house: House = {
      id: `house_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      name: newHouseName.trim(),
      description: newHouseDescription.trim(),
      type: newHouseType,
      members: 1,
      isPrivate: newHousePrivate,
      isPinned: false,
      createdAt: Date.now(),
      creatorId: "current_user",
      unreadCount: 0,
    };

    setHouses((prev) => [house, ...prev]);
    showToast?.(`${getTypeLabel(newHouseType)} "${newHouseName}" created!`, "success");
    setNewHouseName("");
    setNewHouseDescription("");
    setNewHouseType("group_chat");
    setNewHousePrivate(false);
    setShowCreateModal(false);
    setSelectedHouseId(house.id);
  };

  const sendMessage = () => {
    if (!messageInput.trim() || !selectedHouseId) return;

    const message: Message = {
      id: `msg_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      houseId: selectedHouseId,
      userId: "current_user",
      userName: "You",
      content: messageInput.trim(),
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, message]);
    setMessageInput("");
  };

  const performAction = (action: "call" | "meet" | "play" | "learn") => {
    if (!selectedHouse) return;
    switch (action) {
      case "call":
        showToast?.(`Starting a call in ${selectedHouse.name}...`, "info");
        break;
      case "meet":
        showToast?.(`Opening meeting controls for ${selectedHouse.name}...`, "info");
        break;
      case "play":
        showToast?.(`Launching play session in ${selectedHouse.name}...`, "info");
        break;
      case "learn":
        showToast?.(`Opening learning tools for ${selectedHouse.name}...`, "info");
        break;
    }
    setActiveAction(null);
  };

  const deleteHouse = (houseId: string) => {
    setHouses((prev) => prev.filter((h) => h.id !== houseId));
    setMessages((prev) => prev.filter((m) => m.houseId !== houseId));
    if (selectedHouseId === houseId) setSelectedHouseId(null);
    showToast?.("House deleted", "info");
  };

  const togglePinHouse = (houseId: string) => {
    setHouses((prev) => prev.map((h) => (h.id === houseId ? { ...h, isPinned: !h.isPinned } : h)));
  };

  const filteredHouses = houses
    .filter((h) => {
      if (activeTab !== "all" && h.type !== activeTab) return false;
      return (
        h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    })
    .sort((a, b) => {
      if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
      return b.createdAt - a.createdAt;
    });

  const selectedHouse = houses.find((h) => h.id === selectedHouseId);
  const houseMessages = selectedHouseId
    ? messages
        .filter((m) => m.houseId === selectedHouseId)
        .sort((a, b) => a.timestamp - b.timestamp)
    : [];

  return (
    <div className="animate-fadeIn pb-24 sm:pb-0 w-full h-full flex flex-col bg-slate-950">
      {/* Header */}
      <div className="px-4 sm:px-6 py-6 border-b border-slate-700/50 bg-slate-900 flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-50">Vynce House</h1>
            <p className="text-sm text-slate-400 mt-1">Groups, Communities, Houses & Broadcasts</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold rounded-lg transition-all shadow-lg shadow-purple-500/25"
          >
            <Plus size={20} />
            <span className="hidden sm:inline">Create</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input
            type="text"
            placeholder="Search houses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-50 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
          />
        </div>
      </div>

      <div className="flex-1 flex gap-4 overflow-hidden px-3 sm:px-6 py-4">
        {/* Left Sidebar - Houses List */}
        <div className="w-full sm:w-72 flex flex-col bg-slate-900/40 rounded-xl border border-slate-700/30 overflow-hidden">
          {/* Type Tabs */}
          <div className="flex items-center overflow-x-auto border-b border-slate-700/30 bg-slate-900/60 px-2 py-2 gap-1">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === "all"
                  ? "bg-purple-600/40 text-purple-300 border border-purple-600/50"
                  : "text-slate-400 hover:text-slate-300"
              }`}
            >
              All
            </button>
            {(["group_chat", "community", "house", "broadcast"] as HouseType[]).map((type) => (
              <button
                key={type}
                onClick={() => setActiveTab(type)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1 ${
                  activeTab === type
                    ? "bg-purple-600/40 text-purple-300 border border-purple-600/50"
                    : "text-slate-400 hover:text-slate-300"
                }`}
              >
                {getTypeIcon(type)}
                <span className="hidden sm:inline">{getTypeLabel(type).split(" ")[0]}</span>
              </button>
            ))}
          </div>

          {/* Houses List */}
          <div className="flex-1 overflow-y-auto space-y-2 p-3">
            {filteredHouses.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-sm text-slate-400">No houses found</p>
                <p className="text-xs text-slate-500 mt-1">Create one to get started!</p>
              </div>
            ) : (
              filteredHouses.map((house) => (
                <div
                  key={house.id}
                  onClick={() => setSelectedHouseId(house.id)}
                  className={`p-3 rounded-lg cursor-pointer transition-all border group ${
                    selectedHouseId === house.id
                      ? "bg-purple-600/20 border-purple-600/50"
                      : "bg-slate-800/40 border-slate-700/30 hover:bg-slate-800/60 hover:border-slate-600/50"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <div
                          className={`p-1.5 rounded-lg flex-shrink-0 ${getTypeColor(house.type)}`}
                        >
                          {getTypeIcon(house.type)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-slate-50 truncate text-sm">
                            {house.name}
                          </p>
                          <p className="text-xs text-slate-400 truncate">{house.members} members</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      {house.isPrivate && <Lock size={14} className="text-slate-500" />}
                      {house.isPinned && <Star size={14} className="text-yellow-500" />}
                    </div>
                  </div>
                  {house.unreadCount > 0 && (
                    <div className="mt-2 px-2 py-0.5 bg-red-600/30 rounded text-xs text-red-300 font-semibold w-fit">
                      {house.unreadCount} new
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Panel - Chat View (desktop) */}
        <div className="hidden sm:flex flex-1 flex-col bg-slate-900/40 rounded-xl border border-slate-700/30 overflow-hidden">
          {selectedHouse ? (
            <>
              {/* Chat Header */}
              <div className="flex items-center justify-between gap-3 px-4 py-4 border-b border-slate-700/30 bg-slate-900/60 flex-shrink-0">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-lg ${getTypeColor(selectedHouse.type)}`}>
                    {getTypeIcon(selectedHouse.type)}
                  </div>
                  <div>
                    <h2 className="font-bold text-slate-50">{selectedHouse.name}</h2>
                    <p className="text-xs text-slate-400">{selectedHouse.members} members</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {/* Action Buttons: Call / Meet / Play / Learn */}
                  <button
                    onClick={() => setActiveAction("call")}
                    title="Call"
                    className="p-2 hover:bg-slate-800/60 rounded-lg transition-all text-slate-400 hover:text-slate-50"
                  >
                    <Phone size={18} />
                  </button>
                  <button
                    onClick={() => setActiveAction("meet")}
                    title="Meet"
                    className="p-2 hover:bg-slate-800/60 rounded-lg transition-all text-slate-400 hover:text-slate-50"
                  >
                    <Video size={18} />
                  </button>
                  <button
                    onClick={() => setActiveAction("play")}
                    title="Play"
                    className="p-2 hover:bg-slate-800/60 rounded-lg transition-all text-slate-400 hover:text-slate-50"
                  >
                    <Play size={18} />
                  </button>
                  <button
                    onClick={() => setActiveAction("learn")}
                    title="Learn"
                    className="p-2 hover:bg-slate-800/60 rounded-lg transition-all text-slate-400 hover:text-slate-50"
                  >
                    <Book size={18} />
                  </button>

                  <div className="w-px h-6 bg-slate-700/30" />

                  <button className="p-2 hover:bg-slate-800/60 rounded-lg transition-all text-slate-400 hover:text-slate-50">
                    <Settings size={18} />
                  </button>
                  <button
                    onClick={() => togglePinHouse(selectedHouse.id)}
                    className={`p-2 rounded-lg transition-all ${
                      selectedHouse.isPinned
                        ? "bg-yellow-600/20 text-yellow-400"
                        : "hover:bg-slate-800/60 text-slate-400 hover:text-slate-50"
                    }`}
                  >
                    <Star size={18} />
                  </button>
                  <button
                    onClick={() => deleteHouse(selectedHouse.id)}
                    className="p-2 hover:bg-red-600/20 rounded-lg transition-all text-slate-400 hover:text-red-400"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-slate-900/20 to-slate-900/40">
                {houseMessages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <MessageSquare size={32} className="text-slate-600 mb-3" />
                    <p className="text-slate-400">No messages yet</p>
                    <p className="text-xs text-slate-500 mt-1">Start the conversation!</p>
                  </div>
                ) : (
                  houseMessages.map((msg) => (
                    <div key={msg.id} className="group">
                      <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-800/30 transition-all">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                          {msg.userName.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-semibold text-slate-50 text-sm">{msg.userName}</p>
                            <p className="text-xs text-slate-500">
                              {new Date(msg.timestamp).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                          <p className="text-sm text-slate-300 break-words">{msg.content}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="px-4 py-3 border-t border-slate-700/30 bg-slate-900/60 flex-shrink-0">
                <div className="flex items-end gap-3">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                    className="flex-1 px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-50 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all text-sm"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!messageInput.trim()}
                    className="p-2.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-all"
                  >
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <Home size={48} className="text-slate-600 mb-4" />
              <p className="text-slate-400 text-lg font-semibold">Select a house</p>
              <p className="text-slate-500 text-sm mt-2">Choose from the list to start chatting</p>
            </div>
          )}
        </div>
        {/* Mobile Chat Panel - opens when a house is selected */}
        {selectedHouse && (
          <div className="sm:hidden fixed inset-0 z-40 bg-slate-950 flex flex-col">
            <div className="px-4 py-3 border-b border-slate-700/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedHouseId(null)}
                  className="p-2 rounded-lg hover:bg-slate-800/60 text-slate-300"
                >
                  <ChevronDown size={20} />
                </button>
                <div className={`p-2 rounded-lg ${getTypeColor(selectedHouse.type)}`}>
                  {getTypeIcon(selectedHouse.type)}
                </div>
                <div>
                  <div className="font-bold text-slate-50">{selectedHouse.name}</div>
                  <div className="text-xs text-slate-400">{selectedHouse.members} members</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowMobileAdvanced(true)}
                  title="Advanced"
                  className="p-2 rounded-lg hover:bg-slate-800/60 text-slate-300"
                >
                  <Settings size={18} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {houseMessages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <MessageSquare size={32} className="text-slate-600 mb-3" />
                  <p className="text-slate-400">No messages yet</p>
                  <p className="text-xs text-slate-500 mt-1">Start the conversation!</p>
                </div>
              ) : (
                houseMessages.map((msg) => (
                  <div key={msg.id} className="group">
                    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-800/30 transition-all">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                        {msg.userName.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-slate-50 text-sm">{msg.userName}</p>
                          <p className="text-xs text-slate-500">
                            {new Date(msg.timestamp).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                        <p className="text-sm text-slate-300 break-words">{msg.content}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="px-4 py-3 border-t border-slate-700/30 bg-slate-900/60 flex-shrink-0">
              <div className="flex items-end gap-3">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  className="flex-1 px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-50 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all text-sm"
                />
                <button
                  onClick={sendMessage}
                  disabled={!messageInput.trim()}
                  className="p-2.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-all"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Advanced Options Sheet */}
        {showMobileAdvanced && selectedHouse && (
          <div className="fixed inset-0 z-50 flex items-end sm:hidden">
            <div className="w-full bg-slate-900 rounded-t-xl p-4 border-t border-slate-700/50">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="text-sm font-bold text-slate-50">Advanced Options</h4>
                  <p className="text-xs text-slate-400">Actions for {selectedHouse.name}</p>
                </div>
                <button
                  onClick={() => setShowMobileAdvanced(false)}
                  className="p-2 rounded-lg hover:bg-slate-800/60 text-slate-300"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    setShowMobileAdvanced(false);
                    performAction("call");
                  }}
                  className="flex items-center gap-2 justify-center px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-bold"
                >
                  <Phone size={16} />
                  Call
                </button>
                <button
                  onClick={() => {
                    setShowMobileAdvanced(false);
                    performAction("meet");
                  }}
                  className="flex items-center gap-2 justify-center px-4 py-3 bg-slate-800/50 text-slate-200 rounded-lg border border-slate-700/50"
                >
                  <Video size={16} />
                  Meet
                </button>
                <button
                  onClick={() => {
                    setShowMobileAdvanced(false);
                    performAction("play");
                  }}
                  className="flex items-center gap-2 justify-center px-4 py-3 bg-slate-800/50 text-slate-200 rounded-lg border border-slate-700/50"
                >
                  <Play size={16} />
                  Play
                </button>
                <button
                  onClick={() => {
                    setShowMobileAdvanced(false);
                    performAction("learn");
                  }}
                  className="flex items-center gap-2 justify-center px-4 py-3 bg-slate-800/50 text-slate-200 rounded-lg border border-slate-700/50"
                >
                  <Book size={16} />
                  Learn
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="w-full max-w-md bg-slate-900 rounded-xl border border-slate-700/50 p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-slate-50">Create New House</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 hover:bg-slate-800 rounded-lg transition-all text-slate-400 hover:text-slate-50"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-2">
                  House Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(["group_chat", "community", "house", "broadcast"] as HouseType[]).map(
                    (type) => (
                      <button
                        key={type}
                        onClick={() => setNewHouseType(type)}
                        className={`p-3 rounded-lg font-semibold text-sm transition-all border flex flex-col items-center gap-2 ${
                          newHouseType === type
                            ? "bg-purple-600/40 border-purple-600/50 text-purple-300"
                            : "bg-slate-800/40 border-slate-700/50 text-slate-400 hover:border-slate-600"
                        }`}
                      >
                        {getTypeIcon(type)}
                        <span className="text-xs">{getTypeLabel(type).split(" ")[0]}</span>
                      </button>
                    )
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-2">Name</label>
                <input
                  type="text"
                  placeholder="House name"
                  value={newHouseName}
                  onChange={(e) => setNewHouseName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-50 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-2">
                  Description
                </label>
                <textarea
                  placeholder="What's this house about?"
                  value={newHouseDescription}
                  onChange={(e) => setNewHouseDescription(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-50 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all resize-none"
                />
              </div>

              <div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newHousePrivate}
                    onChange={(e) => setNewHousePrivate(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-700 bg-slate-800"
                  />
                  <span className="text-sm text-slate-300">Private House</span>
                  <Lock size={14} className="text-slate-500" />
                </label>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={createHouse}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold rounded-lg transition-all"
              >
                Create
              </button>
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-2.5 bg-slate-800/50 hover:bg-slate-800 text-slate-300 font-semibold rounded-lg border border-slate-700/50 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Action Modal (Call / Meet / Play / Learn) */}
      {activeAction && selectedHouse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="w-full max-w-lg bg-slate-900 rounded-xl border border-slate-700/50 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-50">
                {activeAction === "call"
                  ? "Start Call"
                  : activeAction === "meet"
                    ? "Start Meeting"
                    : activeAction === "play"
                      ? "Play Together"
                      : "Learning Session"}
              </h3>
              <button
                onClick={() => setActiveAction(null)}
                className="p-2 rounded-lg hover:bg-slate-800 transition-colors text-slate-400"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-sm text-slate-400">
              {selectedHouse.name} • {getTypeLabel(selectedHouse.type)}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => performAction(activeAction)}
                className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-bold"
              >
                {activeAction === "call" && "Start Call"}
                {activeAction === "meet" && "Start Meeting"}
                {activeAction === "play" && "Start Play Session"}
                {activeAction === "learn" && "Open Learning Tools"}
              </button>
              <button
                onClick={() => {
                  setActiveAction(null);
                  showToast?.("Coming soon — advanced tools are being rolled out.", "info");
                }}
                className="w-full px-4 py-3 bg-slate-800/50 text-slate-200 rounded-lg border border-slate-700/50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
