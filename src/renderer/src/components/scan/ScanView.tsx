import { useState, useEffect, useRef } from 'react'
import { useScanStore } from '../../store/scan-store'
import { formatElapsed } from '../../lib/format'
import CircularProgress from './CircularProgress'
import ScanLog from './ScanLog'
import PlatformCards from './PlatformCards'
import { Play, Pause, X, Zap } from 'lucide-react'

export default function ScanView() {
  const {
    scanning, progress, games, scannedAt,
    setScanning, setProgress, setResults,
    addScanLog, clearScanLog, scanElapsed, setScanElapsed
  } = useScanStore()

  const [paused, setPaused] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const percentage = progress
    ? Math.round((progress.current / Math.max(progress.total, 1)) * 100)
    : scanning ? 0 : (scannedAt ? 100 : 0)

  // Elapsed timer
  useEffect(() => {
    if (scanning && !paused) {
      timerRef.current = setInterval(() => {
        setScanElapsed(useScanStore.getState().scanElapsed + 1)
      }, 1000)
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [scanning, paused])

  const handleStartScan = async () => {
    clearScanLog()
    setScanning(true)

    addScanLog({ timestamp: Date.now(), type: 'SCAN', message: 'Initiating full system scan...' })

    const unsub = window.api.onScanProgress((prog) => {
      setProgress(prog)
      addScanLog({
        timestamp: Date.now(),
        type: prog.detail ? 'IDENT' : 'SCAN',
        message: prog.phase
      })
    })

    try {
      const results = await window.api.startScan()
      if (results) {
        setResults(results)
        addScanLog({
          timestamp: Date.now(),
          type: 'OK',
          message: `Scan complete. ${results.games.length} games detected across ${results.disks.length} volumes.`
        })
      }
    } catch (err) {
      addScanLog({ timestamp: Date.now(), type: 'ERROR', message: `Scan failed: ${err}` })
    } finally {
      setScanning(false)
      unsub()
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left: Progress + Controls */}
        <div className="xl:col-span-2">
          <div className="card-cyber-solid flex flex-col items-center py-8">
            <CircularProgress percentage={percentage} />

            <div className="mt-6 text-center">
              <h2 className="text-mono text-lg font-bold text-text">
                {scanning ? 'Scan in Progress' : scannedAt ? 'Scan Complete' : 'Ready to Scan'}
              </h2>
              <p className="text-[0.7rem] text-text-muted mt-1 max-w-sm">
                {scanning
                  ? 'Vault kinetic engine is mapping local storage clusters...'
                  : scannedAt
                    ? `${games.length} games detected across all volumes`
                    : 'Initiate a full system scan to detect all installed games'
                }
              </p>
            </div>

            {/* Stats */}
            {(scanning || scannedAt) && (
              <div className="flex gap-8 mt-6">
                <div className="text-center">
                  <div className="text-label">Files Processed</div>
                  <div className="text-mono text-sm font-bold text-text mt-1">
                    {progress ? `${progress.current} / ${progress.total}` : '--'}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-label">Elapsed</div>
                  <div className="text-mono text-sm font-bold text-text mt-1">
                    {formatElapsed(scanElapsed)}
                  </div>
                </div>
              </div>
            )}

            {/* Controls */}
            <div className="flex gap-3 mt-6">
              {!scanning ? (
                <button
                  onClick={handleStartScan}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-accent text-bg text-mono text-xs font-bold uppercase tracking-wider hover:bg-accent-light transition-all glow-cyan"
                >
                  <Zap size={16} />
                  {scannedAt ? 'Re-Scan' : 'Start Scan'}
                </button>
              ) : (
                <>
                  <button
                    onClick={() => setPaused(!paused)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border text-text-secondary text-mono text-xs uppercase tracking-wider hover:border-accent hover:text-accent transition-all"
                  >
                    {paused ? <Play size={14} /> : <Pause size={14} />}
                    {paused ? 'Resume' : 'Pause'}
                  </button>
                  <button
                    className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-red/50 text-red text-mono text-xs uppercase tracking-wider hover:bg-red/10 transition-all"
                  >
                    <X size={14} />
                    Cancel Scan
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right: Platform Cards */}
        <div>
          <PlatformCards />
        </div>
      </div>

      {/* Terminal Log */}
      <ScanLog />
    </div>
  )
}
