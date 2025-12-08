'use client';

import React from 'react';
import { Heart, MessageCircle, UserPlus, Share2, Zap } from 'lucide-react';

export default function YourActivityPage() {
  const activities = [
    {
      type: 'like',
      user: 'Alex Orbit',
      action: 'liked your post',
      time: '2 hours ago',
      icon: Heart,
      color: 'text-red-400',
    },
    {
      type: 'comment',
      user: 'Jane Cosmos',
      action: 'commented on your post',
      time: '3 hours ago',
      icon: MessageCircle,
      color: 'text-blue-400',
    },
    {
      type: 'follow',
      user: 'Tech Warrior',
      action: 'started following you',
      time: '5 hours ago',
      icon: UserPlus,
      color: 'text-green-400',
    },
    {
      type: 'share',
      user: 'Design Pro',
      action: 'shared your post',
      time: '8 hours ago',
      icon: Share2,
      color: 'text-purple-400',
    },
    {
      type: 'like',
      user: 'Creative Studio',
      action: 'liked your post',
      time: '1 day ago',
      icon: Heart,
      color: 'text-red-400',
    },
    {
      type: 'follow',
      user: 'Nova Spark',
      action: 'started following you',
      time: '2 days ago',
      icon: UserPlus,
      color: 'text-green-400',
    },
  ];

  return (
    <div className="animate-fadeIn pb-24 sm:pb-0 w-full">
      {/* Header */}
      <div className="px-4 sm:px-6 py-6 border-b border-slate-700/50 bg-slate-900">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-50 mb-2">Your Activity</h1>
        <p className="text-sm sm:text-base text-slate-400">See what's happening with your posts and account</p>
      </div>

      {/* Activity Feed */}
      <div className="max-w-2xl mx-auto w-full px-3 sm:px-6 py-6 space-y-2">
        {activities.map((activity, idx) => {
          const Icon = activity.icon;
          return (
            <div
              key={idx}
              className="clean-card px-4 py-3 flex items-center gap-3 hover:bg-slate-800/50 transition-colors cursor-pointer"
            >
              {/* Icon */}
              <div className={`p-2.5 rounded-lg bg-slate-800 ${activity.color}`}>
                <Icon size={18} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-50">
                  <span className="font-semibold">{activity.user}</span>
                  <span className="text-slate-500 mx-1">·</span>
                  <span className="text-slate-400">{activity.action}</span>
                </p>
                <p className="text-xs text-slate-500 mt-0.5">{activity.time}</p>
              </div>

              {/* Arrow */}
              <div className="text-slate-500 text-lg flex-shrink-0">→</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
