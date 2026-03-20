import { useScanStore } from '../../store/scan-store'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  totalItems: number
  pageSize: number
}

export default function Pagination({ currentPage, totalPages, totalItems, pageSize }: PaginationProps) {
  const setPage = useScanStore((s) => s.setPage)

  const start = (currentPage - 1) * pageSize + 1
  const end = Math.min(currentPage * pageSize, totalItems)

  if (totalItems === 0) return null

  const pageNumbers: number[] = []
  for (let i = Math.max(1, currentPage - 1); i <= Math.min(totalPages, currentPage + 1); i++) {
    pageNumbers.push(i)
  }

  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-mono text-[0.65rem] text-text-muted">
        Showing {start}-{end} of {totalItems} detected entities
      </span>

      <div className="flex items-center gap-1">
        <button
          onClick={() => setPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="w-7 h-7 flex items-center justify-center rounded border border-border text-text-muted hover:border-accent hover:text-accent transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={14} />
        </button>

        {pageNumbers.map((num) => (
          <button
            key={num}
            onClick={() => setPage(num)}
            className={`w-7 h-7 flex items-center justify-center rounded text-mono text-[0.65rem] transition-all ${
              num === currentPage
                ? 'bg-accent text-bg font-bold'
                : 'border border-border text-text-muted hover:border-accent hover:text-accent'
            }`}
          >
            {num}
          </button>
        ))}

        <button
          onClick={() => setPage(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="w-7 h-7 flex items-center justify-center rounded border border-border text-text-muted hover:border-accent hover:text-accent transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  )
}
