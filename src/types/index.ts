export interface Participant {
  id: string
  name: string
  dasakams: number[]
  contactNumber?: string
  notes?: string
  createdAt?: string
}

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
