import React, { useState } from 'react'
import { Users } from 'lucide-react'
import type { ThemeTokens } from '@/utils/theme'
import type { Translations } from '@/utils/i18n'

interface GenerateModalProps {
  onGenerate: (count: number, autoAllocate: boolean) => void
  onClose: () => void
  t: Translations
  theme: ThemeTokens
}

const GenerateModal: React.FC<GenerateModalProps> = ({ onGenerate, onClose, t, theme }) => {
  const [count, setCount] = useState('')
  const [autoAlloc, setAutoAlloc] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = () => {
    const n = parseInt(count)
    if (!n || n < 1) { setError(t.generate.errMin); return }
    if (n > 200) { setError(t.generate.errMax); return }
    onGenerate(n, autoAlloc)
    onClose()
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 14px',
    border: `1.5px solid ${theme.inputBorder}`,
    borderRadius: '8px',
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: '1.1rem',
    color: theme.inputText,
    background: theme.inputBg,
    outline: 'none',
    boxSizing: 'border-box',
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1500,
        background: theme.modalOverlay,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        backdropFilter: 'blur(6px)',
      }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          background: theme.modalBg,
          borderRadius: '16px',
          border: `1px solid rgba(212,168,67,0.4)`,
          boxShadow: '0 20px 60px rgba(0,0,0,0.35)',
          padding: '28px',
          width: '100%',
          maxWidth: '400px',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: theme.badgeGradient,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Users size={18} color="#FDF6E3" />
            </div>
            <h3
              style={{
                fontFamily: "'Cinzel Decorative', serif",
                fontSize: '0.85rem',
                color: theme.text,
                letterSpacing: '0.04em',
              }}
            >
              {t.generate.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: theme.textLight, fontSize: '1.2rem', lineHeight: 1 }}
          >
            ✕
          </button>
        </div>

        {/* Count input */}
        <label
          style={{
            fontFamily: "'Cinzel Decorative', serif",
            fontSize: '0.62rem',
            color: theme.textMid,
            letterSpacing: '0.08em',
            display: 'block',
            marginBottom: '8px',
          }}
        >
          {t.generate.countLabel}
        </label>
        <input
          type="number"
          value={count}
          onChange={e => { setCount(e.target.value); setError('') }}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          placeholder={t.generate.countPlaceholder}
          min="1"
          max="200"
          autoFocus
          style={inputStyle}
        />
        {error && (
          <p style={{ fontSize: '0.78rem', color: theme.errorText, fontFamily: "'Cormorant Garamond', serif", marginTop: '6px' }}>
            {error}
          </p>
        )}

        {/* Auto-allocate toggle */}
        <label
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px',
            cursor: 'pointer',
            marginTop: '16px',
            marginBottom: '22px',
            padding: '13px',
            background: theme.statsBg,
            borderRadius: '8px',
            border: `1px solid ${theme.statsBorder}`,
          }}
        >
          <input
            type="checkbox"
            checked={autoAlloc}
            onChange={e => setAutoAlloc(e.target.checked)}
            style={{ accentColor: theme.checkboxAccent, marginTop: '2px', flexShrink: 0 }}
          />
          <div>
            <div
              style={{
                fontFamily: "'Cinzel Decorative', serif",
                fontSize: '0.62rem',
                color: theme.textMid,
                letterSpacing: '0.05em',
              }}
            >
              {t.generate.autoLabel}
            </div>
            <div
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '0.85rem',
                color: theme.textLight,
                fontStyle: 'italic',
                marginTop: '3px',
              }}
            >
              {t.generate.autoSub}
            </div>
          </div>
        </label>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              background: theme.btnGhostBg,
              color: theme.btnGhostText,
              border: `1px solid ${theme.btnGhostBorder}`,
              padding: '11px',
              borderRadius: '6px',
              fontFamily: "'Cinzel Decorative', serif",
              fontSize: '0.66rem',
              cursor: 'pointer',
              letterSpacing: '0.04em',
            }}
          >
            {t.generate.cancel}
          </button>
          <button
            onClick={handleSubmit}
            style={{
              flex: 2,
              background: theme.btnPrimaryBg,
              color: theme.btnPrimaryText,
              border: 'none',
              padding: '11px',
              borderRadius: '6px',
              fontFamily: "'Cinzel Decorative', serif",
              fontSize: '0.66rem',
              cursor: 'pointer',
              letterSpacing: '0.04em',
              boxShadow: '0 2px 10px rgba(255,107,0,0.3)',
            }}
          >
            {t.generate.submit}
          </button>
        </div>
      </div>
    </div>
  )
}

export default GenerateModal
