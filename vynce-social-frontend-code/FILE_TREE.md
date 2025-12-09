# 📂 Complete File Tree Reference

Visual reference for the entire project structure.

## 🌳 Full Project Tree

```
vynce-social/
│
├── 📄 package.json                    # Dependencies & scripts
├── 📄 tsconfig.json                   # TypeScript configuration
├── 📄 next.config.js                  # Next.js configuration
├── 📄 tailwind.config.ts              # Tailwind CSS + animations
├── 📄 postcss.config.js               # PostCSS configuration
├── 📄 README.md                       # Main documentation
├── 📄 QUICKSTART.md                   # Quick setup guide
├── 📄 PROJECT_CHECKLIST.md            # Setup checklist
├── 📄 .gitignore                      # Git ignore rules
├── 📄 .eslintrc.json                  # ESLint configuration
│
├── 📁 app/                            # Next.js App Router
│   ├── 📄 layout.tsx                  # Root layout (metadata, fonts)
│   ├── 📄 page.tsx                    # Entry point
│   ├── 📄 globals.css                 # Global styles + animations
│   └── 📄 providers.tsx               # Context providers
│
├── 📁 components/                     # React components
│   │
│   ├── 📄 VynceSocialUI.tsx          # Main app container
│   │
│   ├── 📁 layout/                     # Layout components
│   │   ├── 📄 TopBar.tsx             # Top navigation
│   │   ├── 📄 BottomNav.tsx          # Bottom navigation
│   │   └── 📄 Sidebar.tsx            # Sidebar menu
│   │
│   ├── 📁 pages/                      # Page components
│   │   ├── 📄 HomePage.tsx           # Home feed
│   │   ├── 📄 CapsulesPage.tsx       # Stories viewer
│   │   ├── 📄 DropsPage.tsx          # Drops feed
│   │   ├── 📄 FightPage.tsx          # Fight arena
│   │   ├── 📄 ExplorePage.tsx        # Explore page
│   │   ├── 📄 NotificationsPage.tsx  # Notifications
│   │   └── 📄 ProfilePage.tsx        # User profile
│   │
│   └── 📁 theme/                      # Theme components
│       └── 📄 ThemeSelector.tsx      # Theme switcher UI
│
├── 📁 lib/                            # Utilities & helpers
│   ├── 📄 store.ts                    # Zustand state management
│   └── 📄 utils.ts                    # Utility functions (cn)
│
├── 📁 config/                         # Configuration files
│   └── 📄 themes.ts                   # Theme definitions (6 themes)
│
├── 📁 app/                            # Next app
│   └── 📄 globals.css                 # global styles (includes .glass-effect utilities)
│
├── 📁 types/                          # TypeScript definitions
│   └── 📄 index.ts                    # Type interfaces
│
├── 📁 public/                         # Static assets
│   └── (empty - no required assets)
│
├── 📁 node_modules/                   # Dependencies (auto-generated)
│
└── 📁 .next/                          # Build output (auto-generated)
```

---

## 📊 File Count Summary

| Category          | Count        | Description                     |
| ----------------- | ------------ | ------------------------------- |
| **Root Config**   | 5            | package.json, tsconfig, etc.    |
| **App Files**     | 4            | layout, page, styles, providers |
| **Core Logic**    | 4            | types, config, lib utilities    |
| **Components**    | 11           | Layout + Pages + Theme          |
| **Documentation** | 4            | README, QUICKSTART, etc.        |
| **Total**         | **28 files** | Complete working app!           |

---

## 🎯 File Purposes Quick Reference

### Root Level (5 files)

| File                 | Purpose                | When to Edit         |
| -------------------- | ---------------------- | -------------------- |
| `package.json`       | Dependencies & scripts | Adding packages      |
| `tsconfig.json`      | TypeScript config      | Changing TS settings |
| `next.config.js`     | Next.js config         | Adding features      |
| `tailwind.config.ts` | Tailwind + animations  | Adding animations    |
| `postcss.config.js`  | CSS processing         | Rarely needed        |

### App Directory (4 files)

| File            | Purpose             | When to Edit                  |
| --------------- | ------------------- | ----------------------------- |
| `layout.tsx`    | Root HTML structure | Changing metadata             |
| `page.tsx`      | Entry point         | Never (renders VynceSocialUI) |
| `globals.css`   | Global styles       | Adding custom CSS             |
| `providers.tsx` | Context setup       | Adding providers              |

### Types Directory (1 file)

| File       | Purpose          | When to Edit     |
| ---------- | ---------------- | ---------------- |
| `index.ts` | TypeScript types | Adding new types |

### Config Directory (1 file)

| File        | Purpose    | When to Edit          |
| ----------- | ---------- | --------------------- |
| `themes.ts` | All themes | Adding/editing themes |

### Lib Directory (2 files)

| File       | Purpose          | When to Edit         |
| ---------- | ---------------- | -------------------- |
| `store.ts` | App state        | Adding state/actions |
| `utils.ts` | Helper functions | Adding utilities     |

### Components (11 files)

#### Main Container (1 file)

- `VynceSocialUI.tsx` - Orchestrates everything

#### Layout Components (3 files)

- `TopBar.tsx` - Top navigation
- `BottomNav.tsx` - Bottom tabs
- `Sidebar.tsx` - Side menu

#### Page Components (7 files)

- `HomePage.tsx` - Stories + posts
- `CapsulesPage.tsx` - Full-screen videos
- `DropsPage.tsx` - Trending feed
- `FightPage.tsx` - Battle arena
- `ExplorePage.tsx` - Discovery
- `NotificationsPage.tsx` - Activity feed
- `ProfilePage.tsx` - User profile

#### Theme Component (1 file)

- `ThemeSelector.tsx` - Theme picker

---

## 🔍 What Each Component Does

### VynceSocialUI (Main)

```
Purpose: Orchestrates the entire app
Contains: All pages, navigation, theme system
Manages: Page routing, sidebar, theme selector
```

### Layout Components

#### TopBar

```
Purpose: Top navigation bar
Contains: Menu button, logo, heart icon
Always visible: Yes
```

#### BottomNav

```
Purpose: Main navigation tabs
Contains: 4 icons (Home, Capsules, Fight, Profile)
Always visible: Yes (except on Capsules page)
```

#### Sidebar

```
Purpose: Side menu
Contains: Profile card, menu items, badges
Toggleable: Yes (menu button in TopBar)
```

### Page Components

#### HomePage

```
Purpose: Main feed
Contains: Stories carousel, posts feed
Features: Aura/Lame voting, save posts
```

#### CapsulesPage

```
Purpose: Story viewer
Contains: Full-screen video capsules
Features: Swipe between stories, interactions
```

#### DropsPage

```
Purpose: Trending feed
Contains: High-engagement posts
Features: Same as HomePage
```

#### FightPage

```
Purpose: Battle arena
Contains: Live fights, energy system
Features: Start fight, watch battles
```

#### ExplorePage

```
Purpose: Discovery
Contains: Search, trending topics, houses
Features: Join houses, explore content
```

#### NotificationsPage

```
Purpose: Activity feed
Contains: Aura, likes, follows, comments
Features: Different notification types
```

#### ProfilePage

```
Purpose: User profile
Contains: Stats, tabs, content grid
Features: Edit profile, view analytics
```

### Theme System

#### ThemeSelector

```
Purpose: Theme picker UI
Contains: 6 theme cards organized by category
Features: Preview, select, apply themes
```

---

## 📝 File Dependencies

### Import Hierarchy

```
app/page.tsx
    └── components/VynceSocialUI.tsx
            ├── lib/store.ts (state)
            ├── config/themes.ts (themes)
            │
            ├── components/layout/TopBar.tsx
            ├── components/layout/BottomNav.tsx
            ├── components/layout/Sidebar.tsx
            ├── components/theme/ThemeSelector.tsx
            │
            └── components/pages/
                    ├── HomePage.tsx
                    ├── CapsulesPage.tsx
                    ├── DropsPage.tsx
                    ├── FightPage.tsx
                    ├── ExplorePage.tsx
                    ├── NotificationsPage.tsx
                    └── ProfilePage.tsx
```

### Common Imports

Every component imports:

```typescript
import React from "react";
import { useAppStore } from "@/lib/store";
import { getAllThemes } from "@/config/themes";
import { IconName } from "lucide-react";
```

---

## 🎨 File Sizes (Approximate)

| File                  | Lines | Complexity |
| --------------------- | ----- | ---------- |
| VynceSocialUI.tsx     | ~80   | Medium     |
| HomePage.tsx          | ~200  | High       |
| CapsulesPage.tsx      | ~150  | Medium     |
| DropsPage.tsx         | ~150  | Medium     |
| FightPage.tsx         | ~180  | Medium     |
| ExplorePage.tsx       | ~150  | Medium     |
| NotificationsPage.tsx | ~100  | Low        |
| ProfilePage.tsx       | ~200  | High       |
| ThemeSelector.tsx     | ~200  | High       |
| TopBar.tsx            | ~30   | Low        |
| BottomNav.tsx         | ~50   | Low        |
| Sidebar.tsx           | ~100  | Medium     |
| store.ts              | ~80   | Medium     |
| themes.ts             | ~150  | Low        |

---

## 🚦 Edit Frequency

| Files             | Frequency | Reason             |
| ----------------- | --------- | ------------------ |
| Page components   | High      | Adding features    |
| store.ts          | High      | Adding state       |
| themes.ts         | Medium    | Adding themes      |
| Layout components | Low       | Stable structure   |
| Config files      | Low       | Initial setup only |

---

## 💡 Quick Navigation

**Want to...**

- Add a theme? → `config/themes.ts`
- Add state? → `lib/store.ts`
- Add a feature? → `components/pages/[Page].tsx`
- Change navigation? → `components/layout/BottomNav.tsx`
- Add animation? → `tailwind.config.ts`
- Add types? → `types/index.ts`

---

**Use this as a reference when working on the project!** 📚
