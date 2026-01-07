"use client";

import { api } from "@/lib/api";
import socket from "@/lib/socket";
import { useAppStore } from "@/lib/store";
import { House, HouseMessage, HouseType } from "@/types";
import {
  Copy,
  Hash,
  Home,
  Mail,
  Menu,
  MessageCircle,
  MessageSquare,
  MoreVertical,
  Plus,
  Radio,
  Search,
  Send,
  Share2,
  Users,
  X
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { CreateChannelModal } from "./house/CreateChannelModal";
import { CreateHouseModal } from "./house/CreateHouseModal";
import { HouseMember } from "./house/HouseConstants";
import HouseList from "./house/HouseList";
import { MembersSidebar } from "./house/MembersSidebar";

export default function VynceHousePage() {
  const { showToast } = useAppStore();
  const [houses, setHouses] = useState<House[]>([]);
  const [channelMessages, setChannelMessages] = useState<HouseMessage[]>([]);
  const [selectedHouseId, setSelectedHouseId] = useState<string | null>(null);
  const [selectedChannelId, setSelectedChannelId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const [showCreateHouseModal, setShowCreateHouseModal] = useState(false);
  const [showCreateChannelModal, setShowCreateChannelModal] = useState(false);
  const [newHouseName, setNewHouseName] = useState("");
  const [newHouseDescription, setNewHouseDescription] = useState("");
  const [newHouseType, setNewHouseType] = useState<House["type"]>("group_chat");
  const [newHousePrivate, setNewHousePrivate] = useState(false);
  const [newHousePurpose, setNewHousePurpose] = useState("");
  const [newChannelName, setNewChannelName] = useState("");
  const [newChannelDescription, setNewChannelDescription] = useState("");
  const [newChannelPrivate, setNewChannelPrivate] = useState(false);
  const [members, setMembers] = useState<Record<string, HouseMember[]>>({});
  const [expandedHouses, setExpandedHouses] = useState<Set<string>>(new Set());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showMembersSidebar, setShowMembersSidebar] = useState(true);
  const [showHousesSidebar, setShowHousesSidebar] = useState(false);
  const [showMembersDrawer, setShowMembersDrawer] = useState(false);
  const [showGlobalSearch, setShowGlobalSearch] = useState(false);
  const [globalSearchQuery, setGlobalSearchQuery] = useState("");
  const [showShareHouseSheet, setShowShareHouseSheet] = useState(false);
  // Touch/swipe state for mobile gestures (edge swipes only)
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [touching, setTouching] = useState(false);
  // Header scroll behavior state
  const [headerVisible, setHeaderVisible] = useState(true);
  const lastScrollY = useRef(0);

  // Load houses from API
  useEffect(() => {
    const loadHouses = async () => {
      try {
        const res = await api.get("/houses");
        setHouses(res.data);
        if (res.data.length > 0) {
          setSelectedHouseId(res.data[0]._id);
          if (res.data[0].channels.length > 0) {
            setSelectedChannelId(res.data[0].channels[0]._id);
            setExpandedHouses(new Set([res.data[0]._id]));
          }
        }
      } catch (error) {
        console.error("Failed to load houses:", error);
      }
    };
    loadHouses();
  }, []);

  // Load messages when channel changes
  useEffect(() => {
    if (selectedHouseId && selectedChannelId) {
      const loadMessages = async () => {
        try {
          const res = await api.get(`/houses/${selectedHouseId}/channels/${selectedChannelId}/messages`);
          setChannelMessages(res.data);
        } catch (error) {
          console.error("Failed to load messages:", error);
        }
      };
      loadMessages();
    }
  }, [selectedHouseId, selectedChannelId]);

  // Socket setup
  useEffect(() => {
    const userId = localStorage.getItem("userId"); // Assuming userId is stored
    if (userId) {
      socket.emit("join-user-room", userId);
    }

    socket.on("new-house-message", (message: HouseMessage) => {
      if (message.houseId === selectedHouseId && message.channelId === selectedChannelId) {
        setChannelMessages(prev => [...prev, message]);
      }
    });

    return () => {
      socket.off("new-house-message");
    };
  }, [selectedHouseId, selectedChannelId]);

  // Join/leave house channels
  useEffect(() => {
    if (selectedHouseId && selectedChannelId) {
      const userId = localStorage.getItem("userId");
      socket.emit("join-house-channel", { houseId: selectedHouseId, channelId: selectedChannelId, userId });
    }

    return () => {
      if (selectedHouseId && selectedChannelId) {
        socket.emit("leave-house-channel", { houseId: selectedHouseId, channelId: selectedChannelId });
      }
    };
  }, [selectedHouseId, selectedChannelId]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [channelMessages]);

  // Header scroll behavior - hide on scroll down, show on scroll up
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollingDown = currentScrollY > lastScrollY.current;
      const scrollDelta = Math.abs(currentScrollY - lastScrollY.current);

      // Only trigger on significant scroll changes to avoid jitter
      if (scrollDelta > 5) {
        if (scrollingDown && currentScrollY > 50) {
          setHeaderVisible(false);
        } else if (!scrollingDown) {
          setHeaderVisible(true);
        }
        lastScrollY.current = currentScrollY;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  const createHouse = async () => {
    if (!newHouseName.trim() || !newHousePurpose.trim()) {
      showToast?.("Please enter house name and purpose", "warning");
      return;
    }

    try {
      const res = await api.post("/houses", {
        name: newHouseName.trim(),
        description: newHouseDescription.trim(),
        purpose: newHousePurpose.trim(),
        type: newHouseType,
      });

      // Add the created house to the state
      setHouses((prev) => [res.data, ...prev]);
      showToast?.(`House "${newHouseName}" established! Your destiny awaits.`, "success");
      setNewHouseName("");
      setNewHouseDescription("");
      setNewHousePurpose("");
      setNewHouseType("group_chat");
      setNewHousePrivate(false);
      setShowCreateHouseModal(false);
      setSelectedHouseId(res.data._id);
      if (res.data.channels && res.data.channels.length > 0) {
        setSelectedChannelId(res.data.channels[0]._id);
        setExpandedHouses((prev) => new Set([...prev, res.data._id]));
      }
    } catch (error) {
      console.error("Failed to create house:", error);
      showToast?.("Failed to create house", "error");
    }
  };

  const createChannel = async () => {
    if (!newChannelName.trim() || !selectedHouseId) {
      showToast?.("Please enter a channel name", "warning");
      return;
    }

    try {
      const res = await api.post(`/houses/${selectedHouseId}/channels`, {
        name: newChannelName.trim().toLowerCase().replace(/\s+/g, "-"),
        description: newChannelDescription.trim(),
      });

      // Update houses state
      setHouses((prev) =>
        prev.map((h) =>
          h._id === selectedHouseId ? { ...h, channels: [...h.channels, res.data] } : h
        )
      );

      showToast?.(`Channel #${res.data.name} created!`, "success");
      setNewChannelName("");
      setNewChannelDescription("");
      setNewChannelPrivate(false);
      setShowCreateChannelModal(false);
      setSelectedChannelId(res.data._id);
    } catch (error) {
      console.error("Failed to create channel:", error);
      showToast?.("Failed to create channel", "error");
    }
  };

  const joinHouse = (houseId: string) => {
    const house = houses.find(h => h._id === houseId);
    if (!house) return;

    // Check if already a member
    if (members[houseId]?.some(m => m.username === "You")) {
      showToast?.(`You're already a member of ${house.name}`, "info");
      return;
    }

    // Add user as member
    setMembers((prev) => ({
      ...prev,
      [houseId]: [
        ...(prev[houseId] || []),
        {
          id: `member_${Date.now()}`,
          username: "You",
          role: "member",
          joinedAt: Date.now(),
          isOnline: true,
          influence: 10,
          loyalty: 50,
          powers: [],
        },
      ],
    }));

    // Update house members count
    setHouses((prev) =>
      prev.map((h) =>
        h._id === houseId ? { ...h, members: h.members + 1 } : h
      )
    );

    showToast?.(`Joined ${house.name}!`, "success");
    setSelectedHouseId(houseId);
    if (house.channels.length > 0) {
      setSelectedChannelId(house.channels[0]._id);
      setExpandedHouses((prev) => new Set([...prev, houseId]));
    }
    setShowGlobalSearch(false);
  };

  const shareHouse = (option: string) => {
    if (!selectedHouse) return;
    const houseUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/houses?house=${selectedHouse._id}`;
    const shareText = `Check out "${selectedHouse.name}" on Vynce! 🏰\n${selectedHouse.description}\nLevel: ${selectedHouse.level} | Influence: ${selectedHouse.influence}`;

    switch (option) {
      case "copy":
        navigator.clipboard.writeText(houseUrl);
        showToast?.("House link copied!", "success");
        break;
      case "dm":
        showToast?.("DM feature coming soon", "info");
        break;
      case "email":
        window.location.href = `mailto:?subject=Check out ${selectedHouse.name} on Vynce&body=${shareText}\n\n${houseUrl}`;
        break;
      case "share":
        if (navigator.share) {
          navigator.share({
            title: selectedHouse.name,
            text: shareText,
            url: houseUrl,
          });
        }
        break;
    }
    setShowShareHouseSheet(false);
  };

  const sendMessage = async () => {
    if (!messageInput.trim() || !selectedHouseId || !selectedChannelId) return;

    try {
      const res = await api.post(`/houses/${selectedHouseId}/channels/${selectedChannelId}/messages`, {
        content: messageInput.trim(),
      });

      // Emit to socket
      socket.emit("send-house-message", {
        houseId: selectedHouseId,
        channelId: selectedChannelId,
        message: res.data,
      });

      setMessageInput("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
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

  const selectedHouse = houses.find((h) => h._id === selectedHouseId);
  const selectedChannel = selectedHouse?.channels.find((c) => c._id === selectedChannelId);
  const houseMembers = selectedHouseId ? (members[selectedHouseId] || []) : [];

  return (
    <div className="animate-fadeIn w-full h-full flex flex-col bg-slate-950">
      {/* Header */}
      <div
        className={`sticky top-0 h-16 px-4 sm:px-6 border-b border-slate-700/30 bg-slate-900/60 backdrop-blur-sm shadow-sm flex-shrink-0 flex items-center justify-between transition-transform duration-300 ease-out ${
          headerVisible ? 'transform translate-y-0' : 'transform -translate-y-full'
        }`}
        style={{ zIndex: 10 }}
      >
        <div>
          <h1 className="text-2xl font-black text-slate-50">Vynce Houses</h1>
          <p className="text-xs text-slate-400">Exclusive groups built on hierarchy, loyalty, and influence</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowHousesSidebar(true)}
            className="sm:hidden p-2 hover:bg-slate-800/60 rounded-lg transition-all text-slate-400 hover:text-slate-50"
            title="Browse houses"
            aria-label="Open houses menu"
          >
            <Menu size={20} />
          </button>
          <button
            onClick={() => setShowGlobalSearch(true)}
            className="flex sm:hidden p-2 hover:bg-slate-800/60 rounded-lg transition-all text-slate-400 hover:text-slate-50"
            title="Search public houses"
            aria-label="Search houses"
          >
            <Search size={18} />
          </button>
          <button
            onClick={() => setShowGlobalSearch(true)}
            className="hidden sm:flex items-center gap-2 px-3 py-2 bg-slate-800/50 hover:bg-slate-800 text-slate-300 rounded-lg transition-all text-sm border border-slate-700/50"
            title="Search public houses"
          >
            <Search size={16} />
            <span>Search Houses</span>
          </button>
          <button
            onClick={() => setShowCreateHouseModal(true)}
            className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold rounded-lg transition-all shadow-lg shadow-purple-500/25 text-sm"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">Create House</span>
          </button>
        </div>
      </div>

      {/* Main Content - Three Column Layout */}
      <div
        className="flex-1 flex overflow-hidden gap-0 sm:gap-3 px-2 sm:px-3 py-3 relative"
        onTouchStart={(e) => {
          const t = e.touches[0];
          setTouchStartX(t.clientX);
          setTouchStartY(t.clientY);
          setTouching(true);
        }}
        onTouchMove={(e) => {
          if (!touching || touchStartX == null || touchStartY == null) return;
          const t = e.touches[0];
          const dx = t.clientX - touchStartX;
          const dy = t.clientY - touchStartY;
          if (Math.abs(dy) > Math.abs(dx)) return; // vertical scroll
          const EDGE = 28; // px edge activation
          // Start near left edge + swipe right -> open houses drawer
          if (touchStartX <= EDGE && dx > 50) {
            setShowHousesSidebar(true);
            setTouching(false);
            setTouchStartX(null);
            setTouchStartY(null);
            return;
          }
          // Start near right edge + swipe left -> open members drawer (mobile/tablet)
          if (typeof window !== "undefined") {
            const vw = window.innerWidth || 0;
            if (touchStartX >= vw - EDGE && dx < -50) {
              setShowMembersDrawer(true);
              setTouching(false);
              setTouchStartX(null);
              setTouchStartY(null);
              return;
            }
          }
          // Close houses drawer by swiping left
          if (showHousesSidebar && dx < -50) {
            setShowHousesSidebar(false);
            setTouching(false);
            setTouchStartX(null);
            setTouchStartY(null);
            return;
          }
          // Close members drawer by swiping right
          if (showMembersDrawer && dx > 50) {
            setShowMembersDrawer(false);
            setTouching(false);
            setTouchStartX(null);
            setTouchStartY(null);
            return;
          }
        }}
      >
        {/* Left Sidebar - Houses List (Desktop Only) */}
        <div className="hidden sm:flex sm:w-56 flex-col bg-slate-900/50 rounded-xl border border-slate-700/20 overflow-hidden flex-shrink-0">
          <HouseList
            searchQuery={searchQuery}
            houses={houses}
            selectedHouseId={selectedHouseId}
            selectedChannelId={selectedChannelId}
            expandedHouses={expandedHouses}
            onSelectHouse={(houseId) => {
              setSelectedHouseId(houseId);
              toggleHouseExpand(houseId);
              const house = houses.find(h => h._id === houseId);
              if (house && house.channels.length > 0) {
                setSelectedChannelId(house.channels[0]._id);
              }
              setShowHousesSidebar(false);
            }}
            onSelectChannel={(channelId) => {
              setSelectedChannelId(channelId);
              setShowHousesSidebar(false);
            }}
            onToggleExpand={toggleHouseExpand}
            onClose={() => setShowHousesSidebar(false)}
            onCreateChannel={() => setShowCreateChannelModal(true)}
            getTypeIcon={getTypeIcon}
            getTypeColor={getTypeColor}
          />
        </div>

        {/* Mobile Houses Drawer (slide from left) */}
        {showHousesSidebar && (
          <div className="fixed inset-0 z-40 sm:hidden">
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setShowHousesSidebar(false)}
            />
            <div className="absolute inset-y-0 left-0 w-64 bg-slate-900/95 backdrop-blur-md border-r border-slate-700/30 shadow-2xl overflow-hidden flex flex-col">
              <HouseList
                searchQuery={searchQuery}
                houses={houses}
                selectedHouseId={selectedHouseId}
                selectedChannelId={selectedChannelId}
                expandedHouses={expandedHouses}
                onSelectHouse={(houseId) => {
                  setSelectedHouseId(houseId);
                  toggleHouseExpand(houseId);
                  const house = houses.find(h => h._id === houseId);
                  if (house && house.channels.length > 0) {
                    setSelectedChannelId(house.channels[0]._id);
                  }
                  setShowHousesSidebar(false);
                }}
                onSelectChannel={(channelId) => {
                  setSelectedChannelId(channelId);
                  setShowHousesSidebar(false);
                }}
                onToggleExpand={toggleHouseExpand}
                onClose={() => setShowHousesSidebar(false)}
                onCreateChannel={() => setShowCreateChannelModal(true)}
                getTypeIcon={getTypeIcon}
                getTypeColor={getTypeColor}
              />
            </div>
          </div>
        )}

        {/* Center - Chat View */}
        <div className="flex-1 flex flex-col bg-slate-900/40 rounded-xl sm:border border-slate-700/10 overflow-hidden transition-all">
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
                    onClick={() => setShowShareHouseSheet(true)}
                    className="p-2 hover:bg-slate-800/60 rounded-lg transition-all text-slate-400 hover:text-slate-50"
                    title="Share house"
                    aria-label="Share this house"
                  >
                    <Share2 size={16} />
                  </button>
                  <button
                    onClick={() => {
                      if (typeof window !== "undefined" && window.innerWidth < 640) {
                        setShowMembersDrawer(true);
                      } else {
                        setShowMembersSidebar(!showMembersSidebar);
                      }
                    }}
                    className="p-2 hover:bg-slate-800/60 rounded-lg transition-all text-slate-400 hover:text-slate-50"
                    title="Members (open list)"
                    aria-label="Open members list"
                  >
                    <Users size={16} />
                  </button>
                  <button
                    onClick={() => showToast?.('Channel options coming soon', 'info')}
                    className="p-2 hover:bg-slate-800/60 rounded-lg transition-all text-slate-400 hover:text-slate-50"
                    title="Channel options"
                    aria-label="Channel options"
                  >
                    <MoreVertical size={16} />
                  </button>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-slate-900/20 to-slate-900/40 flex flex-col justify-end">
                {channelMessages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center flex-1">
                    <MessageSquare size={40} className="text-slate-600 mb-3" />
                    <p className="text-slate-400 font-semibold">No messages yet</p>
                    <p className="text-xs text-slate-500 mt-1">
                      Start the conversation in #{selectedChannel.name}!
                    </p>
                  </div>
                ) : (
                  channelMessages.map((msg) => (
                    <div key={msg._id} className="group">
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
              <div className="px-4 py-3 border-t border-slate-700/20 bg-slate-900/70 flex-shrink-0">
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
                    className="flex-1 px-3 py-3 sm:py-2 bg-slate-800/50 border border-slate-700/40 rounded-2xl text-slate-50 placeholder-slate-500 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20 transition-all"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!messageInput.trim()}
                    className="p-3 sm:p-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-2xl transition-all flex-shrink-0 shadow-sm"
                  >
                    <Send size={18} />
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
        <MembersSidebar
          showMembersSidebar={showMembersSidebar}
          showMembersDrawer={showMembersDrawer}
          selectedHouse={selectedHouse}
          houseMembers={houseMembers}
          onCloseSidebar={() => setShowMembersSidebar(false)}
          onCloseDrawer={() => setShowMembersDrawer(false)}
        />
      </div>


      {/* Create House Modal */}
      <CreateHouseModal
        isOpen={showCreateHouseModal}
        onClose={() => setShowCreateHouseModal(false)}
        newHouseType={newHouseType}
        setNewHouseType={setNewHouseType}
        newHouseName={newHouseName}
        setNewHouseName={setNewHouseName}
        newHousePurpose={newHousePurpose}
        setNewHousePurpose={setNewHousePurpose}
        newHouseDescription={newHouseDescription}
        setNewHouseDescription={setNewHouseDescription}
        newHousePrivate={newHousePrivate}
        setNewHousePrivate={setNewHousePrivate}
        onCreateHouse={createHouse}
        getTypeIcon={getTypeIcon}
      />

      {/* Create Channel Modal */}
      <CreateChannelModal
        isOpen={showCreateChannelModal}
        onClose={() => setShowCreateChannelModal(false)}
        newChannelName={newChannelName}
        setNewChannelName={setNewChannelName}
        newChannelDescription={newChannelDescription}
        setNewChannelDescription={setNewChannelDescription}
        newChannelPrivate={newChannelPrivate}
        setNewChannelPrivate={setNewChannelPrivate}
        onCreateChannel={createChannel}
      />

      {/* Global House Search Modal */}
      {showGlobalSearch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="w-full max-w-2xl bg-slate-900 rounded-xl border border-slate-700/50 p-6 space-y-6 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-slate-50">Discover Houses</h2>
                <p className="text-xs text-slate-400 mt-1">Explore and join public houses</p>
              </div>
              <button
                onClick={() => setShowGlobalSearch(false)}
                className="p-2 hover:bg-slate-800 rounded-lg transition-all text-slate-400 hover:text-slate-50"
              >
                <X size={20} />
              </button>
            </div>

            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                size={18}
              />
              <input
                type="text"
                placeholder="Search public houses by name or type..."
                value={globalSearchQuery}
                onChange={(e) => setGlobalSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-50 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                autoFocus
              />
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {houses
                .filter((h) => !h.isPrivate)
                .filter((h) =>
                  globalSearchQuery.toLowerCase() === ""
                    ? true
                    : h.name.toLowerCase().includes(globalSearchQuery.toLowerCase()) ||
                    h.description.toLowerCase().includes(globalSearchQuery.toLowerCase()) ||
                    h.type.toLowerCase().includes(globalSearchQuery.toLowerCase())
                )
                .map((house) => (
                  <div
                    key={house._id}
                    className="p-4 rounded-lg bg-slate-800/30 border border-slate-700/30 hover:border-slate-700/60 transition-all cursor-pointer group"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-start gap-3 flex-1">
                        <div className={`p-2 rounded-lg flex-shrink-0 ${getTypeColor(house.type)}`}>
                          {getTypeIcon(house.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-sm font-bold text-slate-50 truncate">{house.name}</h3>
                          </div>
                          <p className="text-xs text-slate-400 line-clamp-2">{house.description}</p>
                          <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                            <span>Lv. {house.level}</span>
                            <span>•</span>
                            <span>{house.members} members</span>
                            <span>•</span>
                            <span>⚡ {house.influence}</span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => joinHouse(house._id)}
                        className="ml-2 px-3 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white text-xs font-bold rounded-lg transition-all flex-shrink-0"
                      >
                        Join
                      </button>
                    </div>
                  </div>
                ))}
              {houses.filter((h) => !h.isPrivate).length === 0 && (
                <div className="text-center py-8">
                  <p className="text-slate-400">No public houses yet</p>
                  <p className="text-xs text-slate-500 mt-1">Create a public house to get started!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* House Share Sheet */}
      {showShareHouseSheet && selectedHouse && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-fadeIn"
            onClick={() => setShowShareHouseSheet(false)}
          />

          {/* Sheet */}
          <div className={`fixed inset-x-0 bottom-0 z-50 animate-slideIn max-w-2xl mx-auto p-4`}>
            <div className={`rounded-3xl bg-slate-800 border border-slate-700 overflow-hidden shadow-2xl`}>
              {/* Header */}
              <div className={`flex items-center justify-between p-4 border-b border-slate-700`}>
                <h3 className={`text-lg font-bold text-slate-50`}>Share {selectedHouse.name}</h3>
                <button
                  onClick={() => setShowShareHouseSheet(false)}
                  className={`p-2 rounded-lg hover:bg-slate-700/50 transition-colors focus:outline-none focus-visible:outline-2 focus-visible:outline-purple-500`}
                >
                  <X size={20} className={`text-slate-400`} />
                </button>
              </div>

              {/* Share Options */}
              <div className="p-4 grid grid-cols-2 gap-3">
                <button
                  onClick={() => shareHouse("copy")}
                  className={`flex flex-col items-center gap-3 p-4 rounded-2xl transition-all hover:scale-105 bg-slate-700/30 hover:bg-slate-700/50 border border-slate-600/50 focus:outline-none focus-visible:outline-2 focus-visible:outline-purple-500`}
                >
                  <div className={`p-3 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500`}>
                    <Copy size={24} className="text-white" />
                  </div>
                  <span className={`text-sm font-semibold text-slate-50 text-center`}>Copy Link</span>
                </button>

                <button
                  onClick={() => shareHouse("dm")}
                  className={`flex flex-col items-center gap-3 p-4 rounded-2xl transition-all hover:scale-105 bg-slate-700/30 hover:bg-slate-700/50 border border-slate-600/50 focus:outline-none focus-visible:outline-2 focus-visible:outline-purple-500`}
                >
                  <div className={`p-3 rounded-full bg-gradient-to-br from-purple-500 to-pink-500`}>
                    <MessageCircle size={24} className="text-white" />
                  </div>
                  <span className={`text-sm font-semibold text-slate-50 text-center`}>Send DM</span>
                </button>

                <button
                  onClick={() => shareHouse("email")}
                  className={`flex flex-col items-center gap-3 p-4 rounded-2xl transition-all hover:scale-105 bg-slate-700/30 hover:bg-slate-700/50 border border-slate-600/50 focus:outline-none focus-visible:outline-2 focus-visible:outline-purple-500`}
                >
                  <div className={`p-3 rounded-full bg-gradient-to-br from-orange-500 to-red-500`}>
                    <Mail size={24} className="text-white" />
                  </div>
                  <span className={`text-sm font-semibold text-slate-50 text-center`}>Email</span>
                </button>

                <button
                  onClick={() => shareHouse("share")}
                  className={`flex flex-col items-center gap-3 p-4 rounded-2xl transition-all hover:scale-105 bg-slate-700/30 hover:bg-slate-700/50 border border-slate-600/50 focus:outline-none focus-visible:outline-2 focus-visible:outline-purple-500`}
                >
                  <div className={`p-3 rounded-full bg-gradient-to-br from-green-500 to-cyan-500`}>
                    <Share2 size={24} className="text-white" />
                  </div>
                  <span className={`text-sm font-semibold text-slate-50 text-center`}>More Options</span>
                </button>
              </div>

              {/* Link Input */}
              <div className={`p-4 border-t border-slate-700`}>
                <label className={`block text-sm font-semibold text-slate-400 mb-2`}>House Link</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={`${typeof window !== "undefined" ? window.location.origin : ""}/houses?house=${selectedHouse._id}`}
                    readOnly
                    className={`flex-1 px-4 py-2 rounded-lg bg-slate-700 border border-slate-600 text-slate-50 outline-none min-h-[40px] text-sm`}
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`${typeof window !== "undefined" ? window.location.origin : ""}/houses?house=${selectedHouse._id}`);
                      showToast?.("House link copied!", "success");
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
      )}
    </div >
  );
}
