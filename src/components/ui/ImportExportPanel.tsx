import React, { useRef, useState } from 'react'
import { Upload, Download } from 'lucide-react'
import WhatsAppModal from '@/components/ui/WhatsAppModal'
import { importFromExcel, exportToExcel } from '@/services/excelService'
import type { Participant, ExportOptions } from '@/types'
import type { ThemeTokens } from '@/utils/theme'
import type { Translations } from '@/utils/i18n'

interface ImportExportPanelProps {
  participants: Participant[]
  onImport: (participants: Participant[]) => void
  t: Translations
  theme: ThemeTokens
}

const ImportExportPanel: React.FC<ImportExportPanelProps> = ({
  participants,
  onImport,
  t,
  theme,
}) => {
  const fileRef = useRef<HTMLInputElement>(null)
  const [importing, setImporting] = useState(false)
  const [result, setResult] = useState<{ success: boolean; msg: string } | null>(null)
  const [options, setOptions] = useState<ExportOptions>({
    includeContact: true,
    includeNotes: true,
    includeSummary: true,
  })
  const [dragging, setDragging] = useState(false)
  const [showWA, setShowWA] = useState(false)

  const processFile = async (file: File) => {
    if (!file.name.match(/\.(xlsx|xls)$/i)) {
      setResult({ success: false, msg: t.importPanel.unsupported })
      return
    }
    setImporting(true)
    setResult(null)
    const res = await importFromExcel(file)
    setImporting(false)
    if (res.success) {
      onImport(res.participants)
      setResult({ success: true, msg: `${res.message} ${t.importedMsg}` })
    } else {
      const msgKey = res.message as keyof typeof t.importPanel
      const msg = (t.importPanel as Record<string, string>)[msgKey] || t.importPanel.parseErr
      setResult({ success: false, msg })
    }
  }

  const handleExport = () => {
    exportToExcel(participants, options, {
      excelSheetName: t.excelSheetName,
      colNo: t.colNo,
      colName: t.colName,
      colDasakam: t.colDasakam,
      colContact: t.colContact,
      colNotes: t.colNotes,
      summarySheet: t.summarySheet,
      summaryGenerated: t.summaryGenerated,
      summaryParticipants: t.summaryParticipants,
      summaryCovered: t.summaryCovered,
      summaryRemaining: t.summaryRemaining,
      summaryUnallocated: t.summaryUnallocated,
      summaryNone: t.summaryNone,
    })
  }

  const cardStyle: React.CSSProperties = {
    background: theme.surface,
    border: `1px solid ${theme.surfaceBorder}`,
    borderRadius: '12px',
    boxShadow: theme.surfaceShadow,
    padding: '22px',
  }

  const sectionHeadStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '16px',
  }

  const iconBox = (icon: React.ReactNode) => (
    <div
      style={{
        width: '38px',
        height: '38px',
        borderRadius: '8px',
        background: theme.statsBg,
        border: `1px solid ${theme.statsBorder}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        color: theme.textMid,
      }}
    >
      {icon}
    </div>
  )

  return (
    <>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '16px',
        }}
      >
        {/* ── Import ── */}
        <div style={cardStyle}>
          <div style={sectionHeadStyle}>
            {iconBox(<Upload size={18} />)}
            <div>
              <h3
                style={{
                  fontFamily: "'Cinzel Decorative', serif",
                  fontSize: 'clamp(0.62rem, 1.5vw, 0.76rem)',
                  color: theme.text,
                  letterSpacing: '0.05em',
                }}
              >
                {t.importPanel.title}
              </h3>
              <p
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '0.85rem',
                  color: theme.textLight,
                  fontStyle: 'italic',
                }}
              >
                {t.importPanel.sub}
              </p>
            </div>
          </div>

          {/* Drop zone */}
          <div
            onDragOver={e => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={e => {
              e.preventDefault()
              setDragging(false)
              const file = e.dataTransfer.files[0]
              if (file) processFile(file)
            }}
            onClick={() => fileRef.current?.click()}
            style={{
              border: `2px dashed ${dragging ? theme.dropzoneBorderActive : theme.dropzoneBorder}`,
              borderRadius: '10px',
              padding: 'clamp(18px, 4vw, 26px)',
              textAlign: 'center',
              cursor: 'pointer',
              background: dragging ? theme.dropzoneBg : 'transparent',
              transition: 'all 0.2s',
            }}
          >
            <div style={{ fontSize: '2.2rem', marginBottom: '8px', opacity: 0.6 }}>📊</div>
            <p
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '0.92rem',
                color: theme.textLight,
              }}
            >
              {importing ? t.importPanel.processing : t.importPanel.drop}
            </p>
            <p
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '0.78rem',
                color: theme.textLight,
                marginTop: '4px',
                fontStyle: 'italic',
              }}
            >
              {t.importPanel.fmt}
            </p>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept=".xlsx,.xls"
            style={{ display: 'none' }}
            onChange={e => {
              const file = e.target.files?.[0]
              if (file) processFile(file)
              e.target.value = ''
            }}
          />

          {/* Result */}
          {result && (
            <div
              style={{
                marginTop: '12px',
                padding: '10px 14px',
                borderRadius: '8px',
                background: result.success ? theme.successBg : theme.errorBg,
                border: `1px solid ${result.success ? theme.successBorder : theme.errorBorder}`,
              }}
            >
              <span
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '0.9rem',
                  color: result.success ? theme.successText : theme.errorText,
                }}
              >
                {result.success ? '✓' : '✗'} {result.msg}
              </span>
            </div>
          )}
        </div>

        {/* ── Export ── */}
        <div style={cardStyle}>
          <div style={sectionHeadStyle}>
            {iconBox(<Download size={18} />)}
            <div>
              <h3
                style={{
                  fontFamily: "'Cinzel Decorative', serif",
                  fontSize: 'clamp(0.62rem, 1.5vw, 0.76rem)',
                  color: theme.text,
                  letterSpacing: '0.05em',
                }}
              >
                {t.exportPanel.title}
              </h3>
              <p
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '0.85rem',
                  color: theme.textLight,
                  fontStyle: 'italic',
                }}
              >
                {participants.length}{' '}
                {participants.length === 1
                  ? t.exportPanel.readySingle
                  : t.exportPanel.readyMulti}
              </p>
            </div>
          </div>

          {/* Options */}
          <div
            style={{
              background: theme.statsBg,
              borderRadius: '10px',
              padding: '14px',
              marginBottom: '14px',
              border: `1px solid ${theme.statsBorder}`,
            }}
          >
            <p
              style={{
                fontFamily: "'Cinzel Decorative', serif",
                fontSize: '0.6rem',
                color: theme.textMid,
                letterSpacing: '0.07em',
                marginBottom: '10px',
              }}
            >
              {t.exportPanel.exportOptions}
            </p>
            {(
              [
                ['includeContact', t.exportPanel.optContact],
                ['includeNotes', t.exportPanel.optNotes],
                ['includeSummary', t.exportPanel.optSummary],
              ] as [keyof ExportOptions, string][]
            ).map(([key, label]) => (
              <label
                key={key}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  marginBottom: '8px',
                }}
              >
                <input
                  type="checkbox"
                  checked={options[key] as boolean}
                  onChange={e => setOptions(o => ({ ...o, [key]: e.target.checked }))}
                  style={{ accentColor: theme.checkboxAccent }}
                />
                <span
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: '0.92rem',
                    color: theme.text,
                  }}
                >
                  {label}
                </span>
              </label>
            ))}
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button
              onClick={handleExport}
              disabled={participants.length === 0}
              style={{
                width: '100%',
                background:
                  participants.length === 0
                    ? 'rgba(139,26,26,0.3)'
                    : theme.btnSecondaryBg,
                color: theme.btnSecondaryText,
                border: 'none',
                padding: '12px',
                borderRadius: '6px',
                fontFamily: "'Cinzel Decorative', serif",
                fontSize: 'clamp(0.58rem, 1.4vw, 0.7rem)',
                cursor: participants.length === 0 ? 'not-allowed' : 'pointer',
                letterSpacing: '0.04em',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                opacity: participants.length === 0 ? 0.5 : 1,
                boxShadow: participants.length > 0 ? '0 2px 8px rgba(139,26,26,0.25)' : 'none',
              }}
            >
              <Download size={14} />
              {t.exportPanel.download}
            </button>

            <button
              onClick={() => participants.length > 0 && setShowWA(true)}
              disabled={participants.length === 0}
              style={{
                width: '100%',
                background:
                  participants.length === 0
                    ? 'rgba(37,211,102,0.2)'
                    : 'linear-gradient(135deg, #25D366, #128C7E)',
                color: '#fff',
                border: 'none',
                padding: '12px',
                borderRadius: '6px',
                fontFamily: "'Cinzel Decorative', serif",
                fontSize: 'clamp(0.58rem, 1.4vw, 0.7rem)',
                cursor: participants.length === 0 ? 'not-allowed' : 'pointer',
                letterSpacing: '0.04em',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                opacity: participants.length === 0 ? 0.5 : 1,
                boxShadow: participants.length > 0 ? '0 2px 8px rgba(37,211,102,0.3)' : 'none',
              }}
            >
              📲 {t.exportPanel.share}
            </button>
          </div>

          {participants.length === 0 && (
            <p
              style={{
                textAlign: 'center',
                marginTop: '8px',
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '0.82rem',
                color: theme.textLight,
                fontStyle: 'italic',
              }}
            >
              {t.exportPanel.noParticipants}
            </p>
          )}
        </div>
      </div>

      {showWA && (
        <WhatsAppModal
          participants={participants}
          t={t}
          theme={theme}
          onClose={() => setShowWA(false)}
        />
      )}
    </>
  )
}

export default ImportExportPanel
