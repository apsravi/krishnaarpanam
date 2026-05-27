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
    <header style={{ background: theme.headerGradient, position: 'relative', overflow: 'hidden' }}>
      {/* Top shimmer line */}
      <div style={{ height: '3px', background: 'linear-gradient(90deg,transparent,#C9A84C,#FF6B00,#C9A84C,transparent)' }} />

      <div style={{ padding: 'clamp(14px,3.5vw,26px) 16px', position: 'relative' }}>

        {/* Controls — top right */}
        <div style={{ position: 'absolute', top: '12px', right: '12px', display: 'flex', gap: '6px', zIndex: 10, alignItems: 'center' }}>
          <button
            onClick={() => setLang(lang === 'en' ? 'ta' : 'en')}
            aria-label="Toggle language"
            style={{
              background: 'rgba(201,168,76,0.18)', border: '1px solid rgba(201,168,76,0.45)',
              borderRadius: '20px', color: '#C9A84C', padding: '5px 13px',
              fontFamily: "'Cinzel Decorative',serif", fontSize: 'clamp(0.5rem,1.5vw,0.62rem)',
              cursor: 'pointer', letterSpacing: '0.04em', whiteSpace: 'nowrap', transition: 'all 0.2s',
            }}
          >
            {t.langToggle}
          </button>
          <button
            onClick={() => setDark(!dark)}
            aria-label={dark ? t.lightMode : t.darkMode}
            title={dark ? t.lightMode : t.darkMode}
            style={{
              background: 'rgba(201,168,76,0.18)', border: '1px solid rgba(201,168,76,0.45)',
              borderRadius: '50%', color: '#C9A84C', width: '32px', height: '32px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', transition: 'all 0.2s', flexShrink: 0,
            }}
          >
            {dark ? <Sun size={14} /> : <Moon size={14} />}
          </button>
        </div>

        {/* Main content — logo + title side by side on desktop, stacked on mobile */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: '0',
        }}>
          {/* Guruvayurappan image */}
          <div style={{
            width: 'clamp(68px,12vw,100px)',
            height: 'clamp(68px,12vw,100px)',
            borderRadius: '50%',
            overflow: 'hidden',
            border: '2.5px solid rgba(201,168,76,0.6)',
            boxShadow: '0 0 24px rgba(201,168,76,0.35), 0 0 6px rgba(255,107,0,0.2)',
            marginBottom: '10px',
            background: 'radial-gradient(circle,rgba(201,168,76,0.12) 0%,rgba(139,26,26,0.08) 100%)',
            flexShrink: 0,
          }}>
            <img
              src="/guruvayurappan.svg"
              alt="Guruvayurappan"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={e => {
                // Fallback to Om symbol if image fails
                const el = e.currentTarget as HTMLImageElement
                el.style.display = 'none'
                const parent = el.parentElement!
                parent.innerHTML = '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:2.5rem;color:#C9A84C;opacity:0.9;">ॐ</div>'
              }}
            />
          </div>

          {/* Sanskrit subtitle */}
          <p style={{
            fontFamily: "'Cinzel Decorative',serif",
            fontSize: 'clamp(0.46rem,1.5vw,0.7rem)',
            color: 'rgba(201,168,76,0.88)',
            letterSpacing: '0.16em',
            marginBottom: '6px',
          }}>
            {lang === 'en' ? 'நாராயணீயம் · Nārāyaṇīyam' : 'Narayaneeyam · நாராயணீயம்'}
          </p>

          {/* App name */}
          <h1 style={{
            fontFamily: "'Cinzel Decorative',serif",
            fontSize: 'clamp(1.3rem,5vw,2.7rem)',
            color: '#FDF6E3',
            letterSpacing: '0.04em',
            textShadow: '0 2px 20px rgba(201,168,76,0.45)',
            margin: 0,
            lineHeight: 1.15,
          }}>
            {t.appName}
          </h1>

          {/* Tagline */}
          <p style={{
            fontFamily: "'Cinzel Decorative',serif",
            fontSize: 'clamp(0.46rem,1.5vw,0.76rem)',
            color: '#C9A84C',
            letterSpacing: '0.13em',
            marginTop: '5px',
          }}>
            {t.appSub}
          </p>

          {/* Divider with place name */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginTop: '10px' }}>
            <div style={{ height: '1px', width: 'clamp(28px,5vw,56px)', background: 'linear-gradient(90deg,transparent,#C9A84C)' }} />
            <span style={{ color: '#C9A84C', fontSize: '0.85rem' }}>✦</span>
            <span style={{ color: '#FF6B00', fontFamily: "'Cinzel Decorative',serif", fontSize: 'clamp(0.46rem,1.2vw,0.58rem)', letterSpacing: '0.15em' }}>
              {t.place}
            </span>
            <span style={{ color: '#C9A84C', fontSize: '0.85rem' }}>✦</span>
            <div style={{ height: '1px', width: 'clamp(28px,5vw,56px)', background: 'linear-gradient(90deg,#C9A84C,transparent)' }} />
          </div>
        </div>
      </div>

      {/* Bottom shimmer line */}
      <div style={{ height: '3px', background: 'linear-gradient(90deg,transparent,#FF6B00,#C9A84C,#FF6B00,transparent)' }} />
    </header>
  )
}

export default Header
