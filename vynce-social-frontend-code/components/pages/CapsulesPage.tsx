'use client';

import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Share2 } from 'lucide-react';
import CommentsSheet from '@/components/PostActions/CommentsSheet';
import ShareSheet from '@/components/PostActions/ShareSheet';
import { useAppStore } from '@/lib/store';

const capsules = [
  {
    id: 1,
    username: 'alex_orbit',
    displayName: 'Alex Orbit',
    userAvatar: '🎵',
    gradient: 'from-purple-500 to-pink-500',
    timestamp: '2h ago',
    likes: 1234,
    comments: 234,
    shares: 89,
    description: 'Check out my latest music production! 🔥',
    isLiked: false,
  },
  {
    id: 2,
    username: 'jane_cosmos',
    displayName: 'Jane Cosmos',
    userAvatar: '🎨',
    gradient: 'from-orange-500 to-pink-500',
    timestamp: '4h ago',
    likes: 5678,
    comments: 567,
    shares: 234,
    description: 'Digital art collection - part 3 of my series',
    isLiked: false,
  },
  {
    id: 3,
    username: 'tech_warrior',
    displayName: 'Tech Warrior',
    userAvatar: '💻',
    gradient: 'from-cyan-500 to-blue-500',
    timestamp: '6h ago',
    likes: 2345,
    comments: 345,
    shares: 123,
    description: 'Building an AI app in 10 minutes | Dev speedrun',
    isLiked: false,
  },
  {
    id: 4,
    username: 'design_flow',
    displayName: 'Design Flow',
    userAvatar: '🎭',
    gradient: 'from-green-500 to-teal-500',
    timestamp: '8h ago',
    likes: 3456,
    comments: 456,
    shares: 156,
    description: 'New UI design trends for 2025',
    isLiked: false,
  },
];

export default function CapsulesPage() {
  const { currentCapsuleIndex, setCurrentCapsuleIndex } = useAppStore();
  const [capsuleState, setCapsuleState] = useState(capsules);
  const [activeComments, setActiveComments] = useState<number | null>(null);
  const [activeShare, setActiveShare] = useState<number | null>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const currentIndex = currentCapsuleIndex % capsules.length;
  const capsule = capsuleState[currentIndex];

  // Handle swipe gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientY);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart) return;
    const diff = touchStart - e.changedTouches[0].clientY;
    
    // Swipe down = prev, Swipe up = next
    if (diff > 50 && currentIndex < capsules.length - 1) {
      setCurrentCapsuleIndex(currentCapsuleIndex + 1);
    } else if (diff < -50 && currentIndex > 0) {
      setCurrentCapsuleIndex(currentCapsuleIndex - 1);
    }
    setTouchStart(null);
  };

  const handleLike = () => {
    const updated = [...capsuleState];
    updated[currentIndex].isLiked = !updated[currentIndex].isLiked;
    updated[currentIndex].likes += updated[currentIndex].isLiked ? 1 : -1;
    setCapsuleState(updated);
  };

  return (
    <div className="w-full h-full min-h-screen bg-black flex items-center justify-center py-4 sm:py-8">
      {/* Container - Responsive */}
      <div className="w-full h-full sm:h-auto flex flex-col items-center justify-center max-w-2xl">
        {/* Progress Bars - Top */}
        <div className="w-full flex gap-0.5 px-3 sm:px-6 py-3 z-20">
          {capsules.map((_, idx) => (
            <div
              key={idx}
              className={`h-0.5 flex-1 rounded-full transition-all duration-300 ${
                idx < currentIndex
                  ? 'bg-white'
                  : idx === currentIndex
                  ? 'bg-white'
                  : 'bg-white/40'
              }`}
              aria-hidden="true"
            />
          ))}
        </div>

        {/* User Info Header - Top Left */}
        <div className="w-full flex items-start px-3 sm:px-6 py-3 z-20">
          <div className="flex items-center gap-2">
            <div
              className={`w-10 h-10 rounded-full bg-gradient-to-br ${capsule.gradient} flex items-center justify-center text-lg font-bold ring-2 ring-white`}
            >
              {capsule.userAvatar}
            </div>
            <div className="text-white">
              <div className="font-bold text-sm">{capsule.username}</div>
              <div className="text-xs text-white/70">{capsule.timestamp}</div>
            </div>
          </div>
        </div>

        {/* Main Story Card */}
        <div
          className="w-full max-w-md sm:h-[70vh] h-[55vh] rounded-2xl sm:rounded-3xl overflow-hidden flex items-center justify-center flex-shrink-0 mx-3 sm:mx-0"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Background Gradient */}
          <div
            className={`absolute inset-0 bg-gradient-to-br ${capsule.gradient}`}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />
          </div>

          {/* Content - Centered */}
          <div className="relative z-10 flex flex-col items-center justify-center space-y-3 sm:space-y-4 px-4 sm:px-6 text-center">
            <div className="text-6xl sm:text-7xl animate-float">{capsule.userAvatar}</div>
            <h2 className="text-2xl sm:text-4xl font-black text-white drop-shadow-lg leading-tight">
              {capsule.displayName}
            </h2>
            <p className="text-xs sm:text-base text-white/95 drop-shadow-md max-w-xs font-medium leading-relaxed">
              {capsule.description}
            </p>
          </div>

          {/* Right Side Actions */}
          <div className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-4 sm:gap-6">
            {/* Like Button */}
            <button
              onClick={handleLike}
              className="flex flex-col items-center gap-1 focus:outline-none focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
              aria-label={capsule.isLiked ? 'Unlike story' : 'Like story'}
            >
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center hover:bg-white/30 transition-all active:scale-90">
                <Heart
                  size={20}
                  className={`${
                    capsule.isLiked
                      ? 'fill-red-500 text-red-500'
                      : 'text-white'
                  }`}
                />
              </div>
              <span className="text-white text-xs font-semibold">{capsule.likes}</span>
            </button>

            {/* Comment Button */}
            <button
              onClick={() => setActiveComments(capsule.id)}
              className="flex flex-col items-center gap-1 focus:outline-none focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
              aria-label="Comment on story"
            >
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center hover:bg-white/30 transition-all active:scale-90">
                <MessageCircle size={20} className="text-white" />
              </div>
              <span className="text-white text-xs font-semibold">{capsule.comments}</span>
            </button>

            {/* Share Button */}
            <button
              onClick={() => setActiveShare(capsule.id)}
              className="flex flex-col items-center gap-1 focus:outline-none focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
              aria-label="Share story"
            >
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center hover:bg-white/30 transition-all active:scale-90">
                <Share2 size={20} className="text-white" />
              </div>
              <span className="text-white text-xs font-semibold">{capsule.shares}</span>
            </button>
          </div>
        </div>

        {/* Dot Navigation */}
        <div className="w-full flex justify-center gap-1.5 mt-4 sm:mt-6 z-20">
          {capsules.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentCapsuleIndex(idx)}
              className={`transition-all duration-300 rounded-full ${
                idx === currentIndex
                  ? 'w-6 h-2 sm:w-8 bg-white'
                  : 'w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white/40'
              }`}
              aria-label={`Capsule ${idx + 1}${idx === currentIndex ? ' (current)' : ''}`}
            />
          ))}
        </div>

        {/* Swipe hint - Mobile only */}
        <p className="text-white/60 text-xs mt-3 sm:hidden z-20">Swipe up/down to navigate</p>
      </div>

      {/* Modals */}
      {activeComments !== null && (
        <CommentsSheet
          isOpen={true}
          onClose={() => setActiveComments(null)}
          postId={activeComments}
          commentsCount={capsuleState.find((c) => c.id === activeComments)?.comments || 0}
          variant="capsules"
        />
      )}

      {activeShare !== null && (
        <ShareSheet
          isOpen={true}
          onClose={() => setActiveShare(null)}
          postId={activeShare}
          variant="capsules"
        />
      )}
    </div>
  );
}
