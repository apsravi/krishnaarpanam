import type { Participant, DasakamStats } from '@/types'

export const TOTAL_DASAKAMS = 100

export function parseDasakam(input: string): number[] {
  if (!input?.trim()) return []
  const out: number[] = []
  input.split(',').forEach(part => {
    part = part.trim()
    if (part.includes('-')) {
      const [a, b] = part.split('-').map(Number)
      if (!isNaN(a) && !isNaN(b))
        for (let i = a; i <= b && i <= TOTAL_DASAKAMS; i++) out.push(i)
    } else {
      const n = Number(part)
      if (!isNaN(n) && n >= 1 && n <= TOTAL_DASAKAMS) out.push(n)
    }
  })
  return [...new Set(out)].sort((a, b) => a - b)
}

export function formatDasakam(arr: number[]): string {
  if (!arr?.length) return ''
  const s = [...arr].sort((a, b) => a - b)
  const ranges: string[] = []
  let start = s[0], end = s[0]
  for (let i = 1; i < s.length; i++) {
    if (s[i] === end + 1) end = s[i]
    else {
      ranges.push(start === end ? `${start}` : `${start}-${end}`)
      start = end = s[i]
    }
  }
  ranges.push(start === end ? `${start}` : `${start}-${end}`)
  return ranges.join(', ')
}

export function computeStats(participants: Participant[]): DasakamStats {
  const all = participants.flatMap(p => p.dasakams)
  const allocated = [...new Set(all)].sort((a, b) => a - b)
  const unallocated = Array.from({ length: 100 }, (_, i) => i + 1).filter(
    d => !allocated.includes(d)
  )
  const countMap: Record<number, number> = {}
  all.forEach(d => { countMap[d] = (countMap[d] || 0) + 1 })
  const duplicates = Object.entries(countMap)
    .filter(([, c]) => c > 1)
    .map(([d, c]) => ({ dasakam: +d, count: c }))
  return { allocated, unallocated, duplicates }
}

export function autoAllocateDasakams(participants: Participant[]): Participant[] {
  if (!participants.length) return participants
  const alloc: number[][] = participants.map(() => [])
  for (let i = 0; i < TOTAL_DASAKAMS; i++) alloc[i % participants.length].push(i + 1)
  return participants.map((p, i) => ({ ...p, dasakams: alloc[i] }))
}
