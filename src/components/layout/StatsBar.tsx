import React from 'react'
import type { Participant } from '@/types'
import type { ThemeTokens } from '@/utils/theme'
import type { Translations } from '@/utils/i18n'
import { computeStats } from '@/utils/dasakam'

interface StatsBarProps {
  participants: Participant[]
  t: Translations
  theme: ThemeTokens
}

const StatsBar: React.FC<StatsBarProps> = ({ participants, t, theme }) => {
  const stats = computeStats(participants)
  const coverage = Math.round((stats.allocated.length / 100) * 100)

  const items = [
    { label: t.stats.participants, value: participants.length, color: '#8B1A1A' },
    { label: t.stats.covered, value: `${stats.allocated.length}/100`, color: '#C9A84C' },
    { label: t.stats.remaining, value: stats.unallocated.length, color: '#FF6B00' },
    {
      label: t.stats.duplicates,
      value: stats.duplicates.length,
      color: stats.duplicates.length > 0 ? '#DC2626' : '#16A34A',
    },
  ]

  return (
    <div
      style={{
        background: theme.statsBg,
        border: `1px solid ${theme.statsBorder}`,
        borderRadius: '12px',
        padding: 'clamp(12px,3vw,18px) clamp(14px,3vw,22px)',
        marginBottom: '18px',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '8px',
          textAlign: 'center',
          marginBottom: '14px',
        }}
      >
        {items.map(({ label, value, color }) => (
          <div key={label}>
            <div
              style={{
                fontFamily: "'Cinzel Decorative', serif",
                fontSize: 'clamp(1.6rem,4vw,2.5rem)',
                color,
                fontWeight: 700,
                lineHeight: 1,
              }}
            >
              {value}
            </div>
            <div
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 'clamp(1rem,1.8vw,1.15rem)',
                color: theme.textLight,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                marginTop: '4px',
              }}
            >
              {label}
            </div>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '6px',
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 'clamp(1rem,1.8vw,1.1rem)',
          color: theme.textLight,
        }}
      >
        <span>{t.stats.coverage}</span>
        <span style={{ color: '#C9A84C', fontWeight: 600 }}>{coverage}%</span>
      </div>

      <div
        style={{
          height: '9px',
          background: theme.progressBg,
          borderRadius: '4px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${coverage}%`,
            background:
              coverage === 100 ? theme.progressFillComplete : theme.progressFill,
            borderRadius: '4px',
            transition: 'width 0.5s ease',
          }}
        />
      </div>

      {coverage === 100 && (
        <p
          style={{
            textAlign: 'center',
            marginTop: '8px',
            color: '#16A34A',
            fontFamily: "'Cinzel Decorative', serif",
            fontSize: 'clamp(0.8rem,1.5vw,0.9rem)',
            letterSpacing: '0.08em',
          }}
        >
          {t.stats.complete}
        </p>
      )}
    </div>
  )
}

export default StatsBar
