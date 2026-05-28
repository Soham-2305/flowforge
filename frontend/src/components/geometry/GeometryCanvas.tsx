import { useRef, useEffect, useState, useCallback } from 'react'

type Tool = 'select' | 'rect' | 'circle' | 'polygon' | 'airfoil'

interface Shape {
  id: string
  type: 'rect' | 'circle' | 'airfoil'
  x: number
  y: number
  w: number
  h: number
}

interface GeometryCanvasProps {
  activeTool: Tool
  onShapeChange?: (shapes: Shape[]) => void
}

const GRID_SIZE = 30

export default function GeometryCanvas({ activeTool, onShapeChange }: GeometryCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [shapes, setShapes] = useState<Shape[]>([])
  const [drawing, setDrawing] = useState(false)
  const [start, setStart] = useState({ x: 0, y: 0 })
  const [current, setCurrent] = useState({ x: 0, y: 0 })
  const [selected, setSelected] = useState<string | null>(null)

  const snap = (v: number) => Math.round(v / GRID_SIZE) * GRID_SIZE

  const getPos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect()
    return {
      x: snap(e.clientX - rect.left),
      y: snap(e.clientY - rect.top),
    }
  }

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Grid
    ctx.strokeStyle = 'rgba(255,255,255,0.04)'
    ctx.lineWidth = 1
    for (let x = 0; x < canvas.width; x += GRID_SIZE) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke()
    }
    for (let y = 0; y < canvas.height; y += GRID_SIZE) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke()
    }

    // Origin cross
    ctx.strokeStyle = 'rgba(59,130,246,0.2)'
    ctx.lineWidth = 1
    ctx.beginPath(); ctx.moveTo(canvas.width / 2, 0); ctx.lineTo(canvas.width / 2, canvas.height); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(0, canvas.height / 2); ctx.lineTo(canvas.width, canvas.height / 2); ctx.stroke()

    // Drawn shapes
    shapes.forEach(shape => {
      const isSelected = selected === shape.id
      ctx.strokeStyle = isSelected ? '#3b82f6' : 'rgba(99,102,241,0.8)'
      ctx.fillStyle = isSelected ? 'rgba(59,130,246,0.12)' : 'rgba(99,102,241,0.06)'
      ctx.lineWidth = isSelected ? 2 : 1.5

      if (shape.type === 'rect') {
        ctx.beginPath()
        ctx.roundRect(shape.x, shape.y, shape.w, shape.h, 2)
        ctx.fill(); ctx.stroke()

        // Dimension labels
        ctx.fillStyle = 'rgba(255,255,255,0.4)'
        ctx.font = '10px monospace'
        ctx.fillText(`${Math.abs(Math.round(shape.w / GRID_SIZE))}u`, shape.x + shape.w / 2 - 10, shape.y + shape.h + 14)
        ctx.fillText(`${Math.abs(Math.round(shape.h / GRID_SIZE))}u`, shape.x + shape.w + 6, shape.y + shape.h / 2 + 4)
      }

      if (shape.type === 'circle') {
        ctx.beginPath()
        ctx.ellipse(shape.x + shape.w / 2, shape.y + shape.h / 2, Math.abs(shape.w / 2), Math.abs(shape.h / 2), 0, 0, Math.PI * 2)
        ctx.fill(); ctx.stroke()
      }

      if (shape.type === 'airfoil') {
        // Simple NACA-like shape
        ctx.beginPath()
        const cx = shape.x, cy = shape.y + shape.h / 2
        const len = shape.w, thick = shape.h / 2
        ctx.moveTo(cx, cy)
        for (let i = 0; i <= 50; i++) {
          const t = i / 50
          const x = cx + t * len
          const y = cy - thick * Math.sin(Math.PI * t) * (1 - t * 0.3)
          i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
        }
        for (let i = 50; i >= 0; i--) {
          const t = i / 50
          const x = cx + t * len
          const y = cy + thick * Math.sin(Math.PI * t) * (1 - t * 0.3) * 0.4
          ctx.lineTo(x, y)
        }
        ctx.closePath()
        ctx.fill(); ctx.stroke()
      }
    })

    // Preview shape while drawing
    if (drawing) {
      const x = Math.min(start.x, current.x)
      const y = Math.min(start.y, current.y)
      const w = Math.abs(current.x - start.x)
      const h = Math.abs(current.y - start.y)

      ctx.strokeStyle = '#3b82f6'
      ctx.fillStyle = 'rgba(59,130,246,0.1)'
      ctx.lineWidth = 1.5
      ctx.setLineDash([4, 4])

      if (activeTool === 'rect') {
        ctx.beginPath(); ctx.roundRect(x, y, w, h, 2); ctx.fill(); ctx.stroke()
      } else if (activeTool === 'circle') {
        ctx.beginPath(); ctx.ellipse(x + w / 2, y + h / 2, w / 2, h / 2, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke()
      } else if (activeTool === 'airfoil') {
        ctx.beginPath()
        const cy2 = start.y + h / 2
        for (let i = 0; i <= 50; i++) {
          const t = i / 50
          const px = start.x + t * w
          const py = cy2 - h / 2 * Math.sin(Math.PI * t) * (1 - t * 0.3)
          i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py)
        }
        for (let i = 50; i >= 0; i--) {
          const t = i / 50
          const px = start.x + t * w
          const py = cy2 + h / 2 * Math.sin(Math.PI * t) * (1 - t * 0.3) * 0.4
          ctx.lineTo(px, py)
        }
        ctx.closePath(); ctx.fill(); ctx.stroke()
      }

      ctx.setLineDash([])
    }
  }, [shapes, drawing, start, current, activeTool, selected])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      draw()
    }
    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [draw])

  useEffect(() => { draw() }, [draw])

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const pos = getPos(e)
    if (activeTool === 'select') {
      const hit = shapes.find(s =>
        pos.x >= s.x && pos.x <= s.x + s.w && pos.y >= s.y && pos.y <= s.y + s.h
      )
      setSelected(hit?.id ?? null)
      return
    }
    setDrawing(true)
    setStart(pos)
    setCurrent(pos)
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!drawing) return
    setCurrent(getPos(e))
  }

  const handleMouseUp = () => {
    if (!drawing) return
    setDrawing(false)

    const x = Math.min(start.x, current.x)
    const y = Math.min(start.y, current.y)
    const w = current.x - start.x
    const h = current.y - start.y

    if (Math.abs(w) < 10 || Math.abs(h) < 10) return

    const type = activeTool === 'airfoil' ? 'airfoil' : activeTool === 'circle' ? 'circle' : 'rect'
    const newShape: Shape = { id: Date.now().toString(), type, x, y, w, h }
    const updated = [...shapes, newShape]
    setShapes(updated)
    onShapeChange?.(updated)
  }

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{
        cursor: activeTool === 'select' ? 'default' : 'crosshair',
        background: 'rgba(8,8,16,0.95)',
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    />
  )
}