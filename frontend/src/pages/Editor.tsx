import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import StatusBar from '../components/layout/StatusBar'
import ShapeToolbar from '../components/geometry/ShapeToolbar'
import GeometryCanvas from '../components/geometry/GeometryCanvas'
import SolverPanel, { type SolverParams } from '../components/solver/SolverPanel'
import BoundaryPanel from '../components/solver/BoundaryPanel'
import RunControls from '../components/solver/RunControls'
import ResidualPlot from '../components/solver/ResidualPlot'
import { projectsApi } from '../api/projects'
import { solverApi } from '../api/solver'

type Step = 0 | 1 | 2 | 3
type Status = 'idle' | 'meshing' | 'running' | 'done' | 'error'
type Tool = 'select' | 'rect' | 'circle' | 'polygon' | 'airfoil'

const stepLabels = ['Geometry', 'Mesh', 'Solver', 'Results']

const defaultSolverParams: SolverParams = {
  reynoldsNumber: 500,
  viscosity: 0.001,
  inletVelocity: 1.0,
  turbulenceModel: 'laminar',
  maxIterations: 1000,
  convergenceTolerance: 1e-5,
}

export default function Editor() {
  const { projectId } = useParams()
  const [step, setStep] = useState<Step>(0)
  const [status, setStatus] = useState<Status>('idle')
  const [activeTool, setActiveTool] = useState<Tool>('rect')
  const [hasGeometry, setHasGeometry] = useState(false)
  const [solverParams, setSolverParams] = useState(defaultSolverParams)
  const [boundaries, setBoundaries] = useState({})
  const [residuals, setResiduals] = useState<number[]>([])
  const [iteration, setIteration] = useState(0)
  const simulationRef = useRef<ReturnType<typeof setInterval> | null>(null)

const navigate = useNavigate()
const isNew = projectId === 'new'
const [realProjectId, setRealProjectId] = useState<string | null>(
  isNew ? null : (projectId ?? null)
)

// Create project in DB when user first draws something
const ensureProject = async (): Promise<string> => {
  if (realProjectId) return realProjectId
  const res = await projectsApi.create('Untitled simulation')
  const id = res.data.id
  setRealProjectId(id)
  navigate(`/editor/${id}`, { replace: true })
  return id
}

// WebSocket connection
const wsRef = useRef<WebSocket | null>(null)

const handleRun = async () => {
  const id = await ensureProject()

  // Save current shapes + params
  await projectsApi.update(id, {
    solver_params: solverParams,
    boundaries,
  })

  setStatus('meshing')
  setResiduals([])
  setIteration(0)

  // Connect WebSocket
  const ws = new WebSocket(`ws://localhost:8000/ws/${id}`)
  wsRef.current = ws

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data)
    if (data.type === 'progress') {
      setIteration(data.iteration)
      setResiduals(prev => [...prev, data.residual])
      setStatus('running')
      setStep(2)
    }
    if (data.type === 'complete') {
      setStatus('done')
      setStep(3)
      setIteration(data.iteration)
      setResiduals(prev => [...prev, data.residual])
    }
    if (data.type === 'error') {
      setStatus('error')
    }
  }

  ws.onopen = async () => {
    setStatus('running')
    await solverApi.run(id, solverParams)
  }
}

const handleStop = async () => {
  if (realProjectId) await solverApi.stop(realProjectId)
  wsRef.current?.close()
  setStatus('idle')
}

const handleReset = () => {
  wsRef.current?.close()
  setStatus('idle')
  setResiduals([])
  setIteration(0)
  setStep(0)
}

useEffect(() => () => { wsRef.current?.close() }, [])

  useEffect(() => () => {
    if (simulationRef.current) clearInterval(simulationRef.current)
  }, [])

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ background: '#0a0a0f' }}>
      <Navbar />

      {/* StatusBar — sits just below Navbar */}
      <div className="pt-16">
        <StatusBar
          step={step}
          status={status}
          iteration={iteration}
          maxIterations={solverParams.maxIterations}
        />
      </div>

      {/* 3-panel workspace */}
      <div className="flex flex-1 overflow-hidden">

        {/* Left panel */}
        <div
          className="w-56 flex-shrink-0 border-r border-white/8 flex flex-col overflow-y-auto"
          style={{ background: 'rgba(10,10,18,0.95)' }}
        >
          {/* Step tabs */}
          <div className="flex border-b border-white/8">
            {stepLabels.map((label, i) => (
              <button
                key={label}
                onClick={() => setStep(i as Step)}
                className={`flex-1 py-2.5 text-xs font-medium transition-colors ${
                  step === i
                    ? 'text-blue-400 border-b-2 border-blue-400'
                    : 'text-white/30 hover:text-white/50'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <div className="p-3 flex flex-col gap-4 flex-1">
            <p className="text-xs font-medium text-white/60">{stepLabels[step]}</p>

            {step === 0 && (
              <ShapeToolbar
                activeTool={activeTool}
                onToolChange={setActiveTool}
                onClear={() => setHasGeometry(false)}
              />
            )}

            {step === 1 && (
              <div className="flex flex-col gap-3">
                <p className="text-xs text-white/30 uppercase tracking-widest">Mesh Settings</p>
                <div className="flex flex-col gap-2 text-xs text-white/50">
                  <div className="flex justify-between">
                    <span>Cell size</span>
                    <span className="font-mono text-white/70">0.05 m</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Refinement</span>
                    <span className="font-mono text-white/70">2x near walls</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total cells</span>
                    <span className="font-mono text-white/70">~12,400</span>
                  </div>
                </div>
                <button
                  className="mt-2 w-full py-2 rounded-lg text-xs font-medium text-white transition-all hover:opacity-90"
                  style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)' }}
                  onClick={() => setStep(2)}
                >
                  Generate Mesh
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="flex flex-col gap-4">
                <SolverPanel params={solverParams} onChange={setSolverParams} />
                <div className="border-t border-white/8 pt-4">
                  <BoundaryPanel boundaries={boundaries} onChange={setBoundaries} />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="flex flex-col gap-3 text-xs">
                <p className="text-xs text-white/30 uppercase tracking-widest">Results</p>
                {status === 'done' ? (
                  <>
                    <div className="p-3 rounded-lg border border-green-500/20"
                      style={{ background: 'rgba(34,197,94,0.05)' }}>
                      <p className="text-green-400 font-medium mb-2">Converged</p>
                      <div className="flex flex-col gap-1 text-white/60">
                        <div className="flex justify-between">
                          <span>Iterations</span>
                          <span className="font-mono">{iteration}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Final residual</span>
                          <span className="font-mono">{residuals[residuals.length - 1]?.toExponential(2)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-3 rounded-lg border border-white/8"
                      style={{ background: 'rgba(255,255,255,0.02)' }}>
                      <p className="text-white/50 mb-2">Aerodynamic coefficients</p>
                      <div className="flex gap-4">
                        <div>
                          <p className="text-white/30 text-xs">Cd</p>
                          <p className="text-white font-mono font-medium">0.028</p>
                        </div>
                        <div>
                          <p className="text-white/30 text-xs">Cl</p>
                          <p className="text-white font-mono font-medium">0.412</p>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <p className="text-white/25">Run the simulation first</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Centre canvas */}
        <div className="flex-1 relative overflow-hidden">
          {step === 0 || step === 1 ? (
            <GeometryCanvas
              activeTool={activeTool}
              onShapeChange={shapes => setHasGeometry(shapes.length > 0)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center"
              style={{ background: 'rgba(8,8,16,0.95)' }}>
              <div className="flex flex-col items-center gap-3 text-white/20">
                <svg width="64" height="64" fill="none" stroke="currentColor" strokeWidth="1">
                  <rect x="6" y="6" width="52" height="52" rx="4" />
                  <path d="M16 32 Q32 12 48 32 Q32 52 16 32Z" />
                  <circle cx="32" cy="32" r="4" />
                </svg>
                <p className="text-sm">
                  {status === 'running' ? 'Solver running...' :
                   status === 'done' ? 'Field visualiser — coming in Month 2' :
                   'Start the simulation to see results'}
                </p>
              </div>
            </div>
          )}

          {/* Tool hint overlay */}
          {step === 0 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
              <div
                className="px-3 py-1.5 rounded-full border border-white/10 text-xs text-white/30"
                style={{ background: 'rgba(10,10,15,0.8)' }}
              >
                Click and drag to draw · Grid snap active
              </div>
            </div>
          )}
        </div>

        {/* Right panel */}
        <div
          className="w-64 flex-shrink-0 border-l border-white/8 flex flex-col gap-0 overflow-y-auto"
          style={{ background: 'rgba(10,10,18,0.95)' }}
        >
          <div className="p-4 border-b border-white/8">
            <p className="text-xs text-white/40 mb-1">Project</p>
            <p className="text-sm font-medium text-white">
              {isNew ? 'Untitled simulation' : `Project ${projectId}`}
            </p>
          </div>

          <div className="p-4 border-b border-white/8">
            <RunControls
              status={status}
              onRun={handleRun}
              onStop={handleStop}
              onReset={handleReset}
              hasGeometry={hasGeometry}
            />
          </div>

          <div className="p-4 border-b border-white/8">
            <ResidualPlot data={residuals} running={status === 'running'} />
          </div>

          {/* AI panel placeholder */}
          <div className="p-4">
            <p className="text-xs text-white/30 uppercase tracking-widest mb-3">AI Assistant</p>
            <div
              className="p-3 rounded-lg border border-white/8 text-center"
              style={{ background: 'rgba(99,102,241,0.05)' }}
            >
              <p className="text-xs text-white/25">
                AI design feedback available after simulation completes
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}