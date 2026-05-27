import React from 'react'
import type { ThemeTokens } from '@/utils/theme'

interface LoadingOverlayProps {
  message?: string
  theme: ThemeTokens
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ message = 'Generating…', theme }) => {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 3000,
      background: theme.modalOverlay,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backdropFilter: 'blur(4px)',
    }}>
      <div style={{
        background: theme.modalBg,
        border: `1px solid rgba(201,168,76,0.35)`,
        borderRadius: '16px',
        padding: '36px 48px',
        textAlign: 'center',
        boxShadow: '0 20px 60px rgba(0,0,0,0.35)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px',
      }}>
        {/* Animated lotus spinner */}
        <div style={{ position: 'relative', width: '64px', height: '64px' }}>
          {/* Rotating outer ring */}
          <div style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            border: '3px solid transparent',
            borderTopColor: '#C9A84C',
            borderRightColor: '#FF6B00',
            animation: 'spin 1s linear infinite',
          }} />
          {/* Inner ring opposite */}
          <div style={{
            position: 'absolute',
            inset: '8px',
            borderRadius: '50%',
            border: '2px solid transparent',
            borderBottomColor: '#8B1A1A',
            borderLeftColor: '#C9A84C',
            animation: 'spin 0.7s linear infinite reverse',
          }} />
          {/* Om center */}
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.4rem',
            color: '#C9A84C',
            animation: 'pulse 1.5s ease-in-out infinite',
          }}>
            ॐ
          </div>
        </div>

        <div>
          <p style={{
            fontFamily: "'Cinzel Decorative', serif",
            fontSize: '1.3rem',
            color: theme.textMid,
            letterSpacing: '0.08em',
            marginBottom: '4px',
          }}>
            {message}
          </p>
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '1.2rem',
            color: theme.textLight,
            fontStyle: 'italic',
          }}>
            Please wait…
          </p>
        </div>

        {/* Animated dots */}
        <div style={{ display: 'flex', gap: '6px' }}>
          {[0, 1, 2].map(i => (
            <div
              key={i}
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: i === 0 ? '#FF6B00' : i === 1 ? '#C9A84C' : '#8B1A1A',
                animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Inline keyframes via style tag */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.7; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.1); }
        }
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.6; }
          40% { transform: translateY(-8px); opacity: 1; }
        }
      `}</style>
    </div>
  )
}

export default LoadingOverlay
