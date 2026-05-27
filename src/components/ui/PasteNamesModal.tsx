import React, { useState, useRef } from 'react'
import { ClipboardPaste, X, Check, AlertCircle } from 'lucide-react'
import type { ThemeTokens } from '@/utils/theme'
import type { Translations } from '@/utils/i18n'

interface PasteNamesModalProps {
  onAdd: (names: string[]) => void
  onClose: () => void
  existingCount: number
  rowCap: number | null
  theme: ThemeTokens
  t: Translations
}

// Smart name parser — handles many real-world paste formats
function parseNames(raw: string): string[] {
  const lines = raw
    .split(/[\n\r]+/)                        // split by newlines
    .map(l => l.trim())
    .filter(Boolean)

  const names: string[] = []

  for (const line of lines) {
    // Remove leading numbering: "1.", "1)", "1 -", "S.No 1", "(1)", etc.
    let cleaned = line
      .replace(/^\(?[\d]+[.):\-]\s*/,  '')   // 1. 1) 1: 1-
      .replace(/^S\.?No\.?\s*[\d]+\s*/i, '') // SNo 1 / S.No. 1
      .replace(/^[-•*►▶→]\s*/,         '')   // bullets
      .trim()

    // Handle comma-separated in one line: "Rajan, Priya, Anand"
    const commaParts = cleaned.split(',').map(p => p.trim()).filter(Boolean)
    if (commaParts.length > 1) {
      // Multiple names on one line, comma-separated
      commaParts.forEach(p => {
        const n = p.replace(/^\d+\.\s*/, '').trim() // remove any inline numbering
        if (n.length >= 2 && n.length <= 80 && /[a-zA-ZÀ-ÿ\u0B80-\u0BFF\u0900-\u097F]/.test(n)) {
          names.push(n)
        }
      })
    } else {
      // Single name per line
      if (cleaned.length >= 2 && cleaned.length <= 80 && /[a-zA-ZÀ-ÿ\u0B80-\u0BFF\u0900-\u097F]/.test(cleaned)) {
        names.push(cleaned)
      }
    }
  }

  // Deduplicate preserving order
  return [...new Set(names)]
}

const PasteNamesModal: React.FC<PasteNamesModalProps> = ({
  onAdd, onClose, existingCount, rowCap, theme, t,
}) => {
  const [raw, setRaw]           = useState('')
  const [preview, setPreview]   = useState<string[]>([])
  const [parsed, setParsed]     = useState(false)
  const textRef = useRef<HTMLTextAreaElement>(null)

  const remainingSlots = rowCap !== null ? Math.max(0, rowCap - existingCount) : null

  const handleParse = () => {
    const names = parseNames(raw)
    setPreview(names)
    setParsed(true)
  }

  const handleAdd = () => {
    let toAdd = preview
    if (remainingSlots !== null) toAdd = preview.slice(0, remainingSlots)
    onAdd(toAdd)
    onClose()
  }

  const cappedCount = remainingSlots !== null ? Math.min(preview.length, remainingSlots) : preview.length
  const overCap     = remainingSlots !== null && preview.length > remainingSlots

  const inp: React.CSSProperties = {
    width: '100%', padding: '12px 14px',
    border: `1.5px solid ${theme.inputBorder}`,
    borderRadius: '10px', fontFamily: "'Cormorant Garamond', serif",
    fontSize: '1.05rem', color: theme.inputText,
    background: theme.inputBg, outline: 'none',
    boxSizing: 'border-box', resize: 'vertical',
  }

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 1500, background: theme.modalOverlay, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', backdropFilter: 'blur(6px)' }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div style={{ background: theme.modalBg, borderRadius: '20px', border: `1px solid rgba(212,168,67,0.4)`, boxShadow: '0 20px 60px rgba(0,0,0,0.35)', padding: 'clamp(20px,4vw,32px)', width: '100%', maxWidth: '520px', maxHeight: '90vh', overflowY: 'auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'linear-gradient(135deg,#8B1A1A,#C9A84C)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <ClipboardPaste size={18} color="#FDF6E3" />
            </div>
            <div>
              <h3 style={{ fontFamily: "'Cinzel Decorative', serif", fontSize: '0.95rem', color: theme.text, letterSpacing: '0.04em' }}>Paste Names</h3>
              <p style={{ fontSize: '0.92rem', color: theme.textLight, fontStyle: 'italic' }}>
                Paste any list — numbered, bulleted, comma-separated
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: theme.textLight, padding: '4px', display: 'flex', alignItems: 'center' }}>
            <X size={18} />
          </button>
        </div>

        {/* Cap notice */}
        {rowCap !== null && (
          <div style={{ padding: '10px 14px', background: theme.statsBg, border: `1px solid ${theme.statsBorder}`, borderRadius: '8px', marginBottom: '14px', fontSize: '0.92rem', color: theme.textMid }}>
            🔒 Row cap active: <strong>{rowCap}</strong> total · <strong>{remainingSlots}</strong> slot{remainingSlots !== 1 ? 's' : ''} available
          </div>
        )}

        {/* Textarea */}
        <label style={{ fontFamily: "'Cinzel Decorative', serif", fontSize: '0.78rem', color: theme.textMid, letterSpacing: '0.07em', display: 'block', marginBottom: '8px' }}>
          Paste your list here
        </label>
        <textarea
          ref={textRef}
          value={raw}
          onChange={e => { setRaw(e.target.value); setParsed(false); setPreview([]) }}
          placeholder={`Examples supported:\n1. Rajan Kumar\n2. Priya Nair\n\nOr comma-separated:\nRajan, Priya, Anand\n\nOr plain lines:\nMeena Krishnamurthy\nSundar Rajan`}
          rows={8}
          style={inp}
          autoFocus
        />

        {/* Parse button */}
        <button
          onClick={handleParse}
          disabled={!raw.trim()}
          style={{
            width: '100%', marginTop: '12px', padding: '12px',
            background: !raw.trim() ? 'rgba(139,26,26,0.3)' : 'linear-gradient(135deg,#FF6B00,#FF9A3C)',
            color: '#fff', border: 'none', borderRadius: '10px',
            fontFamily: "'Cinzel Decorative', serif", fontSize: '0.88rem',
            letterSpacing: '0.04em', cursor: !raw.trim() ? 'not-allowed' : 'pointer',
            opacity: !raw.trim() ? 0.5 : 1,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          }}
        >
          <ClipboardPaste size={15} /> Parse Names ({raw.trim() ? parseNames(raw).length : 0} detected)
        </button>

        {/* Preview */}
        {parsed && preview.length > 0 && (
          <div style={{ marginTop: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <p style={{ fontFamily: "'Cinzel Decorative', serif", fontSize: '0.78rem', color: theme.textMid, letterSpacing: '0.06em' }}>
                {cappedCount} name{cappedCount !== 1 ? 's' : ''} ready to add
              </p>
              {overCap && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#FF6B00', fontSize: '0.88rem' }}>
                  <AlertCircle size={13} />
                  {preview.length - cappedCount} will be skipped (cap)
                </div>
              )}
            </div>

            <div style={{ maxHeight: '200px', overflowY: 'auto', border: `1px solid ${theme.surfaceBorder}`, borderRadius: '10px', background: theme.surface }}>
              {preview.map((name, i) => {
                const skipped = remainingSlots !== null && i >= remainingSlots
                return (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '9px 14px',
                    borderBottom: i < preview.length - 1 ? `1px solid ${theme.tableBorder}` : 'none',
                    opacity: skipped ? 0.4 : 1,
                  }}>
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: skipped ? theme.statsBg : 'linear-gradient(135deg,#8B1A1A,#C9A84C)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span style={{ fontFamily: "'Cinzel Decorative', serif", fontSize: '0.6rem', color: skipped ? theme.textLight : '#FDF6E3' }}>{i + 1}</span>
                    </div>
                    <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.05rem', color: skipped ? theme.textLight : theme.text }}>
                      {name}
                    </span>
                    {skipped && <span style={{ fontSize: '0.8rem', color: '#FF6B00', marginLeft: 'auto', fontStyle: 'italic' }}>skipped</span>}
                  </div>
                )
              })}
            </div>

            {/* Confirm */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '14px' }}>
              <button onClick={onClose} style={{ flex: 1, background: theme.btnGhostBg, color: theme.btnGhostText, border: `1px solid ${theme.btnGhostBorder}`, padding: '12px', borderRadius: '10px', fontFamily: "'Cinzel Decorative', serif", fontSize: '0.82rem', cursor: 'pointer', letterSpacing: '0.04em' }}>
                Cancel
              </button>
              <button onClick={handleAdd} style={{ flex: 2, background: 'linear-gradient(135deg,#8B1A1A,#C9A84C)', color: '#FDF6E3', border: 'none', padding: '12px', borderRadius: '10px', fontFamily: "'Cinzel Decorative', serif", fontSize: '0.82rem', cursor: 'pointer', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <Check size={15} /> Add {cappedCount} Participant{cappedCount !== 1 ? 's' : ''}
              </button>
            </div>
          </div>
        )}

        {parsed && preview.length === 0 && (
          <div style={{ marginTop: '14px', padding: '14px', background: theme.errorBg, border: `1px solid ${theme.errorBorder}`, borderRadius: '10px', color: theme.errorText, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={15} /> No valid names detected. Try a different format.
          </div>
        )}
      </div>
    </div>
  )
}

export default PasteNamesModal
