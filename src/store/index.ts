import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Participant, Lang } from '@/types'
import { generateId } from '@/utils/id'
import { autoAllocateDasakams } from '@/utils/dasakam'

interface Store {
  participants: Participant[]
  lang: Lang
  dark: boolean
  searchQuery: string

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

  // Preferences
  setLang: (lang: Lang) => void
  setDark: (dark: boolean) => void
  setSearchQuery: (q: string) => void

  // Computed
  filteredParticipants: () => Participant[]
}

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      participants: [],
      lang: 'en',
      dark: false,
      searchQuery: '',

      addEmpty: () =>
        set(s => ({
          participants: [
            ...s.participants,
            {
              id: generateId(),
              name: '',
              dasakams: [],
              contactNumber: '',
              notes: '',
              createdAt: new Date().toISOString(),
            },
          ],
        })),

      generateRows: (count: number) =>
        set(s => ({
          participants: [
            ...s.participants,
            ...Array.from({ length: count }, () => ({
              id: generateId(),
              name: '',
              dasakams: [],
              contactNumber: '',
              notes: '',
              createdAt: new Date().toISOString(),
            })),
          ],
        })),

      updateParticipant: (id, data) =>
        set(s => ({
          participants: s.participants.map(p => (p.id === id ? { ...p, ...data } : p)),
        })),

      removeParticipant: (id) =>
        set(s => ({ participants: s.participants.filter(p => p.id !== id) })),

      setParticipants: (participants) => set({ participants }),

      appendParticipants: (incoming) =>
        set(s => ({ participants: [...s.participants, ...incoming] })),

      clearAll: () => set({ participants: [], searchQuery: '' }),

      autoAllocate: () =>
        set(s => ({ participants: autoAllocateDasakams(s.participants) })),

      clearDasakamAssignments: () =>
        set(s => ({
          participants: s.participants.map(p => ({ ...p, dasakams: [] })),
        })),

      setLang: (lang) => set({ lang }),
      setDark: (dark) => set({ dark }),
      setSearchQuery: (searchQuery) => set({ searchQuery }),

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
    }),
    { name: 'krishnaarpanam-v3' }
  )
)
