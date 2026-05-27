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
      {/* Top shimmer */}
      <div style={{ height: '3px', background: 'linear-gradient(90deg,transparent,#C9A84C,#FF6B00,#C9A84C,transparent)' }} />

      <div style={{ padding: 'clamp(14px,3vw,24px) 16px', position: 'relative' }}>
        {/* Language + dark toggle — top right */}
        <div style={{ position: 'absolute', top: '12px', right: '12px', display: 'flex', gap: '6px', zIndex: 10, alignItems: 'center' }}>
          <button
            onClick={() => setLang(lang === 'en' ? 'ta' : 'en')}
            aria-label="Toggle language"
            style={{ background: 'rgba(201,168,76,0.18)', border: '1px solid rgba(201,168,76,0.45)', borderRadius: '20px', color: '#C9A84C', padding: '5px 13px', fontFamily: "'Cinzel Decorative',serif", fontSize: 'clamp(0.48rem,1.4vw,0.6rem)', cursor: 'pointer', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}
          >
            {t.langToggle}
          </button>
          <button
            onClick={() => setDark(!dark)}
            aria-label={dark ? t.lightMode : t.darkMode}
            style={{ background: 'rgba(201,168,76,0.18)', border: '1px solid rgba(201,168,76,0.45)', borderRadius: '50%', color: '#C9A84C', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}
          >
            {dark ? <Sun size={14} /> : <Moon size={14} />}
          </button>
        </div>

        {/* Content — centered */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>

          {/* Guruvayurappan image — portrait style with golden arch frame */}
          <div style={{
            position: 'relative',
            marginBottom: '12px',
            display: 'flex',
            justifyContent: 'center',
          }}>
            {/* Outer golden glow ring */}
            <div style={{
              position: 'absolute',
              inset: '-6px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255,214,0,0.35) 0%, transparent 70%)',
              animation: 'pulseGlow 3s ease-in-out infinite',
              zIndex: 0,
            }} />
            {/* Image container */}
            <div style={{
              width: 'clamp(72px,13vw,108px)',
              height: 'clamp(72px,13vw,108px)',
              borderRadius: '50%',
              overflow: 'hidden',
              border: '3px solid #C9A84C',
              boxShadow: '0 0 0 1px rgba(255,214,0,0.4), 0 0 28px rgba(201,168,76,0.5), 0 4px 16px rgba(0,0,0,0.4)',
              background: 'linear-gradient(135deg, #FFF8E1, #FFF3E0)',
              position: 'relative',
              zIndex: 1,
              flexShrink: 0,
            }}>
              <img
                src="/guruvayurappan.svg"
                alt="Guruvayurappan — Lord Vishnu of Guruvayur"
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}
                onError={e => {
                  const el = e.currentTarget as HTMLImageElement
                  el.style.display = 'none'
                  const parent = el.parentElement!
                  parent.innerHTML = '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:3rem;color:#C9A84C;background:radial-gradient(circle,rgba(201,168,76,0.15),transparent);">ॐ</div>'
                }}
              />
            </div>
          </div>

          {/* Sanskrit line */}
          <p style={{ fontFamily: "'Cinzel Decorative',serif", fontSize: 'clamp(0.44rem,1.4vw,0.68rem)', color: 'rgba(201,168,76,0.88)', letterSpacing: '0.16em', marginBottom: '6px' }}>
            {lang === 'en' ? 'நாராயணீயம் · Nārāyaṇīyam' : 'Narayaneeyam · நாராயணீயம்'}
          </p>

          {/* App name */}
          <h1 style={{ fontFamily: "'Cinzel Decorative',serif", fontSize: 'clamp(1.3rem,5vw,2.7rem)', color: '#FDF6E3', letterSpacing: '0.04em', textShadow: '0 2px 20px rgba(201,168,76,0.45)', margin: 0, lineHeight: 1.15 }}>
            {t.appName}
          </h1>

          {/* Tagline */}
          <p style={{ fontFamily: "'Cinzel Decorative',serif", fontSize: 'clamp(0.44rem,1.4vw,0.72rem)', color: '#C9A84C', letterSpacing: '0.13em', marginTop: '5px' }}>
            {t.appSub}
          </p>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
            <div style={{ height: '1px', width: 'clamp(24px,5vw,52px)', background: 'linear-gradient(90deg,transparent,#C9A84C)' }} />
            <span style={{ color: '#C9A84C' }}>✦</span>
            <span style={{ color: '#FF6B00', fontFamily: "'Cinzel Decorative',serif", fontSize: 'clamp(0.44rem,1.1vw,0.56rem)', letterSpacing: '0.15em' }}>{t.place}</span>
            <span style={{ color: '#C9A84C' }}>✦</span>
            <div style={{ height: '1px', width: 'clamp(24px,5vw,52px)', background: 'linear-gradient(90deg,#C9A84C,transparent)' }} />
          </div>
        </div>
      </div>

      {/* Bottom shimmer */}
      <div style={{ height: '3px', background: 'linear-gradient(90deg,transparent,#FF6B00,#C9A84C,#FF6B00,transparent)' }} />

      {/* Pulse animation */}
      <style>{`
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.06); }
        }
      `}</style>
    </header>
  )
}

export default Header
