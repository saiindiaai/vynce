'use client';

import React, { useState } from 'react';
import { MessageCircle, Share2, Flame, Reply, X, ThumbsUp, ThumbsDown, ChevronDown } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import CommentsSheet from '@/components/PostActions/CommentsSheet';
import ShareSheet from '@/components/PostActions/ShareSheet';

interface TextDebateViewerProps {
  fight: any;
  onClose?: () => void;
}

export default function TextDebateViewer({ fight, onClose }: TextDebateViewerProps) {
  const { fightVotes, toggleFightVote, argumentVotes, toggleArgumentVote, showToast } = useAppStore();
  const [liveDebates, setLiveDebates] = useState<Array<any>>([ {
      id: 1,
      team: 'teamA',
      author: 'TechArgument',
      avatar: '💻',
      time: '2m ago',
      argument: 'TypeScript is objectively better for type safety in large projects',
      replies: 45,
      repliesList: [
        { id: 101, author: 'DevExpert', avatar: '🔧', text: 'Totally agree. I switched 2 years ago.', time: '1m ago', upvotes: 12, downvotes: 1 },
        { id: 102, author: 'QuickHacker', avatar: '⚡', text: 'Disagree - too much overhead.', time: '30s ago', upvotes: 5, downvotes: 3 },
      ],
      showReplies: false,
    },
    {
      id: 2,
      team: 'teamB',
      author: 'JSAdvocate',
      avatar: '⚡',
      time: '1m ago',
      argument: 'JavaScript flexibility allows faster iteration and prototyping',
      replies: 38,
      repliesList: [
        { id: 201, author: 'SpeedCoder', avatar: '🚀', text: 'This is the way. Move fast.', time: '45s ago', upvotes: 28, downvotes: 2 },
      ],
      showReplies: false,
    },
    {
      id: 3,
      team: 'teamA',
      author: 'CodeQuality',
      avatar: '✅',
      time: '30s ago',
      argument: 'Compile-time error detection saves hours of debugging',
      replies: 22,
      repliesList: [],
      showReplies: false,
    },
  ]);
  

  const [showVotePanel, setShowVotePanel] = useState(false);
  const [openReplyFor, setOpenReplyFor] = useState<number | null>(null);
  const [replyText, setReplyText] = useState('');
  const [activeComments, setActiveComments] = useState<number | null>(null);
  const [activeShare, setActiveShare] = useState<number | null>(null);
  const [expandedReplies, setExpandedReplies] = useState<number[]>([]);

  const votes = fightVotes[fight.id] || { teamA: 0, teamB: 0, userVote: undefined };

  return (
    <div className="w-full h-full bg-slate-950 flex flex-col">
      <div className="sticky top-0 z-30 border-b border-slate-800 p-3 sm:p-4 flex items-center justify-between bg-slate-950">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <div className="text-sm font-bold text-slate-50">Text Debate</div>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-800 text-slate-300">
            <X size={16} />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-auto p-4">
        <div className="max-w-3xl mx-auto space-y-3">
          {liveDebates.map((d) => {
            const argVotes = argumentVotes[d.id] || { upvotes: 0, downvotes: 0, userVote: undefined };
            return (
            <div key={d.id} className={(d.team === 'teamA' ? 'bg-blue-600/5 ' : 'bg-red-600/5 ') + 'p-3 rounded-lg'}>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-800 text-sm">{d.avatar}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold text-slate-50 truncate">{d.author}</div>
                    <div className="text-xs text-slate-400">{d.time}</div>
                  </div>
                  <p className="text-sm text-slate-300 mt-2">{d.argument}</p>
                  
                  {/* Vote buttons - Reddit style upvote/downvote */}
                  <div className="flex items-center gap-2 mt-3 bg-slate-800/40 rounded-lg p-2 w-fit">
                    <button
                      onClick={() => {
                        const prev = argVotes.userVote;
                        toggleArgumentVote(d.id, 'up');
                        showToast('Upvoted', 'success', 1200, 'Undo', () => {
                          if (prev === undefined) toggleArgumentVote(d.id, 'up');
                          else if (prev === 'up') toggleArgumentVote(d.id, 'up');
                          else toggleArgumentVote(d.id, prev);
                        });
                      }}
                      className={`p-1 rounded flex items-center gap-1 text-xs transition-colors ${
                        argVotes.userVote === 'up'
                          ? 'text-orange-400 bg-orange-600/20'
                          : 'text-slate-400 hover:text-slate-300 hover:bg-slate-700/30'
                      }`}
                    >
                      <ThumbsUp size={12} /> <span className="font-semibold">{argVotes.upvotes}</span>
                    </button>
                    <div className="w-px h-4 bg-slate-700" />
                    <button
                      onClick={() => {
                        const prev = argVotes.userVote;
                        toggleArgumentVote(d.id, 'down');
                        showToast('Downvoted', 'success', 1200, 'Undo', () => {
                          if (prev === undefined) toggleArgumentVote(d.id, 'down');
                          else if (prev === 'down') toggleArgumentVote(d.id, 'down');
                          else toggleArgumentVote(d.id, prev);
                        });
                      }}
                      className={`p-1 rounded flex items-center gap-1 text-xs transition-colors ${
                        argVotes.userVote === 'down'
                          ? 'text-blue-400 bg-blue-600/20'
                          : 'text-slate-400 hover:text-slate-300 hover:bg-slate-700/30'
                      }`}
                    >
                      <ThumbsDown size={12} /> <span className="font-semibold">{argVotes.downvotes}</span>
                    </button>
                  </div>
                  
                  {/* Reply section */}
                  <div className="flex items-center gap-2 mt-3 text-xs text-slate-400">
                    <button
                      onClick={() => setExpandedReplies(prev => prev.includes(d.id) ? prev.filter(id => id !== d.id) : [...prev, d.id])}
                      className="flex items-center gap-1 hover:text-slate-300 transition-colors"
                    >
                      <Reply size={14} /> <span>{d.replies} {d.replies === 1 ? 'reply' : 'replies'}</span>
                      {d.repliesList.length > 0 && <ChevronDown size={12} className={`transition-transform ${expandedReplies.includes(d.id) ? 'rotate-180' : ''}`} />}
                    </button>
                    <button className="flex items-center gap-1 hover:text-slate-300" onClick={() => setActiveShare(d.id)}><Share2 size={14} /></button>
                  </div>
                  
                  {/* Threaded replies */}
                  {expandedReplies.includes(d.id) && d.repliesList.length > 0 && (
                    <div className="mt-3 ml-2 pl-3 border-l border-slate-700 space-y-2">
                      {d.repliesList.map((r: any) => {
                        const replyVotes = argumentVotes[r.id] || { upvotes: r.upvotes || 0, downvotes: r.downvotes || 0, userVote: undefined };
                        return (
                          <div key={r.id} className="bg-slate-800/30 p-2 rounded text-xs">
                            <div className="flex items-start gap-2">
                              <div className="w-6 h-6 rounded-full flex items-center justify-center bg-slate-700 flex-shrink-0 text-xs">{r.avatar}</div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <div className="font-semibold text-slate-50">{r.author}</div>
                                  <div className="text-slate-500">{r.time}</div>
                                </div>
                                <p className="text-slate-300 mt-1">{r.text}</p>
                                {/* Nested upvote/downvote */}
                                <div className="flex items-center gap-1 mt-2 bg-slate-800/40 rounded p-1 w-fit">
                                  <button
                                    onClick={() => {
                                      const prev = replyVotes.userVote;
                                      toggleArgumentVote(r.id, 'up');
                                      showToast('Upvoted reply', 'success', 1000, 'Undo', () => {
                                        if (prev === undefined) toggleArgumentVote(r.id, 'up');
                                        else if (prev === 'up') toggleArgumentVote(r.id, 'up');
                                        else toggleArgumentVote(r.id, prev);
                                      });
                                    }}
                                    className={`p-0.5 rounded flex items-center gap-0.5 text-xs transition-colors ${
                                      replyVotes.userVote === 'up' ? 'text-orange-400 bg-orange-600/20' : 'text-slate-500 hover:text-slate-300'
                                    }`}
                                  >
                                    <ThumbsUp size={10} /> {replyVotes.upvotes}
                                  </button>
                                  <div className="w-px h-3 bg-slate-700" />
                                  <button
                                    onClick={() => {
                                      const prev = replyVotes.userVote;
                                      toggleArgumentVote(r.id, 'down');
                                      showToast('Downvoted reply', 'success', 1000, 'Undo', () => {
                                        if (prev === undefined) toggleArgumentVote(r.id, 'down');
                                        else if (prev === 'down') toggleArgumentVote(r.id, 'down');
                                        else toggleArgumentVote(r.id, prev);
                                      });
                                    }}
                                    className={`p-0.5 rounded flex items-center gap-0.5 text-xs transition-colors ${
                                      replyVotes.userVote === 'down' ? 'text-blue-400 bg-blue-600/20' : 'text-slate-500 hover:text-slate-300'
                                    }`}
                                  >
                                    <ThumbsDown size={10} /> {replyVotes.downvotes}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      {/* Reply input for this argument */}
                      {openReplyFor === d.id && (
                        <div className="mt-2 bg-slate-800/40 p-2 rounded">
                          <textarea value={replyText} onChange={(e) => setReplyText(e.target.value)} rows={2} className="w-full rounded p-2 bg-slate-800 text-sm text-slate-50 placeholder-slate-500 mb-2" placeholder="Reply to this argument..." />
                          <div className="flex justify-end gap-2">
                            <button onClick={() => { setOpenReplyFor(null); setReplyText(''); }} className="px-2 py-1 text-xs rounded text-slate-400 hover:text-slate-300">Cancel</button>
                            <button onClick={() => {
                              if (!replyText.trim()) return;
                              const newReply = { id: Date.now(), author: 'You', avatar: '👤', text: replyText.trim(), time: 'now', upvotes: 0, downvotes: 0 };
                              setLiveDebates((prev) => prev.map((dd) => dd.id === d.id ? { ...dd, replies: (dd.replies||0) + 1, repliesList: [newReply, ...(dd.repliesList||[])] } : dd));
                              setReplyText(''); setOpenReplyFor(null); showToast('Reply posted', 'success', 1400);
                            }} className="px-3 py-1 rounded text-xs bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold">Reply</button>
                          </div>
                        </div>
                      )}
                      {/* Show reply button only if not already replying */}
                      {openReplyFor !== d.id && (
                        <button onClick={() => setOpenReplyFor(d.id)} className="text-xs text-slate-500 hover:text-slate-300 transition-colors mt-2">+ Add reply</button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
            );
          })}
        </div>
      </div>

      <div className="p-4 border-t border-slate-800 bg-slate-900">
        <div className="max-w-3xl mx-auto flex flex-col gap-3">
          <textarea placeholder="Share your argument..." rows={2} className="flex-1 rounded p-3 bg-slate-800 text-slate-50" />
          <div className="flex items-center gap-2 relative">
            <div className="relative flex-1">
              <button onClick={() => setShowVotePanel((s) => !s)} className="p-2 rounded bg-slate-800 text-slate-200 w-full flex items-center justify-center"><Flame size={16} className="mr-2" />Support a team</button>
              {showVotePanel && (
                <div className="absolute left-0 right-0 bottom-full mb-2 w-full p-2 bg-slate-800 rounded-lg shadow-lg">
                  <div className="text-xs text-slate-300 mb-1">Support a team</div>
                  <div className="flex gap-2">
                    <button onClick={() => {
                      const prev = votes.userVote;
                      toggleFightVote(fight.id, 'teamA');
                      setShowVotePanel(false);
                      showToast(`You now support ${fight.fighter1}`, 'success', 2000, 'Undo', () => {
                        if (prev === undefined) toggleFightVote(fight.id, 'teamA'); else toggleFightVote(fight.id, prev);
                      });
                    }} className="flex-1 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-xs font-semibold">{fight.fighter1}</button>
                    <button onClick={() => {
                      const prev = votes.userVote;
                      toggleFightVote(fight.id, 'teamB');
                      setShowVotePanel(false);
                      showToast(`You now support ${fight.fighter2}`, 'success', 2000, 'Undo', () => {
                        if (prev === undefined) toggleFightVote(fight.id, 'teamB'); else toggleFightVote(fight.id, prev);
                      });
                    }} className="flex-1 py-2 rounded-lg bg-gradient-to-r from-red-600 to-orange-600 text-white text-xs font-semibold">{fight.fighter2}</button>
                  </div>
                </div>
              )}
            </div>
            <button className="px-4 py-2 rounded bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold">Post</button>
          </div>
        </div>
        {activeComments !== null && (
          <CommentsSheet isOpen={true} onClose={() => setActiveComments(null)} postId={activeComments} variant="fight" />
        )}
        {activeShare !== null && (
          <ShareSheet isOpen={true} onClose={() => setActiveShare(null)} postId={activeShare} variant="fight" />
        )}
      </div>
    </div>
  );
}
