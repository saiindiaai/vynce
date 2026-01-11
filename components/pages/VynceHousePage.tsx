"use client";

import { api } from "@/lib/api";
import socket from "@/lib/socket";
import { useAppStore } from "@/lib/store";
import { House, HouseMessage, HouseType } from "@/types";
import {
  Hash,
  Home,
  Menu,
  MessageSquare,
  MoreVertical,
  Plus,
  Radio,
  Search,
  Send,
  Share2,
  Users
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CreateChannelModal } from "./house/CreateChannelModal";
import { CreateHouseModal } from "./house/CreateHouseModal";
import { EditHouseModal } from "./house/EditHouseModal";
import GlobalHouseSearch from "./house/GlobalHouseSearch";
import { HouseMember } from "./house/HouseConstants";
import { HouseInfoModal } from "./house/HouseInfoModal";
import HouseList from "./house/HouseList";
import HouseMembersDropdown from "./house/HouseMembersDropdown";
import HouseMenu from "./house/HouseMenu";
import HouseShareSheet from "./house/HouseShareSheet";
import { ManageMembersModal } from "./house/ManageMembersModal";
import { MembersSidebar } from "./house/MembersSidebar";

export default function VynceHousePage() {
  const { showToast, sidebarOpen, currentUser } = useAppStore();
  const searchParams = useSearchParams();
  const [houses, setHouses] = useState<House[]>([]);
  const [channelMessages, setChannelMessages] = useState<HouseMessage[]>([]);
  const [selectedHouseId, setSelectedHouseId] = useState<string | null>(null);
  const [selectedChannelId, setSelectedChannelId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const [showCreateHouseModal, setShowCreateHouseModal] = useState(false);
  const [showCreateChannelModal, setShowCreateChannelModal] = useState(false);
  const [showEditHouseModal, setShowEditHouseModal] = useState(false);
  const [showManageMembersModal, setShowManageMembersModal] = useState(false);
  const [showHouseInfoModal, setShowHouseInfoModal] = useState(false);
  const [editingHouse, setEditingHouse] = useState<House | null>(null);
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
  const [globalSearchResults, setGlobalSearchResults] = useState<House[]>([]);
  const [showShareHouseSheet, setShowShareHouseSheet] = useState(false);
  const [showHouseMenu, setShowHouseMenu] = useState(false);
  const [showMembersDropdown, setShowMembersDropdown] = useState(false);
  // Touch/swipe state for mobile gestures (edge swipes only)
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [touching, setTouching] = useState(false);

  // Load houses from API
  useEffect(() => {
    const loadHouses = async () => {
      try {
        const res = await api.get("/houses");
        setHouses(res.data);

        // Check if there's a discover query parameter (for discovery search)
        const discoverParam = searchParams.get("discover");

        if (discoverParam) {
          // Open the discovery modal and auto-search the house name
          setShowGlobalSearch(true);
          setGlobalSearchQuery(discoverParam);
        } else {
          // Default behavior - select first house
          if (res.data.length > 0) {
            setSelectedHouseId(res.data[0]._id);
            if (res.data[0].channels.length > 0) {
              setSelectedChannelId(res.data[0].channels[0]._id);
              setExpandedHouses(new Set([res.data[0]._id]));
            }
          }
        }
      } catch (error) {
        console.error("Failed to load houses:", error);
      }
    };
    loadHouses();
  }, [searchParams]);

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

  // Load house members when house changes
  useEffect(() => {
    if (!selectedHouseId) return;

    const selectedHouse = houses.find((h) => h._id === selectedHouseId);
    if (!selectedHouse) return;

    const loadMembers = async () => {
      try {
        // Get members from the house data (now populated)
        const approvedMembers: HouseMember[] = (selectedHouse.members || []).map((member: any) => ({
          id: member._id || member.id || member,
          username: member.username || 'Unknown',
          role: 'member',
          isOnline: false,
          joinedAt: Date.now(), // We don't have this info
          influence: 0,
          loyalty: 0,
          powers: []
        }));

        // Always include creator at the top
        const founderId = typeof selectedHouse.foundedBy === 'object' && selectedHouse.foundedBy
          ? (selectedHouse.foundedBy as any)._id || (selectedHouse.foundedBy as any).id
          : selectedHouse.foundedBy as string;
        const founderUsername = typeof selectedHouse.foundedBy === 'object' && selectedHouse.foundedBy
          ? (selectedHouse.foundedBy as any).username || 'Creator'
          : 'Creator';

        const creatorMember: HouseMember = {
          id: founderId,
          username: founderUsername,
          role: 'founder',
          isOnline: false,
          joinedAt: typeof selectedHouse.createdAt === 'number' ? selectedHouse.createdAt : Date.now(),
          influence: 0,
          loyalty: 0,
          powers: []
        };

        // Combine creator + approved members, avoiding duplicates
        const allMembers: HouseMember[] = [creatorMember];
        approvedMembers.forEach((member: HouseMember) => {
          if (member.id !== creatorMember.id) {
            allMembers.push(member);
          }
        });

        setMembers(prev => ({
          ...prev,
          [selectedHouseId]: allMembers
        }));
      } catch (err) {
        console.error("Failed to load house members", err);
        // Even if something fails, still include creator
        const founderId = typeof selectedHouse.foundedBy === 'object' && selectedHouse.foundedBy
          ? (selectedHouse.foundedBy as any)._id || (selectedHouse.foundedBy as any).id
          : selectedHouse.foundedBy as string;
        const founderUsername = typeof selectedHouse.foundedBy === 'object' && selectedHouse.foundedBy
          ? (selectedHouse.foundedBy as any).username || 'Creator'
          : 'Creator';

        const creatorMember: HouseMember = {
          id: founderId,
          username: founderUsername,
          role: 'founder',
          isOnline: false,
          joinedAt: typeof selectedHouse.createdAt === 'number' ? selectedHouse.createdAt : Date.now(),
          influence: 0,
          loyalty: 0,
          powers: []
        };

        setMembers(prev => ({
          ...prev,
          [selectedHouseId]: [creatorMember]
        }));
      }
    };

    loadMembers();
  }, [selectedHouseId, houses]);

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

  // Global house search
  useEffect(() => {
    const searchHouses = async () => {
      if (globalSearchQuery.length >= 2) {
        try {
          const res = await api.get(`/houses/search?q=${encodeURIComponent(globalSearchQuery)}`);
          setGlobalSearchResults(res.data);
        } catch (error) {
          console.error("Failed to search houses:", error);
          setGlobalSearchResults([]);
        }
      } else {
        setGlobalSearchResults([]);
      }
    };

    const debounceTimer = setTimeout(searchHouses, 100); // Debounce search
    return () => clearTimeout(debounceTimer);
  }, [globalSearchQuery]);

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

  const getUserRole = (house: House) => {
    const userId = localStorage.getItem("userId");
    if (!userId || !house) return null;

    if (house.foundedBy === userId || (house.foundedBy as any)?._id === userId) {
      return "creator";
    }
    // members can be a number (count) or array of member ids; handle both safely
    if (Array.isArray(house.members) && house.members.includes(userId)) {
      return "member";
    }
    return null;
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

  const openEditHouseModal = (house: House) => {
    setEditingHouse(house);
    setNewHouseName(house.name);
    setNewHouseDescription(house.description || "");
    setNewHousePurpose(house.purpose || "");
    setNewHouseType(house.type);
    setNewHousePrivate(house.isPrivate || false);
    setShowEditHouseModal(true);
  };

  const editHouse = async () => {
    if (!editingHouse || !newHouseName.trim() || !newHousePurpose.trim()) {
      showToast?.("Please enter house name and purpose", "warning");
      return;
    }

    try {
      const res = await api.put(`/houses/${editingHouse._id}`, {
        name: newHouseName.trim(),
        description: newHouseDescription.trim(),
        purpose: newHousePurpose.trim(),
        type: newHouseType,
        isPrivate: newHousePrivate,
      });

      // Update houses state
      setHouses((prev) =>
        prev.map((h) => (h._id === editingHouse._id ? res.data : h))
      );
      showToast?.(`House "${newHouseName}" updated successfully!`, "success");
      setShowEditHouseModal(false);
      setEditingHouse(null);
    } catch (error) {
      console.error("Failed to edit house:", error);
      showToast?.("Failed to edit house", "error");
    }
  };

  const openManageMembersModal = (house: House) => {
    setEditingHouse(house);
    setShowManageMembersModal(true);
  };

  const removeMember = async (memberId: string) => {
    if (!editingHouse) return;

    try {
      await api.post(`/houses/${editingHouse._id}/members/${memberId}/remove`);
      // Update houses state
      setHouses((prev) =>
        prev.map((h) =>
          h._id === editingHouse._id
            ? { ...h, members: h.members.filter((m) => m !== memberId) }
            : h
        )
      );
      showToast?.("Member removed successfully", "success");
    } catch (error) {
      console.error("Failed to remove member:", error);
      showToast?.("Failed to remove member", "error");
    }
  };

  const openHouseInfoModal = (house: House) => {
    setEditingHouse(house);
    setShowHouseInfoModal(true);
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

  const joinHouse = async (houseId: string) => {
    try {
      await api.post(`/houses/${houseId}/join`);
      showToast?.("Join request sent!", "success");
      // Reload houses to update the list
      const res = await api.get("/houses");
      setHouses(res.data);
      setShowGlobalSearch(false);
    } catch (error: any) {
      showToast?.(error.response?.data?.message || "Failed to join house", "error");
    }
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
  const selectedHouseRole = selectedHouse ? getUserRole(selectedHouse) : null;

  return (
    <div className="animate-fadeIn w-full h-full flex flex-col bg-slate-950">
      {/* Header */}
      <div
        className={`fixed top-16 left-0 right-0 h-16 px-4 sm:px-6 border-b border-slate-700/30 bg-slate-900/60 backdrop-blur-sm shadow-sm flex items-center justify-between transition-opacity duration-200 ${sidebarOpen ? 'opacity-0 pointer-events-none sm:opacity-100 sm:pointer-events-auto' : 'opacity-100'}`}
        style={{ zIndex: 30 }}
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
            onClick={() => {
              setShowGlobalSearch(true);
              setGlobalSearchQuery("");
              setGlobalSearchResults([]);
            }}
            className="sm:hidden p-2 hover:bg-slate-800/60 rounded-lg transition-all text-slate-400 hover:text-slate-50"
            title="Search public houses"
            aria-label="Search houses"
          >
            <Search size={18} />
          </button>
          <button
            onClick={() => {
              setShowGlobalSearch(true);
              setGlobalSearchQuery("");
              setGlobalSearchResults([]);
            }}
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
        style={{ marginTop: '184px' }}
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
              <div className={`fixed top-32 left-0 right-0 h-14 px-4 py-3 border-b border-slate-700/30 bg-slate-900/80 flex items-center justify-between group/header transition-opacity duration-200 ${showHousesSidebar || showMembersDrawer || sidebarOpen ? 'opacity-0 pointer-events-none sm:opacity-100 sm:pointer-events-auto' : 'opacity-100'}`} style={{ zIndex: 25 }}>
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
                    onClick={(e) => { e.stopPropagation(); e.preventDefault(); setShowMembersDropdown(v => !v); }}
                    className="p-2 hover:bg-slate-800/60 rounded-lg transition-all text-slate-400 hover:text-slate-50"
                    title="Members (open list)"
                    aria-label="Open members list"
                  >
                    <Users size={16} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); e.preventDefault(); setShowHouseMenu(v => !v); }}
                    className="p-2 hover:bg-slate-700/60 rounded-lg transition-all duration-150 text-slate-400 hover:text-slate-50"
                    title="House options"
                    aria-label="House options"
                  >
                    <MoreVertical size={18} />
                  </button>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-slate-900/20 to-slate-900/40 flex flex-col justify-end" style={{ marginBottom: '120px' }}>
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
              <div className={`fixed bottom-16 left-0 right-0 px-4 py-3 border-t border-slate-700/20 bg-slate-900/70 transition-opacity duration-200 ${showHousesSidebar || showMembersDrawer || sidebarOpen ? 'opacity-0 pointer-events-none sm:opacity-100 sm:pointer-events-auto' : 'opacity-100'}`} style={{ zIndex: 50 }}>
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

      {/* Edit House Modal */}
      <EditHouseModal
        isOpen={showEditHouseModal}
        onClose={() => setShowEditHouseModal(false)}
        houseName={newHouseName}
        setHouseName={setNewHouseName}
        housePurpose={newHousePurpose}
        setHousePurpose={setNewHousePurpose}
        houseDescription={newHouseDescription}
        setHouseDescription={setNewHouseDescription}
        houseType={newHouseType}
        setHouseType={setNewHouseType}
        housePrivate={newHousePrivate}
        setHousePrivate={setNewHousePrivate}
        onEditHouse={editHouse}
        getTypeIcon={getTypeIcon}
      />

      {/* Manage Members Modal */}
      <ManageMembersModal
        isOpen={showManageMembersModal}
        onClose={() => setShowManageMembersModal(false)}
        house={editingHouse}
        members={editingHouse ? editingHouse.members : []}
        currentUserId={currentUser?.id ? String(currentUser.id) : null}
        onRemoveMember={removeMember}
      />

      {/* House Info Modal */}
      <HouseInfoModal
        isOpen={showHouseInfoModal}
        onClose={() => setShowHouseInfoModal(false)}
        house={editingHouse}
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

      {showGlobalSearch && (
        <GlobalHouseSearch
          query={globalSearchQuery}
          setQuery={setGlobalSearchQuery}
          results={globalSearchResults}
          onClose={() => { setShowGlobalSearch(false); setGlobalSearchQuery(""); setGlobalSearchResults([]); }}
          joinHouse={joinHouse}
          getTypeIcon={getTypeIcon}
          getTypeColor={getTypeColor}
        />
      )}

      <HouseShareSheet
        show={showShareHouseSheet}
        onClose={() => setShowShareHouseSheet(false)}
        selectedHouse={selectedHouse}
        shareHouse={shareHouse}
        showToast={showToast}
      />

      <HouseMenu
        isOpen={showHouseMenu}
        selectedHouse={selectedHouse}
        selectedHouseRole={selectedHouseRole}
        onClose={() => setShowHouseMenu(false)}
        shareHouse={shareHouse}
        showToast={showToast}
        onEditHouse={openEditHouseModal}
        onManageMembers={openManageMembersModal}
        onViewHouseInfo={openHouseInfoModal}
      />

      <HouseMembersDropdown
        isOpen={showMembersDropdown}
        selectedHouse={selectedHouse}
        houseMembers={houseMembers}
        selectedHouseRole={selectedHouseRole}
        onClose={() => setShowMembersDropdown(false)}
        showToast={showToast}
      />
    </div >
  );
}
