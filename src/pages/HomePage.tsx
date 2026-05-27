import React, { useCallback, useEffect, useState } from 'react'
import { Users, Grid3X3, FileSpreadsheet, Zap, Search, Trash2, X, ClipboardPaste } from 'lucide-react'
import Header from '@/components/layout/Header'
import StatsBar from '@/components/layout/StatsBar'
import ParticipantTable from '@/components/table/ParticipantTable'
import DasakamGrid from '@/components/ui/DasakamGrid'
import ImportExportPanel from '@/components/ui/ImportExportPanel'
import GenerateModal from '@/components/ui/GenerateModal'
import ColumnManager from '@/components/ui/ColumnManager'
import LoadingOverlay from '@/components/ui/LoadingOverlay'
import PasteNamesModal from '@/components/ui/PasteNamesModal'
import { useStore } from '@/store'
import { T } from '@/utils/i18n'
import { getTheme } from '@/utils/theme'
import type { Participant, Column } from '@/types'
import { generateId } from '@/utils/id'

type Tab = 'participants' | 'grid' | 'import-export'

interface HomePageProps { onSignOut: () => void }

const HomePage: React.FC<HomePageProps> = ({ onSignOut }) => {
  const {
    participants,
    lang, dark, searchQuery,
    columns, pagination, isLoading,
    rowCap, setRowCap,
    addEmpty, generateRows, updateParticipant, removeParticipant,
    appendParticipants, clearAll, autoAllocate, clearDasakamAssignments,
    setLang, setDark, setSearchQuery,
    toggleColumnVisibility, addCustomColumn, removeCustomColumn, updateColumnLabel, resetColumns,
    setPage, setPageSize,
    filteredParticipants, paginatedParticipants, totalPages,
    canAddMore, remainingSlots,
  } = useStore()

  const t = T[lang]
  const theme = getTheme(dark)

  const [tab, setTab] = useState<Tab>('participants')
  const [showGenModal, setShowGenModal] = useState(false)
  const [showClearConfirm, setShowClearConfirm] = useState(false)
  const [showPasteModal, setShowPasteModal] = useState(false)
  const [windowW, setWindowW] = useState(typeof window !== 'undefined' ? window.innerWidth : 800)

  useEffect(() => {
    const handler = () => setWindowW(window.innerWidth)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  const isMobile = windowW < 700

  const handleGenerate = useCallback((count: number, doAutoAlloc: boolean, cap: number | null) => {
    generateRows(count, cap)
    if (doAutoAlloc) setTimeout(() => autoAllocate(), 500)
  }, [generateRows, autoAllocate])

  const handleImport = useCallback((imported: Participant[]) => {
    appendParticipants(imported)
  }, [appendParticipants])

  const handlePasteNames = useCallback((names: string[]) => {
    const rows = names.map(name => ({
      id: generateId(),
      name,
      dasakams: [] as number[],
      contactNumber: '',
      notes: '',
      createdAt: new Date().toISOString(),
    }))
    appendParticipants(rows)
  }, [appendParticipants])

  const filtered = filteredParticipants()
  const paginated = paginatedParticipants()
  const pages = totalPages()

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'participants', label: t.tabs.participants, icon: <Users size={14} /> },
    { id: 'grid', label: t.tabs.grid, icon: <Grid3X3 size={14} /> },
    { id: 'import-export', label: t.tabs.importExport, icon: <FileSpreadsheet size={14} /> },
  ]

  const btnGhost: React.CSSProperties = {
    background: theme.btnGhostBg, color: theme.btnGhostText,
    border: `1px solid ${theme.btnGhostBorder}`,
    padding: '11px 18px', borderRadius: '8px',
    fontFamily: "'Cinzel Decorative', serif",
    fontSize: 'clamp(0.86rem,1.6vw,1rem)',
    letterSpacing: '0.04em', cursor: 'pointer',
    display: 'inline-flex', alignItems: 'center', gap: '6px',
    whiteSpace: 'nowrap' as const, transition: 'all 0.2s',
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      background: theme.bg, backgroundImage: theme.bgPattern,
      color: theme.text, transition: 'background 0.3s, color 0.3s',
    }}>
      {/* Loading overlay */}
      {isLoading && <LoadingOverlay message="Generating rows…" theme={theme} />}

      {/* Header */}
      <Header lang={lang} setLang={setLang} dark={dark} setDark={setDark} onSignOut={onSignOut} t={t} theme={theme} />

      {/* Main */}
      <main style={{
        flex: 1, maxWidth: '1140px', width: '100%', margin: '0 auto',
        padding: isMobile ? '14px 12px' : '22px 24px', boxSizing: 'border-box',
      }}>
        <div style={{ marginTop: '16px' }}>
          <StatsBar participants={participants} t={t} theme={theme} />
        </div>

        {/* Toolbar */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center', marginBottom: '18px' }}>
          {/* Generate rows */}
          <button
            onClick={() => setShowGenModal(true)}
            style={{
              background: theme.btnPrimaryBg, color: theme.btnPrimaryText, border: 'none',
              padding: '9px 18px', borderRadius: '6px',
              fontFamily: "'Cinzel Decorative', serif",
              fontSize: 'clamp(0.86rem,1.6vw,1rem)', letterSpacing: '0.04em',
              cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px',
              whiteSpace: 'nowrap', boxShadow: '0 2px 10px rgba(255,107,0,0.28)',
            }}
          >
            <Users size={14} /> {t.toolbar.generate}
          </button>

          {/* Paste names */}
          <button
            onClick={() => setShowPasteModal(true)}
            style={{ ...btnGhost }}
            title="Paste a list of names"
          >
            <ClipboardPaste size={14} />
            {isMobile ? '' : 'Paste Names'}
          </button>

          {/* Add one — respects row cap */}
          <button
            onClick={addEmpty}
            disabled={!canAddMore()}
            title={!canAddMore() ? `Row cap reached (${rowCap} max)` : t.toolbar.addOne}
            style={{ ...btnGhost, opacity: canAddMore() ? 1 : 0.4, cursor: canAddMore() ? 'pointer' : 'not-allowed' }}
          >
            {t.toolbar.addOne}
          </button>

          {/* Row cap badge */}
          {rowCap !== null && (
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '5px',
              padding: '5px 10px',
              background: remainingSlots() === 0
                ? 'rgba(220,38,38,0.1)'
                : 'rgba(201,168,76,0.1)',
              border: `1px solid ${remainingSlots() === 0 ? 'rgba(220,38,38,0.35)' : theme.statsBorder}`,
              borderRadius: '20px',
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '1.2rem',
              color: remainingSlots() === 0 ? theme.btnDangerText : theme.textMid,
            }}>
              🔒 {remainingSlots() === 0 ? 'Cap reached' : `${remainingSlots()} of ${rowCap} left`}
              <button
                onClick={() => setRowCap(null)}
                title="Remove row cap"
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: theme.textLight, fontSize: '1.3rem', padding: '0 2px', lineHeight: 1 }}
              >✕</button>
            </div>
          )}

          {/* Auto-allocate */}
          {participants.length > 0 && (
            <button onClick={autoAllocate} style={btnGhost} title="Evenly distribute all 100 Dasakams">
              <Zap size={13} />
              {isMobile ? '' : t.toolbar.autoAlloc}
            </button>
          )}

          {/* Column manager */}
          <ColumnManager
            columns={columns}
            onToggle={toggleColumnVisibility}
            onAdd={addCustomColumn}
            onRemove={removeCustomColumn}
            onUpdateLabel={updateColumnLabel}
            onReset={resetColumns}
            t={t}
            theme={theme}
          />

          {/* Spacer */}
          <div style={{ flex: 1, minWidth: 0 }} />

          {/* Search */}
          <div style={{ position: 'relative', width: isMobile ? '100%' : 'clamp(180px,28vw,320px)' }}>
            <Search size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: theme.textPlaceholder, pointerEvents: 'none' }} />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={t.toolbar.search}
              style={{
                width: '100%', padding: '9px 32px 9px 32px',
                border: `1.5px solid ${theme.inputBorder}`, borderRadius: '8px',
                fontFamily: "'Cormorant Garamond', serif", fontSize: '1.3rem',
                background: theme.inputBg, color: theme.inputText, outline: 'none',
                boxSizing: 'border-box', transition: 'border-color 0.2s',
              }}
              onFocus={e => (e.currentTarget.style.borderColor = theme.inputBorderFocus)}
              onBlur={e => (e.currentTarget.style.borderColor = theme.inputBorder)}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: theme.textPlaceholder, display: 'flex', alignItems: 'center', padding: '2px' }}>
                <X size={13} />
              </button>
            )}
          </div>

          {/* Clear All */}
          {participants.length > 0 && (
            <button onClick={() => setShowClearConfirm(true)} style={{ ...btnGhost, color: theme.btnDangerText, border: `1px solid ${theme.btnDangerBorder}` }}>
              <Trash2 size={13} />
              {isMobile ? '' : t.toolbar.clearAll}
            </button>
          )}
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex', gap: '4px', marginBottom: '18px',
          background: theme.tabBg, borderRadius: '10px',
          padding: '4px', border: `1px solid ${theme.tabBorder}`,
        }}>
          {tabs.map(tb => (
            <button
              key={tb.id}
              onClick={() => setTab(tb.id)}
              style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                padding: isMobile ? '11px 6px' : '12px 10px', borderRadius: '8px',
                border: 'none', cursor: 'pointer',
                fontFamily: "'Cinzel Decorative', serif",
                fontSize: 'clamp(0.8rem,1.5vw,0.9rem)', letterSpacing: '0.04em',
                transition: 'all 0.2s',
                background: tab === tb.id ? 'linear-gradient(135deg,#8B1A1A,#C9A84C)' : 'transparent',
                color: tab === tb.id ? '#FDF6E3' : theme.textMid,
                boxShadow: tab === tb.id ? '0 2px 10px rgba(139,26,26,0.28)' : 'none',
                whiteSpace: 'nowrap',
              }}
            >
              {tb.icon}
              <span style={{ display: windowW < 360 ? 'none' : 'inline' }}>{tb.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {tab === 'participants' && (
          <ParticipantTable
            participants={searchQuery ? paginated : paginatedParticipants()}
            allParticipants={filtered}
            columns={columns}
            page={pagination.page}
            pageSize={pagination.pageSize}
            totalPages={pages}
            onUpdate={updateParticipant}
            onRemove={removeParticipant}
            onAddRow={addEmpty}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
            isMobile={isMobile}
            t={t}
            theme={theme}
          />
        )}

        {tab === 'grid' && (
          <div style={{
            background: theme.surface, border: `1px solid ${theme.surfaceBorder}`,
            borderRadius: '12px', boxShadow: theme.surfaceShadow,
            padding: 'clamp(16px,3vw,24px)',
          }}>
            <DasakamGrid
              participants={participants}
              onClearAssignments={clearDasakamAssignments}
              t={t} theme={theme}
            />
          </div>
        )}

        {tab === 'import-export' && (
          <ImportExportPanel
            participants={participants}
            onImport={handleImport}
            t={t} theme={theme}
          />
        )}

        {/* Quote + devotion — compact */}
        <div style={{
          marginTop: '24px',
          background: theme.quoteBg,
          border: `1px solid ${theme.quoteBorder}`,
          borderRadius: '12px',
          overflow: 'hidden',
        }}>
          <div style={{ height: '2px', background: 'linear-gradient(90deg,transparent,#C9A84C,#FF6B00,#C9A84C,transparent)' }} />

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'clamp(12px,3vw,28px)',
            padding: 'clamp(12px,2.5vw,18px) clamp(14px,3vw,28px)',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}>
            {/* Lotus — compact left side */}
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <div style={{
                position: 'absolute', inset: '-8px', borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(233,30,99,0.1) 0%, transparent 70%)',
                filter: 'blur(6px)',
              }} />
              <img
                src="/lotus.svg"
                alt="Sacred Lotus"
                style={{
                  width: 'clamp(48px,7vw,72px)',
                  height: 'clamp(48px,7vw,72px)',
                  display: 'block',
                  position: 'relative',
                  zIndex: 1,
                  filter: 'drop-shadow(0 3px 8px rgba(233,30,99,0.22))',
                }}
              />
            </div>

            {/* Vertical divider — desktop only */}
            <div style={{ width: '1px', height: '52px', background: 'linear-gradient(180deg,transparent,rgba(201,168,76,0.4),transparent)', flexShrink: 0, display: 'none' }} className="quote-vdivider" />

            {/* Text block */}
            <div style={{ textAlign: 'center', minWidth: 0 }}>
              <p style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 'clamp(1.1rem,2.2vw,1.3rem)',
                color: theme.text, fontStyle: 'italic',
                lineHeight: 1.7, marginBottom: '6px',
              }}>
                {t.quote}
              </p>
              <p style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 'clamp(1.05rem,1.8vw,1.2rem)',
                color: '#C9A84C', letterSpacing: '0.04em',
                lineHeight: 1.5, fontWeight: 500, marginBottom: '6px',
              }}>
                {(t as any).devotionLine}
              </p>
              <p style={{
                fontFamily: "'Cinzel Decorative', serif",
                fontSize: 'clamp(0.76rem,1.1vw,0.88rem)',
                color: theme.textLight, letterSpacing: '0.1em', opacity: 0.6,
              }}>
                ✦ KRISHNAARPANAM · 100 DASAKAMS · 1036 SHLOKAS · GURUVAYURAPPAN ✦
              </p>
            </div>
          </div>

          <div style={{ height: '1.5px', background: 'linear-gradient(90deg,transparent,rgba(201,168,76,0.3),transparent)' }} />
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        textAlign: 'center', padding: '16px 20px',
        borderTop: `1px solid ${theme.footerBorder}`,
        background: theme.footerBg, marginTop: '24px',
      }}>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.15rem,2.2vw,1.35rem)', color: theme.textLight, marginBottom: '2px' }}>
          {t.footer}
        </p>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(0.96rem,1.8vw,1.1rem)', color: '#C9A84C', marginBottom: '4px', fontStyle: 'italic' }}>
          {(t as any).devotionLine}
        </p>
        <p style={{ fontFamily: "'Cinzel Decorative', serif", fontSize: 'clamp(0.76rem,1.3vw,0.9rem)', color: theme.textMid, letterSpacing: '0.06em' }}>
          {t.copyright}
        </p>
      </footer>

      {/* Paste names modal */}
      {showPasteModal && (
        <PasteNamesModal
          onAdd={handlePasteNames}
          onClose={() => setShowPasteModal(false)}
          existingCount={participants.length}
          rowCap={rowCap}
          theme={theme}
          t={t}
        />
      )}

      {/* Generate modal */}
      {showGenModal && (
        <GenerateModal
          onGenerate={handleGenerate}
          onClose={() => setShowGenModal(false)}
          currentCount={participants.length}
          existingCap={rowCap}
          t={t}
          theme={theme}
        />
      )}

      {/* Clear confirm */}
      {showClearConfirm && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 1500, background: theme.modalOverlay, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', backdropFilter: 'blur(6px)' }}
          onClick={e => e.target === e.currentTarget && setShowClearConfirm(false)}
        >
          <div style={{ background: theme.modalBg, borderRadius: '16px', border: `1px solid ${theme.btnDangerBorder}`, boxShadow: '0 20px 60px rgba(0,0,0,0.35)', padding: '28px', maxWidth: '380px', width: '100%', textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>⚠️</div>
            <h3 style={{ fontFamily: "'Cinzel Decorative', serif", fontSize: '1.3rem', color: theme.text, marginBottom: '10px' }}>{t.clear.title}</h3>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.3rem', color: theme.textLight, marginBottom: '22px', lineHeight: 1.6 }}>
              {t.clear.body} {participants.length} {t.clear.bodyEnd}
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setShowClearConfirm(false)} style={{ flex: 1, background: theme.btnGhostBg, color: theme.btnGhostText, border: `1px solid ${theme.btnGhostBorder}`, padding: '11px', borderRadius: '6px', fontFamily: "'Cinzel Decorative', serif", fontSize: '1.3rem', cursor: 'pointer', letterSpacing: '0.04em' }}>
                {t.clear.cancel}
              </button>
              <button onClick={() => { clearAll(); setShowClearConfirm(false) }} style={{ flex: 1, background: 'linear-gradient(135deg,#DC2626,#EF4444)', color: '#fff', border: 'none', padding: '11px', borderRadius: '6px', fontFamily: "'Cinzel Decorative', serif", fontSize: '1.3rem', cursor: 'pointer', letterSpacing: '0.04em' }}>
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
