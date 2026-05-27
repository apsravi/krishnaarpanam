import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Participant, Lang, Column, PaginationState } from '@/types'
import { DEFAULT_COLUMNS } from '@/types'
import { generateId } from '@/utils/id'
import { autoAllocateDasakams } from '@/utils/dasakam'

interface Store {
  participants: Participant[]
  lang: Lang
  dark: boolean
  searchQuery: string
  columns: Column[]
  pagination: PaginationState
  isLoading: boolean

  // Participant actions
  addEmpty: () => void
  generateRows: (count: number) => void
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

      addEmpty: () =>
        set(s => ({
          participants: [
            ...s.participants,
            { id: generateId(), name: '', dasakams: [], contactNumber: '', notes: '', createdAt: new Date().toISOString() },
          ],
        })),

      generateRows: (count: number) => {
        set({ isLoading: true })
        setTimeout(() => {
          set(s => ({
            isLoading: false,
            participants: [
              ...s.participants,
              ...Array.from({ length: count }, () => ({
                id: generateId(), name: '', dasakams: [], contactNumber: '', notes: '',
                createdAt: new Date().toISOString(),
              })),
            ],
          }))
        }, 400) // slight delay to show loading
      },

      updateParticipant: (id, data) =>
        set(s => ({ participants: s.participants.map(p => p.id === id ? { ...p, ...data } : p) })),

      removeParticipant: (id) =>
        set(s => ({ participants: s.participants.filter(p => p.id !== id) })),

      setParticipants: (participants) => set({ participants }),

      appendParticipants: (incoming) =>
        set(s => ({ participants: [...s.participants, ...incoming] })),

      clearAll: () => set({ participants: [], searchQuery: '', pagination: { page: 1, pageSize: get().pagination.pageSize } }),

      autoAllocate: () =>
        set(s => ({ participants: autoAllocateDasakams(s.participants) })),

      clearDasakamAssignments: () =>
        set(s => ({ participants: s.participants.map(p => ({ ...p, dasakams: [] })) })),

      // Column management
      toggleColumnVisibility: (id) =>
        set(s => ({
          columns: s.columns.map(c =>
            c.id === id && !c.required ? { ...c, visible: !c.visible } : c
          ),
        })),

      addCustomColumn: (label, type) =>
        set(s => ({
          columns: [
            ...s.columns,
            {
              id: `custom_${generateId()}`,
              label,
              visible: true,
              required: false,
              type,
              isCustom: true,
            },
          ],
        })),

      removeCustomColumn: (id) =>
        set(s => ({ columns: s.columns.filter(c => c.id !== id) })),

      updateColumnLabel: (id, label) =>
        set(s => ({ columns: s.columns.map(c => c.id === id ? { ...c, label } : c) })),

      resetColumns: () => set({ columns: DEFAULT_COLUMNS }),

      // Pagination
      setPage: (page) => set(s => ({ pagination: { ...s.pagination, page } })),
      setPageSize: (pageSize) => set(s => ({ pagination: { page: 1, pageSize } })),

      // Preferences
      setLang: (lang) => set({ lang }),
      setDark: (dark) => set({ dark }),
      setSearchQuery: (searchQuery) => set({ searchQuery, pagination: { ...get().pagination, page: 1 } }),
      setLoading: (isLoading) => set({ isLoading }),

      // Computed
      filteredParticipants: () => {
        const { participants, searchQuery } = get()
        const q = searchQuery.trim().toLowerCase()
        if (!q) return participants
        return participants.filter(
          p =>
            p.name.toLowerCase().includes(q) ||
            p.dasakams.some(d => d.toString().includes(q)) ||
            (p.contactNumber || '').includes(q)
        )
      },

      paginatedParticipants: () => {
        const filtered = get().filteredParticipants()
        const { page, pageSize } = get().pagination
        const start = (page - 1) * pageSize
        return filtered.slice(start, start + pageSize)
      },

      totalPages: () => {
        const filtered = get().filteredParticipants()
        return Math.max(1, Math.ceil(filtered.length / get().pagination.pageSize))
      },

      visibleColumns: () => get().columns.filter(c => c.visible),
    }),
    { name: 'krishnaarpanam-v4' }
  )
)
