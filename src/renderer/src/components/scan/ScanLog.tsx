import { useEffect, useRef } from 'react'
import { useScanStore } from '../../store/scan-store'
import { formatTimestamp } from '../../lib/format'

export default function ScanLog() {
  const scanLog = useScanStore((s) => s.scanLog)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [scanLog.length])

  const typeColors: Record<string, string> = {
    OK: 'log-ok',
    SCAN: 'log-scan',
    IDENT: 'log-ident',
    BUSY: 'log-busy',
    ERROR: 'log-error'
  }

  return (
    <div className="card-cyber-solid">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-mono text-xs font-bold text-text-secondary">
          ⌘ Scanning Cluster Output
        </span>
        <div className="flex gap-1 ml-auto">
          <div className="w-2 h-2 rounded-full bg-green animate-pulse" />
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse" style={{ animationDelay: '0.2s' }} />
          <div className="w-2 h-2 rounded-full bg-yellow animate-pulse" style={{ animationDelay: '0.4s' }} />
        </div>
      </div>

      <div className="bg-terminal-bg rounded p-3 max-h-48 overflow-y-auto font-mono text-[0.7rem] leading-relaxed">
        {scanLog.length === 0 ? (
          <div className="text-text-muted">Awaiting scan initiation...</div>
        ) : (
          scanLog.map((entry, i) => (
            <div key={i} className="flex gap-2">
              <span className="text-text-muted flex-shrink-0">{formatTimestamp(entry.timestamp)}</span>
              <span className={`font-bold flex-shrink-0 w-12 ${typeColors[entry.type] || 'text-text-muted'}`}>
                {entry.type}
              </span>
              <span className="text-text-secondary">{entry.message}</span>
            </div>
          ))
        )}
        <div ref={endRef} />
      </div>
    </div>
  )
}
