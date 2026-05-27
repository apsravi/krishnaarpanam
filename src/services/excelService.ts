import * as XLSX from 'xlsx'
import type { Participant, ExportOptions } from '@/types'
import { parseDasakam, formatDasakam, computeStats } from '@/utils/dasakam'
import { generateId } from '@/utils/id'

const NAME_KEYS = ['name','participant name','participant','devotee','devotee name','பெயர்','பக்தர் பெயர்']
const DASAK_KEYS = ['dasakam','dasakams','dasakam no','dasakam number','allotted dasakam','தசகம்','ஒதுக்கப்பட்ட தசகம்']
const CONT_KEYS = ['contact','contact number','phone','mobile','தொடர்பு','தொடர்பு எண்']
const NOTE_KEYS = ['notes','note','remarks','குறிப்பு']

export interface ImportResult {
  success: boolean
  participants: Participant[]
  message: string
}

export async function importFromExcel(file: File): Promise<ImportResult> {
  return new Promise(resolve => {
    const reader = new FileReader()
    reader.onload = e => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer)
        const wb = XLSX.read(data, { type: 'array' })
        const ws = wb.Sheets[wb.SheetNames[0]]
        const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(ws, { defval: '' })

        if (!rows.length) { resolve({ success: false, participants: [], message: 'empty' }); return }

        const headers = Object.keys(rows[0])
        const findCol = (keys: string[]) => headers.find(h => keys.includes(h.toLowerCase().trim()))

        const nC = findCol(NAME_KEYS), dC = findCol(DASAK_KEYS)
        const cC = findCol(CONT_KEYS), nCC = findCol(NOTE_KEYS)

        if (!nC) { resolve({ success: false, participants: [], message: 'noName' }); return }

        const participants: Participant[] = rows
          .filter(r => String(r[nC!] ?? '').trim())
          .map(r => ({
            id: generateId(),
            name: String(r[nC!]).trim(),
            dasakams: dC ? parseDasakam(String(r[dC])) : [],
            contactNumber: cC ? String(r[cC]).trim() : '',
            notes: nCC ? String(r[nCC]).trim() : '',
            createdAt: new Date().toISOString(),
          }))

        resolve({ success: true, participants, message: `${participants.length}` })
      } catch {
        resolve({ success: false, participants: [], message: 'parseErr' })
      }
    }
    reader.onerror = () => resolve({ success: false, participants: [], message: 'parseErr' })
    reader.readAsArrayBuffer(file)
  })
}

// Helper — apply cell style (works with xlsx community edition via cell.s)
function cellStyle(bold = false, center = false, wrap = false, bgRgb?: string, fontRgb?: string, fontSize = 11) {
  return {
    font: { bold, sz: fontSize, color: fontRgb ? { rgb: fontRgb } : undefined },
    alignment: { horizontal: center ? 'center' : 'left', vertical: 'center', wrapText: wrap },
    fill: bgRgb ? { fgColor: { rgb: bgRgb } } : undefined,
    border: {
      top:    { style: 'thin', color: { rgb: 'D4A843' } },
      bottom: { style: 'thin', color: { rgb: 'D4A843' } },
      left:   { style: 'thin', color: { rgb: 'D4A843' } },
      right:  { style: 'thin', color: { rgb: 'D4A843' } },
    },
  }
}

export function exportToExcel(
  participants: Participant[],
  options: ExportOptions,
  customFilename: string,
  translations: {
    excelSheetName: string
    colNo: string; colName: string; colDasakam: string
    colContact: string; colNotes: string
    summarySheet: string; summaryGenerated: string
    summaryParticipants: string; summaryCovered: string
    summaryRemaining: string; summaryUnallocated: string; summaryNone: string
  }
): void {
  const wb = XLSX.utils.book_new()
  const date = new Date().toISOString().slice(0, 10)

  // ── MAIN DATA SHEET ──────────────────────────────────────────────────────────
  const headers = [translations.colNo, translations.colName, translations.colDasakam]
  if (options.includeContact) headers.push(translations.colContact)
  if (options.includeNotes)   headers.push(translations.colNotes)

  const dataRows = participants.map((p, i) => {
    const r: (string | number)[] = [i + 1, p.name, formatDasakam(p.dasakams) || '-']
    if (options.includeContact) r.push(p.contactNumber || '')
    if (options.includeNotes)   r.push(p.notes || '')
    return r
  })

  const ws = XLSX.utils.aoa_to_sheet([headers, ...dataRows])

  // Column widths
  ws['!cols'] = [
    { wch: 6 }, { wch: 28 }, { wch: 26 },
    ...(options.includeContact ? [{ wch: 20 }] : []),
    ...(options.includeNotes   ? [{ wch: 32 }] : []),
  ]

  // Row height for header
  ws['!rows'] = [{ hpt: 22 }]

  // Style header row
  headers.forEach((_, ci) => {
    const ref = XLSX.utils.encode_cell({ r: 0, c: ci })
    if (ws[ref]) {
      ws[ref].s = cellStyle(true, true, false, '8B1A1A', 'FDF6E3', 12)
    }
  })

  // Style data rows alternating
  dataRows.forEach((_, ri) => {
    headers.forEach((__, ci) => {
      const ref = XLSX.utils.encode_cell({ r: ri + 1, c: ci })
      if (ws[ref]) {
        const bg = ri % 2 === 0 ? 'FFFFFF' : 'FFF8ED'
        ws[ref].s = cellStyle(false, ci === 0, ci === 2, bg)
      }
    })
  })

  // Freeze header row
  ws['!freeze'] = { xSplit: 0, ySplit: 1, topLeftCell: 'A2', activePane: 'bottomLeft' }

  XLSX.utils.book_append_sheet(wb, ws, translations.excelSheetName.slice(0, 31))

  // ── SUMMARY SHEET ────────────────────────────────────────────────────────────
  if (options.includeSummary) {
    const stats = computeStats(participants)
    const unallocatedStr = stats.unallocated.length > 0
      ? stats.unallocated.join(', ')
      : translations.summaryNone

    // Group allocated dasakams by participant for summary
    const participantSummary = participants
      .filter(p => p.dasakams.length > 0)
      .map(p => [p.name, formatDasakam(p.dasakams), p.contactNumber || ''])

    const summaryData: (string | number)[][] = [
      // Title row
      ['KRISHNAARPANAM — NARAYANEEYAM DASAKAM RECITATION', '', ''],
      ['© Aparnaa Ravi 2026. All rights reserved.', '', ''],
      ['', '', ''],
      // Meta
      [translations.summaryGenerated, new Date().toLocaleString('en-IN', { dateStyle: 'long', timeStyle: 'short' }), ''],
      [translations.summaryParticipants, participants.length, ''],
      [translations.summaryCovered, `${stats.allocated.length} / 100`, ''],
      [translations.summaryRemaining, stats.unallocated.length, ''],
      ['', '', ''],
      // Participant breakdown header
      ['Participant Name', 'Dasakam(s) Assigned', 'Contact'],
      ...participantSummary,
      ['', '', ''],
      // Unallocated section
      [translations.summaryUnallocated, '', ''],
      [unallocatedStr, '', ''],
    ]

    const wsSummary = XLSX.utils.aoa_to_sheet(summaryData)

    // Column widths for summary — wide enough for wrapped text
    wsSummary['!cols'] = [{ wch: 32 }, { wch: 40 }, { wch: 22 }]

    // Row heights
    const rowHeights: { hpt: number }[] = []
    summaryData.forEach((row, i) => {
      if (i === 0) rowHeights.push({ hpt: 28 })         // Title
      else if (i === 12 + participantSummary.length) rowHeights.push({ hpt: 14 }) // gap
      else if (i === 13 + participantSummary.length) {
        // Unallocated text — estimate height based on length
        const lines = Math.ceil(unallocatedStr.length / 55)
        rowHeights.push({ hpt: Math.max(18, lines * 16) })
      } else rowHeights.push({ hpt: 18 })
    })
    wsSummary['!rows'] = rowHeights

    // Style individual cells
    const applyStyle = (r: number, c: number, s: ReturnType<typeof cellStyle>) => {
      const ref = XLSX.utils.encode_cell({ r, c })
      if (wsSummary[ref]) wsSummary[ref].s = s
    }

    // Title — merged look via bold large font
    applyStyle(0, 0, cellStyle(true, false, false, 'C9A84C', '1C1008', 14))
    applyStyle(1, 0, cellStyle(false, false, false, 'FFF8ED', '8B6914', 10))

    // Meta label rows (col 0 = label, col 1 = value)
    ;[3, 4, 5, 6].forEach(r => {
      applyStyle(r, 0, cellStyle(true,  false, false, 'FFF3DC', '4A2510', 11))
      applyStyle(r, 1, cellStyle(false, false, false, 'FFFFFF', '1C1008', 11))
    })

    // Participant breakdown header row (row 8)
    ;[0, 1, 2].forEach(c => {
      applyStyle(8, 0 + c, cellStyle(true, false, false, '8B1A1A', 'FDF6E3', 11))
    })

    // Participant rows — alternating, with wrap for dasakam column
    participantSummary.forEach((_, ri) => {
      const rowIdx = 9 + ri
      const bg = ri % 2 === 0 ? 'FFFFFF' : 'FFF8ED'
      applyStyle(rowIdx, 0, cellStyle(false, false, false, bg, '1C1008'))
      applyStyle(rowIdx, 1, cellStyle(false, false, true,  bg, '1C1008'))  // wrap dasakam
      applyStyle(rowIdx, 2, cellStyle(false, false, false, bg, '1C1008'))
    })

    // Unallocated header
    const unallocHdr = 12 + participantSummary.length
    applyStyle(unallocHdr, 0, cellStyle(true, false, false, 'FF6B00', 'FFFFFF', 11))

    // Unallocated value — wrapped, auto height
    const unallocVal = 13 + participantSummary.length
    applyStyle(unallocVal, 0, cellStyle(false, false, true, 'FFF3DC', '1C1008', 10))

    // Merges — title spans all 3 columns
    wsSummary['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 2 } },   // Title
      { s: { r: 1, c: 0 }, e: { r: 1, c: 2 } },   // Copyright
      { s: { r: unallocHdr, c: 0 }, e: { r: unallocHdr, c: 2 } }, // Unallocated label
      { s: { r: unallocVal, c: 0 }, e: { r: unallocVal, c: 2 } }, // Unallocated value (wrapped)
    ]

    XLSX.utils.book_append_sheet(wb, wsSummary, translations.summarySheet.slice(0, 31))
  }

  // ── FILENAME ─────────────────────────────────────────────────────────────────
  // Sanitise custom filename, append date, ensure .xlsx extension
  const base = customFilename.trim()
    ? customFilename.trim().replace(/[\\/:*?"<>|]/g, '_').replace(/\.xlsx$/i, '')
    : 'krishnaarpanam_dasakam_list'

  XLSX.writeFile(wb, `${base}_${date}.xlsx`)
}
