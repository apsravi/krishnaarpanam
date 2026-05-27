import React, { useState } from 'react'
import { Users, Lock } from 'lucide-react'
import type { ThemeTokens } from '@/utils/theme'
import type { Translations } from '@/utils/i18n'

interface GenerateModalProps {
  onGenerate: (count: number, autoAllocate: boolean, cap: number | null) => void
  onClose: () => void
  currentCount: number
  existingCap: number | null
  t: Translations
  theme: ThemeTokens
}

const GenerateModal: React.FC<GenerateModalProps> = ({
  onGenerate, onClose, currentCount, existingCap, t, theme,
}) => {
  const [count, setCount] = useState('')
  const [autoAlloc, setAutoAlloc] = useState(false)
  const [lockRows, setLockRows] = useState(existingCap !== null)
  const [error, setError] = useState('')

  const handleSubmit = () => {
    const n = parseInt(count)
    if (!n || n < 1) { setError(t.generate.errMin); return }
    if (n > 200) { setError(t.generate.errMax); return }

    // If locking, cap = current + n
    const cap = lockRows ? currentCount + n : null

    // Check if adding n rows would exceed existing cap
    if (existingCap !== null && !lockRows) {
      const remaining = existingCap - currentCount
      if (n > remaining) {
        setError(`Only ${remaining} slot${remaining !== 1 ? 's' : ''} remaining (cap is ${existingCap})`)
        return
      }
    }

    onGenerate(n, autoAlloc, cap)
    onClose()
  }

  const remaining = existingCap !== null ? Math.max(0, existingCap - currentCount) : null

  const inpStyle: React.CSSProperties = {
    width: '100%', padding: '12px 14px',
    border: `1.5px solid ${theme.inputBorder}`, borderRadius: '8px',
    fontFamily: "'Cormorant Garamond', serif", fontSize: '1.1rem',
    color: theme.inputText, background: theme.inputBg,
    outline: 'none', boxSizing: 'border-box',
  }

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 1500, background: theme.modalOverlay, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', backdropFilter: 'blur(6px)' }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div style={{ background: theme.modalBg, borderRadius: '16px', border: `1px solid rgba(212,168,67,0.4)`, boxShadow: '0 20px 60px rgba(0,0,0,0.35)', padding: '28px', width: '100%', maxWidth: '420px' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: theme.badgeGradient, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={18} color="#FDF6E3" />
            </div>
            <h3 style={{ fontFamily: "'Cinzel Decorative', serif", fontSize: '0.85rem', color: theme.text, letterSpacing: '0.04em' }}>{t.generate.title}</h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: theme.textLight, fontSize: '1.2rem', lineHeight: 1 }}>✕</button>
        </div>

        {/* Cap notice — if one already exists */}
        {existingCap !== null && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', background: theme.statsBg, border: `1px solid ${theme.statsBorder}`, borderRadius: '8px', marginBottom: '16px' }}>
            <Lock size={14} color="#C9A84C" />
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '0.9rem', color: theme.textMid }}>
              Row cap active: <strong>{existingCap}</strong> total · <strong>{remaining}</strong> slot{remaining !== 1 ? 's' : ''} remaining
            </p>
          </div>
        )}

        {/* Count input */}
        <label style={{ fontFamily: "'Cinzel Decorative', serif", fontSize: '0.62rem', color: theme.textMid, letterSpacing: '0.08em', display: 'block', marginBottom: '8px' }}>
          {t.generate.countLabel}
        </label>
        <input
          type="number"
          value={count}
          onChange={e => { setCount(e.target.value); setError('') }}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          placeholder={existingCap !== null ? `Max ${remaining} more rows` : t.generate.countPlaceholder}
          min="1" max={existingCap !== null ? remaining ?? 200 : 200}
          autoFocus
          style={inpStyle}
        />
        {error && <p style={{ fontSize: '0.78rem', color: theme.errorText, fontFamily: "'Cormorant Garamond', serif", marginTop: '6px' }}>{error}</p>}

        {/* Lock rows toggle */}
        <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer', marginTop: '14px', padding: '12px', background: theme.statsBg, borderRadius: '8px', border: `1px solid ${theme.statsBorder}` }}>
          <input
            type="checkbox"
            checked={lockRows}
            onChange={e => setLockRows(e.target.checked)}
            style={{ accentColor: '#C9A84C', marginTop: '3px', flexShrink: 0 }}
          />
          <div>
            <div style={{ fontFamily: "'Cinzel Decorative', serif", fontSize: '0.62rem', color: theme.textMid, letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Lock size={11} /> Set as maximum row limit
            </div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '0.84rem', color: theme.textLight, fontStyle: 'italic', marginTop: '3px' }}>
              {count && parseInt(count) > 0
                ? `App will allow exactly ${currentCount + parseInt(count)} rows total — no more can be added`
                : 'Once set, the app will not allow more rows to be added beyond this number'}
            </div>
          </div>
        </label>

        {/* Auto-allocate toggle */}
        <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer', marginTop: '10px', marginBottom: '22px', padding: '12px', background: theme.statsBg, borderRadius: '8px', border: `1px solid ${theme.statsBorder}` }}>
          <input
            type="checkbox"
            checked={autoAlloc}
            onChange={e => setAutoAlloc(e.target.checked)}
            style={{ accentColor: '#C9A84C', marginTop: '3px', flexShrink: 0 }}
          />
          <div>
            <div style={{ fontFamily: "'Cinzel Decorative', serif", fontSize: '0.62rem', color: theme.textMid, letterSpacing: '0.05em' }}>
              {t.generate.autoLabel}
            </div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '0.84rem', color: theme.textLight, fontStyle: 'italic', marginTop: '3px' }}>
              {t.generate.autoSub}
            </div>
          </div>
        </label>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={onClose} style={{ flex: 1, background: theme.btnGhostBg, color: theme.btnGhostText, border: `1px solid ${theme.btnGhostBorder}`, padding: '11px', borderRadius: '6px', fontFamily: "'Cinzel Decorative', serif", fontSize: '0.66rem', cursor: 'pointer', letterSpacing: '0.04em' }}>
            {t.generate.cancel}
          </button>
          <button onClick={handleSubmit} style={{ flex: 2, background: theme.btnPrimaryBg, color: theme.btnPrimaryText, border: 'none', padding: '11px', borderRadius: '6px', fontFamily: "'Cinzel Decorative', serif", fontSize: '0.66rem', cursor: 'pointer', letterSpacing: '0.04em', boxShadow: '0 2px 10px rgba(255,107,0,0.3)' }}>
            {t.generate.submit}
          </button>
        </div>
      </div>
    </div>
  )
}

export default GenerateModal
