interface BoundaryCondition {
  type: 'inlet' | 'outlet' | 'wall' | 'symmetry'
  velocity?: number
  pressure?: number
}

interface BoundaryPanelProps {
  boundaries: Record<string, BoundaryCondition>
  onChange: (b: Record<string, BoundaryCondition>) => void
}

const bcColors = {
  inlet: 'text-blue-400 bg-blue-500/15 border-blue-500/30',
  outlet: 'text-green-400 bg-green-500/15 border-green-500/30',
  wall: 'text-white/50 bg-white/5 border-white/15',
  symmetry: 'text-purple-400 bg-purple-500/15 border-purple-500/30',
}

const defaultBoundaries: Record<string, BoundaryCondition> = {
  Left: { type: 'inlet', velocity: 1.0 },
  Right: { type: 'outlet', pressure: 0 },
  Top: { type: 'wall' },
  Bottom: { type: 'wall' },
}

export default function BoundaryPanel({ boundaries, onChange }: BoundaryPanelProps) {
  const walls = Object.keys(boundaries).length > 0 ? boundaries : defaultBoundaries

  const cycleType = (wall: string) => {
    const types: BoundaryCondition['type'][] = ['inlet', 'outlet', 'wall', 'symmetry']
    const current = walls[wall].type
    const next = types[(types.indexOf(current) + 1) % types.length]
    onChange({ ...walls, [wall]: { ...walls[wall], type: next } })
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs text-white/30 uppercase tracking-widest">Boundary Conditions</p>
      <p className="text-xs text-white/25">Click a boundary to cycle its type</p>

      {Object.entries(walls).map(([wall, bc]) => (
        <button
          key={wall}
          onClick={() => cycleType(wall)}
          className={`flex items-center justify-between px-3 py-2 rounded-lg border text-xs transition-all ${bcColors[bc.type]}`}
        >
          <span className="font-medium">{wall}</span>
          <span className="opacity-70 uppercase tracking-wider">{bc.type}</span>
        </button>
      ))}

      <div className="mt-1 p-3 rounded-lg border border-white/8"
        style={{ background: 'rgba(255,255,255,0.02)' }}>
        <p className="text-xs text-white/30 mb-2">Legend</p>
        <div className="flex flex-wrap gap-2">
          {Object.entries(bcColors).map(([type, color]) => (
            <span key={type} className={`text-xs px-2 py-0.5 rounded border ${color}`}>
              {type}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}