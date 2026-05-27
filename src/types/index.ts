export interface Participant {
  id: string
  name: string
  dasakams: number[]
  contactNumber?: string
  notes?: string
  createdAt?: string
  // extensible custom columns
  [key: string]: unknown
}

export interface Column {
  id: string          // unique key e.g. "name", "dasakams", "contactNumber", "notes", or custom
  label: string       // display label
  visible: boolean
  required: boolean   // name + dasakam are required
  width?: string
  type: 'text' | 'dasakam' | 'tel' | 'textarea'
  isCustom: boolean
}

export const DEFAULT_COLUMNS: Column[] = [
  { id: 'name',          label: 'Participant Name', visible: true,  required: true,  type: 'text',    isCustom: false },
  { id: 'dasakams',      label: 'Dasakam(s)',        visible: true,  required: true,  type: 'dasakam', isCustom: false },
  { id: 'contactNumber', label: 'Contact Number',    visible: true,  required: false, type: 'tel',     isCustom: false },
  { id: 'notes',         label: 'Notes',             visible: true,  required: false, type: 'textarea',isCustom: false },
]

export interface ImportResult {
  success: boolean
  participants: Participant[]
  errors: string[]
  warnings: string[]
}

export interface ExportOptions {
  includeContact: boolean
  includeNotes: boolean
  includeSummary: boolean
}

export type Lang = 'en' | 'ta'
export type Theme = 'light' | 'dark'

export interface DasakamStats {
  allocated: number[]
  unallocated: number[]
  duplicates: { dasakam: number; count: number }[]
}

export interface PaginationState {
  page: number
  pageSize: number
}
