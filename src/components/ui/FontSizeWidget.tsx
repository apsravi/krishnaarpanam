import React, { useState } from 'react'
import { Type, Minus, Plus, X } from 'lucide-react'
import { FONT_LEVELS, type FontLevel } from '@/utils/fontScale'
import type { ThemeTokens } from '@/utils/theme'

interface FontSizeWidgetProps {
  level: FontLevel
  onChange: (level: FontLevel) => void
  theme: ThemeTokens
}

const FontSizeWidget: React.FC<FontSizeWidgetProps> = ({ level, onChange, theme }) => {
  const [open, setOpen] = useState(false)

  const dec = () => level > 0 && onChange((level - 1) as FontLevel)
  const inc = () => level < 4 && onChange((level + 1) as FontLevel)

  const btnStyle = (disabled: boolean): React.CSSProperties => ({
    width: '34px', height: '34px', borderRadius: '50%',
    border: 'none', cursor: disabled ? 'not-allowed' : 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: disabled ? 'rgba(201,168,76,0.15)' : 'linear-gradient(135deg,#8B1A1A,#C9A84C)',
    color: disabled ? 'rgba(201,168,76,0.4)' : '#FDF6E3',
    opacity: disabled ? 0.5 : 1,
    flexShrink: 0,
    transition: 'all 0.2s',
  })

  return (
    <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 900, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>

      {/* Expanded panel */}
      {open && (
        <div style={{
          background: theme.modalBg,
          border: `1px solid rgba(201,168,76,0.4)`,
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
          padding: '16px 18px',
          display: 'flex', flexDirection: 'column', gap: '12px',
          minWidth: '210px',
          animation: 'slideUp 0.2s ease',
        }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontFamily: "'Cinzel Decorative', serif", fontSize: '0.8rem', color: theme.textMid, letterSpacing: '0.06em' }}>
              Text Size
            </span>
            <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: theme.textLight, display: 'flex', alignItems: 'center', padding: '2px' }}>
              <X size={14} />
            </button>
          </div>

          {/* Controls */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
            {/* Decrease */}
            <button onClick={dec} disabled={level === 0} style={btnStyle(level === 0)} aria-label="Decrease text size">
              <Minus size={15} />
            </button>

            {/* Level dots */}
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flex: 1, justifyContent: 'center' }}>
              {FONT_LEVELS.map((fl, i) => (
                <button
                  key={i}
                  onClick={() => onChange(i as FontLevel)}
                  title={fl.desc}
                  style={{
                    width: i === level ? '12px' : '8px',
                    height: i === level ? '12px' : '8px',
                    borderRadius: '50%',
                    border: 'none', cursor: 'pointer',
                    background: i === level ? '#C9A84C' : 'rgba(201,168,76,0.3)',
                    transition: 'all 0.2s',
                    padding: 0,
                  }}
                  aria-label={`Set text size to ${fl.desc}`}
                  aria-pressed={i === level}
                />
              ))}
            </div>

            {/* Increase */}
            <button onClick={inc} disabled={level === 4} style={btnStyle(level === 4)} aria-label="Increase text size">
              <Plus size={15} />
            </button>
          </div>

          {/* Sample text preview */}
          <div style={{
            padding: '10px 12px',
            background: theme.statsBg, borderRadius: '8px',
            border: `1px solid ${theme.statsBorder}`,
            textAlign: 'center',
          }}>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", color: theme.text, lineHeight: 1.5, margin: 0 }}>
              Participant Name
            </p>
            <p style={{ fontFamily: "'Cinzel Decorative', serif", fontSize: '0.72rem', color: theme.textMid, marginTop: '2px', letterSpacing: '0.05em' }}>
              {FONT_LEVELS[level].desc} — {Math.round(18 * FONT_LEVELS[level].scale)}px base
            </p>
          </div>

          {/* Reset */}
          {level !== 2 && (
            <button
              onClick={() => onChange(2)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: theme.textLight, fontFamily: "'Cormorant Garamond', serif", fontSize: '0.88rem', fontStyle: 'italic', textAlign: 'center', padding: '2px' }}
            >
              Reset to default
            </button>
          )}
        </div>
      )}

      {/* FAB trigger button */}
      <button
        onClick={() => setOpen(o => !o)}
        aria-label="Adjust text size"
        title="Adjust text size"
        style={{
          width: '52px', height: '52px', borderRadius: '50%',
          background: 'linear-gradient(135deg,#8B1A1A,#C9A84C)',
          border: '2px solid rgba(201,168,76,0.5)',
          boxShadow: '0 4px 18px rgba(139,26,26,0.35)',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#FDF6E3', flexDirection: 'column', gap: '1px',
          transition: 'transform 0.2s, box-shadow 0.2s',
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.08)'; e.currentTarget.style.boxShadow = '0 6px 24px rgba(139,26,26,0.45)' }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 18px rgba(139,26,26,0.35)' }}
      >
        <Type size={18} />
        <span style={{ fontFamily: "'Cinzel Decorative', serif", fontSize: '0.55rem', letterSpacing: '0.04em', lineHeight: 1 }}>
          {FONT_LEVELS[level].label}
        </span>
      </button>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}

export default FontSizeWidget
