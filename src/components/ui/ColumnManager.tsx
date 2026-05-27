import React, { useState } from 'react'
import { Eye, Plus, Trash2, Columns, X, RotateCcw, ChevronDown } from 'lucide-react'
import type { Column } from '@/types'
import type { ThemeTokens } from '@/utils/theme'
import type { Translations } from '@/utils/i18n'

interface ColumnManagerProps {
  columns: Column[]
  onToggle: (id: string) => void
  onAdd: (label: string, type: Column['type']) => void
  onRemove: (id: string) => void
  onUpdateLabel: (id: string, label: string) => void
  onReset: () => void
  t: Translations
  theme: ThemeTokens
}

const ColumnManager: React.FC<ColumnManagerProps> = ({
  columns, onToggle, onAdd, onRemove, onUpdateLabel, onReset, t, theme,
}) => {
  const [open, setOpen] = useState(false)
  const [showHiddenDropdown, setShowHiddenDropdown] = useState(false)
  const [newLabel, setNewLabel] = useState('')
  const [newType, setNewType] = useState<Column['type']>('text')
  const [addError, setAddError] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editLabel, setEditLabel] = useState('')

  // Locked columns — always visible, cannot be hidden or removed
  const LOCKED = ['name', 'dasakams']

  const visibleCols = columns.filter(c => c.visible)
  const hiddenCols = columns.filter(c => !c.visible && !LOCKED.includes(c.id))
  const removableCols = columns.filter(c => c.visible && !LOCKED.includes(c.id))

  const handleAdd = () => {
    const label = newLabel.trim()
    if (!label) { setAddError('Column name is required'); return }
    if (columns.some(c => c.label.toLowerCase() === label.toLowerCase())) {
      setAddError('A column with this name already exists'); return
    }
    onAdd(label, newType)
    setNewLabel(''); setNewType('text'); setAddError('')
  }

  const startEdit = (col: Column) => {
    setEditingId(col.id); setEditLabel(col.label)
  }

  const commitEdit = (id: string) => {
    if (editLabel.trim()) onUpdateLabel(id, editLabel.trim())
    setEditingId(null)
  }

  const inp: React.CSSProperties = {
    background: theme.inputBg, border: `1px solid ${theme.inputBorder}`,
    borderRadius: '6px', padding: '7px 10px',
    fontFamily: "'Cormorant Garamond', serif", fontSize: '0.95rem',
    color: theme.inputText, outline: 'none', width: '100%', boxSizing: 'border-box',
  }

  const chipStyle = (col: Column): React.CSSProperties => ({
    display: 'inline-flex', alignItems: 'center', gap: '5px',
    padding: '4px 10px',
    background: LOCKED.includes(col.id)
      ? 'linear-gradient(135deg,rgba(139,26,26,0.12),rgba(201,168,76,0.12))'
      : theme.statsBg,
    border: `1px solid ${LOCKED.includes(col.id) ? 'rgba(201,168,76,0.5)' : theme.statsBorder}`,
    borderRadius: '20px',
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: '0.88rem',
    color: theme.text,
    cursor: LOCKED.includes(col.id) ? 'default' : 'default',
    flexShrink: 0,
  })

  return (
    <div style={{ position: 'relative', display: 'inline-flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>

      {/* Active column chips — visible inline */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
        {visibleCols.map(col => (
          <div key={col.id} style={chipStyle(col)}>
            {/* Lock icon for required cols */}
            {LOCKED.includes(col.id) ? (
              <span style={{ fontSize: '0.7rem', opacity: 0.6 }}>🔒</span>
            ) : null}

            {/* Label — click to rename custom */}
            {editingId === col.id ? (
              <input
                value={editLabel}
                onChange={e => setEditLabel(e.target.value)}
                onBlur={() => commitEdit(col.id)}
                onKeyDown={e => e.key === 'Enter' && commitEdit(col.id)}
                autoFocus
                style={{ ...inp, width: '90px', padding: '2px 6px', fontSize: '0.85rem', display: 'inline' }}
              />
            ) : (
              <span
                onClick={() => col.isCustom && startEdit(col)}
                style={{ cursor: col.isCustom ? 'text' : 'default' }}
              >
                {col.label}
              </span>
            )}

            {/* Remove from view (hide) — non-locked cols */}
            {!LOCKED.includes(col.id) && (
              <button
                onClick={() => onToggle(col.id)}
                title="Remove from view"
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: theme.btnDangerText, display: 'flex', alignItems: 'center',
                  padding: '1px', lineHeight: 1, marginLeft: '2px',
                }}
              >
                <X size={11} />
              </button>
            )}
          </div>
        ))}

        {/* Hidden columns restore dropdown */}
        {hiddenCols.length > 0 && (
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowHiddenDropdown(d => !d)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '4px',
                padding: '5px 10px',
                background: theme.statsBg, border: `1px solid ${theme.statsBorder}`,
                borderRadius: '20px', cursor: 'pointer',
                fontFamily: "'Cormorant Garamond', serif", fontSize: '0.85rem',
                color: theme.textMid,
              }}
            >
              <Eye size={12} />
              {hiddenCols.length} hidden
              <ChevronDown size={11} />
            </button>

            {showHiddenDropdown && (
              <>
                <div style={{ position: 'fixed', inset: 0, zIndex: 150 }} onClick={() => setShowHiddenDropdown(false)} />
                <div style={{
                  position: 'absolute', top: 'calc(100% + 6px)', left: 0, zIndex: 200,
                  background: theme.modalBg, border: `1px solid ${theme.surfaceBorder}`,
                  borderRadius: '10px', boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                  minWidth: '180px', overflow: 'hidden',
                }}>
                  <p style={{ padding: '8px 12px', fontFamily: "'Cinzel Decorative',serif", fontSize: '0.58rem', color: theme.textMid, letterSpacing: '0.06em', borderBottom: `1px solid ${theme.tableBorder}` }}>
                    Hidden Columns
                  </p>
                  {hiddenCols.map(col => (
                    <div
                      key={col.id}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', gap: '8px', borderBottom: `1px solid ${theme.tableBorder}` }}
                    >
                      <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '0.92rem', color: theme.text }}>{col.label}</span>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        {/* Restore to view */}
                        <button
                          onClick={() => { onToggle(col.id); if (hiddenCols.length === 1) setShowHiddenDropdown(false) }}
                          title="Show column"
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#16A34A', display: 'flex', alignItems: 'center' }}
                        >
                          <Eye size={13} />
                        </button>
                        {/* Delete permanently */}
                        {col.isCustom && (
                          <button
                            onClick={() => onRemove(col.id)}
                            title="Delete column"
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: theme.btnDangerText, display: 'flex', alignItems: 'center' }}
                          >
                            <Trash2 size={12} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Manage button */}
      <div style={{ position: 'relative' }}>
        <button
          onClick={() => setOpen(o => !o)}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '5px',
            background: theme.btnGhostBg, color: theme.btnGhostText,
            border: `1px solid ${theme.btnGhostBorder}`,
            padding: '9px 14px', borderRadius: '6px',
            fontFamily: "'Cinzel Decorative',serif",
            fontSize: 'clamp(0.54rem,1.3vw,0.66rem)', letterSpacing: '0.04em',
            cursor: 'pointer', whiteSpace: 'nowrap',
          }}
        >
          <Columns size={13} />
          Columns
        </button>

        {/* Management panel */}
        {open && (
          <>
            <div style={{ position: 'fixed', inset: 0, zIndex: 100 }} onClick={() => setOpen(false)} />
            <div style={{
              position: 'absolute', top: 'calc(100% + 8px)', right: 0, zIndex: 200,
              background: theme.modalBg, border: `1px solid ${theme.surfaceBorder}`,
              borderRadius: '12px', boxShadow: '0 12px 40px rgba(0,0,0,0.25)',
              width: 'clamp(270px,38vw,360px)', overflow: 'hidden',
            }}>
              {/* Panel header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 16px', borderBottom: `1px solid ${theme.surfaceBorder}`, background: theme.statsBg }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Columns size={14} color={theme.textMid} />
                  <span style={{ fontFamily: "'Cinzel Decorative',serif", fontSize: '0.7rem', color: theme.text, letterSpacing: '0.05em' }}>
                    Manage Columns
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button onClick={onReset} title="Reset to defaults" style={{ background: 'none', border: 'none', cursor: 'pointer', color: theme.textLight, display: 'flex', alignItems: 'center', padding: '2px 4px' }}>
                    <RotateCcw size={13} />
                  </button>
                  <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: theme.textLight, display: 'flex', alignItems: 'center' }}>
                    <X size={15} />
                  </button>
                </div>
              </div>

              {/* Column list */}
              <div style={{ padding: '8px 16px', maxHeight: '240px', overflowY: 'auto' }}>
                {columns.map(col => {
                  const isLocked = LOCKED.includes(col.id)
                  return (
                    <div key={col.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 0', borderBottom: `1px solid ${theme.tableBorder}` }}>
                      {/* Status indicator */}
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', flexShrink: 0, background: isLocked ? '#C9A84C' : col.visible ? '#16A34A' : theme.textLight }} />

                      {/* Label */}
                      {editingId === col.id ? (
                        <input
                          value={editLabel}
                          onChange={e => setEditLabel(e.target.value)}
                          onBlur={() => commitEdit(col.id)}
                          onKeyDown={e => e.key === 'Enter' && commitEdit(col.id)}
                          autoFocus
                          style={{ ...inp, flex: 1, padding: '4px 8px', fontSize: '0.88rem' }}
                        />
                      ) : (
                        <span
                          onClick={() => col.isCustom && startEdit(col)}
                          style={{ flex: 1, fontFamily: "'Cormorant Garamond',serif", fontSize: '0.95rem', color: theme.text, cursor: col.isCustom ? 'text' : 'default' }}
                        >
                          {col.label}
                          {isLocked && <span style={{ color: '#FF6B00', marginLeft: '4px', fontSize: '0.72rem' }}>locked</span>}
                          {col.isCustom && <span style={{ color: theme.textLight, fontSize: '0.7rem', marginLeft: '6px', fontStyle: 'italic' }}>custom</span>}
                        </span>
                      )}

                      {/* Actions */}
                      <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
                        {!isLocked && (
                          <button
                            onClick={() => onToggle(col.id)}
                            title={col.visible ? 'Hide column' : 'Show column'}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: col.visible ? '#C9A84C' : theme.textLight, display: 'flex', alignItems: 'center', padding: '3px' }}
                          >
                            <Eye size={13} />
                          </button>
                        )}
                        {col.isCustom && (
                          <button
                            onClick={() => onRemove(col.id)}
                            title="Delete permanently"
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: theme.btnDangerText, display: 'flex', alignItems: 'center', padding: '3px' }}
                          >
                            <Trash2 size={12} />
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Add new column */}
              <div style={{ padding: '12px 16px', borderTop: `1px solid ${theme.surfaceBorder}`, background: theme.statsBg }}>
                <p style={{ fontFamily: "'Cinzel Decorative',serif", fontSize: '0.58rem', color: theme.textMid, letterSpacing: '0.07em', marginBottom: '8px' }}>
                  Add Custom Column
                </p>
                <div style={{ display: 'flex', gap: '6px', marginBottom: '6px' }}>
                  <input
                    value={newLabel}
                    onChange={e => { setNewLabel(e.target.value); setAddError('') }}
                    onKeyDown={e => e.key === 'Enter' && handleAdd()}
                    placeholder="Column name"
                    style={{ ...inp, flex: 1 }}
                  />
                  <select
                    value={newType}
                    onChange={e => setNewType(e.target.value as Column['type'])}
                    style={{ ...inp, width: 'auto', padding: '7px 8px', cursor: 'pointer', flexShrink: 0 }}
                  >
                    <option value="text">Text</option>
                    <option value="tel">Phone</option>
                    <option value="textarea">Notes</option>
                  </select>
                  <button
                    onClick={handleAdd}
                    style={{ background: 'linear-gradient(135deg,#FF6B00,#FF9A3C)', border: 'none', borderRadius: '6px', color: '#fff', cursor: 'pointer', padding: '7px 10px', display: 'flex', alignItems: 'center', flexShrink: 0 }}
                  >
                    <Plus size={14} />
                  </button>
                </div>
                {addError && <p style={{ fontSize: '0.75rem', color: theme.errorText, fontFamily: "'Cormorant Garamond',serif" }}>{addError}</p>}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default ColumnManager
