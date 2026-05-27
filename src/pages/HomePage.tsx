import React, { useCallback, useEffect, useState } from 'react'
import { Users, Grid3X3, FileSpreadsheet, Zap, Search, Trash2, X } from 'lucide-react'
import Header from '@/components/layout/Header'
import StatsBar from '@/components/layout/StatsBar'
import ParticipantTable from '@/components/table/ParticipantTable'
import DasakamGrid from '@/components/ui/DasakamGrid'
import ImportExportPanel from '@/components/ui/ImportExportPanel'
import GenerateModal from '@/components/ui/GenerateModal'
import { useStore } from '@/store'
import { T } from '@/utils/i18n'
import { getTheme } from '@/utils/theme'
import { autoAllocateDasakams } from '@/utils/dasakam'
import type { Participant } from '@/types'

type Tab = 'participants' | 'grid' | 'import-export'

const HomePage: React.FC = () => {
  const {
    participants,
    lang,
    dark,
    searchQuery,
    addEmpty,
    generateRows,
    updateParticipant,
    removeParticipant,
    appendParticipants,
    clearAll,
    autoAllocate,
    clearDasakamAssignments,
    setLang,
    setDark,
    setSearchQuery,
    filteredParticipants,
  } = useStore()

  const t = T[lang]
  const theme = getTheme(dark)

  const [tab, setTab] = useState<Tab>('participants')
  const [showGenModal, setShowGenModal] = useState(false)
  const [showClearConfirm, setShowClearConfirm] = useState(false)
  const [windowW, setWindowW] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 800
  )

  useEffect(() => {
    const handler = () => setWindowW(window.innerWidth)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  const isMobile = windowW < 700

  const handleGenerate = useCallback(
    (count: number, doAutoAlloc: boolean) => {
      generateRows(count)
      if (doAutoAlloc) {
        // Timeout allows store update to complete before reallocating
        setTimeout(() => autoAllocate(), 60)
      }
    },
    [generateRows, autoAllocate]
  )

  const handleImport = useCallback(
    (imported: Participant[]) => {
      appendParticipants(imported)
    },
    [appendParticipants]
  )

  const filtered = filteredParticipants()

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'participants', label: t.tabs.participants, icon: <Users size={14} /> },
    { id: 'grid', label: t.tabs.grid, icon: <Grid3X3 size={14} /> },
    { id: 'import-export', label: t.tabs.importExport, icon: <FileSpreadsheet size={14} /> },
  ]

  const btnGhost: React.CSSProperties = {
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
    whiteSpace: 'nowrap' as const,
    transition: 'all 0.2s',
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: theme.bg,
        backgroundImage: theme.bgPattern,
        color: theme.text,
        transition: 'background 0.3s, color 0.3s',
      }}
    >
      {/* ── Header ── */}
      <Header lang={lang} setLang={setLang} dark={dark} setDark={setDark} t={t} theme={theme} />

      {/* ── Main ── */}
      <main
        style={{
          flex: 1,
          maxWidth: '1120px',
          width: '100%',
          margin: '0 auto',
          padding: isMobile ? '14px 12px' : '22px 24px',
          boxSizing: 'border-box',
        }}
      >
        {/* Stats */}
        <div style={{ marginTop: '16px' }}>
          <StatsBar participants={participants} t={t} theme={theme} />
        </div>

        {/* ── Toolbar ── */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
            alignItems: 'center',
            marginBottom: '18px',
          }}
        >
          {/* Generate rows */}
          <button
            onClick={() => setShowGenModal(true)}
            style={{
              background: theme.btnPrimaryBg,
              color: theme.btnPrimaryText,
              border: 'none',
              padding: '9px 18px',
              borderRadius: '6px',
              fontFamily: "'Cinzel Decorative', serif",
              fontSize: 'clamp(0.56rem, 1.4vw, 0.7rem)',
              letterSpacing: '0.04em',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              whiteSpace: 'nowrap',
              boxShadow: '0 2px 10px rgba(255,107,0,0.28)',
            }}
          >
            <Users size={14} />
            {t.toolbar.generate}
          </button>

          {/* Add one */}
          <button onClick={addEmpty} style={btnGhost}>
            {t.toolbar.addOne}
          </button>

          {/* Auto-allocate */}
          {participants.length > 0 && (
            <button
              onClick={autoAllocate}
              style={btnGhost}
              title="Evenly distribute all 100 Dasakams"
            >
              <Zap size={13} />
              {isMobile ? '' : t.toolbar.autoAlloc}
            </button>
          )}

          {/* Spacer */}
          <div style={{ flex: 1, minWidth: '0' }} />

          {/* Search */}
          <div
            style={{
              position: 'relative',
              width: isMobile ? '100%' : 'clamp(180px, 28vw, 320px)',
            }}
          >
            <Search
              size={15}
              style={{
                position: 'absolute',
                left: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: theme.textPlaceholder,
                pointerEvents: 'none',
              }}
            />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={t.toolbar.search}
              style={{
                width: '100%',
                padding: '9px 32px 9px 32px',
                border: `1.5px solid ${theme.inputBorder}`,
                borderRadius: '8px',
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '0.95rem',
                background: theme.inputBg,
                color: theme.inputText,
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s',
              }}
              onFocus={e => (e.currentTarget.style.borderColor = theme.inputBorderFocus)}
              onBlur={e => (e.currentTarget.style.borderColor = theme.inputBorder)}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute',
                  right: '8px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: theme.textPlaceholder,
                  display: 'flex',
                  alignItems: 'center',
                  padding: '2px',
                }}
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Clear All */}
          {participants.length > 0 && (
            <button
              onClick={() => setShowClearConfirm(true)}
              style={{
                ...btnGhost,
                color: theme.btnDangerText,
                border: `1px solid ${theme.btnDangerBorder}`,
              }}
            >
              <Trash2 size={13} />
              {isMobile ? '' : t.toolbar.clearAll}
            </button>
          )}
        </div>

        {/* ── Tabs ── */}
        <div
          style={{
            display: 'flex',
            gap: '4px',
            marginBottom: '18px',
            background: theme.tabBg,
            borderRadius: '10px',
            padding: '4px',
            border: `1px solid ${theme.tabBorder}`,
          }}
        >
          {tabs.map(tb => (
            <button
              key={tb.id}
              onClick={() => setTab(tb.id)}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: isMobile ? '9px 6px' : '10px 8px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontFamily: "'Cinzel Decorative', serif",
                fontSize: 'clamp(0.5rem, 1.3vw, 0.64rem)',
                letterSpacing: '0.04em',
                transition: 'all 0.2s',
                background:
                  tab === tb.id
                    ? 'linear-gradient(135deg, #8B1A1A, #C9A84C)'
                    : 'transparent',
                color: tab === tb.id ? '#FDF6E3' : theme.textMid,
                boxShadow:
                  tab === tb.id ? '0 2px 10px rgba(139,26,26,0.28)' : 'none',
                whiteSpace: 'nowrap',
              }}
            >
              {tb.icon}
              <span style={{ display: windowW < 360 ? 'none' : 'inline' }}>
                {tb.label}
              </span>
            </button>
          ))}
        </div>

        {/* ── Tab Content ── */}
        {tab === 'participants' && (
          <ParticipantTable
            participants={searchQuery ? filtered : participants}
            onUpdate={updateParticipant}
            onRemove={removeParticipant}
            onAddRow={addEmpty}
            isMobile={isMobile}
            t={t}
            theme={theme}
          />
        )}

        {tab === 'grid' && (
          <div
            style={{
              background: theme.surface,
              border: `1px solid ${theme.surfaceBorder}`,
              borderRadius: '12px',
              boxShadow: theme.surfaceShadow,
              padding: 'clamp(16px, 3vw, 24px)',
            }}
          >
            <DasakamGrid
              participants={participants}
              onClearAssignments={clearDasakamAssignments}
              t={t}
              theme={theme}
            />
          </div>
        )}

        {tab === 'import-export' && (
          <ImportExportPanel
            participants={participants}
            onImport={handleImport}
            t={t}
            theme={theme}
          />
        )}

        {/* ── Devotional Quote ── */}
        <div
          style={{
            marginTop: '32px',
            padding: 'clamp(14px, 3vw, 20px)',
            background: theme.quoteBg,
            border: `1px solid ${theme.quoteBorder}`,
            borderRadius: '10px',
            textAlign: 'center',
          }}
        >
          <p
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(0.88rem, 2vw, 1.05rem)',
              color: theme.textLight,
              fontStyle: 'italic',
              lineHeight: 1.8,
              whiteSpace: 'pre-line',
            }}
          >
            {t.quote}
          </p>
          <p
            style={{
              fontFamily: "'Cinzel Decorative', serif",
              fontSize: 'clamp(0.46rem, 1.2vw, 0.58rem)',
              color: '#C9A84C',
              letterSpacing: '0.1em',
              marginTop: '10px',
            }}
          >
            ✦ KRISHNAARPANAM · 100 DASAKAMS · 1036 SHLOKAS · GURUVAYURAPPAN ✦
          </p>
        </div>
      </main>

      {/* ── Footer ── */}
      <footer
        style={{
          textAlign: 'center',
          padding: '16px 20px',
          borderTop: `1px solid ${theme.footerBorder}`,
          background: theme.footerBg,
          marginTop: '24px',
        }}
      >
        <p
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(0.72rem, 1.8vw, 0.88rem)',
            color: theme.textLight,
            marginBottom: '4px',
          }}
        >
          {t.footer}
        </p>
        <p
          style={{
            fontFamily: "'Cinzel Decorative', serif",
            fontSize: 'clamp(0.46rem, 1.2vw, 0.58rem)',
            color: theme.textMid,
            letterSpacing: '0.06em',
          }}
        >
          {t.copyright}
        </p>
      </footer>

      {/* ── Modals ── */}
      {showGenModal && (
        <GenerateModal
          onGenerate={handleGenerate}
          onClose={() => setShowGenModal(false)}
          t={t}
          theme={theme}
        />
      )}

      {showClearConfirm && (
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
          onClick={e => e.target === e.currentTarget && setShowClearConfirm(false)}
        >
          <div
            style={{
              background: theme.modalBg,
              borderRadius: '16px',
              border: `1px solid ${theme.btnDangerBorder}`,
              boxShadow: '0 20px 60px rgba(0,0,0,0.35)',
              padding: '28px',
              maxWidth: '380px',
              width: '100%',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>⚠️</div>
            <h3
              style={{
                fontFamily: "'Cinzel Decorative', serif",
                fontSize: '0.88rem',
                color: theme.text,
                marginBottom: '10px',
              }}
            >
              {t.clear.title}
            </h3>
            <p
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '0.95rem',
                color: theme.textLight,
                marginBottom: '22px',
                lineHeight: 1.6,
              }}
            >
              {t.clear.body} {participants.length} {t.clear.bodyEnd}
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setShowClearConfirm(false)}
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
                {t.clear.cancel}
              </button>
              <button
                onClick={() => { clearAll(); setShowClearConfirm(false) }}
                style={{
                  flex: 1,
                  background: 'linear-gradient(135deg, #DC2626, #EF4444)',
                  color: '#fff',
                  border: 'none',
                  padding: '11px',
                  borderRadius: '6px',
                  fontFamily: "'Cinzel Decorative', serif",
                  fontSize: '0.66rem',
                  cursor: 'pointer',
                  letterSpacing: '0.04em',
                }}
              >
                {t.clear.confirm}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default HomePage
