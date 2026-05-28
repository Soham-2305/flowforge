import Button from '../ui/Button'

type Tool = 'select' | 'rect' | 'circle' | 'polygon' | 'airfoil'

interface ShapeToolbarProps {
  activeTool: Tool
  onToolChange: (tool: Tool) => void
  onClear: () => void
}

const tools: { id: Tool; icon: string; label: string }[] = [
  { id: 'select', icon: '↖', label: 'Select' },
  { id: 'rect', icon: '▭', label: 'Rectangle' },
  { id: 'circle', icon: '○', label: 'Circle' },
  { id: 'polygon', icon: '⬡', label: 'Polygon' },
  { id: 'airfoil', icon: '✈', label: 'NACA Airfoil' },
]

export default function ShapeToolbar({ activeTool, onToolChange, onClear }: ShapeToolbarProps) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-xs text-white/30 uppercase tracking-widest mb-1">Tools</p>
      {tools.map(tool => (
        <button
          key={tool.id}
          onClick={() => onToolChange(tool.id)}
          className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all ${
            activeTool === tool.id
              ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
              : 'text-white/50 hover:text-white hover:bg-white/5'
          }`}
        >
          <span className="text-base w-5 text-center">{tool.icon}</span>
          <span className="text-xs font-medium">{tool.label}</span>
        </button>
      ))}
      <div className="border-t border-white/8 mt-2 pt-2">
        <Button variant="ghost" size="sm" onClick={onClear} className="w-full justify-start">
          <span className="text-xs">Clear canvas</span>
        </Button>
      </div>
    </div>
  )
}