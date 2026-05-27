import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Lock, Eye, EyeOff, RefreshCw, LogIn } from 'lucide-react'
import { GURUVAYURAPPAN_COLOR_IMG } from '@/assets/guruvayurappan_color'
import {
  isPinSet, setPin, verifyPin, isLockedOut, isSessionValid, getFailedAttempts,
} from '@/utils/auth'

interface PinLoginProps {
  onAuthenticated: () => void
  dark: boolean
}

type Mode = 'login' | 'setup'

const PinLogin: React.FC<PinLoginProps> = ({ onAuthenticated, dark }) => {
  const [mode, setMode]           = useState<Mode>(isPinSet() ? 'login' : 'setup')
  const [pin, setPin_]            = useState('')
  const [confirmPin, setConfirm]  = useState('')
  const [showPin, setShowPin]     = useState(false)
  const [error, setError]         = useState('')
  const [loading, setLoading]     = useState(false)
  const [lockInfo, setLockInfo]   = useState({ locked: false, remainingMs: 0 })
  const [attemptsLeft, setLeft]   = useState(3)
  const inputRef = useRef<HTMLInputElement>(null)

  // Poll lockout countdown
  useEffect(() => {
    const tick = () => {
      const info = isLockedOut()
      setLockInfo(info)
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 100)
  }, [mode])

  const formatCountdown = (ms: number) => {
    const m = Math.floor(ms / 60000)
    const s = Math.floor((ms % 60000) / 1000)
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  const handleLogin = useCallback(async () => {
    if (pin.length < 4) { setError('Enter your PIN'); return }
    setLoading(true)
    const res = await verifyPin(pin)
    setLoading(false)
    if (res.ok) {
      onAuthenticated()
    } else if (res.locked) {
      setError('Too many attempts. App locked.')
      setLeft(0)
    } else {
      setPin_('')
      setLeft(res.attemptsLeft)
      setError(`Incorrect PIN. ${res.attemptsLeft} attempt${res.attemptsLeft !== 1 ? 's' : ''} remaining.`)
    }
  }, [pin, onAuthenticated])

  const handleSetup = useCallback(async () => {
    if (pin.length < 4) { setError('PIN must be at least 4 digits'); return }
    if (pin !== confirmPin) { setError('PINs do not match'); return }
    setLoading(true)
    await setPin(pin)
    setLoading(false)
    onAuthenticated()
  }, [pin, confirmPin, onAuthenticated])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') mode === 'login' ? handleLogin() : handleSetup()
  }

  const bg    = dark ? '#0F0A05' : '#FDF6E3'
  const surf  = dark ? 'rgba(28,16,5,0.97)' : 'rgba(253,246,227,0.98)'
  const text  = dark ? '#F5E6C8' : '#1C1008'
  const mid   = dark ? '#C9A84C' : '#8B6914'
  const light = dark ? '#9B8A70' : '#8B7355'
  const bord  = dark ? 'rgba(201,168,76,0.25)' : 'rgba(201,168,76,0.4)'
  const inpBg = dark ? 'rgba(255,255,255,0.05)' : 'transparent'

  return (
    <div style={{
      minHeight: '100vh', width: '100%',
      background: bg,
      backgroundImage: dark
        ? 'radial-gradient(circle at 20% 20%, rgba(255,107,0,0.06) 0%, transparent 50%)'
        : 'radial-gradient(circle at 20% 20%, rgba(255,107,0,0.04) 0%, transparent 50%)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '20px',
      fontFamily: "'Cormorant Garamond', Georgia, serif",
    }}>
      {/* Pillayar Suzhi */}
      <div style={{ fontSize: '2rem', color: '#C9A84C', marginBottom: '8px', opacity: 0.85 }}>ஃ</div>

      {/* Logo */}
      <div style={{
        width: '88px', height: '88px', borderRadius: '50%',
        overflow: 'hidden', border: '3px solid #FFD700',
        boxShadow: '0 0 32px rgba(255,165,0,0.45)',
        marginBottom: '18px', flexShrink: 0, background: '#FFF8E1',
      }}>
        <img src={GURUVAYURAPPAN_COLOR_IMG} alt="Guruvayurappan"
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 10%' }}
          onError={e => {
            const el = e.currentTarget as HTMLImageElement
            el.style.display = 'none'
            el.parentElement!.innerHTML = '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:2.5rem;color:#C9A84C">ॐ</div>'
          }}
        />
      </div>

      {/* App name */}
      <h1 style={{
        fontFamily: "'Cinzel Decorative', serif",
        fontSize: 'clamp(1.4rem, 4vw, 2.2rem)',
        color: '#C9A84C', textAlign: 'center', marginBottom: '4px',
        textShadow: '0 2px 12px rgba(201,168,76,0.3)',
      }}>
        Krishnaarpanam
      </h1>
      <p style={{
        fontFamily: "'Cinzel Decorative', serif",
        fontSize: 'clamp(0.6rem, 1.5vw, 0.78rem)',
        color: mid, letterSpacing: '0.12em', marginBottom: '32px',
      }}>
        NARAYANEEYAM · DASAKAM RECITATION MANAGER
      </p>

      {/* Card */}
      <div style={{
        background: surf,
        border: `1px solid ${bord}`,
        borderRadius: '20px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
        padding: 'clamp(24px, 5vw, 40px)',
        width: '100%', maxWidth: '380px',
      }}>
        {/* Card title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '50%',
            background: 'linear-gradient(135deg,#8B1A1A,#C9A84C)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <Lock size={16} color="#FDF6E3" />
          </div>
          <div>
            <h2 style={{ fontFamily: "'Cinzel Decorative', serif", fontSize: '0.95rem', color: text, letterSpacing: '0.04em' }}>
              {mode === 'login' ? 'Enter PIN' : 'Create PIN'}
            </h2>
            <p style={{ fontSize: '0.88rem', color: light, fontStyle: 'italic' }}>
              {mode === 'login' ? 'Enter your PIN to access the app' : 'Set a PIN to secure the app'}
            </p>
          </div>
        </div>

        {/* Lockout */}
        {lockInfo.locked && (
          <div style={{ padding: '12px 16px', background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.3)', borderRadius: '10px', marginBottom: '16px', display: 'flex', gap: '10px', alignItems: 'center' }}>
            <RefreshCw size={14} color="#DC2626" />
            <p style={{ color: '#DC2626', fontSize: '0.95rem' }}>
              Locked. Try again in <strong>{formatCountdown(lockInfo.remainingMs)}</strong>
            </p>
          </div>
        )}

        {/* PIN input */}
        <div style={{ marginBottom: '14px' }}>
          <label style={{ fontFamily: "'Cinzel Decorative', serif", fontSize: '0.76rem', color: mid, letterSpacing: '0.07em', display: 'block', marginBottom: '8px' }}>
            {mode === 'login' ? 'PIN' : 'New PIN (minimum 4 digits)'}
          </label>
          <div style={{ position: 'relative' }}>
            <input
              ref={inputRef}
              type={showPin ? 'text' : 'password'}
              inputMode="numeric"
              pattern="[0-9]*"
              value={pin}
              onChange={e => { setPin_(e.target.value.replace(/\D/g, '').slice(0, 8)); setError('') }}
              onKeyDown={handleKeyDown}
              disabled={lockInfo.locked || loading}
              placeholder="••••"
              style={{
                width: '100%', padding: '14px 44px 14px 16px',
                border: `2px solid ${error ? '#DC2626' : bord}`,
                borderRadius: '10px', fontSize: '1.5rem',
                letterSpacing: '0.3em',
                background: inpBg, color: text,
                fontFamily: "'Cinzel Decorative', serif",
                outline: 'none', boxSizing: 'border-box',
                transition: 'border-color 0.2s',
              }}
              onFocus={e => { if (!error) e.currentTarget.style.borderColor = '#C9A84C' }}
              onBlur={e => { if (!error) e.currentTarget.style.borderColor = bord }}
            />
            <button
              type="button"
              onClick={() => setShowPin(s => !s)}
              style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: mid, display: 'flex', alignItems: 'center', padding: '4px' }}
              aria-label={showPin ? 'Hide PIN' : 'Show PIN'}
            >
              {showPin ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Confirm PIN (setup only) */}
        {mode === 'setup' && (
          <div style={{ marginBottom: '14px' }}>
            <label style={{ fontFamily: "'Cinzel Decorative', serif", fontSize: '0.76rem', color: mid, letterSpacing: '0.07em', display: 'block', marginBottom: '8px' }}>
              Confirm PIN
            </label>
            <input
              type={showPin ? 'text' : 'password'}
              inputMode="numeric"
              pattern="[0-9]*"
              value={confirmPin}
              onChange={e => { setConfirm(e.target.value.replace(/\D/g, '').slice(0, 8)); setError('') }}
              onKeyDown={handleKeyDown}
              placeholder="••••"
              style={{
                width: '100%', padding: '14px 16px',
                border: `2px solid ${error ? '#DC2626' : bord}`,
                borderRadius: '10px', fontSize: '1.5rem',
                letterSpacing: '0.3em',
                background: inpBg, color: text,
                fontFamily: "'Cinzel Decorative', serif",
                outline: 'none', boxSizing: 'border-box',
              }}
            />
          </div>
        )}

        {/* Error */}
        {error && (
          <p style={{ color: '#DC2626', fontSize: '0.92rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            ⚠ {error}
          </p>
        )}

        {/* Attempts indicator */}
        {mode === 'login' && !lockInfo.locked && attemptsLeft < 3 && (
          <div style={{ display: 'flex', gap: '6px', marginBottom: '14px' }}>
            {[0,1,2].map(i => (
              <div key={i} style={{ width: '10px', height: '10px', borderRadius: '50%', background: i < attemptsLeft ? '#16A34A' : '#DC2626', transition: 'background 0.3s' }} />
            ))}
            <span style={{ fontSize: '0.85rem', color: light, marginLeft: '4px' }}>{attemptsLeft} attempt{attemptsLeft !== 1 ? 's' : ''} left</span>
          </div>
        )}

        {/* Submit button */}
        <button
          onClick={mode === 'login' ? handleLogin : handleSetup}
          disabled={lockInfo.locked || loading}
          style={{
            width: '100%', padding: '14px',
            background: lockInfo.locked ? 'rgba(139,26,26,0.3)' : 'linear-gradient(135deg,#8B1A1A,#C9A84C)',
            color: '#FDF6E3', border: 'none', borderRadius: '10px',
            fontFamily: "'Cinzel Decorative', serif", fontSize: '0.88rem',
            letterSpacing: '0.06em', cursor: lockInfo.locked ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            boxShadow: lockInfo.locked ? 'none' : '0 4px 16px rgba(139,26,26,0.3)',
            opacity: lockInfo.locked ? 0.6 : 1, transition: 'all 0.2s',
          }}
        >
          {loading ? '...' : <><LogIn size={16} /> {mode === 'login' ? 'Unlock App' : 'Set PIN & Enter'}</>}
        </button>

        {/* Footer note */}
        <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '0.85rem', color: light, fontStyle: 'italic' }}>
          {mode === 'setup'
            ? 'This PIN protects the app on this device. Use 4–8 digits.'
            : 'PIN is stored securely on this device only.'}
        </p>
      </div>

      {/* Copyright */}
      <p style={{ marginTop: '24px', fontFamily: "'Cinzel Decorative', serif", fontSize: '0.72rem', color: mid, letterSpacing: '0.06em', opacity: 0.7 }}>
        © Aparnaa Ravi 2026. All rights reserved.
      </p>
    </div>
  )
}

export default PinLogin
