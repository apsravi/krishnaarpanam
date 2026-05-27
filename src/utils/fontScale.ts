// 5 font scale levels — each multiplies the 18px base
// Stored in localStorage, applied as CSS custom property on <html>

export const FONT_LEVELS = [
  { id: 0, label: 'XS',  scale: 0.88, desc: 'Smallest' },
  { id: 1, label: 'S',   scale: 0.94, desc: 'Small'    },
  { id: 2, label: 'M',   scale: 1.00, desc: 'Default'  },
  { id: 3, label: 'L',   scale: 1.12, desc: 'Large'    },
  { id: 4, label: 'XL',  scale: 1.26, desc: 'Largest'  },
] as const

export type FontLevel = 0 | 1 | 2 | 3 | 4

export const DEFAULT_FONT_LEVEL: FontLevel = 2

const STORAGE_KEY = 'krishnaarpanam-fontlevel'

export function loadFontLevel(): FontLevel {
  try {
    const v = localStorage.getItem(STORAGE_KEY)
    const n = Number(v)
    if ([0,1,2,3,4].includes(n)) return n as FontLevel
  } catch {}
  return DEFAULT_FONT_LEVEL
}

export function saveFontLevel(level: FontLevel) {
  try { localStorage.setItem(STORAGE_KEY, String(level)) } catch {}
}

export function applyFontLevel(level: FontLevel) {
  const scale = FONT_LEVELS[level].scale
  // Set CSS custom property — all rem values scale with this
  document.documentElement.style.setProperty('--font-scale', String(scale))
  document.documentElement.style.fontSize = `${18 * scale}px`
}
