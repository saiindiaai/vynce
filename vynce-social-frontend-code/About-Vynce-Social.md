# 🚀 Vynce Social

A next-generation social media platform built with Next.js 14, TypeScript, and Tailwind CSS.

![Vynce Social](https://img.shields.io/badge/Next.js-14.2.3-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.0-38bdf8?style=for-the-badge&logo=tailwind-css)

## 📖 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Architecture](#architecture)
- [State Management](#state-management)
- [Theme System](#theme-system)
- [Development Guide](#development-guide)
- [Deployment](#deployment)
- [Contributing](#contributing)

---

## 🌟 Overview

Vynce Social is a modern social media platform featuring:

- **Stories & Capsules**: Instagram-style stories with full-screen vertical video
- **Drops Feed**: Twitter-style posts with rich media support
- **Aura System**: Unique engagement mechanism (Aura/Lame voting)
- **Fight Arena**: Interactive battle system with energy mechanics
- **Houses**: Community groups for different interests
- **6 Beautiful Themes**: From minimal mono to cosmic retro

Built with **Next.js 14 App Router** for optimal performance and SEO.

---

## ✨ Features

### Core Features

- 🏠 **Home Feed** - Stories and posts from My Gang
- 📸 **Capsules** - Full-screen vertical video stories
- 📰 **Drops** - Trending posts and updates
- ⚔️ **Fight Arena** - Live energy-based battles
- 🔍 **Explore** - Discover trending content and houses
- 🔔 **Notifications** - Real-time activity updates
- 👤 **Profile** - Customizable user profiles with stats

### Interaction System

- ⭐ **Aura/Lame Voting** - Unique post engagement system
- 💬 **Comments** - Threaded discussions (UI ready)
- 🔄 **Shares** - Content distribution
- 🔖 **Bookmarks** - Save content for later
- 🎨 **Houses** - Interest-based communities

### UI/UX Features

- 🎨 **6 Theme System** - Switch between beautiful themes instantly
- 📱 **Mobile-First Design** - Optimized for mobile devices
- ✨ **Smooth Animations** - 60fps animations with Tailwind
- 🌙 **Dark Mode Ready** - All themes support dark mode
- ♿ **Accessible** - Built with accessibility in mind
- **Glassmorphism UI**: Frosted, semi-translucent card styles and subtle noise to give a premium, layered look (implemented via .glass-effect / .glossy-card in app/globals.css).

---

## 🛠 Tech Stack

### Frontend

- **Next.js 14.2.3** - React framework with App Router
- **React 18.3** - UI library
- **TypeScript 5** - Type safety
- **Tailwind CSS 3.4** - Utility-first CSS

### State Management

- **Zustand 4.5** - Lightweight state management

### Icons & UI

- **Lucide React** - Beautiful icon set
- **Custom Animations** - Tailwind-based animations

### Development Tools

- **ESLint** - Code linting
- **TypeScript** - Static type checking
- **PostCSS** - CSS processing

---

## 📁 Project Structure

```
vynce-social/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout with metadata
│   ├── page.tsx                 # Home page entry point
│   ├── globals.css              # Global styles & animations
│   └── providers.tsx            # Context providers
│
├── components/                   # React components
│   ├── layout/                  # Layout components
│   │   ├── TopBar.tsx          # Top navigation bar
│   │   ├── BottomNav.tsx       # Bottom navigation
│   │   └── Sidebar.tsx         # Sidebar menu
│   │
│   ├── pages/                   # Page components
│   │   ├── HomePage.tsx        # Home feed
│   │   ├── CapsulesPage.tsx    # Stories viewer
│   │   ├── DropsPage.tsx       # Drops feed
│   │   ├── FightPage.tsx       # Fight arena
│   │   ├── ExplorePage.tsx     # Explore page
│   │   ├── NotificationsPage.tsx # Notifications
│   │   └── ProfilePage.tsx     # User profile
│   │
│   ├── theme/                   # Theme components
│   │   └── ThemeSelector.tsx   # Theme switcher UI
│   │
│   └── VynceSocialUI.tsx       # Main app container
│
├── lib/                         # Utilities & helpers
│   ├── store.ts                # Zustand store
│   └── utils.ts                # Utility functions
│
├── config/                      # Configuration
│   └── themes.ts               # Theme definitions
│
├── types/                       # TypeScript types
│   └── index.ts                # Type definitions
│
├── public/                      # Static assets
│
├── package.json                 # Dependencies
├── tsconfig.json               # TypeScript config
├── tailwind.config.ts          # Tailwind config
├── postcss.config.js           # PostCSS config
├── next.config.js              # Next.js config
└── README.md                   # This file
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd vynce-social
```

2. **Install dependencies**

```bash
npm install
```

3. **Run development server**

```bash
npm run dev
```

4. **Open in browser**

```
http://localhost:3000
```

### Available Scripts

```bash
# Development
npm run dev          # Start dev server

# Production
npm run build        # Build for production
npm start           # Start production server

# Code Quality
npm run lint        # Run ESLint
```

---

## 🏗 Architecture

### App Router Structure

Vynce Social uses Next.js 14's App Router for optimal performance:

```
app/
├── layout.tsx      # Root layout (metadata, fonts, providers)
└── page.tsx        # Entry point (renders VynceSocialUI)
```

### Component Architecture

```
VynceSocialUI (Main Container)
├── TopBar (Global Navigation)
├── Sidebar (Menu)
├── ThemeSelector (Theme Switcher)
├── Page Components (Dynamic based on route)
│   ├── HomePage
│   ├── CapsulesPage
│   ├── DropsPage
│   ├── FightPage
│   ├── ExplorePage
│   ├── NotificationsPage
│   └── ProfilePage
└── BottomNav (Mobile Navigation)
```

### Data Flow

```
User Interaction
    ↓
Component Event
    ↓
Zustand Store Action
    ↓
State Update
    ↓
Component Re-render
```

---

## 🎯 State Management

### Zustand Store (`lib/store.ts`)

Centralized state management with Zustand:

```typescript
interface AppState {
  // Navigation
  currentPage: PageType;
  setCurrentPage: (page: PageType) => void;

  // UI State
  sidebarOpen: boolean;
  showThemeSelector: boolean;

  // Interactions
  likedPosts: Record<number, boolean>;
  toggleLike: (postId: number) => void;

  // Theme
  currentTheme: string;
  setCurrentTheme: (theme: string) => void;
}
```

### Using the Store

```typescript
import { useAppStore } from '@/lib/store';

function MyComponent() {
  const { currentPage, setCurrentPage } = useAppStore();

  return (
    <button onClick={() => setCurrentPage('home')}>
      Go Home
    </button>
  );
}
```

### State Sections

1. **Navigation State** - Current page, routes
2. **UI State** - Sidebar, modals, overlays
3. **User Interactions** - Likes, saves, follows
4. **Theme State** - Current theme selection
5. **User Data** - Energy, stats (mock data)

---

## 🎨 Theme System

### 6 Available Themes

#### Primary Themes

1. **Minimal Mono** - Clean light theme
2. **Vynce Nebula** - Purple/blue gradient dark

#### Glossy Themes

3. **Galaxy Core** - Purple with cyan accents
4. **Monochrome Royale** - Blue and violet
5. **CyberMint** - Teal and cyan

#### Premium Themes

6. **Vynce Glow** - Cosmic retro with neon effects

### Theme Structure

```typescript
interface ThemeConfig {
  name: string;
  primary: string; // Gradient classes
  secondary: string;
  accent: string;
  bg: string; // Background gradient
  textPrimary: string; // Text colors
  textSecondary: string;
  cardBg: string; // Card backgrounds
  cardBorder: string;
  style: "flat" | "glossy" | "cosmic-retro";
}
```

### Using Themes in Components

```typescript
import { getAllThemes } from '@/config/themes';

function MyComponent() {
  const { currentTheme } = useAppStore();
  const allThemes = getAllThemes();
  const themeClasses = allThemes[currentTheme];

  return (
    <div className={themeClasses.cardBg}>
      <h1 className={themeClasses.textPrimary}>Hello</h1>
    </div>
  );
}
```

### Adding New Themes

1. Open `config/themes.ts`
2. Add theme to appropriate category:

```typescript
'My Theme': {
  name: 'My Theme',
  primary: 'from-blue-500 to-purple-500',
  // ... other properties
  style: 'flat'
}
```

3. Theme automatically appears in selector!

---

## 💻 Development Guide

### Creating a New Page

1. **Create page component** in `components/pages/`

```typescript
'use client';

import React from 'react';
import { useAppStore } from '@/lib/store';
import { getAllThemes } from '@/config/themes';

export default function MyPage() {
  const { currentTheme } = useAppStore();
  const allThemes = getAllThemes();
  const themeClasses = allThemes[currentTheme];

  return (
    <div className="animate-fadeIn">
      {/* Your content */}
    </div>
  );
}
```

2. **Add page type** to `types/index.ts`:

```typescript
export type PageType = 'home' | 'mypage' | ...;
```

3. **Register in main component** (`components/VynceSocialUI.tsx`):

```typescript
{currentPage === 'mypage' && <MyPage />}
```

4. **Add to navigation** in `BottomNav.tsx` or `Sidebar.tsx`

### Adding New Features

#### Example: Adding a New Interaction

```typescript
// 1. Add to store (lib/store.ts)
interface AppState {
  repostedPosts: Record<number, boolean>;
  toggleRepost: (postId: number) => void;
}

// 2. Implement action
toggleRepost: (postId) => set((state) => ({
  repostedPosts: {
    ...state.repostedPosts,
    [postId]: !state.repostedPosts[postId]
  }
}));

// 3. Use in component
const { repostedPosts, toggleRepost } = useAppStore();

<button onClick={() => toggleRepost(post.id)}>
  {repostedPosts[post.id] ? 'Undo' : 'Repost'}
</button>
```

### Styling Guidelines

1. **Use Tailwind classes** - No custom CSS unless necessary
2. **Use theme classes** - Always use `themeClasses` for colors
3. **Use animations** - Leverage built-in animations
4. **Mobile-first** - Design for mobile, enhance for desktop

### Animation Classes Available

```css
animate-fadeIn       /* Fade in entrance */
animate-slideIn      /* Slide up entrance */
animate-slideInLeft  /* Slide from left */
animate-scaleIn      /* Scale up entrance */
animate-pulse        /* Pulsing effect */
animate-shimmer      /* Shimmer effect */
animate-float        /* Floating animation */
card-depth          /* 3D card depth */
hover-lift          /* Lift on hover */
```

---

## 🌐 Deployment

### Vercel (Recommended)

1. **Push to GitHub**

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-repo-url>
git push -u origin main
```

2. **Deploy on Vercel**

- Go to [vercel.com](https://vercel.com)
- Import your GitHub repository
- Vercel auto-detects Next.js
- Click "Deploy"

### Other Platforms

#### Netlify

```bash
npm run build
# Deploy the `.next` folder
```

#### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

---

## 🔧 Troubleshooting

### Common Issues

#### Build Errors

**Issue**: `Module not found: Can't resolve '@/...'`
**Solution**: Check `tsconfig.json` has correct paths:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

**Issue**: `Hydration failed`
**Solution**: Ensure 'use client' directive on components using hooks

#### Styling Issues

**Issue**: Tailwind classes not applying
**Solution**:

1. Check `tailwind.config.ts` includes all paths
2. Restart dev server
3. Clear `.next` cache: `rm -rf .next`

#### State Issues

**Issue**: State not persisting
**Solution**: Zustand state is in-memory only. For persistence:

```typescript
import { persist } from "zustand/middleware";

export const useAppStore = create(
  persist(
    (set) => ({
      /* state */
    }),
    { name: "vynce-storage" }
  )
);
```

---

## 🎯 Roadmap

### Phase 1 (Current) ✅

- [x] Core UI components
- [x] Navigation system
- [x] Theme system
- [x] Basic interactions
- [x] Responsive design

### Phase 2 (Next)

- [ ] Backend API integration
- [ ] Authentication (NextAuth.js)
- [ ] Real-time updates (WebSockets)
- [ ] Image/video upload
- [ ] Database integration (Prisma + PostgreSQL)

### Phase 3 (Future)

- [ ] AI-powered recommendations
- [ ] Advanced fight mechanics
- [ ] Monetization features
- [ ] Analytics dashboard
- [ ] Mobile apps (React Native)

---

## 🤝 Contributing

We welcome contributions! Here's how:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Commit with clear messages**
   ```bash
   git commit -m "Add: Amazing feature description"
   ```
5. **Push to your branch**
   ```bash
   git push origin feature/amazing-feature
   ```
6. **Open a Pull Request**

### Code Style

- Follow TypeScript best practices
- Use functional components with hooks
- Write clear, descriptive variable names
- Add comments for complex logic
- Keep components under 300 lines

---

## 📄 License

This project is licensed under the MIT License.

---

## 👥 Team

Built with ❤️ by the Vynce team

- **Project Lead**: [Your Name]
- **Frontend**: [Your Name]
- **Design**: [Your Name]

---

## 📞 Support

- **Issues**: [GitHub Issues](your-repo/issues)
- **Discussions**: [GitHub Discussions](your-repo/discussions)
- **Email**: support@vynce.social

---

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Tailwind CSS for the utility-first approach
- Lucide for the beautiful icons
- Zustand for simple state management
- The open-source community

---

**Made with ⚡ by Vynce Social** | [Website](https://vynce.social) | [Twitter](https://twitter.com/vynce)
