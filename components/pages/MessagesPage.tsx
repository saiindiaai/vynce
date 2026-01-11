"use client";

import { api } from "@/lib/api";
import socket from "@/lib/socket";
import { Conversation, SocialMessage } from "@/types";
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import {
  ChevronLeft,
  CornerUpLeft,
  MoreVertical,
  Paperclip,
  Phone,
  Search,
  Send,
  Smile,
  Video
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<SocialMessage[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [replyTo, setReplyTo] = useState<SocialMessage | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [reactionPickerFor, setReactionPickerFor] = useState<string | null>(null);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editInput, setEditInput] = useState("");
  const [searchInMessages, setSearchInMessages] = useState("");
  const [unreadMessageId, setUnreadMessageId] = useState<string | null>(null);
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [newChatSearch, setNewChatSearch] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchingUsers, setSearchingUsers] = useState(false);
  const [selectedMessageForActions, setSelectedMessageForActions] = useState<SocialMessage | null>(null);
  const selectedConversationRef = useRef<Conversation | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const longPressTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Clear long press timeout when overlay closes
  useEffect(() => {
    if (!selectedMessageForActions && longPressTimeoutRef.current) {
      clearTimeout(longPressTimeoutRef.current);
      longPressTimeoutRef.current = null;
    }
  }, [selectedMessageForActions]);

  // Load conversations
  useEffect(() => {
    const loadConversations = async () => {
      try {
        const res = await api.get("/social/chat/conversations");
        console.log("Loaded conversations:", res.data);
        setConversations(res.data);
      } catch (error) {
        console.error("Failed to load conversations:", error);
      }
    };
    loadConversations();
  }, []);

  // Load messages when conversation changes
  useEffect(() => {
    if (selectedConversation) {
      const loadMessages = async () => {
        try {
          const res = await api.get(`/social/chat/conversations/${selectedConversation._id}/messages`);
          setMessages(res.data);
        } catch (error) {
          console.error("Failed to load messages:", error);
        }
      };
      loadMessages();
    }
  }, [selectedConversation]);

  // Socket setup - connect once and listen for messages
  useEffect(() => {
    // Connect socket and join personal room
    const handleConnect = () => {
      socket.emit("join-user-room");
    };

    socket.on("connect", handleConnect);
    if (socket.connected) {
      handleConnect();
    }

    // Listen for new messages
    socket.on("new-message", (message: SocialMessage) => {
      // Update conversations list with latest message
      setConversations(prev =>
        prev.map(conv =>
          conv._id === message.conversationId
            ? { ...conv, lastMessage: message, lastMessageTime: message.timestamp }
            : conv
        )
      );

      // If this conversation is currently selected, add the message to the messages list
      if (selectedConversationRef.current && message.conversationId === selectedConversationRef.current._id) {
        setMessages(prev => {
          const existingIndex = prev.findIndex(msg => msg._id === message._id);
          if (existingIndex >= 0) {
            // Replace existing message (for edits, reactions, etc.)
            const updated = [...prev];
            updated[existingIndex] = message;
            return updated;
          } else if (message.deleted) {
            // Remove deleted message
            return prev.filter(msg => msg._id !== message._id);
          } else {
            // Add new message
            return [...prev, message];
          }
        });
      }
    });

    return () => {
      socket.off("connect", handleConnect);
      socket.off("new-message");
    };
  }, []);

  // Track mobile breakpoint on client to avoid using `window` during render
  useEffect(() => {
    const updateMobile = () => setIsMobile(window.innerWidth < 768);
    updateMobile();
    window.addEventListener("resize", updateMobile);
    return () => window.removeEventListener("resize", updateMobile);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Scroll to unread message if present
  useEffect(() => {
    if (unreadMessageId) {
      const el = document.getElementById(`msg-${unreadMessageId}`);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [unreadMessageId]);

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedConversation) return;

    const messageContent = messageInput.trim();
    const tempId = `temp-${Date.now()}`;

    try {
      // Optimistically add message to local state
      const tempMessage: SocialMessage = {
        _id: tempId, // Temporary ID
        conversationId: selectedConversation._id,
        senderId: localStorage.getItem("userId") || "",
        senderName: "You", // Will be updated when real message comes back
        content: messageContent,
        timestamp: new Date().toISOString(),
        read: true,
        delivered: true,
        reactions: [],
        replyTo: replyTo || undefined,
      };

      setMessages(prev => [...prev, tempMessage]);
      setMessageInput("");
      setReplyTo(null);

      // Send to server
      const res = await api.post(`/social/chat/conversations/${selectedConversation._id}/messages`, {
        content: messageContent,
      });

      // Replace temp message with real message from server
      setMessages(prev =>
        prev.map(msg =>
          msg._id === tempId ? res.data : msg
        )
      );

      // Emit to socket for real-time updates
      const recipientId = selectedConversation.participants.find(p => p._id !== localStorage.getItem("userId"))?._id;

      if (recipientId && socket.connected) {
        socket.emit("send-message", {
          toUserId: recipientId,
          message: res.data,
        });
      }

    } catch (error) {
      console.error("Failed to send message:", error);
      // Remove the optimistic message on error
      setMessages(prev => prev.filter(msg => msg._id !== tempId));
      setMessageInput(messageContent); // Restore the message input
    }
  };

  const handleEmojiSelect = (emoji: any) => {
    setMessageInput((prev) => prev + emoji.native);
    setShowEmoji(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      const reader = new FileReader();
      reader.onload = (ev) => setImagePreview(ev.target?.result as string);
      reader.readAsDataURL(f);
    }
  };

  const filteredConversations = conversations.filter((conv) => {
    const otherParticipant = conv.participants.find(p => p._id !== localStorage.getItem("userId"));
    return otherParticipant?.username.toLowerCase().includes(searchQuery.toLowerCase());
  });

  async function handleReact(message: SocialMessage, emoji: string) {
    try {
      await api.post(`/social/chat/messages/${message._id}/react`, {
        emoji: emoji,
      });

      // Update local state optimistically
      setMessages((msgs) =>
        msgs.map((m) =>
          m._id === message._id
            ? { ...m, reactions: [...(m.reactions || []), { type: emoji, by: localStorage.getItem("userId") || "", byName: "You" }] }
            : m
        )
      );

      // Emit socket event for real-time updates
      const recipientId = selectedConversation?.participants.find(p => p._id !== localStorage.getItem("userId"))?._id;
      if (recipientId && socket.connected) {
        socket.emit("send-message", {
          toUserId: recipientId,
          message: { ...message, reactions: [...(message.reactions || []), { type: emoji, by: localStorage.getItem("userId") || "", byName: "You" }] },
        });
      }
    } catch (error) {
      console.error("Failed to react to message:", error);
    }
  }

  // Edit message
  async function handleEditMessage(messageId: string, newContent: string) {
    try {
      const res = await api.put(`/social/chat/messages/${messageId}`, {
        content: newContent,
      });

      // Update local state
      setMessages((msgs) =>
        msgs.map((m) =>
          m._id === messageId ? res.data : m
        )
      );

      setEditingMessageId(null);
      setEditInput("");

      // Emit socket event for real-time updates
      const recipientId = selectedConversation?.participants.find(p => p._id !== localStorage.getItem("userId"))?._id;
      if (recipientId && socket.connected) {
        socket.emit("send-message", {
          toUserId: recipientId,
          message: res.data,
        });
      }
    } catch (error) {
      console.error("Failed to edit message:", error);
      setEditingMessageId(null);
      setEditInput("");
    }
  }

  // Delete message
  async function handleDeleteMessage(messageId: string) {
    try {
      await api.delete(`/social/chat/messages/${messageId}`);

      // Update local state
      setMessages((msgs) => msgs.filter((m) => m._id !== messageId));

      // Emit socket event for real-time updates
      const recipientId = selectedConversation?.participants.find(p => p._id !== localStorage.getItem("userId"))?._id;
      if (recipientId && socket.connected) {
        socket.emit("send-message", {
          toUserId: recipientId,
          message: { _id: messageId, deleted: true },
        });
      }
    } catch (error) {
      console.error("Failed to delete message:", error);
    }
  }

  // Filtered messages for search
  const filteredMessages = searchInMessages.trim()
    ? messages.filter((m) => m.content.toLowerCase().includes(searchInMessages.toLowerCase()))
    : messages;

  // Long press handlers for message actions
  const handleLongPressStart = (message: SocialMessage) => {
    longPressTimeoutRef.current = setTimeout(() => {
      setSelectedMessageForActions(message);
    }, 1000);
  };

  const handleLongPressEnd = () => {
    if (longPressTimeoutRef.current) {
      clearTimeout(longPressTimeoutRef.current);
      longPressTimeoutRef.current = null;
    }
  };

  // Search for users to start new chat
  const handleSearchUsers = async (query: string) => {
    setNewChatSearch(query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setSearchingUsers(true);
    try {
      const res = await api.get(`/users/search?q=${encodeURIComponent(query)}`);
      // Filter out current user and those already in conversations
      const currentUserId = localStorage.getItem("userId");
      const existingConversationIds = conversations.flatMap(conv =>
        conv.participants.map(p => p._id)
      );

      setSearchResults(
        res.data.filter((user: any) =>
          user._id !== currentUserId && !existingConversationIds.includes(user._id)
        )
      );
    } catch (error) {
      console.error("Failed to search users:", error);
      setSearchResults([]);
    } finally {
      setSearchingUsers(false);
    }
  };

  // Start new chat with selected user
  const handleStartChat = async (userId: string) => {
    try {
      const res = await api.post("/social/chat/conversations", {
        participantId: userId,
      });

      setConversations(prev => [res.data, ...prev]);
      setSelectedConversation(res.data);
      setShowNewChatModal(false);
      setNewChatSearch("");
      setSearchResults([]);
    } catch (error) {
      console.error("Failed to create conversation:", error);
    }
  };

  return (
    <div className="w-full h-full flex flex-col md:flex-row bg-slate-900 overflow-hidden animate-fadeIn">
      {/* Conversations Sidebar - Mobile (full), Tablet + Desktop (sidebar) */}
      <div
        className={`${isMobile && selectedConversation ? "hidden" : "flex"} md:flex md:w-64 lg:w-72 flex-col border-r border-slate-700/50 bg-slate-900 w-full md:w-64`}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-700/50">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-3xl font-black text-slate-50">Chats</h2>
            <button
              onClick={() => setShowNewChatModal(true)}
              className="p-2 rounded-full hover:bg-white/10 transition-all text-white/70 hover:text-white text-2xl font-bold"
              aria-label="Start new chat"
            >
              +
            </button>
          </div>
          <div className="relative">
            <Search size={16} className="absolute left-4 top-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-50 placeholder-slate-500 focus:outline-none focus:border-purple-500/50 focus:bg-slate-800 transition-all text-sm min-h-[40px]"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map((conversation, idx) => (
            <button
              key={conversation._id}
              onClick={() => setSelectedConversation(conversation)}
              className={`w-full px-4 py-3.5 flex items-center gap-3 transition-all duration-200 border-b border-slate-700/50 hover:bg-slate-800/50 ${selectedConversation?._id === conversation._id
                ? "bg-slate-800 border-l-4 border-l-purple-500"
                : ""
                }`}
            >
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div
                  className={`w-11 h-11 rounded-full bg-gradient-to-br flex items-center justify-center text-base font-bold shadow-lg from-purple-500 to-pink-500`}
                >
                  {conversation.participants.find(p => p._id !== localStorage.getItem("userId"))?.username.charAt(0) || "?"}
                </div>
              </div>

              {/* Conversation Info */}
              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center justify-between gap-2 mb-0.5">
                  <span className="font-bold text-sm text-slate-50 truncate">
                    {conversation.participants.find(p => p._id !== localStorage.getItem("userId"))?.username || "Unknown"}
                  </span>
                  <span className="text-xs text-slate-500 flex-shrink-0">
                    {new Date(conversation.lastMessageTime).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-xs text-slate-400 truncate">{conversation.lastMessage?.content || "No messages yet"}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      {selectedConversation ? (
        <div className={`${isMobile ? "flex" : "hidden md:flex"} md:flex-1 flex-col`}>
          {/* Message Search */}
          <div className="px-4 sm:px-6 py-2 bg-slate-900 border-b border-slate-700/50">
            <input
              type="text"
              placeholder="Search messages..."
              value={searchInMessages}
              onChange={e => setSearchInMessages(e.target.value)}
              className="w-full px-3 py-2 rounded bg-slate-800 border border-slate-700 text-slate-50 text-xs"
            />
          </div>
          {/* Chat Header */}
          <div className="px-4 sm:px-6 py-4 border-b border-slate-700/50 bg-slate-900 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedConversation(null)}
                className="md:hidden p-2 rounded-full hover:bg-white/10 transition-all text-white/70 hover:text-white"
                aria-label="Back to conversations"
              >
                <ChevronLeft size={20} />
              </button>
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-base sm:text-lg font-bold shadow-lg">
                {selectedConversation.participants.find(p => p._id !== localStorage.getItem("userId"))?.username.charAt(0) || "?"}
              </div>
              <div>
                <h3 className="font-black text-slate-50 text-sm sm:text-base">
                  {selectedConversation.participants.find(p => p._id !== localStorage.getItem("userId"))?.username || "Unknown"}
                </h3>
                <p className="text-xs text-green-400 font-medium">
                  ● active now
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-1 sm:gap-2">
              <button className="p-2 rounded-full hover:bg-white/10 transition-all text-white/70 hover:text-white">
                <Phone size={18} />
              </button>
              <button className="p-2 rounded-full hover:bg-white/10 transition-all text-white/70 hover:text-white">
                <Video size={18} />
              </button>
              <button className="p-2 rounded-full hover:bg-white/10 transition-all text-white/70 hover:text-white">
                <MoreVertical size={18} />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className={`flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-3 flex flex-col bg-slate-900 transition-all duration-300 ${selectedMessageForActions ? "blur-sm" : ""}`}>
            {filteredMessages.map((message) => (
              <div
                key={message._id}
                id={`msg-${message._id}`}
                className={`flex ${message.senderId === localStorage.getItem("userId") ? "justify-end" : "justify-start"} animate-slideInUp relative`}
              >
                <div
                  className={`max-w-xs sm:max-w-md px-4 py-2.5 rounded-2xl border transition-all relative ${
                    selectedMessageForActions?._id === message._id 
                      ? "ring-2 ring-purple-400 ring-opacity-75 scale-105" 
                      : ""
                  } ${message.senderId === localStorage.getItem("userId")
                    ? "bg-purple-600 border-purple-500 text-white shadow-lg"
                    : "bg-slate-800 border-slate-700 text-slate-50"
                    }`}
                >
                  {message.replyTo && (
                    <div className="mb-1 pl-2 border-l-4 border-purple-400 text-xs text-purple-200 opacity-80">
                      Replying to: {message.replyTo.content}
                    </div>
                  )}
                  {message.imageUrl && (
                    <img src={message.imageUrl} alt="attachment" className="mb-2 rounded-lg max-w-[180px]" />
                  )}
                  {/* Edit mode */}
                  {editingMessageId === message._id ? (
                    <div className="flex gap-2 items-center">
                      <input
                        value={editInput}
                        onChange={e => setEditInput(e.target.value)}
                        className="flex-1 px-2 py-1 rounded bg-slate-700 text-white text-xs"
                      />
                      <button onClick={() => handleEditMessage(message._id, editInput)} className="text-green-400 text-xs">Save</button>
                      <button onClick={() => { setEditingMessageId(null); setEditInput(""); }} className="text-slate-400 text-xs">Cancel</button>
                    </div>
                  ) : (
                    <p 
                      className="text-sm leading-relaxed cursor-pointer select-none"
                      onMouseDown={() => handleLongPressStart(message)}
                      onMouseUp={handleLongPressEnd}
                      onTouchStart={() => handleLongPressStart(message)}
                      onTouchEnd={handleLongPressEnd}
                      onClick={() => setSelectedMessageForActions(message)} // For testing
                    >
                      {message.content}
                    </p>
                  )}
                  <div className="flex items-center gap-1 mt-1.5">
                    <span className={`text-xs font-medium ${message.senderId === localStorage.getItem("userId") ? "text-purple-200" : "text-slate-400"}`}>
                      {new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                    {message.edited && (
                      <span className="text-xs text-slate-500 italic">edited</span>
                    )}
                  </div>
                  {/* Reactions with tooltip for who reacted */}
                  <div className="flex gap-1 mt-1">
                    {message.reactions && message.reactions.map((r, i) => (
                      <span
                        key={i}
                        className="text-xs select-none relative group"
                      >
                        {r.type}
                        <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 px-2 py-1 rounded bg-slate-800 text-white text-[10px] opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-10">
                          {r.byName || "Unknown"}
                        </span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            {/* Message Actions Overlay */}
            {selectedMessageForActions && (
              <div 
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] animate-fadeIn"
                onClick={() => setSelectedMessageForActions(null)}
              >
                <div className="flex items-center justify-center min-h-full p-4">
                  <div 
                    className="bg-slate-800 border border-slate-700 rounded-2xl p-6 max-w-sm w-full shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {reactionPickerFor === selectedMessageForActions._id ? (
                      <div>
                        <h3 className="text-white font-semibold mb-4 text-center">Choose Reaction</h3>
                        <Picker
                          data={data}
                          onEmojiSelect={(emoji: any) => {
                            handleReact(selectedMessageForActions, emoji.native);
                            setReactionPickerFor(null);
                            setSelectedMessageForActions(null);
                          }}
                          theme="dark"
                          emojiSize={24}
                          maxFrequentRows={1}
                        />
                        <button
                          onClick={() => setReactionPickerFor(null)}
                          className="w-full mt-4 p-2 rounded-xl bg-slate-700 hover:bg-slate-600 transition-colors text-white text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <>
                        <h3 className="text-white font-semibold mb-4 text-center">Message Actions</h3>
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            onClick={() => {
                              setReplyTo(selectedMessageForActions);
                              setSelectedMessageForActions(null);
                            }}
                            className="flex flex-col items-center gap-2 p-3 rounded-xl bg-slate-700 hover:bg-slate-600 transition-colors text-white"
                          >
                            <CornerUpLeft size={20} />
                            <span className="text-sm">Reply</span>
                          </button>
                          <button
                            onClick={() => setReactionPickerFor(selectedMessageForActions._id)}
                            className="flex flex-col items-center gap-2 p-3 rounded-xl bg-slate-700 hover:bg-slate-600 transition-colors text-white"
                          >
                            <Smile size={20} />
                            <span className="text-sm">React</span>
                          </button>
                          {selectedMessageForActions.senderId === localStorage.getItem("userId") && (
                            <>
                              <button
                                onClick={() => {
                                  setEditingMessageId(selectedMessageForActions._id);
                                  setEditInput(selectedMessageForActions.content);
                                  setSelectedMessageForActions(null);
                                }}
                                className="flex flex-col items-center gap-2 p-3 rounded-xl bg-slate-700 hover:bg-slate-600 transition-colors text-white"
                              >
                                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                  <path d="M12 20h9" />
                                  <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19.5 3 21l1.5-4L16.5 3.5z" />
                                </svg>
                                <span className="text-sm">Edit</span>
                              </button>
                              <button
                                onClick={() => {
                                  handleDeleteMessage(selectedMessageForActions._id);
                                  setSelectedMessageForActions(null);
                                }}
                                className="flex flex-col items-center gap-2 p-3 rounded-xl bg-red-700 hover:bg-red-600 transition-colors text-white"
                              >
                                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                  <polyline points="3 6 5 6 21 6" />
                                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
                                  <line x1="10" y1="11" x2="10" y2="17" />
                                  <line x1="14" y1="11" x2="14" y2="17" />
                                </svg>
                                <span className="text-sm">Delete</span>
                              </button>
                            </>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start animate-slideInUp">
                <div className="px-4 py-3 rounded-2xl bg-slate-800 border border-slate-700">
                  <div className="flex gap-1.5">
                    <div
                      className="w-2 h-2 rounded-full bg-slate-600 animate-bounce"
                      style={{ animationDelay: "0s" }}
                    />
                    <div
                      className="w-2 h-2 rounded-full bg-slate-600 animate-bounce"
                      style={{ animationDelay: "0.15s" }}
                    />
                    <div
                      className="w-2 h-2 rounded-full bg-slate-600 animate-bounce"
                      style={{ animationDelay: "0.3s" }}
                    />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="px-4 sm:px-6 py-4 border-t border-slate-700/50 bg-slate-900">
            {replyTo && (
              <div className="mb-2 flex items-center gap-2 bg-slate-800 px-3 py-1 rounded-lg text-xs text-purple-200">
                Replying to: {replyTo.content}
                <button onClick={() => setReplyTo(null)} className="ml-2 text-slate-400 hover:text-red-400">✕</button>
              </div>
            )}
            <div className="flex items-center gap-2 relative">
              <button className="p-2.5 rounded-full hover:bg-slate-800 transition-all text-slate-400 hover:text-slate-300 relative">
                <label>
                  <Paperclip size={18} />
                  <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                </label>
              </button>
              {imagePreview && (
                <div className="relative">
                  <img src={imagePreview} alt="preview" className="w-10 h-10 rounded-lg object-cover" />
                  <button onClick={() => { setFile(null); setImagePreview(null); }} className="absolute -top-2 -right-2 bg-black text-white rounded-full w-5 h-5 flex items-center justify-center">✕</button>
                </div>
              )}
              <input
                type="text"
                placeholder="Type something nice..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                className="flex-1 px-4 py-2.5 rounded-full bg-slate-800 border border-slate-700 text-slate-50 placeholder-slate-500 focus:outline-none focus:border-purple-500/50 focus:bg-slate-800 transition-all text-sm min-h-[40px]"
              />
              <button
                className="p-2.5 rounded-full hover:bg-slate-800 transition-all text-slate-400 hover:text-slate-300 relative"
                onClick={() => setShowEmoji((v) => !v)}
                type="button"
              >
                <Smile size={18} />
                {showEmoji && (
                  <div className="absolute bottom-12 right-0 z-50">
                    <Picker data={data} onEmojiSelect={handleEmojiSelect} theme="dark" />
                  </div>
                )}
              </button>
              <button
                onClick={handleSendMessage}
                disabled={!messageInput.trim() && !file}
                className="p-2.5 rounded-full bg-purple-600 hover:bg-purple-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-white font-bold shadow-lg"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>

      ) : (
        <div className="hidden md:flex md:flex-1 md:items-center md:justify-center text-center">
          <div>
            <p className="text-2xl font-black text-white mb-2">No chat selected</p>
            <p className="text-white/50">Pick a convo to get chatting</p>
          </div>
        </div>
      )
      }

      {/* New Chat Modal */}
      {showNewChatModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden animate-fadeIn">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-700/50 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-50">Start New Chat</h3>
              <button
                onClick={() => {
                  setShowNewChatModal(false);
                  setNewChatSearch("");
                  setSearchResults([]);
                }}
                className="text-slate-400 hover:text-slate-50 transition-all text-2xl"
              >
                ✕
              </button>
            </div>

            {/* Search Input */}
            <div className="p-4 border-b border-slate-700/50">
              <div className="relative">
                <Search size={18} className="absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search username..."
                  value={newChatSearch}
                  onChange={(e) => handleSearchUsers(e.target.value)}
                  autoFocus
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-700 border border-slate-600 text-slate-50 placeholder-slate-400 focus:outline-none focus:border-purple-500 transition-all text-sm"
                />
              </div>
            </div>

            {/* Results List */}
            <div className="flex-1 overflow-y-auto">
              {searchingUsers ? (
                <div className="flex items-center justify-center py-8">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" />
                    <div className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: "0.15s" }} />
                    <div className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: "0.3s" }} />
                  </div>
                </div>
              ) : searchResults.length > 0 ? (
                <div className="divide-y divide-slate-700/50">
                  {searchResults.map((user) => (
                    <button
                      key={user._id}
                      onClick={() => handleStartChat(user._id)}
                      className="w-full px-4 py-3 flex items-center gap-3 hover:bg-slate-700/50 transition-all duration-200"
                    >
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-base font-bold flex-shrink-0">
                        {user.username?.charAt(0)?.toUpperCase() || "?"}
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-semibold text-slate-50 text-sm">{user.username}</p>
                        <p className="text-xs text-slate-400">{user.displayName || "No display name"}</p>
                      </div>
                      <div className="text-purple-400 text-xl">→</div>
                    </button>
                  ))}
                </div>
              ) : newChatSearch.trim() ? (
                <div className="flex items-center justify-center py-8 text-slate-400">
                  <p className="text-sm">No users found</p>
                </div>
              ) : (
                <div className="flex items-center justify-center py-8 text-slate-400">
                  <p className="text-sm">Search for a username to get started</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MessagesPage;


