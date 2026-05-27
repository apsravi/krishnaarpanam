import React from 'react'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import type { ThemeTokens } from '@/utils/theme'

interface PaginationProps {
  page: number
  pageSize: number
  total: number
  totalPages: number
  onPageChange: (p: number) => void
  onPageSizeChange: (size: number) => void
  theme: ThemeTokens
}

const PAGE_SIZES = [5, 10, 20, 50]

const Pagination: React.FC<PaginationProps> = ({
  page, pageSize, total, totalPages, onPageChange, onPageSizeChange, theme,
}) => {
  if (total === 0) return null

  const start = (page - 1) * pageSize + 1
  const end = Math.min(page * pageSize, total)

  const btnBase: React.CSSProperties = {
    background: 'transparent',
    border: `1px solid ${theme.inputBorder}`,
    borderRadius: '6px',
    color: theme.text,
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
    transition: 'all 0.15s',
    flexShrink: 0,
  }

  const btnDisabled: React.CSSProperties = {
    ...btnBase,
    opacity: 0.35,
    cursor: 'not-allowed',
    color: theme.textLight,
  }

  const btnActive: React.CSSProperties = {
    ...btnBase,
    background: 'linear-gradient(135deg,#8B1A1A,#C9A84C)',
    color: '#FDF6E3',
    border: 'none',
    fontWeight: 700,
  }

  // Build visible page numbers
  const getPages = () => {
    const pages: (number | '...')[] = []
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }
    pages.push(1)
    if (page > 3) pages.push('...')
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
      pages.push(i)
    }
    if (page < totalPages - 2) pages.push('...')
    pages.push(totalPages)
    return pages
  }

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '10px',
      marginTop: '16px',
      padding: '12px 16px',
      background: theme.statsBg,
      border: `1px solid ${theme.statsBorder}`,
      borderRadius: '10px',
    }}>
      {/* Info */}
      <div style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: '0.92rem',
        color: theme.textLight,
        flexShrink: 0,
      }}>
        Showing <span style={{ color: theme.textMid, fontWeight: 600 }}>{start}–{end}</span> of{' '}
        <span style={{ color: theme.textMid, fontWeight: 600 }}>{total}</span> participants
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
        {/* Page size */}
        <select
          value={pageSize}
          onChange={e => onPageSizeChange(Number(e.target.value))}
          style={{
            background: theme.inputBg,
            border: `1px solid ${theme.inputBorder}`,
            borderRadius: '6px',
            color: theme.text,
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '0.88rem',
            padding: '4px 8px',
            cursor: 'pointer',
            outline: 'none',
          }}
          aria-label="Rows per page"
        >
          {PAGE_SIZES.map(s => (
            <option key={s} value={s}>{s} / page</option>
          ))}
        </select>

        {/* First */}
        <button
          onClick={() => onPageChange(1)}
          disabled={page === 1}
          style={page === 1 ? btnDisabled : btnBase}
          aria-label="First page"
        >
          <ChevronsLeft size={14} />
        </button>

        {/* Prev */}
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          style={page === 1 ? btnDisabled : btnBase}
          aria-label="Previous page"
        >
          <ChevronLeft size={14} />
        </button>

        {/* Page numbers */}
        {getPages().map((p, i) =>
          p === '...' ? (
            <span
              key={`ellipsis-${i}`}
              style={{ color: theme.textLight, fontFamily: "'Cormorant Garamond', serif", fontSize: '0.9rem', padding: '0 2px' }}
            >
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p as number)}
              style={p === page ? btnActive : btnBase}
              aria-label={`Page ${p}`}
              aria-current={p === page ? 'page' : undefined}
            >
              <span style={{ fontFamily: "'Cinzel Decorative', serif", fontSize: '0.6rem' }}>{p}</span>
            </button>
          )
        )}

        {/* Next */}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          style={page === totalPages ? btnDisabled : btnBase}
          aria-label="Next page"
        >
          <ChevronRight size={14} />
        </button>

        {/* Last */}
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={page === totalPages}
          style={page === totalPages ? btnDisabled : btnBase}
          aria-label="Last page"
        >
          <ChevronsRight size={14} />
        </button>
      </div>
    </div>
  )
}

export default Pagination
