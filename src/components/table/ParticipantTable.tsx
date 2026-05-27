import React from 'react'
import { Plus } from 'lucide-react'
import ParticipantRow from './ParticipantRow'
import type { Participant } from '@/types'
import type { ThemeTokens } from '@/utils/theme'
import type { Translations } from '@/utils/i18n'

interface ParticipantTableProps {
  participants: Participant[]
  onUpdate: (id: string, data: Partial<Participant>) => void
  onRemove: (id: string) => void
  onAddRow: () => void
  isMobile: boolean
  t: Translations
  theme: ThemeTokens
}

const ParticipantTable: React.FC<ParticipantTableProps> = ({
  participants,
  onUpdate,
  onRemove,
  onAddRow,
  isMobile,
  t,
  theme,
}) => {
  if (participants.length === 0) {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: 'clamp(32px, 8vw, 56px) 20px',
          border: `2px dashed ${theme.dropzoneBorder}`,
          borderRadius: '12px',
          background: theme.dropzoneBg,
        }}
      >
        <div style={{ fontSize: '3rem', marginBottom: '14px', opacity: 0.35 }}>🪷</div>
        <p
          style={{
            fontFamily: "'Cinzel Decorative', serif",
            fontSize: 'clamp(0.7rem, 2vw, 0.88rem)',
            color: theme.textLight,
            letterSpacing: '0.08em',
            marginBottom: '8px',
          }}
        >
          {t.empty.title}
        </p>
        <p
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(0.85rem, 2vw, 1rem)',
            color: theme.textLight,
            fontStyle: 'italic',
          }}
        >
          {t.empty.sub}
        </p>
      </div>
    )
  }

  const headers = [
    t.table.no,
    t.table.name,
    t.table.dasakam,
    t.table.contact,
    t.table.notes,
    t.table.action,
  ]

  return (
    <div>
      {isMobile ? (
        <div>
          {participants.map((p, i) => (
            <ParticipantRow
              key={p.id}
              participant={p}
              index={i}
              onUpdate={onUpdate}
              onRemove={onRemove}
              isMobile={true}
              t={t}
              theme={theme}
            />
          ))}
        </div>
      ) : (
        <div
          style={{
            overflowX: 'auto',
            borderRadius: '12px',
            border: `1px solid ${theme.surfaceBorder}`,
            boxShadow: theme.surfaceShadow,
            WebkitOverflowScrolling: 'touch',
          }}
        >
          <table
            style={{
              borderCollapse: 'separate',
              borderSpacing: 0,
              width: '100%',
              minWidth: '620px',
            }}
          >
            <thead>
              <tr>
                {headers.map((h, i) => (
                  <th
                    key={h}
                    style={{
                      background: theme.tableHeadBg,
                      color: theme.tableHeadText,
                      fontFamily: "'Cinzel Decorative', serif",
                      fontSize: 'clamp(0.58rem, 1.4vw, 0.72rem)',
                      letterSpacing: '0.07em',
                      padding: '13px 12px',
                      textAlign: i === 0 || i === 5 ? 'center' : 'left',
                      borderRadius:
                        i === 0 ? '8px 0 0 0' : i === 5 ? '0 8px 0 0' : '0',
                      whiteSpace: 'nowrap',
                      fontWeight: 700,
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {participants.map((p, i) => (
                <ParticipantRow
                  key={p.id}
                  participant={p}
                  index={i}
                  onUpdate={onUpdate}
                  onRemove={onRemove}
                  isMobile={false}
                  t={t}
                  theme={theme}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add row button */}
      <div style={{ marginTop: '12px' }}>
        <button
          onClick={onAddRow}
          style={{
            background: 'transparent',
            border: `1.5px dashed ${theme.dropzoneBorder}`,
            borderRadius: '8px',
            padding: '8px 18px',
            cursor: 'pointer',
            fontFamily: "'Cinzel Decorative', serif",
            fontSize: 'clamp(0.56rem, 1.4vw, 0.66rem)',
            color: theme.textMid,
            letterSpacing: '0.05em',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.2s',
          }}
        >
          <Plus size={13} />
          {t.toolbar.addOne.replace('+ ', '')}
        </button>
      </div>
    </div>
  )
}

export default ParticipantTable
