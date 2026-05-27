import * as XLSX from 'xlsx'
import type { Participant, ExportOptions } from '@/types'
import { parseDasakam, formatDasakam, computeStats } from '@/utils/dasakam'
import { generateId } from '@/utils/id'

const NAME_KEYS = ['name', 'participant name', 'participant', 'devotee', 'devotee name', 'பெயர்', 'பக்தர் பெயர்']
const DASAK_KEYS = ['dasakam', 'dasakams', 'dasakam no', 'dasakam number', 'allotted dasakam', 'தசகம்', 'ஒதுக்கப்பட்ட தசகம்']
const CONT_KEYS = ['contact', 'contact number', 'phone', 'mobile', 'தொடர்பு', 'தொடர்பு எண்']
const NOTE_KEYS = ['notes', 'note', 'remarks', 'குறிப்பு']

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

        if (!rows.length) {
          resolve({ success: false, participants: [], message: 'empty' })
          return
        }

        const headers = Object.keys(rows[0])
        const findCol = (keys: string[]) =>
          headers.find(h => keys.includes(h.toLowerCase().trim()))

        const nC = findCol(NAME_KEYS)
        const dC = findCol(DASAK_KEYS)
        const cC = findCol(CONT_KEYS)
        const nCC = findCol(NOTE_KEYS)

        if (!nC) {
          resolve({ success: false, participants: [], message: 'noName' })
          return
        }

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
      } catch (err) {
        resolve({ success: false, participants: [], message: 'parseErr' })
      }
    }
    reader.onerror = () => resolve({ success: false, participants: [], message: 'parseErr' })
    reader.readAsArrayBuffer(file)
  })
}

export function exportToExcel(
  participants: Participant[],
  options: ExportOptions,
  translations: {
    excelSheetName: string
    colNo: string
    colName: string
    colDasakam: string
    colContact: string
    colNotes: string
    summarySheet: string
    summaryGenerated: string
    summaryParticipants: string
    summaryCovered: string
    summaryRemaining: string
    summaryUnallocated: string
    summaryNone: string
  }
): void {
  const wb = XLSX.utils.book_new()

  const headers = [translations.colNo, translations.colName, translations.colDasakam]
  if (options.includeContact) headers.push(translations.colContact)
  if (options.includeNotes) headers.push(translations.colNotes)

  const rows = participants.map((p, i) => {
    const r: (string | number)[] = [i + 1, p.name, formatDasakam(p.dasakams) || '-']
    if (options.includeContact) r.push(p.contactNumber || '')
    if (options.includeNotes) r.push(p.notes || '')
    return r
  })

  const ws = XLSX.utils.aoa_to_sheet([headers, ...rows])
  ws['!cols'] = [
    { wch: 6 }, { wch: 28 }, { wch: 26 },
    ...(options.includeContact ? [{ wch: 18 }] : []),
    ...(options.includeNotes ? [{ wch: 30 }] : []),
  ]
  XLSX.utils.book_append_sheet(wb, ws, translations.excelSheetName.slice(0, 31))

  if (options.includeSummary) {
    const stats = computeStats(participants)
    const sd: (string | number)[][] = [
      [translations.summarySheet, ''],
      [translations.summaryGenerated, new Date().toLocaleString()],
      ['Krishnaarpanam — © Aparnaa Ravi 2026', ''],
      [translations.summaryParticipants, participants.length],
      [translations.summaryCovered, stats.allocated.length],
      [translations.summaryRemaining, stats.unallocated.length],
      [''],
      [
        translations.summaryUnallocated,
        stats.unallocated.length > 0
          ? stats.unallocated.join(', ')
          : translations.summaryNone,
      ],
    ]
    const wss = XLSX.utils.aoa_to_sheet(sd)
    wss['!cols'] = [{ wch: 30 }, { wch: 60 }]
    XLSX.utils.book_append_sheet(wb, wss, translations.summarySheet.slice(0, 31))
  }

  const date = new Date().toISOString().slice(0, 10)
  XLSX.writeFile(wb, `krishnaarpanam_dasakam_list_${date}.xlsx`)
}
