interface StatusBarProps {
  step: number
  status: 'idle' | 'meshing' | 'running' | 'done' | 'error'
  iteration?: number
  maxIterations?: number
}

const stepLabels = ['Geometry', 'Mesh', 'Solver', 'Results']

const statusColors = {
  idle: 'text-white/30',
  meshing: 'text-yellow-400',
  running: 'text-blue-400',
  done: 'text-green-400',
  error: 'text-red-400',
}

const statusText = {
  idle: 'Ready',
  meshing: 'Generating mesh...',
  running: 'Solver running',
  done: 'Simulation complete',
  error: 'Error — check parameters',
}

export default function StatusBar({ step, status, iteration, maxIterations }: StatusBarProps) {
  return (
    <div
      className="h-9 border-b border-white/8 flex items-center justify-between px-4"
      style={{ background: 'rgba(10,10,15,0.9)' }}
    >
      {/* Step breadcrumb */}
      <div className="flex items-center gap-1">
        {stepLabels.map((label, i) => (
          <div key={label} className="flex items-center gap-1">
            <span className={`text-xs font-medium transition-colors ${
              i === step ? 'text-blue-400' : i < step ? 'text-white/40' : 'text-white/20'
            }`}>
              {label}
            </span>
            {i < stepLabels.length - 1 && (
              <span className="text-white/15 text-xs">›</span>
            )}
          </div>
        ))}
      </div>

      {/* Status + progress */}
      <div className="flex items-center gap-3">
        {status === 'running' && iteration !== undefined && maxIterations && (
          <div className="flex items-center gap-2">
            <div className="w-24 h-1 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-400 rounded-full transition-all duration-300"
                style={{ width: `${(iteration / maxIterations) * 100}%` }}
              />
            </div>
            <span className="text-xs font-mono text-white/40">
              {iteration}/{maxIterations}
            </span>
          </div>
        )}
        <div className="flex items-center gap-1.5">
          {status === 'running' && (
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
          )}
          <span className={`text-xs ${statusColors[status]}`}>
            {statusText[status]}
          </span>
        </div>
      </div>
    </div>
  )
}