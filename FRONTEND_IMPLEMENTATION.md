# Frontend Implementation Guide

## Overview

This document describes the complete frontend implementation for dailyAGI, including all components, pages, utilities, and features.

## File Structure

```
/app
  /components
    Navbar.tsx              # Main navigation bar
    DemoBanner.tsx          # Demo mode banner
    LiveIndicator.tsx       # Live status indicator with pulse
    StatCard.tsx            # Reusable stat card component
    BottomTabs.tsx          # Mobile bottom navigation
    SSEStream.tsx           # SSE streaming utility (in /utils)
    ChatModal.tsx           # Chat interface for agent interaction
    Dashboard.tsx           # Main dashboard component
    WalletButton.tsx        # Wallet connect/disconnect button
    WaterGlassIcon.tsx     # Water-glass themed icon wrapper
    FloatingParticles.tsx   # Animated background particles
  /reminders
    page.tsx                # Reminders page
  /spending
    page.tsx                # Spending analysis page
  /grocery
    page.tsx                # Grocery list page
  /settings
    page.tsx                # Settings page
  /utils
    wallet.ts               # Wallet utility functions
    sse.ts                  # SSE streaming handler
  /hooks
    useWallet.ts            # Wallet connection hook
  page.tsx                  # Home page
  layout.tsx                # Root layout
  globals.css               # Global styles
```

## Components

### Navbar.tsx
- Logo with animated sparkle icon
- Theme toggle button
- Wallet connection button
- Responsive design

### DemoBanner.tsx
- Shows when demo mode is active
- Exit demo button
- Connect wallet CTA

### LiveIndicator.tsx
- Animated pulse effect
- Green status dot with ripple animation
- "Live" text indicator

### StatCard.tsx
- Water-glass icon integration
- Hover animations (scale, lift)
- Gradient shimmer on hover
- Click handler support

### BottomTabs.tsx
- Mobile-only sticky navigation
- Active tab indicator with layout animation
- Smooth transitions

### ChatModal.tsx
- Floating modal for agent interaction
- SSE streaming support
- Auto-scrolling message list
- Real-time message updates
- Wallet connection check

### Dashboard.tsx
- Main dashboard with tabs
- Stats cards using StatCard component
- Live indicator
- Tab navigation

## Pages

### /reminders
- List of reminders
- Add reminder form
- Delete functionality (when wallet connected)
- Demo data when not connected
- Bottom tabs navigation

### /spending
- Spending analysis charts (Line, Pie)
- Time range selector
- Category breakdown
- Weekly insights
- Demo data when not connected

### /grocery
- Image upload (drag & drop)
- Fridge photo scanning
- Missing items list
- IPFS CID display
- Demo data when not connected

### /settings
- Wallet information
- Notification preferences
- Agent permissions
- IPFS stored data
- Theme toggle

## Utilities

### wallet.ts
- `formatAddress()` - Format wallet address
- `isValidAddress()` - Validate Ethereum address
- `getChainName()` - Get chain name from chainId

### sse.ts
- `streamSSE()` - Stream Server-Sent Events
- Handles: start, progress, message, end, error events
- Auto-reconnect support

## Hooks

### useWallet.ts
- `connect()` - Connect wallet via WalletConnect v2
- `disconnect()` - Disconnect wallet
- `address` - Current wallet address
- `isConnected` - Connection status
- `ensName` - ENS name (if available)
- `chainId` - Current chain ID

## Features

### 🦾 Agent Interaction

1. **SSE Streaming Utility** (`app/utils/sse.ts`)
   - Handles `/sentient/agent` event stream
   - Reads events: start → progress → message → end
   - Displays streamed messages elegantly
   - Auto-scrolls during streaming

2. **Chat-Style Modal** (`app/components/ChatModal.tsx`)
   - Floating modal for quick agent commands
   - "Ask dailyAGI" interface
   - Sends requests to backend
   - Streams agent response in real-time

### 🌐 Sentient Ecosystem Features

1. **"Run in Sentient Chat" Button**
   - Links to: `https://sentient.chat/?agent=dailyAGI`
   - Styled as glowing purple button
   - Fixed position (bottom-right)
   - Responsive (hidden text on mobile)

2. **"Powered by Sentient AGI" Badge**
   - Appears in footer
   - Small, clean, professional
   - Links to `https://sentient.xyz`

### 👤 Wallet Integration

- **WalletConnect v2** integration
- `useWallet` hook provides:
  - `connect`, `disconnect`, `address`, `chainId`
- Shows "Demo Mode Active" when wallet not connected
- Shows "Wallet Connected" and hides demo numbers when connected

### 🎛 Animations

- `animate-pulse` on live status
- `fade-in`, `slide-up`, and `hover:scale-105` on cards
- Gradient shimmer on Connect Wallet button
- Smooth transitions on theme toggle
- Floating particles in background
- Parallax effects

### 🧱 Demo Mode

Hardcoded demo numbers:
- Reminders: 12
- Spending: $847
- Grocery Items: 8

Demo mode switches off when wallet is connected.

## Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:8001
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
```

## Running the App

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set environment variables:**
   Create `.env.local`:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:8001
   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   npm start
   ```

## Styling

- **Tailwind CSS** for utility-first styling
- **Framer Motion** for animations
- **Water-glass theme** with glassmorphism effects
- **Lavender-pink gradient** background
- **Premium typography** (Space Grotesk, Sora)

## Responsive Design

- Mobile-first approach
- Bottom tabs on mobile (< 768px)
- Desktop navigation on larger screens
- Adaptive layouts for all components

## Notes

- All pages use Next.js App Router
- Client components use `'use client'` directive
- Server components can be used for data fetching
- Wallet connection persists in localStorage
- Demo mode can be toggled on/off



