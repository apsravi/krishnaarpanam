import React, { useState } from 'react'
import type { Participant } from '@/types'
import type { ThemeTokens } from '@/utils/theme'
import type { Translations } from '@/utils/i18n'
import { formatDasakam, computeStats } from '@/utils/dasakam'

interface WhatsAppModalProps {
  participants: Participant[]
  t: Translations
  theme: ThemeTokens
  onClose: () => void
}

const WhatsAppModal: React.FC<WhatsAppModalProps> = ({ participants, t, theme, onClose }) => {
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')

  const buildMessage = () => {
    const lines = [t.whatsappText, '']
    participants.forEach((p, i) => {
      lines.push(
        `${i + 1}. ${p.name} — ${formatDasakam(p.dasakams) || '—'}${p.contactNumber ? ` (${p.contactNumber})` : ''}`
      )
    })
    const stats = computeStats(participants)
    lines.push('')
    lines.push(`📊 ${t.stats.participants}: ${participants.length} | ${t.stats.covered}: ${stats.allocated.length}/100`)
    lines.push('')
    lines.push('— Krishnaarpanam | © Aparnaa Ravi 2026')
    return encodeURIComponent(lines.join('\n'))
  }

  const handleSend = () => {
    const cleaned = phone.replace(/[\s\-().]/g, '')
    if (!cleaned.match(/^\+?\d{7,15}$/)) {
      setError(t.exportPanel.whatsappErr)
      return
    }
    const num = cleaned.replace(/^\+/, '')
    window.open(`https://wa.me/${num}?text=${buildMessage()}`, '_blank')
    onClose()
  }

  return (
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
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          background: theme.modalBg,
          borderRadius: '16px',
          border: `1px solid rgba(37,211,102,0.3)`,
          boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
          padding: '28px',
          width: '100%',
          maxWidth: '420px',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #25D366, #128C7E)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.3rem',
              }}
            >
              📲
            </div>
            <h3
              style={{
                fontFamily: "'Cinzel Decorative', serif",
                fontSize: '1.2rem',
                color: theme.text,
                letterSpacing: '0.04em',
              }}
            >
              {t.exportPanel.whatsappTitle}
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: theme.textLight, fontSize: '1.3rem' }}
          >
            ✕
          </button>
        </div>

        {/* Phone input */}
        <label
          style={{
            fontFamily: "'Cinzel Decorative', serif",
            fontSize: '1.2rem',
            color: theme.textMid,
            letterSpacing: '0.08em',
            display: 'block',
            marginBottom: '8px',
          }}
        >
          {t.exportPanel.whatsappLabel}
        </label>
        <input
          value={phone}
          onChange={e => { setPhone(e.target.value); setError('') }}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder={t.exportPanel.whatsappPlaceholder}
          type="tel"
          autoFocus
          style={{
            width: '100%',
            padding: '12px 14px',
            border: `1.5px solid ${theme.inputBorder}`,
            borderRadius: '8px',
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '1.3rem',
            color: theme.inputText,
            background: theme.inputBg,
            outline: 'none',
            boxSizing: 'border-box',
          }}
        />
        {error && (
          <p style={{ fontSize: '1.3rem', color: theme.errorText, fontFamily: "'Cormorant Garamond', serif", marginTop: '5px' }}>
            {error}
          </p>
        )}

        {/* Note */}
        <p
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '1.2rem',
            color: theme.textLight,
            fontStyle: 'italic',
            marginTop: '10px',
            marginBottom: '16px',
            lineHeight: 1.5,
          }}
        >
          {t.exportPanel.whatsappNote}
        </p>

        {/* Preview */}
        <div
          style={{
            background: theme.statsBg,
            borderRadius: '8px',
            padding: '10px 14px',
            marginBottom: '20px',
            border: `1px solid ${theme.statsBorder}`,
          }}
        >
          {participants.slice(0, 3).map(p => (
            <p
              key={p.id}
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '1.2rem',
                color: theme.textLight,
                lineHeight: 1.6,
              }}
            >
              📿 {p.name} — {formatDasakam(p.dasakams) || '—'}
            </p>
          ))}
          {participants.length > 3 && (
            <p style={{ color: theme.textMid, fontFamily: "'Cormorant Garamond', serif", fontSize: '1.2rem', marginTop: '4px' }}>
              …and {participants.length - 3} more
            </p>
          )}
        </div>

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
              fontSize: '1.3rem',
              cursor: 'pointer',
              letterSpacing: '0.04em',
            }}
          >
            {t.exportPanel.cancel}
          </button>
          <button
            onClick={handleSend}
            style={{
              flex: 2,
              background: 'linear-gradient(135deg, #25D366, #128C7E)',
              color: '#fff',
              border: 'none',
              padding: '11px',
              borderRadius: '6px',
              fontFamily: "'Cinzel Decorative', serif",
              fontSize: '1.3rem',
              cursor: 'pointer',
              letterSpacing: '0.04em',
              boxShadow: '0 2px 10px rgba(37,211,102,0.3)',
            }}
          >
            {t.exportPanel.whatsappSend}
          </button>
        </div>
      </div>
    </div>
  )
}

export default WhatsAppModal
