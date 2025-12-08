import { create } from 'zustand';

export type PageType = 'home' | 'capsules' | 'drops' | 'messages' | 'fight' | 'explore' | 'notifications' | 'profile' | 'creator_hub' | 'activity' | 'saved' | 'report' | 'vynce_house';
export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface AppState {
  // Navigation
  currentPage: PageType;
  setCurrentPage: (page: PageType) => void;
  
  // Sidebar
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  
  // Theme
  currentTheme: string;
  setCurrentTheme: (theme: string) => void;
  
  // Theme Selector Modal
  showThemeSelector: boolean;
  setShowThemeSelector: (show: boolean) => void;
  
  // Post Interactions
  likedPosts: Record<number, boolean>;
  dislikedPosts: Record<number, boolean>;
  savedPosts: Record<number, boolean>;
  toggleLike: (postId: number) => void;
  toggleDislike: (postId: number) => void;
  toggleSave: (postId: number) => void;
  
  // User
  currentUser: {
    id: number;
    name: string;
    username: string;
    displayName?: string;
    avatar?: string;
    bio?: string;
    followers: number;
    following: number;
  };
  setCurrentUser: (user: any) => void;
  
  // Energy (for fights)
  userEnergy: number;
  setUserEnergy: (energy: number) => void;
  
  // Capsules (Stories)
  currentCapsuleIndex: number;
  setCurrentCapsuleIndex: (index: number) => void;
  
  // Fight Voting System
  fightVotes: Record<number, { teamA: number; teamB: number; userVote?: 'teamA' | 'teamB' }>;
  toggleFightVote: (fightId: number, team: 'teamA' | 'teamB') => void;
  
  // Team Chat Messages
  teamMessages: Array<{ id: string; fightId: number; team: 'teamA' | 'teamB'; sender: string; text: string; timestamp: string; avatar?: string }>;
  addTeamMessage: (fightId: number, team: 'teamA' | 'teamB', message: string) => void;
  getTeamMessages: (fightId: number, team: 'teamA' | 'teamB') => Array<any>;
  
  // Argument Votes (Upvote/Downvote on debates)
  argumentVotes: Record<number, { upvotes: number; downvotes: number; userVote?: 'up' | 'down' }>;
  toggleArgumentVote: (argumentId: number, voteType: 'up' | 'down') => void;
  
  // Toast Notifications
  toast: { id: string; message: string; type: ToastType; actionLabel?: string; action?: (() => void) } | null;
  showToast: (message: string, type: ToastType, duration?: number, actionLabel?: string, action?: (() => void)) => void;
  hideToast: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Navigation
  currentPage: 'home',
  setCurrentPage: (page: PageType) => set({ currentPage: page }),
  
  // Sidebar
  sidebarOpen: false,
  setSidebarOpen: (open: boolean) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  
  // Theme
  currentTheme: 'Vynce Nebula',
  setCurrentTheme: (theme: string) => set({ currentTheme: theme }),
  
  // Theme Selector
  showThemeSelector: false,
  setShowThemeSelector: (show: boolean) => set({ showThemeSelector: show }),
  
  // Post Interactions
  likedPosts: {},
  dislikedPosts: {},
  savedPosts: {},
  toggleLike: (postId: number) => set((state) => ({
    likedPosts: {
      ...state.likedPosts,
      [postId]: !state.likedPosts[postId],
    },
    dislikedPosts: {
      ...state.dislikedPosts,
      [postId]: false, // clear dislike when liking
    },
  })),
  toggleDislike: (postId: number) => set((state) => ({
    dislikedPosts: {
      ...state.dislikedPosts,
      [postId]: !state.dislikedPosts[postId],
    },
    likedPosts: {
      ...state.likedPosts,
      [postId]: false, // clear like when disliking
    },
  })),
  toggleSave: (postId: number) => set((state) => ({
    savedPosts: {
      ...state.savedPosts,
      [postId]: !state.savedPosts[postId],
    },
  })),
  
  // User
  currentUser: {
    id: 1,
    name: 'You',
    username: 'yourhandle',
    avatar: undefined,
    bio: 'Building the future',
    followers: 1234,
    following: 567,
  },
  setCurrentUser: (user: any) => set({ currentUser: user }),
  
  // Energy
  userEnergy: 1000,
  setUserEnergy: (energy: number) => set({ userEnergy: energy }),
  
  // Capsules
  currentCapsuleIndex: 0,
  setCurrentCapsuleIndex: (index: number) => set({ currentCapsuleIndex: index }),
  
  // Fight Voting
  fightVotes: {},
  toggleFightVote: (fightId: number, team: 'teamA' | 'teamB') => set((state) => {
    const currentVotes = state.fightVotes[fightId] || { teamA: 0, teamB: 0 };
    const userVote = currentVotes.userVote;
    
    // If already voted for this team, remove vote
    if (userVote === team) {
      return {
        fightVotes: {
          ...state.fightVotes,
          [fightId]: {
            teamA: team === 'teamA' ? currentVotes.teamA - 1 : currentVotes.teamA,
            teamB: team === 'teamB' ? currentVotes.teamB - 1 : currentVotes.teamB,
            userVote: undefined,
          },
        },
      };
    }
    
    // Otherwise, add vote (switch if already voted for other team)
    return {
      fightVotes: {
        ...state.fightVotes,
        [fightId]: {
          teamA: team === 'teamA' 
            ? currentVotes.teamA + 1 
            : (userVote === 'teamA' ? currentVotes.teamA - 1 : currentVotes.teamA),
          teamB: team === 'teamB' 
            ? currentVotes.teamB + 1 
            : (userVote === 'teamB' ? currentVotes.teamB - 1 : currentVotes.teamB),
          userVote: team,
        },
      },
    };
  }),
  
  // Team Messages
  teamMessages: [],
  addTeamMessage: (fightId: number, team: 'teamA' | 'teamB', message: string) => set((state) => ({
    teamMessages: [
      ...state.teamMessages,
      {
        id: `msg_${Date.now()}`,
        fightId,
        team,
        sender: state.currentUser.name,
        text: message,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        avatar: state.currentUser.avatar,
      },
    ],
  })),
  
  getTeamMessages: (fightId: number, team: 'teamA' | 'teamB') => {
    // This will be set separately, accessing current state
    return [];
  },
  
  // Argument Votes
  argumentVotes: {},
  toggleArgumentVote: (argumentId: number, voteType: 'up' | 'down') => set((state) => {
    const current = state.argumentVotes[argumentId] || { upvotes: 0, downvotes: 0 };
    const userVote = current.userVote;
    
    // If already voted same type, remove vote
    if (userVote === voteType) {
      return {
        argumentVotes: {
          ...state.argumentVotes,
          [argumentId]: {
            upvotes: voteType === 'up' ? current.upvotes - 1 : current.upvotes,
            downvotes: voteType === 'down' ? current.downvotes - 1 : current.downvotes,
            userVote: undefined,
          },
        },
      };
    }
    
    // Otherwise, switch or add vote
    return {
      argumentVotes: {
        ...state.argumentVotes,
        [argumentId]: {
          upvotes: voteType === 'up'
            ? current.upvotes + 1
            : (userVote === 'up' ? current.upvotes - 1 : current.upvotes),
          downvotes: voteType === 'down'
            ? current.downvotes + 1
            : (userVote === 'down' ? current.downvotes - 1 : current.downvotes),
          userVote: voteType,
        },
      },
    };
  }),
  
  // Toast
  toast: null,
  showToast: (message: string, type: ToastType, duration: number = 3000, actionLabel?: string, action?: (() => void)) => set({ toast: { id: `toast_${Date.now()}`, message, type, actionLabel, action } }),
  hideToast: () => set({ toast: null }),
}));
