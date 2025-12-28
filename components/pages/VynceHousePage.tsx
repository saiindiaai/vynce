"use client";

import { useAppStore } from "@/lib/store";
import {
  ChevronRight,
  Hash,
  Home,
  Lock,
  Menu,
  MessageSquare,
  MoreVertical,
  Plus,
  Radio,
  Search,
  Send,
  Users,
  X
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

type HouseType = "group_chat" | "community" | "house" | "broadcast";
type HouseRarity = "common" | "rare" | "epic" | "legendary" | "mythic";

interface House {
  id: string;
  name: string;
  description: string;
  purpose: string;
  type: HouseType;
  rarity: HouseRarity;
  level: number;
  influence: number;
  members: number;
  isPrivate: boolean;
  isPinned: boolean;
  createdAt: number;
  foundedBy: string;
  crest?: string;
  channels: Channel[];
  allyHouses: string[];
  rivalHouses: string[];
  history: string[];
}

interface Channel {
  id: string;
  houseId: string;
  name: string;
  description: string;
  isPrivate: boolean;
  createdAt: number;
}

interface Message {
  id: string;
  houseId: string;
  channelId: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: number;
}

interface HouseMember {
  id: string;
  username: string;
  role: "founder" | "admin" | "moderator" | "member";
  joinedAt: number;
  isOnline: boolean;
  influence: number;
  loyalty: number;
  powers: string[];
}

const LOCAL_HOUSES_KEY = "vynce_houses_hierarchical";
const LOCAL_MESSAGES_KEY = "vynce_house_messages_hierarchical";
const LOCAL_MEMBERS_KEY = "vynce_house_members_hierarchical";

export default function VynceHousePage() {
  const { showToast } = useAppStore();
  const [houses, setHouses] = useState<House[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedHouseId, setSelectedHouseId] = useState<string | null>(null);
  const [selectedChannelId, setSelectedChannelId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const [showCreateHouseModal, setShowCreateHouseModal] = useState(false);
  const [showCreateChannelModal, setShowCreateChannelModal] = useState(false);
  const [newHouseName, setNewHouseName] = useState("");
  const [newHouseDescription, setNewHouseDescription] = useState("");
  const [newHouseType, setNewHouseType] = useState<HouseType>("group_chat");
  const [newHousePrivate, setNewHousePrivate] = useState(false);
  const [newHousePurpose, setNewHousePurpose] = useState("");
  const [newHouseRarity, setNewHouseRarity] = useState<HouseRarity>("common");
  const [newChannelName, setNewChannelName] = useState("");
  const [newChannelDescription, setNewChannelDescription] = useState("");
  const [newChannelPrivate, setNewChannelPrivate] = useState(false);
  const [members, setMembers] = useState<Record<string, HouseMember[]>>({});
  const [expandedHouses, setExpandedHouses] = useState<Set<string>>(new Set());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showMembersSidebar, setShowMembersSidebar] = useState(true);
  const [showHousesSidebar, setShowHousesSidebar] = useState(false);

  // Load from localStorage
  useEffect(() => {
    try {
      const savedHouses = localStorage.getItem(LOCAL_HOUSES_KEY);
      const savedMessages = localStorage.getItem(LOCAL_MESSAGES_KEY);
      const savedMembers = localStorage.getItem(LOCAL_MEMBERS_KEY);
      if (savedHouses) {
        const parsedHouses = JSON.parse(savedHouses);
        setHouses(parsedHouses);
        if (parsedHouses.length > 0) {
          setSelectedHouseId(parsedHouses[0].id);
          if (parsedHouses[0].channels.length > 0) {
            setSelectedChannelId(parsedHouses[0].channels[0].id);
            setExpandedHouses(new Set([parsedHouses[0].id]));
          }
        }
      }
      if (savedMessages) setMessages(JSON.parse(savedMessages));
      if (savedMembers) setMembers(JSON.parse(savedMembers));
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

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_MEMBERS_KEY, JSON.stringify(members));
    } catch (err) {
      // ignore
    }
  }, [members]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getTypeIcon = (type: HouseType) => {
    switch (type) {
      case "group_chat":
        return <MessageSquare size={18} />;
      case "community":
        return <Users size={18} />;
      case "house":
        return <Home size={18} />;
      case "broadcast":
        return <Radio size={18} />;
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

  const getRarityColor = (rarity: HouseRarity) => {
    switch (rarity) {
      case "common":
        return "text-slate-400";
      case "rare":
        return "text-blue-400";
      case "epic":
        return "text-purple-400";
      case "legendary":
        return "text-amber-400";
      case "mythic":
        return "text-rose-400";
      default:
        return "text-slate-400";
    }
  };

  const getRarityBg = (rarity: HouseRarity) => {
    switch (rarity) {
      case "common":
        return "bg-slate-600/20";
      case "rare":
        return "bg-blue-600/20";
      case "epic":
        return "bg-purple-600/20";
      case "legendary":
        return "bg-amber-600/20";
      case "mythic":
        return "bg-rose-600/20";
      default:
        return "bg-slate-600/20";
    }
  };

  const createHouse = () => {
    if (!newHouseName.trim() || !newHousePurpose.trim()) {
      showToast?.("Please enter house name and purpose", "warning");
      return;
    }

    const houseId = `house_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const defaultChannel: Channel = {
      id: `ch_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      houseId,
      name: "general",
      description: "General discussion",
      isPrivate: false,
      createdAt: Date.now(),
    };

    const house: House = {
      id: houseId,
      name: newHouseName.trim(),
      description: newHouseDescription.trim(),
      purpose: newHousePurpose.trim(),
      type: newHouseType,
      rarity: newHouseRarity,
      level: 1,
      influence: 0,
      members: 1,
      isPrivate: newHousePrivate,
      isPinned: false,
      createdAt: Date.now(),
      foundedBy: "You",
      channels: [defaultChannel],
      allyHouses: [],
      rivalHouses: [],
      history: [`House ${newHouseName} founded with purpose: ${newHousePurpose}`],
    };

    setHouses((prev) => [house, ...prev]);
    setMembers((prev) => ({
      ...prev,
      [houseId]: [
        {
          id: "current_user",
          username: "You",
          role: "founder",
          joinedAt: Date.now(),
          isOnline: true,
          influence: 50,
          loyalty: 100,
          powers: ["House Leadership", "Channel Management", "Member Invite"],
        },
      ],
    }));
    showToast?.(`House "${newHouseName}" established! Your destiny awaits.`, "success");
    setNewHouseName("");
    setNewHouseDescription("");
    setNewHousePurpose("");
    setNewHouseType("group_chat");
    setNewHouseRarity("common");
    setNewHousePrivate(false);
    setShowCreateHouseModal(false);
    setSelectedHouseId(houseId);
    setSelectedChannelId(defaultChannel.id);
    setExpandedHouses((prev) => new Set([...prev, houseId]));
  };

  const createChannel = () => {
    if (!newChannelName.trim() || !selectedHouseId) {
      showToast?.("Please enter a channel name", "warning");
      return;
    }

    const channel: Channel = {
      id: `ch_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      houseId: selectedHouseId,
      name: newChannelName.trim().toLowerCase().replace(/\s+/g, "-"),
      description: newChannelDescription.trim(),
      isPrivate: newChannelPrivate,
      createdAt: Date.now(),
    };

    setHouses((prev) =>
      prev.map((h) =>
        h.id === selectedHouseId ? { ...h, channels: [...h.channels, channel] } : h
      )
    );

    showToast?.(`Channel #${channel.name} created!`, "success");
    setNewChannelName("");
    setNewChannelDescription("");
    setNewChannelPrivate(false);
    setShowCreateChannelModal(false);
    setSelectedChannelId(channel.id);
  };

  const sendMessage = () => {
    if (!messageInput.trim() || !selectedHouseId || !selectedChannelId) return;

    const message: Message = {
      id: `msg_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      houseId: selectedHouseId,
      channelId: selectedChannelId,
      userId: "current_user",
      userName: "You",
      content: messageInput.trim(),
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, message]);
    setMessageInput("");
  };

  const toggleHouseExpand = (houseId: string) => {
    setExpandedHouses((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(houseId)) {
        newSet.delete(houseId);
      } else {
        newSet.add(houseId);
      }
      return newSet;
    });
  };

  const renderHousesList = () => (
    <>
      {/* Search */}
      <div className="p-3 border-b border-slate-700/30 flex-shrink-0">
        <div className="relative">
          <Search
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500"
            size={16}
          />
          <input
            type="text"
            placeholder="Find a house..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-50 text-sm placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20 transition-all"
          />
        </div>
      </div>

      {/* Houses & Channels List */}
      <div className="flex-1 overflow-y-auto space-y-1 p-2">
        {houses.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-xs text-slate-400">No houses yet</p>
            <p className="text-xs text-slate-500 mt-1">Create one to get started!</p>
          </div>
        ) : (
          houses.map((house) => (
            <div key={house.id}>
              {/* House Item */}
              <button
                onClick={() => {
                  setSelectedHouseId(house.id);
                  toggleHouseExpand(house.id);
                  if (house.channels.length > 0) {
                    setSelectedChannelId(house.channels[0].id);
                  }
                  setShowHousesSidebar(false);
                }}
                className={`w-full flex items-start gap-2 px-3 py-2 rounded-lg transition-all text-left text-sm font-medium ${selectedHouseId === house.id
                  ? "bg-purple-600/30 text-purple-200"
                  : "text-slate-300 hover:bg-slate-800/60 hover:text-slate-100"
                  }`}
              >
                <ChevronRight
                  size={16}
                  className={`transition-transform flex-shrink-0 mt-0.5 ${expandedHouses.has(house.id) ? "rotate-90" : ""
                    }`}
                />
                <div className={`p-1 rounded flex-shrink-0 mt-0.5 ${getTypeColor(house.type)}`}>
                  {getTypeIcon(house.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="truncate">{house.name}</span>
                    <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${getRarityColor(house.rarity)} ${getRarityBg(house.rarity)}`}>
                      {house.rarity.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-slate-500">Lv. {house.level}</span>
                    <span className="text-xs text-slate-500">Influence: {house.influence}</span>
                  </div>
                </div>
              </button>

              {/* Channels (expandable) */}
              {expandedHouses.has(house.id) && (
                <div className="ml-4 space-y-0.5 py-1 border-l border-slate-700/30 pl-2">
                  {house.channels.map((channel) => (
                    <button
                      key={channel.id}
                      onClick={() => {
                        setSelectedChannelId(channel.id);
                        setShowHousesSidebar(false);
                      }}
                      className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-xs transition-all text-left ${selectedChannelId === channel.id
                        ? "bg-purple-600/20 text-purple-200"
                        : "text-slate-400 hover:bg-slate-800/40 hover:text-slate-300"
                        }`}
                    >
                      <Hash size={14} />
                      <span className="truncate flex-1">{channel.name}</span>
                    </button>
                  ))}

                  {/* Create Channel Button */}
                  {selectedHouseId === house.id && (
                    <button
                      onClick={() => setShowCreateChannelModal(true)}
                      className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-xs text-slate-500 hover:bg-slate-800/40 hover:text-slate-400 transition-all text-left"
                    >
                      <Plus size={14} />
                      <span>Add channel</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </>
  );

  const selectedHouse = houses.find((h) => h.id === selectedHouseId);
  const selectedChannel = selectedHouse?.channels.find((c) => c.id === selectedChannelId);
  const channelMessages = selectedChannelId
    ? messages
      .filter((m) => m.channelId === selectedChannelId)
      .sort((a, b) => a.timestamp - b.timestamp)
    : [];
  const houseMembers = selectedHouseId ? (members[selectedHouseId] || []) : [];

  return (
    <div className="animate-fadeIn pb-24 sm:pb-0 w-full h-full flex flex-col bg-slate-950">
      {/* Header */}
      <div className="h-16 px-4 sm:px-6 border-b border-slate-700/50 bg-gradient-to-r from-slate-900 to-slate-950 flex-shrink-0 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-50">Vynce Houses</h1>
          <p className="text-xs text-slate-400">Exclusive groups built on hierarchy, loyalty, and influence</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowHousesSidebar(!showHousesSidebar)}
            className="sm:hidden p-2 hover:bg-slate-800/60 rounded-lg transition-all text-slate-400 hover:text-slate-50"
            title="Toggle houses list"
          >
            <Menu size={20} />
          </button>
          <button
            onClick={() => setShowCreateHouseModal(true)}
            className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold rounded-lg transition-all shadow-lg shadow-purple-500/25 text-sm"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">Found House</span>
          </button>
        </div>
      </div>

      {/* Main Content - Three Column Layout */}
      <div className="flex-1 flex overflow-hidden gap-0 sm:gap-3 px-2 sm:px-3 py-3 relative">
        {/* Mobile Houses Sidebar Drawer */}
        {showHousesSidebar && (
          <>
            <div
              className="fixed inset-0 bg-black/50 z-30 sm:hidden"
              onClick={() => setShowHousesSidebar(false)}
            ></div>
            <div className="fixed left-0 top-16 bottom-0 w-60 bg-slate-900/95 border-r border-slate-700/50 z-30 sm:hidden overflow-hidden flex flex-col backdrop-blur-sm">
              {renderHousesList()}
            </div>
          </>
        )}

        {/* Left Sidebar - Houses & Channels List (Desktop) */}
        <div className="w-60 hidden sm:flex flex-col bg-slate-900/60 rounded-xl border border-slate-700/30 overflow-hidden">
          {renderHousesList()}
        </div>

        {/* Center - Chat View */}
        <div className="flex-1 flex flex-col bg-slate-900/60 rounded-xl border border-slate-700/30 overflow-hidden">
          {selectedHouse && selectedChannel ? (
            <>
              {/* Chat Header */}
              <div className="h-14 px-4 py-3 border-b border-slate-700/30 bg-slate-900/80 flex-shrink-0 flex items-center justify-between group/header">
                <div className="flex items-center gap-3 min-w-0 flex-1 cursor-help" title={`Purpose: ${selectedHouse.purpose}`}>
                  <div className={`p-2 rounded-lg flex-shrink-0 ${getTypeColor(selectedHouse.type)}`}>
                    {getTypeIcon(selectedHouse.type)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h2 className="font-bold text-slate-50 text-sm truncate">
                        {selectedHouse.name}
                      </h2>
                      <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${getRarityColor(selectedHouse.rarity)} ${getRarityBg(selectedHouse.rarity)}`}>
                        {selectedHouse.rarity.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-slate-400 truncate flex items-center gap-1">
                        <Hash size={12} />
                        {selectedChannel.name}
                      </p>
                      <span className="text-xs text-slate-500">•</span>
                      <p className="text-xs text-slate-500 truncate">Lv. {selectedHouse.level}</p>
                      <span className="hidden sm:inline text-xs text-slate-500">•</span>
                      <p className="hidden sm:inline text-xs text-amber-300">⚡ {selectedHouse.influence}</p>
                    </div>
                  </div>
                </div>

                {/* Header Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => setShowMembersSidebar(!showMembersSidebar)}
                    className="p-2 hover:bg-slate-800/60 rounded-lg transition-all text-slate-400 hover:text-slate-50"
                    title="Toggle members"
                  >
                    <Users size={16} />
                  </button>
                  <button className="p-2 hover:bg-slate-800/60 rounded-lg transition-all text-slate-400 hover:text-slate-50">
                    <MoreVertical size={16} />
                  </button>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-slate-900/20 to-slate-900/40">
                {channelMessages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <MessageSquare size={40} className="text-slate-600 mb-3" />
                    <p className="text-slate-400 font-semibold">No messages yet</p>
                    <p className="text-xs text-slate-500 mt-1">
                      Start the conversation in #{selectedChannel.name}!
                    </p>
                  </div>
                ) : (
                  channelMessages.map((msg) => (
                    <div key={msg.id} className="group">
                      <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-800/30 transition-all">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                          {msg.userName.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <p className="font-semibold text-slate-50 text-sm">
                              {msg.userName}
                            </p>
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
              <div className="px-4 py-3 border-t border-slate-700/30 bg-slate-900/80 flex-shrink-0">
                <div className="flex items-end gap-2">
                  <input
                    type="text"
                    placeholder={`Message #${selectedChannel.name}`}
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                    className="flex-1 px-3 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-50 placeholder-slate-500 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20 transition-all"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!messageInput.trim()}
                    className="p-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-all flex-shrink-0"
                  >
                    <Send size={16} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <Home size={48} className="text-slate-600 mb-4" />
              <p className="text-slate-400 text-lg font-semibold">
                Select a house and channel
              </p>
              <p className="text-slate-500 text-sm mt-2">
                Click the menu icon (☰) to browse houses
              </p>
            </div>
          )}
        </div>

        {/* Right Sidebar - Members List */}
        {showMembersSidebar && selectedHouse && (
          <div className="w-56 hidden lg:flex flex-col bg-slate-900/60 rounded-xl border border-slate-700/30 overflow-hidden">
            <div className="p-3 border-b border-slate-700/30 flex-shrink-0">
              <p className="text-xs font-semibold text-slate-400 uppercase mb-3">
                Members ({houseMembers.length})
              </p>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">House Level:</span>
                  <span className="text-purple-300 font-semibold">{selectedHouse.level}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Influence:</span>
                  <span className={`font-semibold ${getRarityColor(selectedHouse.rarity)}`}>
                    {selectedHouse.influence}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 p-2">
              {houseMembers.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-4">No members</p>
              ) : (
                houseMembers.map((member) => (
                  <div
                    key={member.id}
                    className="p-2 rounded-lg hover:bg-slate-800/40 transition-all group bg-slate-800/20 border border-slate-700/20"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="relative flex-shrink-0">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-xs font-bold text-white">
                          {member.username.charAt(0)}
                        </div>
                        {member.isOnline && (
                          <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border border-slate-900"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-50 truncate">
                          {member.username}
                        </p>
                        <p className="text-xs text-purple-300 capitalize">
                          {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                        </p>
                      </div>
                    </div>
                    <div className="ml-9 space-y-0.5 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Influence:</span>
                        <span className="text-amber-300 font-semibold">{member.influence}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Loyalty:</span>
                        <div className="flex items-center gap-1">
                          <div className="w-12 h-1 bg-slate-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                              style={{ width: `${member.loyalty}%` }}
                            ></div>
                          </div>
                          <span className="text-slate-400 text-xs">{member.loyalty}%</span>
                        </div>
                      </div>
                      {member.powers.length > 0 && (
                        <div className="pt-1 border-t border-slate-700/30">
                          <p className="text-slate-500 text-xs mb-0.5">Powers:</p>
                          <div className="space-y-0.5">
                            {member.powers.map((power, i) => (
                              <p key={i} className="text-purple-300 text-xs">
                                ✦ {power}
                              </p>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Create House Modal */}
      {showCreateHouseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="w-full max-w-md bg-slate-900 rounded-xl border border-slate-700/50 p-6 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-slate-50">Found New House</h2>
                <p className="text-xs text-slate-400 mt-1">Choose wisely. Your house defines your powers.</p>
              </div>
              <button
                onClick={() => setShowCreateHouseModal(false)}
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
                        className={`p-3 rounded-lg font-semibold text-sm transition-all border flex flex-col items-center gap-2 ${newHouseType === type
                          ? "bg-purple-600/40 border-purple-600/50 text-purple-300"
                          : "bg-slate-800/40 border-slate-700/50 text-slate-400 hover:border-slate-600"
                          }`}
                      >
                        {getTypeIcon(type)}
                        <span className="text-xs">
                          {type
                            .split("_")
                            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                            .join(" ")
                            .split(" ")[0]}
                        </span>
                      </button>
                    )
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-2">
                  House Rarity <span className={getRarityColor(newHouseRarity)}>({newHouseRarity})</span>
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {(["common", "rare", "epic", "legendary", "mythic"] as HouseRarity[]).map(
                    (rarity) => (
                      <button
                        key={rarity}
                        onClick={() => setNewHouseRarity(rarity)}
                        className={`p-2 rounded text-xs font-bold transition-all border ${newHouseRarity === rarity
                          ? `${getRarityBg(rarity)} border-current`
                          : "bg-slate-800/40 border-slate-700/50 text-slate-500 hover:border-slate-600"
                          } ${newHouseRarity === rarity ? getRarityColor(rarity) : ""}`}
                      >
                        {rarity.charAt(0).toUpperCase()}
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
                  Purpose
                </label>
                <textarea
                  placeholder="What is your house destiny? (e.g., 'Unite the strongest warriors' or 'Build a sanctuary for artists')"
                  value={newHousePurpose}
                  onChange={(e) => setNewHousePurpose(e.target.value)}
                  rows={2}
                  maxLength={150}
                  className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-50 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all resize-none"
                />
                <p className="text-xs text-slate-500 mt-1">{newHousePurpose.length}/150</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-2">
                  Description
                </label>
                <textarea
                  placeholder="Detailed description and history"
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
                Establish House
              </button>
              <button
                onClick={() => setShowCreateHouseModal(false)}
                className="flex-1 px-4 py-2.5 bg-slate-800/50 hover:bg-slate-800 text-slate-300 font-semibold rounded-lg border border-slate-700/50 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Channel Modal */}
      {showCreateChannelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="w-full max-w-md bg-slate-900 rounded-xl border border-slate-700/50 p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-slate-50">Create New Channel</h2>
              <button
                onClick={() => setShowCreateChannelModal(false)}
                className="p-2 hover:bg-slate-800 rounded-lg transition-all text-slate-400 hover:text-slate-50"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-2">Name</label>
                <div className="flex items-center gap-2">
                  <Hash size={18} className="text-slate-500 flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="channel-name"
                    value={newChannelName}
                    onChange={(e) => setNewChannelName(e.target.value)}
                    className="flex-1 px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-50 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-2">
                  Description
                </label>
                <textarea
                  placeholder="What's this channel about?"
                  value={newChannelDescription}
                  onChange={(e) => setNewChannelDescription(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-50 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all resize-none"
                />
              </div>

              <div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newChannelPrivate}
                    onChange={(e) => setNewChannelPrivate(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-700 bg-slate-800"
                  />
                  <span className="text-sm text-slate-300">Private Channel</span>
                  <Lock size={14} className="text-slate-500" />
                </label>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={createChannel}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold rounded-lg transition-all"
              >
                Create Channel
              </button>
              <button
                onClick={() => setShowCreateChannelModal(false)}
                className="flex-1 px-4 py-2.5 bg-slate-800/50 hover:bg-slate-800 text-slate-300 font-semibold rounded-lg border border-slate-700/50 transition-all"
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
