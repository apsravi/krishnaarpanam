import React, { useState } from 'react'
import { Trash2 } from 'lucide-react'
import type { Participant } from '@/types'
import type { ThemeTokens } from '@/utils/theme'
import type { Translations } from '@/utils/i18n'
import { computeStats } from '@/utils/dasakam'

interface DasakamGridProps {
  participants: Participant[]
  onClearAssignments: () => void
  t: Translations
  theme: ThemeTokens
}

const DasakamGrid: React.FC<DasakamGridProps> = ({
  participants,
  onClearAssignments,
  t,
  theme,
}) => {
  const [hovered, setHovered] = useState<number | null>(null)
  const [showConfirm, setShowConfirm] = useState(false)

  const stats = computeStats(participants)
  const getAssignee = (d: number) => participants.find(p => p.dasakams.includes(d))
  const isDup = (d: number) => stats.duplicates.some(x => x.dasakam === d)

  const handleClearGrid = () => {
    onClearAssignments()
    setShowConfirm(false)
  }

  return (
    <div>
      {/* Header row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '14px',
          flexWrap: 'wrap',
          gap: '10px',
        }}
      >
        <div>
          <p
            style={{
              fontFamily: "'Cinzel Decorative', serif",
              fontSize: 'clamp(0.9rem,1.7vw,1.05rem)',
              color: theme.textMid,
              letterSpacing: '0.07em',
              marginBottom: '2px',
            }}
          >
            {t.grid.title}
          </p>
          <p
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(1.15rem,2.2vw,1.35rem)',
              color: theme.textLight,
              fontStyle: 'italic',
            }}
          >
            {t.grid.subtitle}
          </p>
        </div>

        {/* Clear Grid button */}
        <button
          onClick={() => setShowConfirm(true)}
          style={{
            background: theme.btnDangerBg,
            border: `1px solid ${theme.btnDangerBorder}`,
            borderRadius: '6px',
            color: theme.btnDangerText,
            padding: '10px 18px',
            fontFamily: "'Cinzel Decorative', serif",
            fontSize: 'clamp(0.82rem,1.5vw,0.92rem)',
            letterSpacing: '0.04em',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.2s',
          }}
        >
          <Trash2 size={12} />
          {t.grid.clearGrid}
        </button>
      </div>

      {/* Legend */}
      <div
        style={{
          display: 'flex',
          gap: '14px',
          marginBottom: '14px',
          flexWrap: 'wrap',
          alignItems: 'center',
        }}
      >
        {[
          [theme.gridAssignedBg, theme.gridAssignedBorder, t.grid.assigned],
          [theme.gridUnassignedBg, theme.gridUnassignedBorder, t.grid.unassigned],
          [theme.gridDupBg, theme.gridDupBorder, t.grid.duplicate],
        ].map(([bg, border, label]) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div
              style={{
                width: '13px',
                height: '13px',
                borderRadius: '3px',
                background: bg,
                border: `1px solid ${border}`,
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 'clamp(1.15rem,2.2vw,1.35rem)',
                color: theme.textLight,
              }}
            >
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* 100-cell grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(34px, 1fr))',
          gap: '4px',
        }}
      >
        {Array.from({ length: 100 }, (_, i) => i + 1).map(d => {
          const assignee = getAssignee(d)
          const dup = isDup(d)
          const hov = hovered === d

          let bg = theme.gridUnassignedBg
          let border = theme.gridUnassignedBorder
          let color = theme.gridUnassignedText

          if (dup) {
            bg = theme.gridDupBg
            border = theme.gridDupBorder
            color = theme.gridDupText
          } else if (assignee) {
            bg = theme.gridAssignedBg
            border = theme.gridAssignedBorder
            color = theme.gridAssignedText
          }

          if (hov) {
            bg = assignee ? theme.gridHoveredBg : theme.dropzoneBg
            border = theme.dropzoneBorderActive
          }

          return (
            <div
              key={d}
              onMouseEnter={() => setHovered(d)}
              onMouseLeave={() => setHovered(null)}
              title={
                assignee
                  ? `${d}: ${assignee.name}${dup ? ' ⚠️ Duplicate' : ''}`
                  : `${d}: ${t.grid.unassigned}`
              }
              style={{
                aspectRatio: '1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '5px',
                background: bg,
                border: `1px solid ${border}`,
                fontFamily: "'Cinzel Decorative', serif",
                fontSize: 'clamp(0.82rem,1.5vw,0.96rem)',
                color,
                cursor: assignee ? 'pointer' : 'default',
                transition: 'all 0.12s',
                transform: hov ? 'scale(1.18)' : 'scale(1)',
                zIndex: hov ? 10 : 1,
                position: 'relative',
                userSelect: 'none',
              }}
            >
              {d}
            </div>
          )
        })}
      </div>

      {/* Tooltip */}
      {hovered && (
        <div
          style={{
            marginTop: '12px',
            padding: '8px 16px',
            background: 'rgba(28,16,8,0.9)',
            borderRadius: '6px',
            color: '#FDF6E3',
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '1.3rem',
            display: 'inline-block',
            backdropFilter: 'blur(4px)',
          }}
        >
          {(() => {
            const a = getAssignee(hovered)
            return a
              ? `Dasakam ${hovered} → ${a.name}${isDup(hovered) ? ' ⚠️ Duplicate!' : ''}`
              : `Dasakam ${hovered} → ${t.grid.unassigned}`
          })()}
        </div>
      )}

      {/* Confirm clear modal */}
      {showConfirm && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 2000,
            background: theme.modalOverlay,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            backdropFilter: 'blur(6px)',
          }}
          onClick={e => e.target === e.currentTarget && setShowConfirm(false)}
        >
          <div
            style={{
              background: theme.modalBg,
              borderRadius: '16px',
              border: `1px solid ${theme.btnDangerBorder}`,
              boxShadow: '0 20px 60px rgba(0,0,0,0.35)',
              padding: '28px',
              maxWidth: '380px',
              width: '100%',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '2.2rem', marginBottom: '12px' }}>⚠️</div>
            <h3
              style={{
                fontFamily: "'Cinzel Decorative', serif",
                fontSize: '1.3rem',
                color: theme.text,
                marginBottom: '10px',
              }}
            >
              {t.grid.confirmClearTitle}
            </h3>
            <p
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '1.3rem',
                color: theme.textLight,
                lineHeight: 1.6,
                marginBottom: '22px',
              }}
            >
              {t.grid.confirmClear}
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setShowConfirm(false)}
                style={{
                  flex: 1,
                  background: theme.btnGhostBg,
                  color: theme.btnGhostText,
                  border: `1px solid ${theme.btnGhostBorder}`,
                  padding: '10px',
                  borderRadius: '6px',
                  fontFamily: "'Cinzel Decorative', serif",
                  fontSize: '1.3rem',
                  cursor: 'pointer',
                  letterSpacing: '0.04em',
                }}
              >
                {t.generate.cancel}
              </button>
              <button
                onClick={handleClearGrid}
                style={{
                  flex: 1,
                  background: 'linear-gradient(135deg, #DC2626, #EF4444)',
                  color: '#fff',
                  border: 'none',
                  padding: '10px',
                  borderRadius: '6px',
                  fontFamily: "'Cinzel Decorative', serif",
                  fontSize: '1.3rem',
                  cursor: 'pointer',
                  letterSpacing: '0.04em',
                }}
              >
                {t.grid.clearGrid}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DasakamGrid
