import React, { useState } from 'react'
import { Sun, Moon, LogOut } from 'lucide-react'
import { GURUVAYURAPPAN_COLOR_IMG } from '@/assets/guruvayurappan_color'
import { GURUVAYURAPPAN_IMG } from '@/assets/guruvayurappan'
import type { ThemeTokens } from '@/utils/theme'
import type { Translations } from '@/utils/i18n'
import type { Lang } from '@/types'

interface HeaderProps {
  lang: Lang
  setLang: (l: Lang) => void
  dark: boolean
  setDark: (d: boolean) => void
  onSignOut: () => void
  t: Translations
  theme: ThemeTokens
}

const LOGO_SIZE = 'clamp(76px, 13vw, 108px)'

const Header: React.FC<HeaderProps> = ({ lang, setLang, dark, setDark, onSignOut, t, theme }) => {
  const [frontError, setFrontError] = useState(false)
  const [backError, setBackError] = useState(false)

  return (
    <header style={{ background: theme.headerGradient, position: 'relative', overflow: 'hidden' }}>
      {/* Pillayar Suzhi — illustrated SVG, themed in app gold/saffron */}
      <div style={{
        background: 'linear-gradient(180deg,rgba(0,0,0,0.45) 0%,rgba(28,8,0,0.3) 100%)',
        textAlign: 'center',
        padding: '10px 12px 8px',
        userSelect: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <svg
          viewBox="0 0 120 100"
          width="clamp(48px,7vw,72px)"
          height="clamp(40px,6vw,60px)"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="Pillayar Suzhi"
          style={{ filter: 'drop-shadow(0 0 8px rgba(255,180,0,0.7)) drop-shadow(0 0 2px rgba(255,107,0,0.5))' }}
        >
          <defs>
            <linearGradient id="psgold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%"   stop-color="#FFE082"/>
              <stop offset="40%"  stop-color="#FFB300"/>
              <stop offset="80%"  stop-color="#FF6B00"/>
              <stop offset="100%" stop-color="#C9A84C"/>
            </linearGradient>
          </defs>
          {/* Main curved spiral — the hook of Pillayar Suzhi */}
          <path
            d="M 60 18
               C 80 18, 95 30, 95 46
               C 95 62, 82 72, 65 70
               C 50 68, 40 58, 42 45
               C 44 34, 54 28, 63 30
               C 72 32, 77 40, 74 48
               C 71 55, 63 58, 57 55
               C 52 52, 51 46, 54 43"
            stroke="url(#psgold)"
            stroke-width="7"
            stroke-linecap="round"
            fill="none"
          />
          {/* Tail curving down-left */}
          <path
            d="M 42 45 C 35 52, 25 58, 18 62"
            stroke="url(#psgold)"
            stroke-width="6.5"
            stroke-linecap="round"
            fill="none"
          />
          {/* Three horizontal lines below — the base strokes */}
          <line x1="12" y1="73" x2="108" y2="73" stroke="url(#psgold)" stroke-width="5.5" stroke-linecap="round"/>
          <line x1="18" y1="83" x2="102" y2="83" stroke="url(#psgold)" stroke-width="4.5" stroke-linecap="round"/>
          <line x1="24" y1="92" x2="96"  y2="92" stroke="url(#psgold)" stroke-width="3.5" stroke-linecap="round"/>
          {/* Dot below — bindu */}
          <circle cx="60" cy="100" r="4" fill="url(#psgold)"/>
        </svg>
      </div>

      <div style={{ padding: 'clamp(14px,3vw,26px) 16px', position: 'relative' }}>

        {/* Controls — top right */}
        <div style={{ position: 'absolute', top: '12px', right: '12px', display: 'flex', gap: '6px', zIndex: 10, alignItems: 'center' }}>
          <button
            onClick={() => setLang(lang === 'en' ? 'ta' : 'en')}
            aria-label="Toggle language"
            style={{ background: 'rgba(201,168,76,0.18)', border: '1px solid rgba(201,168,76,0.45)', borderRadius: '20px', color: '#C9A84C', padding: '5px 13px', fontFamily: "'Cinzel Decorative',serif", fontSize: 'clamp(0.76rem,1.6vw,0.9rem)', cursor: 'pointer', letterSpacing: '0.04em', whiteSpace: 'nowrap', transition: 'all 0.2s' }}>
            {t.langToggle}
          </button>
          <button
            onClick={onSignOut}
            aria-label="Sign out"
            title="Lock app"
            style={{ background: 'rgba(201,168,76,0.18)', border: '1px solid rgba(201,168,76,0.45)', borderRadius: '50%', color: '#C9A84C', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, transition: 'all 0.2s' }}>
            <LogOut size={14} />
          </button>

          <button
            onClick={() => setDark(!dark)}
            aria-label={dark ? t.lightMode : t.darkMode}
            style={{ background: 'rgba(201,168,76,0.18)', border: '1px solid rgba(201,168,76,0.45)', borderRadius: '50%', color: '#C9A84C', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, transition: 'all 0.2s' }}>
            {dark ? <Sun size={14} /> : <Moon size={14} />}
          </button>
        </div>

        {/* Centered content */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>

          {/* ── FLIP CARD LOGO ── */}
          <div
            className="logo-flip-container"
            style={{
              width: LOGO_SIZE,
              height: LOGO_SIZE,
              perspective: '700px',
              marginBottom: '14px',
              cursor: 'pointer',
              position: 'relative',
              flexShrink: 0,
            }}
            title="Hover to reveal Guruvayurappan"
          >
            {/* Outer halo glow */}
            <div className="logo-halo" style={{
              position: 'absolute',
              inset: '-10px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255,214,0,0.38) 0%, rgba(255,107,0,0.12) 55%, transparent 72%)',
              zIndex: 0,
              pointerEvents: 'none',
            }} />

            {/* Flip inner wrapper */}
            <div className="logo-flip-inner" style={{
              width: '100%',
              height: '100%',
              position: 'relative',
              transformStyle: 'preserve-3d',
              transition: 'transform 0.65s cubic-bezier(0.4, 0, 0.2, 1)',
              zIndex: 1,
            }}>

              {/* FRONT — Colorful deity image */}
              <div style={{
                position: 'absolute', inset: 0,
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                borderRadius: '50%',
                overflow: 'hidden',
                border: '3px solid #FFD700',
                boxShadow: '0 0 0 1.5px rgba(255,165,0,0.5), 0 0 32px rgba(255,165,0,0.55), 0 6px 20px rgba(0,0,0,0.45)',
                background: '#FFF8E1',
              }}>
                {frontError ? (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'clamp(2rem,5vw,2.8rem)', color: '#FF8F00', background: 'radial-gradient(circle,rgba(255,214,0,0.2),transparent)' }}>ॐ</div>
                ) : (
                  <img
                    src={GURUVAYURAPPAN_COLOR_IMG}
                    alt="Guruvayurappan — colorful"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 10%', display: 'block' }}
                    onError={() => setFrontError(true)}
                  />
                )}
              </div>

              {/* BACK — B&W temple photo */}
              <div style={{
                position: 'absolute', inset: 0,
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
                borderRadius: '50%',
                overflow: 'hidden',
                border: '3px solid #C9A84C',
                boxShadow: '0 0 0 1.5px rgba(255,214,0,0.3), 0 0 28px rgba(201,168,76,0.5), 0 6px 20px rgba(0,0,0,0.5)',
                background: '#0D0D0D',
              }}>
                {backError ? (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'clamp(2rem,5vw,2.8rem)', color: '#C9A84C', background: 'radial-gradient(circle,rgba(201,168,76,0.15),transparent)' }}>ॐ</div>
                ) : (
                  <img
                    src={GURUVAYURAPPAN_IMG}
                    alt="Guruvayurappan — B&W"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 15%', display: 'block' }}
                    onError={() => setBackError(true)}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Sanskrit subtitle */}
          <p style={{ fontFamily: "'Cinzel Decorative',serif", fontSize: 'clamp(0.72rem,1.6vw,0.88rem)', color: 'rgba(201,168,76,0.9)', letterSpacing: '0.16em', marginBottom: '6px' }}>
            {lang === 'en' ? 'நாராயணீயம் · Nārāyaṇīyam' : 'Narayaneeyam · நாராயணீயம்'}
          </p>

          {/* App name */}
          <h1 style={{ fontFamily: "'Cinzel Decorative',serif", fontSize: 'clamp(1.6rem,5.5vw,3.2rem)', color: '#FDF6E3', letterSpacing: '0.04em', textShadow: '0 2px 22px rgba(201,168,76,0.5)', margin: 0, lineHeight: 1.15 }}>
            {t.appName}
          </h1>

          {/* Tagline */}
          <p style={{ fontFamily: "'Cinzel Decorative',serif", fontSize: 'clamp(1rem,1.9vw,1.1rem)', color: '#C9A84C', letterSpacing: '0.13em', marginTop: '5px' }}>
            {t.appSub}
          </p>

          {/* Divider — ✦ only, no text, no lines */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px', marginTop: '10px' }}>
            <span style={{ color: 'rgba(201,168,76,0.5)', fontSize: '0.9rem' }}>✦</span>
            <span style={{ color: '#C9A84C', fontSize: '1.1rem' }}>✦</span>
            <span style={{ color: 'rgba(201,168,76,0.5)', fontSize: '0.9rem' }}>✦</span>
          </div>
        </div>
      </div>



      {/* Flip card CSS */}
      <style>{`
        .logo-flip-container:hover .logo-flip-inner {
          transform: rotateY(180deg);
        }
        .logo-halo {
          animation: haloPulse 3s ease-in-out infinite;
        }
        .logo-flip-container:hover .logo-halo {
          animation: none;
          opacity: 1;
          background: radial-gradient(circle, rgba(255,165,0,0.5) 0%, rgba(255,107,0,0.2) 55%, transparent 72%);
        }
        @keyframes haloPulse {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.09); }
        }
        @media (hover: none) {
          /* On touch devices, tap toggles the flip */
          .logo-flip-container:active .logo-flip-inner {
            transform: rotateY(180deg);
          }
        }
      `}</style>
    </header>
  )
}

export default Header
