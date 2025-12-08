'use client';

import React from 'react';
import { TrendingUp } from 'lucide-react';

interface TrendingTopicProps {
  topic: {
    name: string;
    tag: string;
    posts: number;
    trend: number;
  };
  onClick?: () => void;
}

export default function TrendingTopic({ topic, onClick }: TrendingTopicProps) {
  return (
    <div
      onClick={onClick}
      className="p-4 border border-gray-700/50 rounded-2xl hover:bg-gray-800/50 transition-colors cursor-pointer group"
    >
      <div className="flex items-start justify-between mb-2">
        <div>
          <h4 className="text-purple-50 font-bold">{topic.name}</h4>
          <p className="text-sm text-purple-200/50">{topic.tag}</p>
        </div>
        <TrendingUp size={20} className="text-green-400 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <p className="text-xs text-purple-200/50">{topic.posts.toLocaleString()} posts • +{topic.trend}%</p>
    </div>
  );
}
