import React from 'react'
import { Sun, Moon } from 'lucide-react'
import type { ThemeTokens } from '@/utils/theme'
import type { Translations } from '@/utils/i18n'
import type { Lang } from '@/types'

interface HeaderProps {
  lang: Lang
  setLang: (l: Lang) => void
  dark: boolean
  setDark: (d: boolean) => void
  t: Translations
  theme: ThemeTokens
}

const Header: React.FC<HeaderProps> = ({ lang, setLang, dark, setDark, t, theme }) => {
  return (
    <header
      style={{
        background: theme.headerGradient,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Top gold line */}
      <div
        style={{
          height: '3px',
          background: 'linear-gradient(90deg, transparent, #C9A84C, #FF6B00, #C9A84C, transparent)',
        }}
      />

      <div
        style={{
          padding: 'clamp(16px, 4vw, 28px) 16px',
          textAlign: 'center',
          position: 'relative',
        }}
      >
        {/* Controls — top right */}
        <div
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            display: 'flex',
            gap: '6px',
            zIndex: 10,
            alignItems: 'center',
          }}
        >
          <button
            onClick={() => setLang(lang === 'en' ? 'ta' : 'en')}
            aria-label="Toggle language"
            style={{
              background: 'rgba(201,168,76,0.15)',
              border: '1px solid rgba(201,168,76,0.40)',
              borderRadius: '20px',
              color: '#C9A84C',
              padding: '5px 12px',
              fontFamily: "'Cinzel Decorative', serif",
              fontSize: 'clamp(0.5rem, 1.5vw, 0.62rem)',
              cursor: 'pointer',
              letterSpacing: '0.04em',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s',
            }}
          >
            {t.langToggle}
          </button>
          <button
            onClick={() => setDark(!dark)}
            aria-label={dark ? t.lightMode : t.darkMode}
            title={dark ? t.lightMode : t.darkMode}
            style={{
              background: 'rgba(201,168,76,0.15)',
              border: '1px solid rgba(201,168,76,0.40)',
              borderRadius: '50%',
              color: '#C9A84C',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s',
              flexShrink: 0,
            }}
          >
            {dark ? <Sun size={14} /> : <Moon size={14} />}
          </button>
        </div>

        {/* Guruvayurappan SVG Logo */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '10px',
          }}
        >
          <div
            style={{
              width: 'clamp(52px, 8vw, 72px)',
              height: 'clamp(52px, 8vw, 72px)',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(201,168,76,0.25) 0%, rgba(139,26,26,0.15) 100%)',
              border: '2px solid rgba(201,168,76,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(201,168,76,0.3)',
            }}
          >
            <svg
              viewBox="0 0 80 80"
              width="clamp(38px, 6vw, 52px)"
              height="clamp(38px, 6vw, 52px)"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Lotus petals */}
              {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                <ellipse
                  key={i}
                  cx="40"
                  cy="40"
                  rx="6"
                  ry="13"
                  fill="rgba(201,168,76,0.35)"
                  transform={`rotate(${angle} 40 40) translate(0,-16)`}
                />
              ))}
              {/* Conch */}
              <path
                d="M35 38 Q32 32 36 28 Q42 24 46 30 Q50 36 46 42 Q42 48 36 46 Q30 44 30 38 Z"
                fill="rgba(253,246,227,0.7)"
                stroke="rgba(201,168,76,0.8)"
                strokeWidth="0.8"
              />
              {/* Sudarshana Chakra */}
              <circle cx="40" cy="40" r="9" fill="none" stroke="#C9A84C" strokeWidth="1.2" opacity="0.8" />
              <circle cx="40" cy="40" r="5" fill="rgba(255,107,0,0.5)" />
              {[0, 30, 60, 90, 120, 150].map((a, i) => (
                <line
                  key={i}
                  x1="40"
                  y1="40"
                  x2={40 + 9 * Math.cos((a * Math.PI) / 180)}
                  y2={40 + 9 * Math.sin((a * Math.PI) / 180)}
                  stroke="#C9A84C"
                  strokeWidth="0.8"
                  opacity="0.7"
                />
              ))}
              {/* Om text */}
              <text
                x="40"
                y="44"
                textAnchor="middle"
                fontSize="10"
                fill="#C9A84C"
                fontFamily="serif"
                opacity="0.9"
              >
                ॐ
              </text>
            </svg>
          </div>
        </div>

        {/* Om decorative left */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '14px',
            transform: 'translateY(-50%)',
            fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
            opacity: 0.1,
            color: '#C9A84C',
            userSelect: 'none',
            pointerEvents: 'none',
            lineHeight: 1,
          }}
        >
          ॐ
        </div>

        {/* Sanskrit subtitle */}
        <p
          style={{
            fontFamily: "'Cinzel Decorative', serif",
            fontSize: 'clamp(0.48rem, 1.6vw, 0.72rem)',
            color: 'rgba(201,168,76,0.85)',
            letterSpacing: '0.18em',
            marginBottom: '6px',
          }}
        >
          {lang === 'en' ? 'நாராயணீயம் · Nārāyaṇīyam' : 'Narayaneeyam · நாராயணீயம்'}
        </p>

        {/* App name */}
        <h1
          style={{
            fontFamily: "'Cinzel Decorative', serif",
            fontSize: 'clamp(1.4rem, 5vw, 2.8rem)',
            color: '#FDF6E3',
            letterSpacing: '0.04em',
            textShadow: '0 2px 20px rgba(201,168,76,0.4)',
            margin: 0,
            lineHeight: 1.15,
          }}
        >
          {t.appName}
        </h1>

        {/* Tag line */}
        <p
          style={{
            fontFamily: "'Cinzel Decorative', serif",
            fontSize: 'clamp(0.48rem, 1.6vw, 0.78rem)',
            color: '#C9A84C',
            letterSpacing: '0.14em',
            marginTop: '6px',
          }}
        >
          {t.appSub}
        </p>

        {/* Decorative divider */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            marginTop: '10px',
          }}
        >
          <div
            style={{
              height: '1px',
              width: 'clamp(30px, 6vw, 60px)',
              background: 'linear-gradient(90deg, transparent, #C9A84C)',
            }}
          />
          <span style={{ color: '#C9A84C', fontSize: '0.9rem' }}>✦</span>
          <span
            style={{
              color: '#FF6B00',
              fontFamily: "'Cinzel Decorative', serif",
              fontSize: 'clamp(0.48rem, 1.3vw, 0.6rem)',
              letterSpacing: '0.15em',
            }}
          >
            {t.place}
          </span>
          <span style={{ color: '#C9A84C', fontSize: '0.9rem' }}>✦</span>
          <div
            style={{
              height: '1px',
              width: 'clamp(30px, 6vw, 60px)',
              background: 'linear-gradient(90deg, #C9A84C, transparent)',
            }}
          />
        </div>
      </div>

      {/* Bottom gold line */}
      <div
        style={{
          height: '3px',
          background:
            'linear-gradient(90deg, transparent, #FF6B00, #C9A84C, #FF6B00, transparent)',
        }}
      />
    </header>
  )
}

export default Header
