# 🪷 Krishnaarpanam | கிருஷ்ணார்பணம்

> Narayaneeyam Dasakam Recitation Manager — Organize devotee participation effortlessly.

**© Aparnaa Ravi 2026. All rights reserved.**

---

## ✨ Features

| Feature | Description |
|---|---|
| 👥 Generate Rows | Generate any number of participant rows at once |
| ✦ Auto-Allocate | Evenly distribute all 100 Dasakams across participants |
| 🔍 Search | Filter participants by name, Dasakam number, or contact |
| 🟩 Dasakam Grid | Visual 100-cell coverage map with hover tooltips |
| 🗑 Clear Grid | Clear all Dasakam assignments while keeping names |
| 📥 Excel Import | Drag & drop .xlsx/.xls with auto column mapping |
| 📤 Excel Export | Download formatted sheet with optional summary |
| 📲 WhatsApp Share | Share participant list via WhatsApp with one click |
| 🌙 Dark Mode | Full dark theme toggle, saved to browser |
| 🌐 EN / தமிழ் | Full English & Tamil language support |
| 💾 Local Storage | Auto-saves data in browser — no login needed |
| 📱 Responsive | Works on mobile, tablet, and desktop |

---

## 🚀 Quick Start

```bash
npm install
npm run dev       # Development server
npm run build     # Production build
npm run preview   # Preview production build
```

## 🌐 Deploy to Netlify

1. Push to GitHub (already done)
2. Go to [netlify.com](https://netlify.com) → Import from GitHub
3. Select `apsravi/krishnaarpanam`
4. Build command: `npm run build` · Publish directory: `dist`
5. Deploy ✅

---

## 🏗 Project Structure

```
src/
├── components/
│   ├── layout/       Header, StatsBar
│   ├── table/        ParticipantRow, ParticipantTable
│   └── ui/           DasakamGrid, GenerateModal, ImportExportPanel, WhatsAppModal
├── pages/            HomePage
├── services/         excelService (import/export)
├── store/            Zustand store with persistence
├── types/            TypeScript interfaces
└── utils/            dasakam helpers, i18n, theme, id, cn
```

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + TypeScript + Vite |
| UI | Tailwind CSS + Custom spiritual design |
| Excel | SheetJS (xlsx) |
| State | Zustand (with localStorage persistence) |
| Icons | Lucide React |
| Fonts | Cinzel Decorative, Cormorant Garamond, Noto Sans Tamil |

---

## 📊 Excel Import Format

| Name | Dasakam | Contact Number | Notes |
|---|---|---|---|
| Rajan | 1, 5, 10-15 | 9876543210 | |

Auto-detects columns in English and Tamil headers.

---

*"Hanta Bhagyam Jananam" — Narayaneeyam, Dasakam 26*

🪷 Built with devotion for Guruvayurappan
