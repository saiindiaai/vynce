'use client';

import React from 'react';
import { Heart, MessageCircle, Share2, Bookmark } from 'lucide-react';

export default function SavedPage() {
  // This would normally come from the store, but for now we'll show a placeholder
  const savedPosts = [
    {
      id: 1,
      user: 'Tech Insider',
      username: 'techinsider',
      content: 'New AI breakthrough just dropped! This changes everything 🤯',
      aura: 3421,
      comments: 567,
      shares: 234,
      savedAt: '2 hours ago',
    },
    {
      id: 2,
      user: 'Design Daily',
      username: 'designdaily',
      content: 'Color theory masterclass: Understanding contrast and harmony in modern UI design 🎨',
      aura: 2156,
      comments: 389,
      shares: 178,
      savedAt: '1 day ago',
    },
    {
      id: 3,
      user: 'Code Academy',
      username: 'codeacademy',
      content: 'TypeScript vs JavaScript: Which should you learn first in 2025? Full breakdown 👇',
      aura: 4892,
      comments: 891,
      shares: 445,
      savedAt: '3 days ago',
    },
  ];

  return (
    <div className="animate-fadeIn pb-24 sm:pb-0 w-full">
      {/* Header */}
      <div className="px-4 sm:px-6 py-6 border-b border-slate-700/50 bg-slate-900">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-50 mb-2">Saved</h1>
        <p className="text-sm sm:text-base text-slate-400">Posts you've bookmarked for later</p>
      </div>

      {/* Saved Posts */}
      <div className="max-w-2xl mx-auto w-full px-3 sm:px-6 py-6 space-y-1">
        {savedPosts.length > 0 ? (
          savedPosts.map((post, idx) => (
            <article
              key={post.id}
              className="clean-card animate-slideIn p-4"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              {/* Post Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex-shrink-0 flex items-center justify-center text-base font-bold">
                    {post.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-sm text-slate-50">{post.user}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      <span>@{post.username}</span>
                      <span>·</span>
                      <span>saved {post.savedAt}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Post Content */}
              <div className="mb-3">
                <p className="text-sm text-slate-100 leading-relaxed">{post.content}</p>
              </div>

              {/* Engagement Stats */}
              <div className="text-xs text-slate-400 flex gap-4 mb-3 pb-3 border-b border-slate-700/30">
                <button className="hover:text-slate-200 transition-colors">{post.aura} Aura</button>
                <button className="hover:text-slate-200 transition-colors">{post.comments} Comments</button>
                <button className="hover:text-slate-200 transition-colors">{post.shares} Shares</button>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-2">
                <button className="flex-1 flex items-center justify-center gap-1 py-2 px-1 rounded-md text-slate-400 hover:bg-slate-800/50 hover:text-red-300 transition-all duration-150 text-xs font-medium min-h-[36px] focus:outline-none focus-visible:outline-2 focus-visible:outline-purple-500">
                  <Heart size={14} />
                </button>
                <button className="flex-1 flex items-center justify-center gap-1 py-2 px-1 rounded-md text-slate-400 hover:bg-slate-800/50 hover:text-blue-300 transition-all duration-150 text-xs font-medium min-h-[36px] focus:outline-none focus-visible:outline-2 focus-visible:outline-purple-500">
                  <MessageCircle size={14} />
                </button>
                <button className="flex-1 flex items-center justify-center gap-1 py-2 px-1 rounded-md text-slate-400 hover:bg-slate-800/50 hover:text-green-300 transition-all duration-150 text-xs font-medium min-h-[36px] focus:outline-none focus-visible:outline-2 focus-visible:outline-purple-500">
                  <Share2 size={14} />
                </button>
                <button className="flex-1 flex items-center justify-center py-2 px-1 rounded-md text-yellow-400 bg-slate-800 transition-all duration-150 text-xs font-medium min-h-[36px] min-w-[36px] focus:outline-none focus-visible:outline-2 focus-visible:outline-purple-500">
                  <Bookmark size={14} fill="currentColor" />
                </button>
              </div>
            </article>
          ))
        ) : (
          <div className="text-center py-12">
            <Bookmark size={32} className="mx-auto text-slate-600 mb-4" />
            <p className="text-slate-300 text-lg font-semibold">No saved posts yet</p>
            <p className="text-slate-500 text-sm mt-1">Posts you save will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
}
