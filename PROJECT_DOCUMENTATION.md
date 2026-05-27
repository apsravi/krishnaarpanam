# Krishnaarpanam — Project Documentation

> **கிருஷ்ணார்பணம்** · Narayaneeyam Dasakam Recitation Manager  
> *Built with great devotion for Guruvayurappan 🪷*  
> © Aparnaa Ravi 2026. All rights reserved.

---

## Table of Contents

1. [Problem Statement](#1-problem-statement)
2. [Solution Overview](#2-solution-overview)
3. [Tech Stack](#3-tech-stack)
4. [Architecture](#4-architecture)
5. [Feature Changelog](#5-feature-changelog)
6. [Project Structure](#6-project-structure)
7. [Security Design](#7-security-design)
8. [Deployment](#8-deployment)
9. [Local Setup](#9-local-setup)

---

## 1. Problem Statement

### Context

**Narayaneeyam** is a sacred Sanskrit composition of **1,036 shlokas** across **100 Dasakams**, written by Melpathur Narayana Bhattathiri as a prayer to Lord Guruvayurappan. During group parayanam (recitation) events — especially at Guruvayur Temple and devotee communities — each participant is allotted specific Dasakams to recite.

### The Problem

Organising Dasakam recitation assignments for large groups of devotees was done manually:

- Handwritten or unformatted spreadsheets
- No visibility into whether all 100 Dasakams are covered
- Duplicate assignments went undetected
- No easy way to share the list with participants
- Elderly devotees struggled with small text in digital tools
- No way to import existing lists or export formatted sheets
- No single place to manage, visualise and distribute assignments

### Who It Affects

- **Event organisers** managing parayanam groups of 10–200+ devotees
- **Devotees** who need to know their assigned Dasakams
- **Elderly participants** who need accessible, large-text interfaces
- **Temple coordinators** managing recitation across multiple sessions

---

## 2. Solution Overview

**Krishnaarpanam** is a modern, responsive, spiritually-themed web application that:

- Lets organisers create participant lists and assign Dasakams visually
- Provides a 100-cell coverage grid showing which Dasakams are assigned, unassigned, or duplicated
- Generates, imports, and exports formatted Excel sheets
- Shares lists via WhatsApp with a single click
- Works beautifully on mobile, tablet, and desktop
- Supports English and Tamil languages throughout
- Protects access with a PIN login system
- Allows font size adjustment for elderly users
- Requires no backend, no database, no paid services

**Live URL:** [https://krishnaarpanam.netlify.app](https://krishnaarpanam.netlify.app)  
**GitHub:** [https://github.com/apsravi/krishnaarpanam](https://github.com/apsravi/krishnaarpanam)

---

## 3. Tech Stack

### Frontend

| Layer | Technology | Version | Purpose |
|---|---|---|---|
| Framework | React | 18 | UI component model |
| Language | TypeScript | 5 | Type safety throughout |
| Build Tool | Vite | 6 | Fast dev server + production bundler |
| Styling | Tailwind CSS | 4 | Utility-first CSS framework |
| State Management | Zustand | Latest | Global state with localStorage persistence |
| Excel Processing | SheetJS (xlsx) | Latest | Import and export .xlsx/.xls files |
| Icons | Lucide React | 0.383 | Consistent icon set |
| Style Utilities | clsx + tailwind-merge | Latest | Conditional class merging |

### Fonts

| Font | Usage |
|---|---|
| Cinzel Decorative | Headers, labels, navigation — Sanskrit/temple aesthetic |
| Cormorant Garamond | Body text, inputs, descriptions — elegant readability |
| Noto Sans Tamil | Tamil language text throughout |

### Hosting & CI/CD

| Service | Purpose |
|---|---|
| Netlify | Production hosting, auto-deploy from GitHub main branch |
| GitHub | Version control, source of truth |
| GitHub Actions | CI pipeline — TypeScript check + build verification on every push |

### No Backend Required

The app is **100% frontend-only**:
- All data stored in browser `localStorage` via Zustand persist middleware
- PIN authentication uses browser `crypto.subtle` (SHA-256) — no server needed
- Excel generation runs entirely in-browser via SheetJS
- WhatsApp sharing uses the `wa.me` deep link protocol

---

## 4. Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Browser (Client)                      │
│                                                         │
│  ┌─────────────┐    ┌──────────────┐   ┌─────────────┐ │
│  │  PIN Auth   │───▶│   App Shell  │──▶│  HomePage   │ │
│  │  (PinLogin) │    │  (App.tsx)   │   │             │ │
│  └─────────────┘    └──────────────┘   └──────┬──────┘ │
│                            │                  │         │
│                     ┌──────┴──────┐    ┌──────┴──────┐ │
│                     │ FontSize    │    │   3 Tabs    │ │
│                     │ Widget(FAB) │    │             │ │
│                     └─────────────┘    │ Participants│ │
│                                        │ Dasakam Grid│ │
│                                        │ Import/Export│ │
│                                        └──────┬──────┘ │
│                                               │         │
│  ┌────────────────────────────────────────────┴──────┐  │
│  │              Zustand Store (persisted)            │  │
│  │  participants | columns | pagination | rowCap     │  │
│  │  lang | dark | searchQuery | isLoading            │  │
│  └───────────────────────┬───────────────────────────┘  │
│                          │                              │
│              ┌───────────┴────────────┐                 │
│              │     localStorage       │                 │
│              │  krishnaarpanam-v5     │                 │
│              │  krishnaarpanam-fontlevel                │
│              │  ka_pin_hash (SHA-256) │                 │
│              │  ka_session (expiry)   │                 │
│              └────────────────────────┘                 │
└─────────────────────────────────────────────────────────┘
```

### Component Architecture

```
src/
├── App.tsx                    # Root: auth gate + font scale + routing
│
├── pages/
│   └── HomePage.tsx           # Main page — all 3 tabs, toolbar, modals
│
├── components/
│   ├── layout/
│   │   ├── Header.tsx         # App header — logo flip card, controls
│   │   └── StatsBar.tsx       # 4-stat summary + coverage progress bar
│   │
│   ├── table/
│   │   ├── ParticipantRow.tsx # Single editable row (desktop + mobile card)
│   │   └── ParticipantTable.tsx # Table with pagination
│   │
│   └── ui/
│       ├── PinLogin.tsx       # PIN setup + login screen
│       ├── FontSizeWidget.tsx # Floating font size FAB (bottom-right)
│       ├── DasakamGrid.tsx    # 100-cell visual coverage map
│       ├── GenerateModal.tsx  # Generate rows + row cap setting
│       ├── PasteNamesModal.tsx # Smart paste parser for name lists
│       ├── ColumnManager.tsx  # Show/hide/add/remove columns
│       ├── ImportExportPanel.tsx # Excel import + export + WhatsApp
│       ├── WhatsAppModal.tsx  # WhatsApp share with phone entry
│       ├── Pagination.tsx     # Page nav with rows-per-page selector
│       └── LoadingOverlay.tsx # Om spinner for async operations
│
├── store/
│   └── index.ts               # Zustand store — all state + actions
│
├── services/
│   └── excelService.ts        # Import parser + export formatter (SheetJS)
│
├── utils/
│   ├── auth.ts                # PIN hashing (SHA-256), session, lockout
│   ├── dasakam.ts             # Parse/format/compute Dasakam logic
│   ├── fontScale.ts           # 5-level font scale system
│   ├── i18n.ts                # Full EN + Tamil translations
│   ├── theme.ts               # Light/dark theme token system
│   ├── id.ts                  # Unique ID generator
│   └── cn.ts                  # Class name utility
│
├── types/
│   └── index.ts               # TypeScript interfaces (Participant, Column, etc.)
│
├── assets/
│   ├── guruvayurappan.ts      # B&W temple photo (base64, 11KB)
│   └── guruvayurappan_color.ts # Colourful deity image (base64, 9.7KB)
│
└── styles/
    └── index.css              # Global CSS — 18px base font, scrollbar, animations
```

### Data Flow

```
User Action
    │
    ▼
Component (e.g. ParticipantRow)
    │
    ▼
Zustand Action (e.g. updateParticipant)
    │
    ├──▶ State updated in memory
    │
    └──▶ Zustand persist middleware
              │
              └──▶ localStorage (krishnaarpanam-v5)
```

---

## 5. Feature Changelog

### v1.0 — Core MVP
- Dynamic participant entry with editable rows
- Dasakam assignment (supports `1`, `1,5`, `1-10` formats)
- Contact number and Notes fields
- Dasakam Coverage Grid (100 cells, colour-coded)
- Excel export with summary sheet
- Excel import with auto column mapping
- Search and filter participants
- Auto-Allocate (distribute 100 Dasakams evenly)
- Clear All with confirmation

### v1.1 — Enhanced Features
- Pagination (5/10/20/50 rows per page)
- Loading overlay with Om spinner animation
- Column Manager (show/hide, add custom columns)
- Dynamic column rendering in table and cards
- Zustand store with localStorage persistence

### v1.2 — UI Overhaul
- Guruvayurappan SVG deity illustration in header
- Improved lotus SVG in quote section
- Quote fix: "Hanta Bhagyam Jananam"
- Column UX: locked columns (Name, Dasakam), hidden column dropdown
- Copyright © Aparnaa Ravi 2026

### v1.3 — Real Images + Aesthetic Polish
- Real Guruvayurappan temple photo (compressed, base64 embedded)
- Photorealistic lotus SVG (layered petals, lily pad, water)
- Quote section redesigned with lotus centred above quote
- "App built with great devotion for Guruvayurappan" devotion line
- Removed "— Narayaneeyam, Dasakam 26" attribution

### v1.4 — Flip Card + Row Cap
- Logo flip card: colorful deity (front) ↔ B&W photo (back) on hover
- Row cap enforcement: set max row limit in Generate modal
- Cap badge in toolbar with remaining slots indicator
- Add One button disabled when cap reached

### v1.5 — Excel Polish + Custom Filename
- Custom filename input for Excel export with live preview
- Summary sheet: merged title, gold borders, wrapped Dasakam column
- Alternating row colours, freeze pane on header row
- Participant breakdown section with contact info

### v1.6 — Accessible Typography
- Base font size increased to 18px (from 16px)
- All 12 component files updated with larger type scale
- 5-level font size system designed (XS→XL)
- Button min-height 36px, increased cell padding throughout
- Cormorant Garamond 700 weight added for bold readability

### v1.7 — Security + Accessibility + Paste Names
- **PIN Authentication**: SHA-256 hashed PIN, 3-attempt lockout (15 min), 8-hour session
- **Font Size Widget**: floating FAB (bottom-right), 5 levels (XS/S/M/L/XL), persisted
- **Paste Names**: smart parser for numbered/bulleted/comma/plain name lists (EN + Tamil)
- **Security headers** via `netlify.toml`: CSP, HSTS, X-Frame-Options, Referrer-Policy
- **GitHub Actions CI**: TypeScript check + build on every push
- Sign Out button in header
- WhatsApp share with pre-filled participant list message

### Post-v1.7 — Fixes
- GURUVAYUR text removed from header divider
- Bottom shimmer bar removed from header
- Pillayar Suzhi removed (per user request)

---

## 6. Project Structure

```
krishnaarpanam/
├── .github/
│   └── workflows/
│       └── ci.yml              # GitHub Actions CI pipeline
├── public/
│   ├── favicon.svg             # Om symbol favicon
│   ├── guruvayurappan.svg      # SVG deity illustration (fallback)
│   ├── guruvayurappan.jpg      # Compressed B&W photo (11KB)
│   ├── guruvayurappan_color.jpg # Compressed colour photo (9.7KB)
│   └── lotus.svg               # Photorealistic lotus illustration
├── src/                        # All source code (see Architecture above)
├── index.html                  # App entry point
├── vite.config.ts              # Vite + Tailwind configuration
├── tsconfig.json               # TypeScript configuration
├── netlify.toml                # Netlify build + security headers
├── package.json                # Dependencies
├── README.md                   # Quick start guide
└── PROJECT_DOCUMENTATION.md   # This file
```

---

## 7. Security Design

### PIN Authentication
- PIN stored as `SHA-256(SALT + PIN)` — never in plain text
- Salt: `krishnaarpanam-guruvayurappan-2026` (prevents rainbow table attacks)
- Lockout: 3 failed attempts → 15-minute cooldown
- Session: 8-hour expiry stored in localStorage
- Sign Out clears session immediately

### HTTP Security Headers (via Netlify)

| Header | Value | Purpose |
|---|---|---|
| `X-Frame-Options` | `DENY` | Prevents clickjacking |
| `X-Content-Type-Options` | `nosniff` | Blocks MIME sniffing |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` | Forces HTTPS |
| `X-XSS-Protection` | `1; mode=block` | Legacy XSS protection |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Controls referrer leakage |
| `Content-Security-Policy` | Restricts scripts, styles, fonts, images to known sources | XSS prevention |
| `Permissions-Policy` | Denies camera, microphone, geolocation, payment | Feature restriction |

### CI/CD Security
- GitHub Actions runs TypeScript check + build on every push
- Broken code never reaches Netlify
- Branch protection recommended: require "Build check" to pass before merge

---

## 8. Deployment

### Netlify (Production)

**Auto-deploy** is configured via `netlify.toml`. Every push to `main` on GitHub triggers:

```
GitHub push → GitHub Actions CI → (pass) → Netlify build → Live site
```

**Manual setup** (one-time):
1. Connect repo at app.netlify.com → Import from Git → `apsravi/krishnaarpanam`
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Deploy

### GitHub Actions CI

Runs on every push and pull request to `main`:

```yaml
steps:
  - Checkout code
  - Setup Node.js 20
  - npm ci (clean install)
  - tsc --noEmit (TypeScript check)
  - npm run build (Vite production build)
  - Verify dist/index.html + dist/assets exist
```

---

## 9. Local Setup

### Prerequisites
- Node.js 18+ 
- npm 9+
- Git

### Install & Run

```bash
# Clone the repository
git clone https://github.com/apsravi/krishnaarpanam.git
cd krishnaarpanam

# Install dependencies
npm install

# Start development server
npm run dev
# → http://localhost:5173

# Production build
npm run build

# Preview production build
npm run preview
```

### Pull latest changes

```bash
cd D:\narayaneeyam
git pull origin main
npm install   # only if package.json changed
npm run dev
```

---

## Glossary

| Term | Meaning |
|---|---|
| Narayaneeyam | Sacred Sanskrit text of 1,036 shlokas in 100 Dasakams, by Melpathur Narayana Bhattathiri |
| Dasakam | A group of 10 shlokas; there are 100 Dasakams in Narayaneeyam |
| Parayanam | Devotional recitation of a sacred text |
| Guruvayurappan | Lord Vishnu as enshrined at Guruvayur Temple, Kerala |
| Krishnaarpanam | "Offered to Krishna" — the act of dedicating one's work to the Lord |

---

*Krishnaarpanam · © Aparnaa Ravi 2026 · All rights reserved*
