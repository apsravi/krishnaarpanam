import React, { useState } from 'react'
import { Eye, EyeOff, Plus, Trash2, Columns, X, RotateCcw } from 'lucide-react'
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
  const [newLabel, setNewLabel] = useState('')
  const [newType, setNewType] = useState<Column['type']>('text')
  const [addError, setAddError] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editLabel, setEditLabel] = useState('')

  const handleAdd = () => {
    const label = newLabel.trim()
    if (!label) { setAddError('Column name is required'); return }
    if (columns.some(c => c.label.toLowerCase() === label.toLowerCase())) {
      setAddError('A column with this name already exists'); return
    }
    onAdd(label, newType)
    setNewLabel('')
    setNewType('text')
    setAddError('')
  }

  const startEdit = (col: Column) => {
    setEditingId(col.id)
    setEditLabel(col.label)
  }

  const commitEdit = (id: string) => {
    if (editLabel.trim()) onUpdateLabel(id, editLabel.trim())
    setEditingId(null)
  }

  const visibleCount = columns.filter(c => c.visible).length

  const inp: React.CSSProperties = {
    background: theme.inputBg,
    border: `1px solid ${theme.inputBorder}`,
    borderRadius: '6px',
    padding: '7px 10px',
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: '0.95rem',
    color: theme.inputText,
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
  }

  return (
    <div style={{ position: 'relative' }}>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          background: theme.btnGhostBg,
          color: theme.btnGhostText,
          border: `1px solid ${theme.btnGhostBorder}`,
          padding: '9px 16px',
          borderRadius: '6px',
          fontFamily: "'Cinzel Decorative', serif",
          fontSize: 'clamp(0.56rem, 1.4vw, 0.68rem)',
          letterSpacing: '0.04em',
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          whiteSpace: 'nowrap',
          transition: 'all 0.2s',
        }}
      >
        <Columns size={13} />
        Columns ({visibleCount})
      </button>

      {/* Dropdown panel */}
      {open && (
        <>
          {/* Backdrop */}
          <div
            style={{ position: 'fixed', inset: 0, zIndex: 100 }}
            onClick={() => setOpen(false)}
          />
          <div
            style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              left: 0,
              zIndex: 200,
              background: theme.modalBg,
              border: `1px solid ${theme.surfaceBorder}`,
              borderRadius: '12px',
              boxShadow: '0 12px 40px rgba(0,0,0,0.25)',
              width: 'clamp(280px, 40vw, 380px)',
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '14px 16px',
              borderBottom: `1px solid ${theme.surfaceBorder}`,
              background: theme.statsBg,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Columns size={14} color={theme.textMid} />
                <span style={{
                  fontFamily: "'Cinzel Decorative', serif",
                  fontSize: '0.72rem', color: theme.text, letterSpacing: '0.06em',
                }}>
                  Manage Columns
                </span>
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  onClick={onReset}
                  title="Reset to defaults"
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: theme.textLight, display: 'flex', alignItems: 'center', padding: '2px 4px',
                  }}
                >
                  <RotateCcw size={13} />
                </button>
                <button
                  onClick={() => setOpen(false)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: theme.textLight, display: 'flex', alignItems: 'center' }}
                >
                  <X size={15} />
                </button>
              </div>
            </div>

            {/* Column list */}
            <div style={{ padding: '10px 16px', maxHeight: '260px', overflowY: 'auto' }}>
              {columns.map(col => (
                <div
                  key={col.id}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    padding: '7px 0',
                    borderBottom: `1px solid ${theme.tableBorder}`,
                  }}
                >
                  {/* Visibility toggle */}
                  <button
                    onClick={() => !col.required && onToggle(col.id)}
                    title={col.required ? 'Required column — cannot hide' : col.visible ? 'Hide column' : 'Show column'}
                    style={{
                      background: 'none', border: 'none', cursor: col.required ? 'not-allowed' : 'pointer',
                      color: col.visible ? '#C9A84C' : theme.textLight,
                      opacity: col.required ? 0.4 : 1,
                      display: 'flex', alignItems: 'center', padding: '2px', flexShrink: 0,
                    }}
                  >
                    {col.visible ? <Eye size={14} /> : <EyeOff size={14} />}
                  </button>

                  {/* Label */}
                  {editingId === col.id ? (
                    <input
                      value={editLabel}
                      onChange={e => setEditLabel(e.target.value)}
                      onBlur={() => commitEdit(col.id)}
                      onKeyDown={e => e.key === 'Enter' && commitEdit(col.id)}
                      autoFocus
                      style={{ ...inp, flex: 1, padding: '4px 8px', fontSize: '0.9rem' }}
                    />
                  ) : (
                    <span
                      onClick={() => col.isCustom && startEdit(col)}
                      style={{
                        flex: 1,
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: '0.95rem',
                        color: col.visible ? theme.text : theme.textLight,
                        cursor: col.isCustom ? 'text' : 'default',
                        textDecoration: col.visible ? 'none' : 'line-through',
                      }}
                    >
                      {col.label}
                      {col.required && (
                        <span style={{ color: '#FF6B00', marginLeft: '3px', fontSize: '0.75rem' }}>*</span>
                      )}
                      {col.isCustom && (
                        <span style={{ color: theme.textLight, fontSize: '0.72rem', marginLeft: '6px', fontStyle: 'italic' }}>
                          custom
                        </span>
                      )}
                    </span>
                  )}

                  {/* Type badge */}
                  <span style={{
                    fontFamily: "'Cinzel Decorative', serif",
                    fontSize: '0.5rem',
                    color: theme.textLight,
                    border: `1px solid ${theme.inputBorder}`,
                    borderRadius: '4px',
                    padding: '1px 5px',
                    flexShrink: 0,
                    letterSpacing: '0.04em',
                  }}>
                    {col.type}
                  </span>

                  {/* Remove custom col */}
                  {col.isCustom && (
                    <button
                      onClick={() => onRemove(col.id)}
                      style={{
                        background: 'none', border: 'none', cursor: 'pointer',
                        color: theme.btnDangerText, display: 'flex', alignItems: 'center', padding: '2px', flexShrink: 0,
                      }}
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Add new column */}
            <div style={{
              padding: '12px 16px',
              borderTop: `1px solid ${theme.surfaceBorder}`,
              background: theme.statsBg,
            }}>
              <p style={{
                fontFamily: "'Cinzel Decorative', serif",
                fontSize: '0.6rem', color: theme.textMid,
                letterSpacing: '0.07em', marginBottom: '8px',
              }}>
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
                  style={{
                    ...inp,
                    width: 'auto',
                    padding: '7px 8px',
                    cursor: 'pointer',
                    flexShrink: 0,
                  }}
                >
                  <option value="text">Text</option>
                  <option value="tel">Phone</option>
                  <option value="textarea">Notes</option>
                </select>
                <button
                  onClick={handleAdd}
                  style={{
                    background: 'linear-gradient(135deg,#FF6B00,#FF9A3C)',
                    border: 'none', borderRadius: '6px',
                    color: '#fff', cursor: 'pointer',
                    padding: '7px 10px',
                    display: 'flex', alignItems: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Plus size={14} />
                </button>
              </div>
              {addError && (
                <p style={{ fontSize: '0.75rem', color: theme.errorText, fontFamily: "'Cormorant Garamond', serif" }}>
                  {addError}
                </p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default ColumnManager
