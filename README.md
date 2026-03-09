<p align="center">
  <img src="public/logo/logo-ipanova.svg" alt="IPANOVA" width="200" />
</p>

<h1 align="center">Ipacoinche</h1>

<p align="center">
  <strong>A mobile-first tournament management app for Coinche card games.</strong>
  <br />
  Built with Next.js 16, Tailwind CSS 4, Prisma 6 & Shadcn UI.
</p>

<p align="center">
  <a href="https://ipacoinche.vercel.app">Live Demo</a> · 
  <a href="#features">Features</a> · 
  <a href="#getting-started">Getting Started</a> · 
  <a href="#tech-stack">Tech Stack</a>
</p>

---

## Features

### Tournament Management
- **Create & configure** tournaments with custom names, dates, and round counts
- **Player management** — add, edit, delete players with a fast mobile UX
- **Manual table assignment** — assign players to tables per round, with anti-duplicate rules
- **Auto template** — generate empty tables based on player count
- **Unassigned players** displayed per round (players on pause)

### Scoring & Validation
- **Score input** per table (Team A vs Team B)
- **Table validation** with integrity checks (all players assigned, scores filled)
- **Unlock & correct** validated tables at any time

### Live Leaderboard
- **Real-time ranking** sorted by wins → goal average → points scored
- **Ties count as 0.5 wins**
- **Podium display** for the top 3 players
- **Player detail page** with stats and round-by-round history

### Sharing
- **Read-only share links** with configurable expiration (1–90 days)
- **QR code generation** (client-side, no external API)
- **Activate / deactivate / regenerate** links
- Public views: leaderboard, rounds, player details — no login required

### Tournament Closure & Exports
- **Close a tournament** to freeze rankings (reopenable)
- **Export podium image** (PNG) with IPANOVA branding, medals & stats
- **Export PDF recap** (jsPDF) — logo, podium visual, full ranking table, pagination

### Settings
- Rename tournament
- Configure total rounds (1–20)
- Configure share link expiration duration

### Demo Mode
- **One-click demo** — generates a full tournament (12 players, 4 rounds, validated tables with random scores)
- **Reset** — delete all demo tournaments

### PWA
- **Installable** on mobile and desktop (manifest, service worker, icons)
- **Offline-capable** static asset caching
- **Page transitions** between screens

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org) (App Router, Server Components, Server Actions) |
| Language | TypeScript (strict, no `any`) |
| Styling | [Tailwind CSS 4](https://tailwindcss.com) |
| Components | [Shadcn UI](https://ui.shadcn.com) primitives (Card, Button, Badge, Input, Label, Separator) |
| Auth | [Better Auth](https://better-auth.com) (self-hosted, email/password) |
| Database | PostgreSQL ([Neon](https://neon.tech)) |
| ORM | [Prisma 6](https://prisma.io) |
| Icons | [Lucide React](https://lucide.dev) |
| PDF Export | [jsPDF](https://github.com/parallax/jsPDF) + [jspdf-autotable](https://github.com/simonbengtsson/jsPDF-AutoTable) |
| QR Codes | [qrcode.react](https://github.com/zpao/qrcode.react) |
| Deployment | [Vercel](https://vercel.com) |
| Package Manager | pnpm |

---

## Project Structure

```
app/
├── auth/                  # Login, Signup, Forgot Password
├── app/                   # Admin area (protected)
│   ├── page.tsx           # Tournament list (home)
│   ├── demo/              # Demo mode
│   └── tournaments/
│       └── [id]/
│           ├── setup/     # Player management
│           ├── rounds/    # Round & table views
│           ├── leaderboard/
│           ├── players/   # Player detail
│           ├── share/     # Share link management
│           ├── settings/  # Tournament settings
│           └── close/     # Closure & exports
├── t/[token]/             # Read-only public views
├── manifest.ts            # PWA manifest
└── layout.tsx             # Root layout

components/
├── ui/                    # Shadcn-style primitives
├── match/                 # MatchCard, TeamStack, ScoreDisplay
└── pwa/                   # Service worker registration

lib/
├── auth.ts                # Better Auth config
├── db.ts                  # Prisma client
├── ranking.ts             # Leaderboard computation
├── share.ts               # Share token resolution
├── export-pdf.ts          # PDF generation
└── tournament-constants.ts

prisma/
├── schema.prisma          # Data models
└── migrations/            # SQL migrations
```

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **pnpm** ≥ 10
- A **PostgreSQL** database (e.g. [Neon](https://neon.tech))

### Installation

```bash
git clone <repo-url>
cd ipacoinche
pnpm install
```

### Environment Variables

Create a `.env.local` file:

```env
POSTGRES_PRISMA_URL=postgresql://...
BETTER_AUTH_SECRET=your-secret-key
BETTER_AUTH_URL=http://localhost:3000
```

### Database Setup

```bash
pnpm migrate:deploy
pnpm db:generate
```

### Development

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### Type Checking

```bash
pnpm typecheck
```

### Production Build

```bash
pnpm build
pnpm start
```

---

## Deployment

The app is deployed on **Vercel** with automatic preview deployments on pull requests.

The `build` script runs `prisma generate` before `next build` to ensure the Prisma client is available in the Vercel build environment.

---

## Data Models

| Model | Description |
|---|---|
| `User` | Admin account (Better Auth) |
| `Tournament` | Name, date, status (draft/started/closed), settings |
| `Player` | Belongs to a tournament |
| `Round` | Indexed round within a tournament |
| `GameTable` | 4-player table with scores and validation status |
| `ShareLink` | Token-based read-only access with expiration |

---

## Brand Guidelines

| Element | Value |
|---|---|
| Accent | `#51bdcb` |
| Text | `#333333` |
| Background | `#f0f0f0` |
| Style | Rounded cards, subtle shadows, minimalist, mobile-first |

---

<p align="center">
  Built by <strong>IPANOVA</strong>
</p>
