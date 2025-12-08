'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Smile, Search, Phone, Video, MoreVertical, ChevronLeft } from 'lucide-react';
import { useAppStore } from '@/lib/store';

interface Message {
  id: number;
  sender: string;
  senderAvatar: string;
  content: string;
  timestamp: string;
  isSent: boolean;
  read?: boolean;
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
    name: 'Alex Orbit',
    avatar: '🎵',
    lastMessage: 'That production is fire! 🔥',
    lastMessageTime: '2m',
    unread: 2,
    isOnline: true,
  },
  {
    id: 2,
    name: 'Jane Cosmos',
    avatar: '🎨',
    lastMessage: 'Thanks for the feedback!',
    lastMessageTime: '15m',
    unread: 0,
    isOnline: true,
  },
  {
    id: 3,
    name: 'Tech Warrior',
    avatar: '💻',
    lastMessage: 'Want to collaborate on the project?',
    lastMessageTime: '1h',
    unread: 1,
    isOnline: false,
  },
  {
    id: 4,
    name: 'Design Flow',
    avatar: '🎭',
    lastMessage: 'The UI looks amazing!',
    lastMessageTime: '3h',
    unread: 0,
    isOnline: true,
  },
  {
    id: 5,
    name: 'Creative Studio',
    avatar: '🎬',
    lastMessage: 'Let\'s schedule a call',
    lastMessageTime: 'Yesterday',
    unread: 0,
    isOnline: false,
  },
];

const mockMessages: Record<number, Message[]> = {
  1: [
    {
      id: 1,
      sender: 'Alex Orbit',
      senderAvatar: '🎵',
      content: 'Hey! How\'s the new track coming?',
      timestamp: '10:30 AM',
      isSent: false,
    },
    {
      id: 2,
      sender: 'You',
      senderAvatar: '👤',
      content: 'Pretty good! Just finished the mixing',
      timestamp: '10:32 AM',
      isSent: true,
    },
    {
      id: 3,
      sender: 'Alex Orbit',
      senderAvatar: '🎵',
      content: 'That production is fire! 🔥',
      timestamp: '10:33 AM',
      isSent: false,
    },
  ],
  2: [
    {
      id: 1,
      sender: 'Jane Cosmos',
      senderAvatar: '🎨',
      content: 'Love your latest art series!',
      timestamp: '9:15 AM',
      isSent: false,
    },
    {
      id: 2,
      sender: 'You',
      senderAvatar: '👤',
      content: 'Thank you! It took ages to finish',
      timestamp: '9:18 AM',
      isSent: true,
    },
    {
      id: 3,
      sender: 'Jane Cosmos',
      senderAvatar: '🎨',
      content: 'Thanks for the feedback!',
      timestamp: '9:20 AM',
      isSent: false,
    },
  ],
  3: [
    {
      id: 1,
      sender: 'Tech Warrior',
      senderAvatar: '💻',
      content: 'Want to collaborate on the project?',
      timestamp: '8:45 AM',
      isSent: false,
    },
  ],
  4: [
    {
      id: 1,
      sender: 'Design Flow',
      senderAvatar: '🎭',
      content: 'The UI looks amazing!',
      timestamp: 'Yesterday',
      isSent: false,
    },
  ],
  5: [
    {
      id: 1,
      sender: 'Creative Studio',
      senderAvatar: '🎬',
      content: 'Let\'s schedule a call',
      timestamp: 'Yesterday',
      isSent: false,
    },
  ],
};

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(conversations[0]);
  const [messages, setMessages] = useState<Message[]>(mockMessages[selectedConversation?.id || 1]);
  const [messageInput, setMessageInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (selectedConversation) {
      setMessages(mockMessages[selectedConversation.id]);
    }
  }, [selectedConversation]);

  // Track mobile breakpoint on client to avoid using `window` during render
  useEffect(() => {
    const updateMobile = () => setIsMobile(window.innerWidth < 768);
    updateMobile();
    window.addEventListener('resize', updateMobile);
    return () => window.removeEventListener('resize', updateMobile);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      const newMessage: Message = {
        id: messages.length + 1,
        sender: 'You',
        senderAvatar: '👤',
        content: messageInput,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isSent: true,
        read: true,
      };
      setMessages([...messages, newMessage]);
      setMessageInput('');
      setIsTyping(true);
      setTimeout(() => setIsTyping(false), 1500);
    }
  };

  const filteredConversations = conversations.filter((conv) =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full h-full flex flex-col md:flex-row bg-slate-900 overflow-hidden animate-fadeIn">
      {/* Conversations Sidebar - Mobile (full), Tablet + Desktop (sidebar) */}
      <div className={`${isMobile && selectedConversation ? 'hidden' : 'flex'} md:flex md:w-64 lg:w-72 flex-col border-r border-slate-700/50 bg-slate-900 w-full md:w-64`}>
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
              className={`w-full px-4 py-3.5 flex items-center gap-3 transition-all duration-200 border-b border-slate-700/50 hover:bg-slate-800/50 ${
                selectedConversation?.id === conversation.id ? 'bg-slate-800 border-l-4 border-l-purple-500' : ''
              }`}
            >
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div className={`w-11 h-11 rounded-full bg-gradient-to-br flex items-center justify-center text-base font-bold shadow-lg ${
                  idx % 3 === 0 ? 'from-purple-500 to-pink-500' :
                  idx % 3 === 1 ? 'from-blue-500 to-cyan-500' :
                  'from-green-500 to-emerald-500'
                }`}>
                  {conversation.avatar}
                </div>
                {conversation.isOnline && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-slate-900 shadow-lg" />
                )}
              </div>

              {/* Conversation Info */}
              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center justify-between gap-2 mb-0.5">
                  <span className="font-bold text-sm text-slate-50 truncate">{conversation.name}</span>
                  <span className="text-xs text-slate-500 flex-shrink-0">{conversation.lastMessageTime}</span>
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
        <div className={`${isMobile ? 'flex' : 'hidden md:flex'} md:flex-1 flex-col`}>
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
                <h3 className="font-black text-slate-50 text-sm sm:text-base">{selectedConversation.name}</h3>
                <p className="text-xs text-green-400 font-medium">
                  {selectedConversation.isOnline ? '● active now' : '● away'}
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
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isSent ? 'justify-end' : 'justify-start'} animate-slideInUp`}
              >
                <div
                  className={`max-w-xs sm:max-w-md px-4 py-2.5 rounded-2xl border transition-all ${
                    message.isSent
                      ? 'bg-purple-600 border-purple-500 text-white shadow-lg'
                      : 'bg-slate-800 border-slate-700 text-slate-50'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  <p className={`text-xs mt-1.5 font-medium ${
                    message.isSent ? 'text-purple-200' : 'text-slate-400'
                  }`}>
                    {message.timestamp}
                  </p>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start animate-slideInUp">
                <div className="px-4 py-3 rounded-2xl bg-slate-800 border border-slate-700">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-slate-600 animate-bounce" style={{ animationDelay: '0s' }} />
                    <div className="w-2 h-2 rounded-full bg-slate-600 animate-bounce" style={{ animationDelay: '0.15s' }} />
                    <div className="w-2 h-2 rounded-full bg-slate-600 animate-bounce" style={{ animationDelay: '0.3s' }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="px-4 sm:px-6 py-4 border-t border-slate-700/50 bg-slate-900">
            <div className="flex items-center gap-2">
              <button className="p-2.5 rounded-full hover:bg-slate-800 transition-all text-slate-400 hover:text-slate-300">
                <Paperclip size={18} />
              </button>
              <input
                type="text"
                placeholder="Type something nice..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1 px-4 py-2.5 rounded-full bg-slate-800 border border-slate-700 text-slate-50 placeholder-slate-500 focus:outline-none focus:border-purple-500/50 focus:bg-slate-800 transition-all text-sm min-h-[40px]"
              />
              <button className="p-2.5 rounded-full hover:bg-slate-800 transition-all text-slate-400 hover:text-slate-300">
                <Smile size={18} />
              </button>
              <button
                onClick={handleSendMessage}
                disabled={!messageInput.trim()}
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
      )}
    </div>
  );
}
