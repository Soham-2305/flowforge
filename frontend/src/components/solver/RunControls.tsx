import Button from '../ui/Button'

interface RunControlsProps {
  status: 'idle' | 'meshing' | 'running' | 'done' | 'error'
  onRun: () => void
  onStop: () => void
  onReset: () => void
  hasGeometry: boolean
}

export default function RunControls({ status, onRun, onStop, onReset, hasGeometry }: RunControlsProps) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs text-white/30 uppercase tracking-widest">Simulation</p>

      {status === 'idle' || status === 'done' || status === 'error' ? (
        <Button
          onClick={onRun}
          disabled={!hasGeometry}
          className="w-full justify-center gap-2"
        >
          <svg width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
            <path d="M4 2l10 6-10 6z" />
          </svg>
          {status === 'done' ? 'Re-run Simulation' : 'Run Simulation'}
        </Button>
      ) : (
        <Button
          onClick={onStop}
          variant="danger"
          className="w-full justify-center gap-2"
        >
          <svg width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
            <rect x="3" y="3" width="10" height="10" />
          </svg>
          Stop
        </Button>
      )}

      {(status === 'done' || status === 'error') && (
        <Button variant="secondary" size="sm" onClick={onReset} className="w-full justify-center">
          Reset
        </Button>
      )}

      {!hasGeometry && (
        <p className="text-xs text-white/25 text-center">
          Draw a geometry first
        </p>
      )}
    </div>
  )
}