
'use client';

import React, { useEffect, useState, useRef } from 'react';
import { BarChart3, TrendingUp, Users, Zap, FileText, Image as ImageIcon, Video, Flame, X } from 'lucide-react';
import { useAppStore } from '@/lib/store';

type ContentType = 'drop' | 'capsule' | 'fight';

type CreatorPost = {
  id: string;
  contentType: ContentType;
  title: string;
  description: string;
  media?: { url: string; type: 'image' | 'video' } | null;
  tags: string[];
  visibility?: 'public' | 'private' | 'draft' | 'scheduled';
  scheduledAt?: number | null;
  createdAt: number;
  // Fight-specific
  opponent?: string;
  fightType?: 'visual' | 'text';
};

const LOCAL_KEY = 'vynce_creator_posts';

export default function CreatorHubPage() {
  const stats = [
    { label: 'Total Followers', value: '1,234', change: '+12% this week', icon: Users },
    { label: 'Total Aura', value: '5,678', change: '+23% this week', icon: Zap },
    { label: 'Engagement Rate', value: '8.5%', change: '+2% this week', icon: TrendingUp },
    { label: 'Total Views', value: '45.2K', change: '+31% this week', icon: BarChart3 },
  ];

  const { showToast } = useAppStore();

  const [contentType, setContentType] = useState<ContentType>('drop');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [visibility, setVisibility] = useState<'public' | 'private' | 'draft'>('public');
  const [scheduledAt, setScheduledAt] = useState<string>('');
  const [isPublishing, setIsPublishing] = useState(false);
  const [opponent, setOpponent] = useState('');
  const [fightType, setFightType] = useState<'visual' | 'text'>('visual');

  const [posts, setPosts] = useState<CreatorPost[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LOCAL_KEY);
      if (raw) setPosts(JSON.parse(raw));
    } catch (err) {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_KEY, JSON.stringify(posts));
    } catch (err) {
      // ignore
    }
  }, [posts]);

  const handleFile = (file?: File) => {
    if (!file) return;
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');
    if (!isImage && !isVideo) {
      showToast?.('Unsupported file type. Please upload an image or video.', 'warning');
      return;
    }
    // basic file size validation: 40MB limit
    const maxBytes = 40 * 1024 * 1024;
    if (file.size > maxBytes) {
      showToast?.('File too large — max 40MB allowed.', 'warning');
      return;
    }
    const url = URL.createObjectURL(file);
    setMediaPreview(url);
    setMediaType(isImage ? 'image' : 'video');
  };

  const clearForm = () => {
    setTitle('');
    setDescription('');
    setTags('');
    setMediaPreview(null);
    setMediaType(null);
    setOpponent('');
    setFightType('visual');
    if (fileRef.current) fileRef.current.value = '';
  };

  const publish = () => {
    if (!title.trim()) {
      showToast?.('Please add a title for your content', 'warning');
      return;
    }

    // Validate by content type
    if (contentType === 'fight' && !opponent.trim()) {
      showToast?.('Please enter an opponent name for the fight', 'warning');
      return;
    }

    setIsPublishing(true);

    const parsedTags = tags.split(',').map((t) => t.trim()).filter(Boolean);
    const postId = `post_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    const scheduledTimestamp = scheduledAt ? new Date(scheduledAt).getTime() : null;
    const vis = scheduledTimestamp && scheduledTimestamp > Date.now() ? 'scheduled' : visibility;

    const post: CreatorPost = {
      id: postId,
      contentType,
      title: title.trim(),
      description: description.trim(),
      media: mediaPreview ? { url: mediaPreview, type: (mediaType as 'image' | 'video') } : undefined,
      tags: parsedTags,
      visibility: vis,
      scheduledAt: scheduledTimestamp,
      createdAt: Date.now(),
      ...(contentType === 'fight' && {
        opponent: opponent.trim(),
        fightType,
      }),
    };

    // quick local persist
    setPosts((p) => [post, ...p]);

    // small UX: simulate upload/publish time
    setTimeout(() => {
      showToast?.(vis === 'scheduled' ? 'Content scheduled successfully.' : 'Content published successfully!', 'success');
      clearForm();
      setIsPublishing(false);
    }, 600);
  };

  const removePost = (id: string) => {
    setPosts((p) => p.filter((x) => x.id !== id));
    showToast?.('Post removed', 'info');
  };

  const tools = [
    {
      title: 'Analytics Dashboard',
      description: 'Track your content performance and audience insights',
      cta: 'View Analytics',
    },
    {
      title: 'Content Planner',
      description: 'Plan and schedule your posts in advance',
      cta: 'Plan Content',
    },
    {
      title: 'Growth Tools',
      description: 'Discover new ways to grow your audience',
      cta: 'Explore Tools',
    },
    {
      title: 'Creator Fund',
      description: 'Earn money from your engaging content',
      cta: 'Learn More',
    },
  ];

  return (
    <div className="animate-fadeIn pb-24 sm:pb-0 w-full">
      {/* Header */}
      <div className="px-4 sm:px-6 py-6 border-b border-slate-700/50 bg-slate-900">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-50 mb-2">Creator Hub</h1>
        <p className="text-sm sm:text-base text-slate-400">Grow your audience and publish content from here</p>
      </div>

      <div className="max-w-6xl mx-auto w-full px-3 sm:px-6 py-6 space-y-6">
        {/* Top Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="clean-card p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs sm:text-sm font-semibold text-slate-400">{stat.label}</h3>
                  <Icon size={16} className="text-purple-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-slate-50">{stat.value}</div>
                <p className="text-xs text-slate-500">{stat.change}</p>
              </div>
            );
          })}
        </div>

        {/* Creator Form + Posts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="clean-card p-6 sm:p-8">
              <div className="mb-8">
                <h2 className="text-2xl font-black text-slate-50 mb-1">Create New Content</h2>
                <p className="text-sm text-slate-400">Share your thoughts with the Vynce community</p>
              </div>
              
              {/* Content Type Selector */}
              <div className="mb-8">
                <label className="block text-xs font-black uppercase tracking-wider text-slate-400 mb-3">Content Type</label>
                <div className="grid grid-cols-3 gap-3">
                  {(['drop', 'capsule', 'fight'] as ContentType[]).map((type) => (
                    <button
                      key={type}
                      onClick={() => {
                        setContentType(type);
                        clearForm();
                      }}
                      className={`relative group py-3 px-4 rounded-xl font-bold transition-all duration-300 text-sm sm:text-base flex items-center justify-center gap-2 overflow-hidden ${
                        contentType === type
                          ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/50'
                          : 'bg-slate-800/40 text-slate-400 hover:bg-slate-800/60 border border-slate-700/50 hover:border-slate-600'
                      }`}
                    >
                      {type === 'drop' && <FileText size={18} />}
                      {type === 'capsule' && <Video size={18} />}
                      {type === 'fight' && <Flame size={18} />}
                      <span>{type.charAt(0).toUpperCase() + type.slice(1)}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-5">
                {/* Title Input */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-2">Title</label>
                  <input 
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-lg text-slate-50 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all" 
                    placeholder="Add an eye-catching title..." 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                  />
                </div>

                {/* Description Input */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-2">Description</label>
                  <textarea 
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-lg text-slate-50 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all resize-none" 
                    placeholder="Tell your story..." 
                    rows={5}
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)} 
                  />
                </div>

                {/* Fight-specific fields */}
                {contentType === 'fight' && (
                  <div className="p-4 bg-gradient-to-br from-red-600/10 to-orange-600/10 rounded-xl border border-red-600/30 space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-red-300 mb-2">Opponent Username</label>
                      <input 
                        className="w-full px-4 py-3 bg-slate-900/60 border border-slate-700/50 rounded-lg text-slate-50 placeholder-slate-500 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all" 
                        placeholder="e.g., ProDev" 
                        value={opponent} 
                        onChange={(e) => setOpponent(e.target.value)} 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-red-300 mb-2">Fight Type</label>
                      <div className="flex gap-3">
                        <button
                          onClick={() => setFightType('visual')}
                          className={`flex-1 py-2.5 px-3 rounded-lg text-sm font-bold transition-all ${
                            fightType === 'visual'
                              ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                              : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-slate-700/50'
                          }`}
                        >
                          🎥 Visual
                        </button>
                        <button
                          onClick={() => setFightType('text')}
                          className={`flex-1 py-2.5 px-3 rounded-lg text-sm font-bold transition-all ${
                            fightType === 'text'
                              ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
                              : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-slate-700/50'
                          }`}
                        >
                          💬 Debate
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tags Input */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-2">Tags <span className="text-slate-500">(optional)</span></label>
                  <input 
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-lg text-slate-50 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all" 
                    placeholder="tech, design, tutorial (comma separated)" 
                    value={tags} 
                    onChange={(e) => setTags(e.target.value)} 
                  />
                </div>

                {/* Media upload */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-3">
                    Media {contentType === 'capsule' && <span className="text-red-400">*</span>}
                    <span className="text-slate-500 ml-1">({contentType === 'capsule' ? 'video recommended' : 'optional'})</span>
                  </label>
                  <div className="relative">
                    <input 
                      ref={fileRef} 
                      type="file" 
                      accept="image/*,video/*" 
                      onChange={(e) => handleFile(e.target.files?.[0] || undefined)}
                      className="sr-only"
                      id="media-upload"
                    />
                    <label htmlFor="media-upload" className="flex items-center justify-center w-full px-4 py-8 border-2 border-dashed border-slate-700/50 rounded-xl hover:border-purple-500/50 hover:bg-slate-900/30 cursor-pointer transition-all group">
                      <div className="text-center">
                        <ImageIcon className="mx-auto mb-2 text-slate-500 group-hover:text-purple-400 transition-colors" size={28} />
                        <p className="text-sm font-semibold text-slate-400">Click to upload or drag and drop</p>
                        <p className="text-xs text-slate-500 mt-1">PNG, JPG, MP4 up to 40MB</p>
                      </div>
                    </label>
                  </div>
                  {mediaPreview && mediaType === 'image' && (
                    <div className="mt-4 relative">
                      <img src={mediaPreview} alt="preview" className="rounded-xl max-h-48 object-cover w-full" />
                      <button onClick={() => { setMediaPreview(null); setMediaType(null); }} className="absolute top-2 right-2 p-2 bg-black/50 hover:bg-black rounded-full transition-all">
                        <X size={16} className="text-white" />
                      </button>
                    </div>
                  )}
                  {mediaPreview && mediaType === 'video' && (
                    <div className="mt-4 relative">
                      <video src={mediaPreview as string} controls className="rounded-xl max-h-48 w-full object-cover" />
                      <button onClick={() => { setMediaPreview(null); setMediaType(null); }} className="absolute top-2 right-2 p-2 bg-black/50 hover:bg-black rounded-full transition-all">
                        <X size={16} className="text-white" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Visibility & Scheduling */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-2">Visibility</label>
                    <select
                      value={visibility}
                      onChange={(e) => setVisibility(e.target.value as 'public' | 'private' | 'draft')}
                      className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-lg text-slate-50 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                    >
                      <option value="public">🌍 Public</option>
                      <option value="private">🔒 Private</option>
                      <option value="draft">📝 Draft</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-2">Schedule <span className="text-slate-500">(optional)</span></label>
                    <input
                      type="datetime-local"
                      value={scheduledAt}
                      onChange={(e) => setScheduledAt(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-lg text-slate-50 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 pt-4 border-t border-slate-700/50">
                  <button
                    onClick={publish}
                    disabled={isPublishing}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 shadow-lg shadow-purple-500/25"
                  >
                    {isPublishing ? 'Publishing...' : `Publish as ${contentType.toUpperCase()}`}
                  </button>
                  <button onClick={clearForm} className="px-6 py-3 bg-slate-800/40 hover:bg-slate-800 text-slate-300 font-semibold rounded-lg border border-slate-700/50 transition-all">
                    Clear
                  </button>
                </div>
              </div>
            </div>

            {/* Your Content Grid */}
            <div className="clean-card p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-slate-50">Your Content</h3>
                {posts.length > 0 && (
                  <span className="text-xs text-slate-500">
                    {posts.filter((p) => p.contentType === 'drop').length} Drops •
                    {posts.filter((p) => p.contentType === 'capsule').length} Capsules •
                    {posts.filter((p) => p.contentType === 'fight').length} Fights
                  </span>
                )}
              </div>
              <div className="space-y-3">
                {posts.length === 0 && <div className="text-sm text-slate-400">You haven't published anything yet.</div>}
                {posts.map((p) => (
                  <div key={p.id} className="border border-slate-700 rounded-lg p-3 bg-slate-900/40 hover:bg-slate-900/60 transition-colors">
                    <div className="flex items-start gap-3">
                      {/* Content Type Badge + Media */}
                      <div className="flex-shrink-0 flex flex-col gap-2">
                        <div
                          className={`w-20 h-20 rounded-lg flex items-center justify-center text-2xl font-bold ${
                            p.contentType === 'drop'
                              ? 'bg-blue-600/20 text-blue-400'
                              : p.contentType === 'capsule'
                              ? 'bg-purple-600/20 text-purple-400'
                              : 'bg-red-600/20 text-red-400'
                          }`}
                        >
                          {p.contentType === 'drop' && <FileText size={24} />}
                          {p.contentType === 'capsule' && <Video size={24} />}
                          {p.contentType === 'fight' && <Flame size={24} />}
                        </div>
                        {p.media?.type === 'image' && (
                          <img src={p.media.url} className="w-20 h-20 object-cover rounded" alt="media" />
                        )}
                        {p.media?.type === 'video' && (
                          <video src={p.media.url} className="w-20 h-20 object-cover rounded" />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <div className="font-semibold text-slate-50 truncate">{p.title}</div>
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                              p.contentType === 'drop'
                                ? 'bg-blue-600/30 text-blue-300'
                                : p.contentType === 'capsule'
                                ? 'bg-purple-600/30 text-purple-300'
                                : 'bg-red-600/30 text-red-300'
                            }`}>
                              {p.contentType === 'fight' && p.opponent ? `vs ${p.opponent}` : p.contentType}
                            </span>
                          </div>
                          <div className="text-xs text-slate-400 flex-shrink-0">{new Date(p.createdAt).toLocaleDateString()}</div>
                        </div>
                        <div className="text-sm text-slate-300 line-clamp-2 mb-1">{p.description}</div>
                        {p.tags.length > 0 && <div className="text-xs text-slate-400 mb-2">#{p.tags.join(' #')}</div>}
                        {p.fightType && <div className="text-xs text-slate-400 mb-2">Fight Type: {p.fightType === 'visual' ? '🎥 Visual' : '💬 Text Debate'}</div>}
                        <div className="flex gap-2 flex-wrap">
                          <span className={`text-xs px-2 py-1 rounded ${
                            p.visibility === 'public' ? 'bg-green-600/30 text-green-300' :
                            p.visibility === 'private' ? 'bg-slate-600/30 text-slate-300' :
                            p.visibility === 'draft' ? 'bg-yellow-600/30 text-yellow-300' :
                            'bg-blue-600/30 text-blue-300'
                          }`}>
                            {p.visibility === 'public' && '🌍 Public'}
                            {p.visibility === 'private' && '🔒 Private'}
                            {p.visibility === 'draft' && '📝 Draft'}
                            {p.visibility === 'scheduled' && '📅 Scheduled'}
                          </span>
                          <button onClick={() => navigator.clipboard?.writeText(JSON.stringify(p))} className="text-xs text-purple-400 hover:text-purple-300">Copy JSON</button>
                          <button onClick={() => removePost(p.id)} className="text-xs text-red-400 hover:text-red-300">Delete</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="clean-card p-4">
              <h3 className="text-lg font-bold text-slate-50 mb-3">Content Guide</h3>
              <div className="space-y-3 text-sm">
                <div className="p-2.5 bg-blue-600/10 border border-blue-600/30 rounded">
                  <div className="font-semibold text-blue-300 mb-1">📄 Drops</div>
                  <p className="text-xs text-slate-300">Long-form posts with images. Perfect for breaking news, tutorials, and insights. Can include multiple images.</p>
                </div>
                <div className="p-2.5 bg-purple-600/10 border border-purple-600/30 rounded">
                  <div className="font-semibold text-purple-300 mb-1">📹 Capsules</div>
                  <p className="text-xs text-slate-300">Short vertical videos or stories. Great for behind-the-scenes content, quick tips, and daily moments.</p>
                </div>
                <div className="p-2.5 bg-red-600/10 border border-red-600/30 rounded">
                  <div className="font-semibold text-red-300 mb-1">⚡ Fights</div>
                  <p className="text-xs text-slate-300">Challenges & debates with opponents. Choose Visual (stream-style) or Text (debate-style) formats.</p>
                </div>
              </div>
            </div>

            <div className="clean-card p-4">
              <h3 className="text-lg font-bold text-slate-50 mb-3">Creator Tools</h3>
              <div className="space-y-2">
                <button className="w-full text-left p-2 border border-slate-700/50 rounded hover:bg-slate-800/50 transition-colors">
                  <div className="text-sm font-semibold text-slate-50">📊 Analytics Dashboard</div>
                  <p className="text-xs text-slate-400 mt-1">Track your content performance and audience insights</p>
                </button>
                <button className="w-full text-left p-2 border border-slate-700/50 rounded hover:bg-slate-800/50 transition-colors">
                  <div className="text-sm font-semibold text-slate-50">📅 Content Planner</div>
                  <p className="text-xs text-slate-400 mt-1">Plan and schedule your posts in advance</p>
                </button>
                <button className="w-full text-left p-2 border border-slate-700/50 rounded hover:bg-slate-800/50 transition-colors">
                  <div className="text-sm font-semibold text-slate-50">🚀 Growth Tools</div>
                  <p className="text-xs text-slate-400 mt-1">Discover ways to grow your audience</p>
                </button>
                <button className="w-full text-left p-2 border border-slate-700/50 rounded hover:bg-slate-800/50 transition-colors">
                  <div className="text-sm font-semibold text-slate-50">💰 Creator Fund</div>
                  <p className="text-xs text-slate-400 mt-1">Earn money from your engaging content</p>
                </button>
              </div>
            </div>

            <div className="clean-card p-4 bg-gradient-to-br from-purple-600/10 to-blue-600/10 border border-purple-600/30">
              <h4 className="text-sm font-bold text-slate-50 mb-2">💡 Pro Tip</h4>
              <p className="text-xs text-slate-300">Content is stored locally and synced to parent ecosystem if embedded. Use scheduling to post when your audience is most active!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
