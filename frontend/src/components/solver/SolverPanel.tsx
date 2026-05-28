import { useState } from 'react'
import Slider from '../ui/Slider'

export interface SolverParams {
  reynoldsNumber: number
  viscosity: number
  inletVelocity: number
  turbulenceModel: 'laminar' | 'k-epsilon'
  maxIterations: number
  convergenceTolerance: number
}

interface SolverPanelProps {
  params: SolverParams
  onChange: (p: SolverParams) => void
}

export default function SolverPanel({ params, onChange }: SolverPanelProps) {
  const set = (key: keyof SolverParams) => (val: number | string) =>
    onChange({ ...params, [key]: val })

  return (
    <div className="flex flex-col gap-5">
      <p className="text-xs text-white/30 uppercase tracking-widest">Solver Parameters</p>

      <Slider
        label="Reynolds Number"
        value={params.reynoldsNumber}
        min={10}
        max={10000}
        step={10}
        onChange={set('reynoldsNumber') as (v: number) => void}
      />

      <Slider
        label="Inlet Velocity"
        value={params.inletVelocity}
        min={0.1}
        max={50}
        step={0.1}
        unit=" m/s"
        onChange={set('inletVelocity') as (v: number) => void}
      />

      <Slider
        label="Max Iterations"
        value={params.maxIterations}
        min={100}
        max={5000}
        step={100}
        onChange={set('maxIterations') as (v: number) => void}
      />

      <div className="flex flex-col gap-1.5">
        <label className="text-xs text-white/50">Turbulence Model</label>
        <div className="flex gap-2">
          {(['laminar', 'k-epsilon'] as const).map(model => (
            <button
              key={model}
              onClick={() => set('turbulenceModel')(model)}
              className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all ${
                params.turbulenceModel === model
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  : 'bg-white/5 text-white/40 hover:text-white/60 border border-white/8'
              }`}
            >
              {model}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}