import React, { useState, useCallback } from 'react'
import { Trash2 } from 'lucide-react'
import type { Participant, Column } from '@/types'
import type { ThemeTokens } from '@/utils/theme'
import type { Translations } from '@/utils/i18n'
import { parseDasakam, formatDasakam } from '@/utils/dasakam'

interface ParticipantRowProps {
  participant: Participant
  index: number
  columns: Column[]
  onUpdate: (id: string, data: Partial<Participant>) => void
  onRemove: (id: string) => void
  isMobile: boolean
  t: Translations
  theme: ThemeTokens
}

const ParticipantRow: React.FC<ParticipantRowProps> = ({
  participant, index, columns, onUpdate, onRemove, isMobile, t, theme,
}) => {
  const [dasakamInput, setDasakamInput] = useState(formatDasakam(participant.dasakams))
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleDasakamBlur = useCallback(() => {
    const parsed = parseDasakam(dasakamInput)
    onUpdate(participant.id, { dasakams: parsed })
    if (parsed.length > 0) {
      setDasakamInput(formatDasakam(parsed))
      setErrors(e => ({ ...e, dasakams: '' }))
    } else if (dasakamInput.trim()) {
      setErrors(e => ({ ...e, dasakams: t.row.dasakamErr }))
    } else {
      setErrors(e => ({ ...e, dasakams: '' }))
    }
  }, [dasakamInput, participant.id, onUpdate, t.row.dasakamErr])

  const inputStyle: React.CSSProperties = {
    background: 'transparent',
    border: 'none',
    borderBottom: `1px solid ${theme.inputBorder}`,
    padding: '6px 8px',
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: '1.2rem',
    color: theme.inputText,
    width: '100%',
    outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box',
  }

  const errStyle: React.CSSProperties = {
    fontSize: '1.08rem', color: theme.errorText,
    fontFamily: "'Cormorant Garamond', serif", marginTop: '2px',
  }

  const labelStyle: React.CSSProperties = {
    fontFamily: "'Cinzel Decorative', serif",
    fontSize: '1.2rem', color: theme.textMid,
    letterSpacing: '0.07em', display: 'block', marginBottom: '3px',
  }

  const badge = (
    <div style={{
      minWidth: '32px', width: '32px', height: '32px', borderRadius: '50%',
      background: theme.badgeGradient,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#FDF6E3', fontFamily: "'Cinzel Decorative', serif",
      fontSize: '1.2rem', flexShrink: 0, fontWeight: 700,
    }}>
      {index + 1}
    </div>
  )

  // Render a cell input based on column type
  const renderInput = (col: Column) => {
    if (col.id === 'dasakams') {
      return (
        <>
          <input
            value={dasakamInput}
            onChange={e => setDasakamInput(e.target.value)}
            onBlur={handleDasakamBlur}
            placeholder={t.row.dasakamPlaceholder}
            style={inputStyle}
            aria-label="Dasakam numbers"
          />
          {errors.dasakams && <div style={errStyle}>{errors.dasakams}</div>}
        </>
      )
    }
    if (col.id === 'name') {
      return (
        <>
          <input
            value={String(participant.name || '')}
            onChange={e => onUpdate(participant.id, { name: e.target.value })}
            placeholder={t.row.namePlaceholder}
            style={inputStyle}
            aria-label="Participant name"
          />
          {errors.name && <div style={errStyle}>{errors.name}</div>}
        </>
      )
    }
    // Generic / custom columns
    return (
      <input
        value={String(participant[col.id] || '')}
        onChange={e => onUpdate(participant.id, { [col.id]: e.target.value })}
        placeholder={col.required ? `${col.label} *` : t.row.contactPlaceholder}
        style={inputStyle}
        type={col.type === 'tel' ? 'tel' : 'text'}
        aria-label={col.label}
      />
    )
  }

  if (isMobile) {
    return (
      <div style={{
        background: theme.surface, border: `1px solid ${theme.surfaceBorder}`,
        borderRadius: '10px', marginBottom: '10px', padding: '14px',
        boxShadow: theme.surfaceShadow,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
          {badge}
          <div style={{ flex: 1, minWidth: 0 }}>
            <input
              value={String(participant.name || '')}
              onChange={e => onUpdate(participant.id, { name: e.target.value })}
              placeholder={t.row.namePlaceholder}
              style={inputStyle}
            />
          </div>
          <button
            onClick={() => onRemove(participant.id)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: theme.btnDangerText, padding: '4px', flexShrink: 0, display: 'flex', alignItems: 'center' }}
            aria-label="Remove"
          >
            <Trash2 size={16} />
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          {columns.filter(c => c.id !== 'name' && c.visible).map(col => (
            <div key={col.id} style={{ gridColumn: col.id === 'notes' ? 'span 2' : 'span 1' }}>
              <label style={labelStyle}>{col.label}{col.required ? ' *' : ''}</label>
              {renderInput(col)}
            </div>
          ))}
        </div>
      </div>
    )
  }

  const tdBase: React.CSSProperties = {
    padding: '13px 14px', borderBottom: `1px solid ${theme.tableBorder}`, verticalAlign: 'middle',
  }

  return (
    <tr style={{ transition: 'background 0.15s' }}>
      <td style={{ ...tdBase, textAlign: 'center', width: '52px' }}>{badge}</td>
      {columns.filter(c => c.visible).map(col => (
        <td key={col.id} style={{ ...tdBase, minWidth: '120px' }}>
          {renderInput(col)}
        </td>
      ))}
      <td style={{ ...tdBase, textAlign: 'center', width: '60px' }}>
        <button
          onClick={() => onRemove(participant.id)}
          style={{
            background: 'none', border: `1px solid ${theme.btnDangerBorder}`,
            borderRadius: '6px', cursor: 'pointer', color: theme.btnDangerText,
            padding: '6px 8px', display: 'inline-flex', alignItems: 'center', transition: 'all 0.15s',
          }}
          aria-label="Remove participant"
        >
          <Trash2 size={14} />
        </button>
      </td>
    </tr>
  )
}

export default ParticipantRow
