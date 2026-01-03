"use client";

import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import {
  Check,
  CheckCheck,
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

interface Message {
  id: number;
  sender: string;
  senderAvatar: string;
  content: string;
  timestamp: string;
  isSent: boolean;
  read?: boolean;
  delivered?: boolean;
  seen?: boolean;
  imageUrl?: string;
  replyTo?: Message | null;
  reactions?: { type: string; by: string }[];
}
interface Conversation {
  id: number;
  name: string;
  avatar: string;
  lastMessage: string;
  lastMessageTime: string;
  unread: number;
  isOnline: boolean;
}

const conversations: Conversation[] = [
  {
    id: 1,
    name: "Alex Orbit",
    avatar: "🎵",
    lastMessage: "That production is fire! 🔥",
    lastMessageTime: "2m",
    unread: 2,
    isOnline: true,
  },
  {
    id: 2,
    name: "Jane Cosmos",
    avatar: "🎨",
    lastMessage: "Thanks for the feedback!",
    lastMessageTime: "15m",
    unread: 0,
    isOnline: true,
  },
  {
    id: 3,
    name: "Tech Warrior",
    avatar: "💻",
    lastMessage: "Want to collaborate on the project?",
    lastMessageTime: "1h",
    unread: 1,
    isOnline: false,
  },
  {
    id: 4,
    name: "Design Flow",
    avatar: "🎭",
    lastMessage: "The UI looks amazing!",
    lastMessageTime: "3h",
    unread: 0,
    isOnline: true,
  },
  {
    id: 5,
    name: "Creative Studio",
    avatar: "🎬",
    lastMessage: "Let's schedule a call",
    lastMessageTime: "Yesterday",
    unread: 0,
    isOnline: false,
  },
];

const mockMessages: Record<number, Message[]> = {
  1: [
    {
      id: 1,
      sender: "Alex Orbit",
      senderAvatar: "🎵",
      content: "Hey! How's the new track coming?",
      timestamp: "10:30 AM",
      isSent: false,
    },
    {
      id: 2,
      sender: "You",
      senderAvatar: "👤",
      content: "Pretty good! Just finished the mixing",
      timestamp: "10:32 AM",
      isSent: true,
    },
    {
      id: 3,
      sender: "Alex Orbit",
      senderAvatar: "🎵",
      content: "That production is fire! 🔥",
      timestamp: "10:33 AM",
      isSent: false,
    },
  ],
  2: [
    {
      id: 1,
      sender: "Jane Cosmos",
      senderAvatar: "🎨",
      content: "Love your latest art series!",
      timestamp: "9:15 AM",
      isSent: false,
    },
    {
      id: 2,
      sender: "You",
      senderAvatar: "👤",
      content: "Thank you! It took ages to finish",
      timestamp: "9:18 AM",
      isSent: true,
    },
    {
      id: 3,
      sender: "Jane Cosmos",
      senderAvatar: "🎨",
      content: "Thanks for the feedback!",
      timestamp: "9:20 AM",
      isSent: false,
    },
  ],
  3: [
    {
      id: 1,
      sender: "Tech Warrior",
      senderAvatar: "💻",
      content: "Want to collaborate on the project?",
      timestamp: "8:45 AM",
      isSent: false,
    },
  ],
  4: [
    {
      id: 1,
      sender: "Design Flow",
      senderAvatar: "🎭",
      content: "The UI looks amazing!",
      timestamp: "Yesterday",
      isSent: false,
    },
  ],
  5: [
    {
      id: 1,
      sender: "Creative Studio",
      senderAvatar: "🎬",
      content: "Let's schedule a call",
      timestamp: "Yesterday",
      isSent: false,
    },
  ],
};


function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>(mockMessages[selectedConversation?.id || 1]);
  const [messageInput, setMessageInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [replyTo, setReplyTo] = useState<Message | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [reactionPickerFor, setReactionPickerFor] = useState<number | null>(null);
  const [editingMessageId, setEditingMessageId] = useState<number | null>(null);
  const [editInput, setEditInput] = useState("");
  const [searchInMessages, setSearchInMessages] = useState("");
  const [unreadMessageId, setUnreadMessageId] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedConversation) {
      setMessages(mockMessages[selectedConversation.id]);
      // Simulate unread message for demo
      setUnreadMessageId(mockMessages[selectedConversation.id].find(m => !m.seen && !m.isSent)?.id || null);
    }
  }, [selectedConversation]);

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

  const handleSendMessage = () => {
    if (messageInput.trim() || file) {
      const newMessage: Message = {
        id: messages.length + 1,
        sender: "You",
        senderAvatar: "👤",
        content: messageInput,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isSent: true,
        read: false,
        delivered: true,
        seen: false,
        imageUrl: imagePreview || undefined,
        replyTo,
        reactions: [],
      };
      setMessages([...messages, newMessage]);
      setMessageInput("");
      setFile(null);
      setImagePreview(null);
      setReplyTo(null);
      setShowEmoji(false);
      setIsTyping(true);
      setTimeout(() => setIsTyping(false), 1500);
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

  const filteredConversations = conversations.filter((conv) =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  function handleReact(message: Message, emoji: string) {
    setMessages((msgs) =>
      msgs.map((m) =>
        m.id === message.id
          ? { ...m, reactions: [...(m.reactions || []), { type: emoji, by: "You" }] }
          : m
      )
    );
  }

  // Edit message
  function handleEditMessage(messageId: number, newContent: string) {
    setMessages((msgs) =>
      msgs.map((m) =>
        m.id === messageId ? { ...m, content: newContent } : m
      )
    );
    setEditingMessageId(null);
    setEditInput("");
  }

  // Delete message
  function handleDeleteMessage(messageId: number) {
    setMessages((msgs) => msgs.filter((m) => m.id !== messageId));
  }

  // Filtered messages for search
  const filteredMessages = searchInMessages.trim()
    ? messages.filter((m) => m.content.toLowerCase().includes(searchInMessages.toLowerCase()))
    : messages;

  return (
    <div className="w-full h-full flex flex-col md:flex-row bg-slate-900 overflow-hidden animate-fadeIn">
      {/* Conversations Sidebar - Mobile (full), Tablet + Desktop (sidebar) */}
      <div
        className={`${isMobile && selectedConversation ? "hidden" : "flex"} md:flex md:w-64 lg:w-72 flex-col border-r border-slate-700/50 bg-slate-900 w-full md:w-64`}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-700/50">
          <h2 className="text-3xl font-black text-slate-50 mb-4">Chats</h2>
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
              key={conversation.id}
              onClick={() => setSelectedConversation(conversation)}
              className={`w-full px-4 py-3.5 flex items-center gap-3 transition-all duration-200 border-b border-slate-700/50 hover:bg-slate-800/50 ${selectedConversation?.id === conversation.id
                ? "bg-slate-800 border-l-4 border-l-purple-500"
                : ""
                }`}
            >
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div
                  className={`w-11 h-11 rounded-full bg-gradient-to-br flex items-center justify-center text-base font-bold shadow-lg ${idx % 3 === 0
                    ? "from-purple-500 to-pink-500"
                    : idx % 3 === 1
                      ? "from-blue-500 to-cyan-500"
                      : "from-green-500 to-emerald-500"
                    }`}
                >
                  {conversation.avatar}
                </div>
                {conversation.isOnline && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-slate-900 shadow-lg" />
                )}
              </div>

              {/* Conversation Info */}
              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center justify-between gap-2 mb-0.5">
                  <span className="font-bold text-sm text-slate-50 truncate">
                    {conversation.name}
                  </span>
                  <span className="text-xs text-slate-500 flex-shrink-0">
                    {conversation.lastMessageTime}
                  </span>
                </div>
                <p className="text-xs text-slate-400 truncate">{conversation.lastMessage}</p>
              </div>

              {/* Unread Badge */}
              {conversation.unread > 0 && (
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center shadow-lg">
                  <span className="text-xs font-black text-white">{conversation.unread}</span>
                </div>
              )}
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
                {selectedConversation.avatar}
              </div>
              <div>
                <h3 className="font-black text-slate-50 text-sm sm:text-base">
                  {selectedConversation.name}
                </h3>
                <p className="text-xs text-green-400 font-medium">
                  {selectedConversation.isOnline ? "● active now" : "● away"}
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
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-3 flex flex-col bg-slate-900">
            {filteredMessages.map((message) => (
              <div
                key={message.id}
                id={`msg-${message.id}`}
                className={`flex ${message.isSent ? "justify-end" : "justify-start"} animate-slideInUp group relative`}
              >
                <div
                  className={`max-w-xs sm:max-w-md px-4 py-2.5 rounded-2xl border transition-all relative ${message.isSent
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
                  {editingMessageId === message.id ? (
                    <div className="flex gap-2 items-center">
                      <input
                        value={editInput}
                        onChange={e => setEditInput(e.target.value)}
                        className="flex-1 px-2 py-1 rounded bg-slate-700 text-white text-xs"
                      />
                      <button onClick={() => handleEditMessage(message.id, editInput)} className="text-green-400 text-xs">Save</button>
                      <button onClick={() => { setEditingMessageId(null); setEditInput(""); }} className="text-slate-400 text-xs">Cancel</button>
                    </div>
                  ) : (
                    <p className="text-sm leading-relaxed">{message.content}</p>
                  )}
                  <div className="flex items-center gap-1 mt-1.5">
                    <span className={`text-xs font-medium ${message.isSent ? "text-purple-200" : "text-slate-400"}`}>{message.timestamp}</span>
                    {message.isSent && (
                      <span className="ml-1 flex items-center gap-0.5">
                        {message.seen ? <CheckCheck size={16} className="text-blue-400" /> : message.delivered ? <CheckCheck size={16} className="text-slate-300" /> : <Check size={16} className="text-slate-300" />}
                      </span>
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
                          {r.by}
                        </span>
                      </span>
                    ))}
                  </div>
                  {/* Message actions */}
                  <div className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 transition flex gap-1">
                    <button onClick={() => setReplyTo(message)} title="Reply" className="p-1 text-xs hover:text-purple-400"><CornerUpLeft size={14} /></button>
                    <button onClick={() => setReactionPickerFor(message.id)} title="React" className="p-1 text-xs hover:text-purple-400"><Smile size={14} /></button>
                    {reactionPickerFor === message.id && (
                      <div className="absolute z-50 top-8 right-0">
                        <Picker
                          data={data}
                          onEmojiSelect={(emoji: any) => {
                            handleReact(message, emoji.native);
                            setReactionPickerFor(null);
                          }}
                          theme="dark"
                          emojiSize={20}
                          maxFrequentRows={1}
                        />
                      </div>
                    )}
                    {/* Edit/Delete for own messages */}
                    {message.isSent && (
                      <>
                        <button onClick={() => { setEditingMessageId(message.id); setEditInput(message.content); }} title="Edit" className="p-1 text-xs hover:text-blue-400"><svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19.5 3 21l1.5-4L16.5 3.5z" /></svg></button>
                        <button onClick={() => handleDeleteMessage(message.id)} title="Delete" className="p-1 text-xs hover:text-red-400"><svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></svg></button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}

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
    </div>
  );
}

export default MessagesPage;


