import { useEffect, useRef } from 'react'

interface ResidualPlotProps {
  data: number[]
  running: boolean
}

export default function ResidualPlot({ data, running }: ResidualPlotProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    const W = canvas.width
    const H = canvas.height

    ctx.clearRect(0, 0, W, H)

    if (data.length < 2) {
      ctx.fillStyle = 'rgba(255,255,255,0.1)'
      ctx.font = '11px system-ui'
      ctx.textAlign = 'center'
      ctx.fillText('Residuals will appear here', W / 2, H / 2)
      return
    }

    const maxVal = Math.max(...data)
    const minVal = Math.min(...data)
    const range = maxVal - minVal || 1

    // Grid lines
    ctx.strokeStyle = 'rgba(255,255,255,0.05)'
    ctx.lineWidth = 1
    for (let i = 0; i <= 4; i++) {
      const y = (H * i) / 4
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke()
    }

    // Residual line
    ctx.beginPath()
    ctx.strokeStyle = running ? '#3b82f6' : '#6366f1'
    ctx.lineWidth = 1.5
    ctx.shadowColor = running ? '#3b82f6' : '#6366f1'
    ctx.shadowBlur = 4

    data.forEach((val, i) => {
      const x = (i / (data.length - 1)) * W
      const y = H - ((val - minVal) / range) * H * 0.85 - H * 0.05
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
    })
    ctx.stroke()
    ctx.shadowBlur = 0

    // Axis labels
    ctx.fillStyle = 'rgba(255,255,255,0.25)'
    ctx.font = '9px monospace'
    ctx.textAlign = 'right'
    ctx.fillText(maxVal.toExponential(1), W - 2, 10)
    ctx.fillText(minVal.toExponential(1), W - 2, H - 2)
    ctx.textAlign = 'left'
    ctx.fillText('0', 2, H - 2)
    ctx.fillText(`${data.length - 1}`, W - 20, H - 2)
  }, [data, running])

  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs text-white/30 uppercase tracking-widest">Residuals</p>
      <div className="rounded-lg overflow-hidden border border-white/8"
        style={{ background: 'rgba(5,5,12,0.8)' }}>
        <canvas
          ref={canvasRef}
          width={240}
          height={100}
          className="w-full"
          style={{ height: '100px' }}
        />
      </div>
      {data.length > 0 && (
        <p className="text-xs font-mono text-white/30 text-right">
          Last: {data[data.length - 1].toExponential(3)}
        </p>
      )}
    </div>
  )
}