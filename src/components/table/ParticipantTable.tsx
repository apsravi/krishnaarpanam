import React from 'react'
import { Plus } from 'lucide-react'
import ParticipantRow from './ParticipantRow'
import Pagination from '@/components/ui/Pagination'
import type { Participant, Column } from '@/types'
import type { ThemeTokens } from '@/utils/theme'
import type { Translations } from '@/utils/i18n'

interface ParticipantTableProps {
  participants: Participant[]        // paginated slice
  allParticipants: Participant[]     // full filtered list (for pagination total)
  columns: Column[]
  page: number
  pageSize: number
  totalPages: number
  onUpdate: (id: string, data: Partial<Participant>) => void
  onRemove: (id: string) => void
  onAddRow: () => void
  onPageChange: (p: number) => void
  onPageSizeChange: (s: number) => void
  isMobile: boolean
  t: Translations
  theme: ThemeTokens
}

const ParticipantTable: React.FC<ParticipantTableProps> = ({
  participants, allParticipants, columns, page, pageSize, totalPages,
  onUpdate, onRemove, onAddRow, onPageChange, onPageSizeChange, isMobile, t, theme,
}) => {
  const visibleCols = columns.filter(c => c.visible)

  if (allParticipants.length === 0) {
    return (
      <div style={{
        textAlign: 'center', padding: 'clamp(32px,8vw,56px) 20px',
        border: `2px dashed ${theme.dropzoneBorder}`, borderRadius: '12px',
        background: theme.dropzoneBg,
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '14px', opacity: 0.35 }}>🪷</div>
        <p style={{ fontFamily: "'Cinzel Decorative', serif", fontSize: 'clamp(0.96rem,2.2vw,1.1rem)', color: theme.textLight, letterSpacing: '0.08em', marginBottom: '8px' }}>
          {t.empty.title}
        </p>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.05rem,2.2vw,1.2rem)', color: theme.textLight, fontStyle: 'italic' }}>
          {t.empty.sub}
        </p>
      </div>
    )
  }

  return (
    <div>
      {isMobile ? (
        <div>
          {participants.map((p, i) => (
            <ParticipantRow
              key={p.id} participant={p}
              index={(page - 1) * pageSize + i}
              columns={columns} onUpdate={onUpdate} onRemove={onRemove}
              isMobile={true} t={t} theme={theme}
            />
          ))}
        </div>
      ) : (
        <div style={{
          overflowX: 'auto', borderRadius: '12px',
          border: `1px solid ${theme.surfaceBorder}`,
          boxShadow: theme.surfaceShadow,
          WebkitOverflowScrolling: 'touch',
        }}>
          <table style={{ borderCollapse: 'separate', borderSpacing: 0, width: '100%', minWidth: '580px' }}>
            <thead>
              <tr>
                <th style={{
                  background: theme.tableHeadBg, color: theme.tableHeadText,
                  fontFamily: "'Cinzel Decorative', serif", fontSize: 'clamp(0.86rem,1.5vw,1rem)',
                  letterSpacing: '0.07em', padding: '15px 14px', textAlign: 'center',
                  width: '56px', borderRadius: '8px 0 0 0',
                }}>
                  {t.table.no}
                </th>
                {visibleCols.map((col, i) => (
                  <th key={col.id} style={{
                    background: theme.tableHeadBg, color: theme.tableHeadText,
                    fontFamily: "'Cinzel Decorative', serif", fontSize: 'clamp(0.86rem,1.5vw,1rem)',
                    letterSpacing: '0.07em', padding: '15px 14px', textAlign: 'left',
                    whiteSpace: 'nowrap', fontWeight: 700,
                  }}>
                    {col.label}{col.required ? ' *' : ''}
                  </th>
                ))}
                <th style={{
                  background: theme.tableHeadBg, color: theme.tableHeadText,
                  fontFamily: "'Cinzel Decorative', serif", fontSize: 'clamp(0.86rem,1.5vw,1rem)',
                  letterSpacing: '0.07em', padding: '15px 14px', textAlign: 'center',
                  width: '64px', borderRadius: '0 8px 0 0',
                }}>
                  {t.table.action}
                </th>
              </tr>
            </thead>
            <tbody>
              {participants.map((p, i) => (
                <ParticipantRow
                  key={p.id} participant={p}
                  index={(page - 1) * pageSize + i}
                  columns={columns} onUpdate={onUpdate} onRemove={onRemove}
                  isMobile={false} t={t} theme={theme}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add row */}
      <div style={{ marginTop: '12px' }}>
        <button
          onClick={onAddRow}
          style={{
            background: 'transparent', border: `1.5px dashed ${theme.dropzoneBorder}`,
            borderRadius: '8px', padding: '8px 18px', cursor: 'pointer',
            fontFamily: "'Cinzel Decorative', serif", fontSize: 'clamp(0.86rem,1.6vw,1rem)',
            color: theme.textMid, letterSpacing: '0.05em',
            display: 'inline-flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s',
          }}
        >
          <Plus size={13} />
          {t.toolbar.addOne.replace('+ ', '')}
        </button>
      </div>

      {/* Pagination */}
      <Pagination
        page={page}
        pageSize={pageSize}
        total={allParticipants.length}
        totalPages={totalPages}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
        theme={theme}
      />
    </div>
  )
}

export default ParticipantTable
