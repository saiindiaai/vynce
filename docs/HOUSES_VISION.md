# Vynce Houses System - Vision & Architecture

## 🏰 The Vision

**Houses of Vynce** are exclusive groups built on three pillars:
- **Hierarchy**: Founder → Admin → Moderator → Member roles define authority and influence
- **Loyalty**: Members build loyalty within their house, unlocking powers and benefits
- **Influence**: Collective house power determines reputation, level, and competitive standing

> "Find your people, compete, grow, and level up. This is where the real action begins. Whispers of alliances and rivalries shape every moment. Each house carries its own history, purpose, and destiny. Choose wisely—your house defines your powers."

---

## 🎮 Core Features

### House Types
1. **Group Chat** (Blue) - Small friend groups, casual collaboration
2. **Community** (Purple) - Large organized groups with shared interests
3. **House** (Amber) - Competitive gaming/esports teams
4. **Broadcast** (Red) - Public channels for creators and influencers

### House Rarity System
- **Common** (Gray) - Entry-level houses
- **Rare** (Blue) - Established houses with growing influence
- **Epic** (Purple) - Prestigious organizations
- **Legendary** (Gold) - Historic powerhouses
- **Mythic** (Rose) - Legendary status, game-defining influence

Rarity affects:
- Member power progression
- Influence gain rates
- Prestige multipliers
- Available powers and abilities

### House Hierarchy & Roles

#### Founder
- Founding member of the house
- Unlimited authority
- Can appoint/remove admins
- Full control of house settings
- Powers: House Leadership, Channel Management, Member Invite

#### Admin
- Trusted lieutenants
- Manage channels, invite members
- Can moderate content
- Help shape house direction

#### Moderator
- Keep house organized
- Enforce rules
- Support community

#### Member
- Full participation rights
- Earn loyalty and influence
- Access to house powers

---

## 📊 Member Progression System

### Influence
- **Definition**: Personal power contribution to house decisions
- **Gain**: Through active participation, achievements, high loyalty
- **Uses**: Voting power, resource allocation, special privileges
- **Range**: 0-999+ (no cap)
- **Display**: Amber lightning bolt icon (⚡)

### Loyalty
- **Definition**: Commitment level to the house
- **Range**: 0-100%
- **Gain**: Daily participation, anniversary milestones, achieving house goals
- **Loss**: Inactivity, rule violations
- **Benefits at thresholds**:
  - 25%: Access to exclusive channels
  - 50%: House-specific power granted
  - 75%: Senior member status, special badge
  - 100%: Legendary loyalty, maximum power potential

### House Powers
Powers granted based on role, loyalty, and rarity:

**Founder Powers:**
- House Leadership
- Channel Management
- Member Invite
- House Customization

**Admin Powers:**
- Moderation Tools
- Channel Creation
- Member Management
- Content Curation

**Member Powers (Earned):**
- Custom Status
- Reaction Emoji
- Voice Priority
- Special Titles

---

## 🏘️ House Progression & Leveling

### House Level
- Starts at: Level 1
- Earned through: Member growth, influence accumulation, member loyalty
- Progression:
  - Lv. 1: 0-100 influence
  - Lv. 2: 100-300 influence
  - Lv. 3: 300-700 influence
  - Lv. 4: 700-1500 influence
  - Lv. 5+: Accelerating requirements

### Influence (House Pool)
- **Definition**: Collective power of all members combined
- **Calculation**: Sum of all member influence scores
- **Uses**:
  - Determine house rank/leaderboard position
  - Unlock special features
  - Competitive advantages
  - Resource allocation

---

## 👥 Alliances & Rivalries

### Alliances
- **Purpose**: Cooperative partnerships between houses
- **Benefits**:
  - Shared knowledge and resources
  - Joint events and competitions
  - Mutual member support
  - Amplified influence in collaborative activities

### Rivalries
- **Purpose**: Competitive standing and game-like tension
- **Mechanics**:
  - Head-to-head leaderboards
  - Competitive events
  - Influence racing
  - Friendly competition system

---

## 📚 House History & Lore

### Founding Document
Each house includes:
- **Name**: House identity
- **Purpose**: Why the house exists (e.g., "Unite the strongest warriors")
- **Type**: Category of house
- **Rarity**: Prestige level
- **Founded By**: Creator name
- **Creation Date**: Timestamp

### House History
Dynamic timeline of milestones:
- Founding statement
- Member milestones (1st, 100th, 1000th member)
- Achievement unlocks
- Alliances formed
- Rivalries established
- House leveling up
- Member promotions
- Major events

Example:
```
"House Vanguard founded with purpose: Unite the strongest warriors"
"First 10 members joined - Small fellowship established"
"Reached 100 members - Growing powerhouse"
"Alliance with House Nexus formed - Combined influence increased"
"Achieved Legendary status - Game-defining influence"
```

---

## 💬 Channels & Communication

### Channel Hierarchy
- Houses can create unlimited channels
- Each house starts with `#general` channel
- Channels can be public or private
- Nested organization within houses

### Channel Types
1. **General** - Main communication hub
2. **Announcements** - House-wide updates
3. **Strategy** - Game/competition planning
4. **Social** - Off-topic, community bonding
5. **Custom** - House-specific topics

### Channel Permissions
- Public: Anyone in house can see/post
- Private: Selected members only
- Role-based access control

---

## 🎯 Game Mechanics Integration

### How Houses Define Powers

Each house member's abilities are enhanced by:
1. **House Type**: Determines power categories
2. **House Rarity**: Determines power tier levels
3. **House Level**: Unlocks additional power slots
4. **Member Role**: Controls power access
5. **Loyalty %**: Powers scale with loyalty commitment

### Power Examples
- **Battle House** (Rarity: Epic): Combat boost +15%, Team damage +8%
- **Creator House** (Rarity: Rare): Content reach +20%, Audience gain +10%
- **Trading House** (Rarity: Legendary): Market advantage +30%, Deal bonus +25%

---

## 📈 Competitive Leaderboards

### House Rankings
- **Global Leaderboard**: All houses ranked by influence
- **Type Leaderboards**: Competition within house type
- **Weekly Rankings**: Short-term competitive events
- **Seasonal Tournaments**: Large-scale house competitions

### Seasonal Reset
- Some leaderboards reset seasonally
- Historical records preserved
- Legacy badges awarded to champions
- New competition cycles created

---

## 🔐 Privacy & Access

### House Privacy Settings
- **Public Houses**: Anyone can discover and request join
- **Private Houses**: Invitation-only membership
- **Unlisted Houses**: Invite-only, hidden from discovery

### Member Invites
- Founder/Admin can invite players
- Invitation acceptance grants membership
- Welcome events on new member join

---

## 📊 Data Structure Overview

```typescript
interface House {
  // Identity
  id: string;
  name: string;
  description: string;
  purpose: string; // House destiny
  
  // Classification
  type: HouseType; // "group_chat" | "community" | "house" | "broadcast"
  rarity: HouseRarity; // "common" | "rare" | "epic" | "legendary" | "mythic"
  
  // Progression
  level: number; // Current house level
  influence: number; // Total house influence pool
  
  // Community
  members: number; // Member count
  isPrivate: boolean;
  
  // Metadata
  createdAt: number;
  foundedBy: string;
  crest?: string; // House colors/symbol
  
  // Organization
  channels: Channel[]; // Nested channels
  allyHouses: string[]; // Allied house IDs
  rivalHouses: string[]; // Rival house IDs
  history: string[]; // Lore and milestones
}

interface HouseMember {
  id: string;
  username: string;
  
  // Hierarchy
  role: "founder" | "admin" | "moderator" | "member";
  
  // Progression
  influence: number; // Member's power contribution
  loyalty: number; // 0-100% commitment level
  powers: string[]; // Role-specific abilities
  
  // Status
  joinedAt: number;
  isOnline: boolean;
}
```

---

## 🚀 Implementation Roadmap

### Phase 1: Core System (Current)
- ✅ House creation with rarity selection
- ✅ House hierarchy (founder/admin/moderator/member)
- ✅ Channel management
- ✅ Member list with influence/loyalty tracking
- ✅ House history logging
- ✅ Purpose & lore system

### Phase 2: Progression
- [ ] House leveling system
- [ ] Loyalty progression mechanics
- [ ] Power unlocking system
- [ ] Achievement system

### Phase 3: Social & Competition
- [ ] Alliance system
- [ ] Rivalry system
- [ ] Leaderboards (global, type-based, seasonal)
- [ ] Competitive events

### Phase 4: Advanced Features
- [ ] House customization (colors, crests)
- [ ] Advanced permissions system
- [ ] House wars/tournaments
- [ ] Trading between houses
- [ ] House marketplace

---

## 🎨 UI/UX Design Principles

1. **Visual Hierarchy**: Rarity colors, role badges, influence badges
2. **Game-Like Aesthetic**: Progression bars, level displays, power lists
3. **Community Focus**: Members sidebar, loyalty tracking, shared purpose
4. **Narrative Integration**: House purpose, history, lore elements
5. **Competitive Spirit**: Influence display, level badges, achievement markers

---

## 💾 Persistence

All house data persists in localStorage with v2 suffix to avoid conflicts:
- `vynce_houses_hierarchical`: House and channel data
- `vynce_house_messages_hierarchical`: Message history
- `vynce_house_members_hierarchical`: Member profiles and progress

---

## 🎯 Success Metrics

- House creation rate
- Member retention within houses
- Loyalty progression rate
- Influence accumulation curves
- Alliance formation frequency
- Competitive event participation
- User session duration in Houses

---

**Your house defines your powers. Choose wisely.**
