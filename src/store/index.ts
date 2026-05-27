import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Participant, Lang, Column, PaginationState } from '@/types'
import { DEFAULT_COLUMNS } from '@/types'
import { generateId } from '@/utils/id'
import { autoAllocateDasakams } from '@/utils/dasakam'

const LOCKED = ['name', 'dasakams']

interface Store {
  participants: Participant[]
  lang: Lang
  dark: boolean
  searchQuery: string
  columns: Column[]
  pagination: PaginationState
  isLoading: boolean

  // Row cap — when set, app will not allow total rows to exceed this number
  rowCap: number | null
  setRowCap: (cap: number | null) => void

  // Participant actions
  addEmpty: () => void
  generateRows: (count: number, cap?: number | null) => void
  updateParticipant: (id: string, data: Partial<Participant>) => void
  removeParticipant: (id: string) => void
  setParticipants: (participants: Participant[]) => void
  appendParticipants: (participants: Participant[]) => void
  clearAll: () => void
  autoAllocate: () => void
  clearDasakamAssignments: () => void

  // Column actions
  toggleColumnVisibility: (id: string) => void
  addCustomColumn: (label: string, type: Column['type']) => void
  removeCustomColumn: (id: string) => void
  updateColumnLabel: (id: string, label: string) => void
  resetColumns: () => void

  // Pagination
  setPage: (page: number) => void
  setPageSize: (size: number) => void

  // Preferences
  setLang: (lang: Lang) => void
  setDark: (dark: boolean) => void
  setSearchQuery: (q: string) => void
  setLoading: (v: boolean) => void

  // Computed
  filteredParticipants: () => Participant[]
  paginatedParticipants: () => Participant[]
  totalPages: () => number
  visibleColumns: () => Column[]
  canAddMore: () => boolean
  remainingSlots: () => number
}

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      participants: [],
      lang: 'en',
      dark: false,
      searchQuery: '',
      columns: DEFAULT_COLUMNS,
      pagination: { page: 1, pageSize: 10 },
      isLoading: false,
      rowCap: null,

      setRowCap: (cap) => set({ rowCap: cap }),

      canAddMore: () => {
        const { participants, rowCap } = get()
        if (rowCap === null) return true
        return participants.length < rowCap
      },

      remainingSlots: () => {
        const { participants, rowCap } = get()
        if (rowCap === null) return Infinity
        return Math.max(0, rowCap - participants.length)
      },

      addEmpty: () => {
        const { participants, rowCap } = get()
        if (rowCap !== null && participants.length >= rowCap) return // cap enforced
        set(s => ({
          participants: [
            ...s.participants,
            { id: generateId(), name: '', dasakams: [], contactNumber: '', notes: '', createdAt: new Date().toISOString() },
          ],
        }))
      },

      generateRows: (count: number, cap?: number | null) => {
        // Determine effective cap
        const effectiveCap = cap !== undefined ? cap : get().rowCap
        const current = get().participants.length

        // How many rows can actually be added
        const allowed = effectiveCap !== null
          ? Math.max(0, effectiveCap - current)
          : count

        const actualCount = Math.min(count, allowed)
        if (actualCount === 0) return

        // Set the cap in store if a new cap was specified
        if (cap !== undefined && cap !== null) {
          set({ rowCap: cap, isLoading: true })
        } else {
          set({ isLoading: true })
        }

        setTimeout(() => {
          set(s => ({
            isLoading: false,
            participants: [
              ...s.participants,
              ...Array.from({ length: actualCount }, () => ({
                id: generateId(), name: '', dasakams: [], contactNumber: '', notes: '',
                createdAt: new Date().toISOString(),
              })),
            ],
          }))
        }, 400)
      },

      updateParticipant: (id, data) =>
        set(s => ({ participants: s.participants.map(p => p.id === id ? { ...p, ...data } : p) })),

      removeParticipant: (id) =>
        set(s => ({ participants: s.participants.filter(p => p.id !== id) })),

      setParticipants: (participants) => set({ participants }),

      appendParticipants: (incoming) =>
        set(s => ({ participants: [...s.participants, ...incoming] })),

      clearAll: () => set({ participants: [], searchQuery: '', rowCap: null, pagination: { page: 1, pageSize: get().pagination.pageSize } }),

      autoAllocate: () =>
        set(s => ({ participants: autoAllocateDasakams(s.participants) })),

      clearDasakamAssignments: () =>
        set(s => ({ participants: s.participants.map(p => ({ ...p, dasakams: [] })) })),

      toggleColumnVisibility: (id) => {
        set(s => ({
          columns: s.columns.map(c =>
            c.id === id && !LOCKED.includes(c.id) ? { ...c, visible: !c.visible } : c
          ),
        }))
      },

      addCustomColumn: (label, type) =>
        set(s => ({
          columns: [...s.columns, { id: `custom_${generateId()}`, label, visible: true, required: false, type, isCustom: true }],
        })),

      removeCustomColumn: (id) => {
        if (LOCKED.includes(id)) return
        set(s => ({ columns: s.columns.filter(c => c.id !== id) }))
      },

      updateColumnLabel: (id, label) =>
        set(s => ({ columns: s.columns.map(c => c.id === id ? { ...c, label } : c) })),

      resetColumns: () => set({ columns: DEFAULT_COLUMNS }),

      setPage: (page) => set(s => ({ pagination: { ...s.pagination, page } })),
      setPageSize: (pageSize) => set(s => ({ pagination: { page: 1, pageSize } })),
      setLang: (lang) => set({ lang }),
      setDark: (dark) => set({ dark }),
      setSearchQuery: (searchQuery) => set({ searchQuery, pagination: { ...get().pagination, page: 1 } }),
      setLoading: (isLoading) => set({ isLoading }),

      filteredParticipants: () => {
        const { participants, searchQuery } = get()
        const q = searchQuery.trim().toLowerCase()
        if (!q) return participants
        return participants.filter(p =>
          p.name.toLowerCase().includes(q) ||
          p.dasakams.some(d => d.toString().includes(q)) ||
          (p.contactNumber || '').includes(q)
        )
      },

      paginatedParticipants: () => {
        const filtered = get().filteredParticipants()
        const { page, pageSize } = get().pagination
        return filtered.slice((page - 1) * pageSize, page * pageSize)
      },

      totalPages: () => {
        const filtered = get().filteredParticipants()
        return Math.max(1, Math.ceil(filtered.length / get().pagination.pageSize))
      },

      visibleColumns: () => get().columns.filter(c => c.visible),
    }),
    { name: 'krishnaarpanam-v5' }
  )
)
