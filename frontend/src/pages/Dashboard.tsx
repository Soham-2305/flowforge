import { Link } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'

const mockProjects: {
  id: string
  name: string
  geometry: string
  lastRun: string
  status: string
  cd: number | null
  cl: number | null
}[] = []

const statusColors: Record<string, string> = {
  completed: 'bg-green-500/20 text-green-400',
  running: 'bg-blue-500/20 text-blue-400',
  failed: 'bg-red-500/20 text-red-400',
}

export default function Dashboard() {
  return (
    <div className="min-h-screen" style={{ background: '#0a0a0f' }}>
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 pt-28 pb-16">

        {/* Header row */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">My Simulations</h1>
            <p className="text-white/40 text-sm">
              {mockProjects.length} project{mockProjects.length !== 1 ? 's' : ''}
            </p>
          </div>
          <Link
            to="/editor/new"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)' }}
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="8" y1="2" x2="8" y2="14" />
              <line x1="2" y1="8" x2="14" y2="8" />
            </svg>
            New Simulation
          </Link>
        </div>

        {/* Project grid */}
        {mockProjects.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockProjects.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
            <NewProjectCard />
          </div>
        )}
      </div>
    </div>
  )
}

function ProjectCard({ project }: { project: typeof mockProjects[0] }) {
  return (
    <Link
      to={`/editor/${project.id}`}
      className="group p-6 rounded-2xl border border-white/10 hover:border-white/20
        transition-all duration-200 flex flex-col gap-4"
      style={{ background: 'rgba(255,255,255,0.02)' }}
    >
      {/* Top row */}
      <div className="flex items-start justify-between">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
          style={{ background: 'rgba(59,130,246,0.15)' }}
        >
          {project.geometry === 'Airfoil' ? '✈' : project.geometry === 'Channel' ? '⟹' : '◈'}
        </div>
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColors[project.status]}`}>
          {project.status}
        </span>
      </div>

      {/* Name */}
      <div>
        <h3 className="text-white font-semibold text-base mb-1 group-hover:text-blue-400 transition-colors">
          {project.name}
        </h3>
        <p className="text-white/40 text-xs">{project.geometry} · {project.lastRun}</p>
      </div>

      {/* Cd / Cl metrics */}
      {project.cd !== null ? (
        <div className="flex gap-4 pt-2 border-t border-white/8">
          <div>
            <p className="text-white/30 text-xs mb-0.5">Drag (Cd)</p>
            <p className="text-white font-mono text-sm font-medium">{project.cd}</p>
          </div>
          <div>
            <p className="text-white/30 text-xs mb-0.5">Lift (Cl)</p>
            <p className="text-white font-mono text-sm font-medium">{project.cl}</p>
          </div>
        </div>
      ) : (
        <div className="pt-2 border-t border-white/8">
          <p className="text-white/20 text-xs">No aerodynamic data</p>
        </div>
      )}
    </Link>
  )
}

function NewProjectCard() {
  return (
    <Link
      to="/editor/new"
      className="group p-6 rounded-2xl border border-dashed border-white/15
        hover:border-blue-500/40 transition-all duration-200 flex flex-col
        items-center justify-center gap-3 min-h-48"
      style={{ background: 'rgba(255,255,255,0.01)' }}
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center
          group-hover:scale-110 transition-transform"
        style={{ background: 'rgba(59,130,246,0.1)' }}
      >
        <svg width="20" height="20" fill="none" stroke="#3b82f6" strokeWidth="2">
          <line x1="10" y1="3" x2="10" y2="17" />
          <line x1="3" y1="10" x2="17" y2="10" />
        </svg>
      </div>
      <p className="text-white/40 text-sm group-hover:text-white/60 transition-colors">
        New simulation
      </p>
    </Link>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-32 text-center">
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
        style={{ background: 'rgba(59,130,246,0.1)' }}
      >
        <svg width="32" height="32" fill="none" stroke="#3b82f6" strokeWidth="1.5">
          <rect x="4" y="4" width="24" height="24" rx="3" />
          <path d="M10 16 Q16 8 22 16 Q16 24 10 16Z" />
        </svg>
      </div>
      <h3 className="text-white font-semibold text-lg mb-2">No simulations yet</h3>
      <p className="text-white/40 text-sm mb-8 max-w-xs">
        Create your first simulation to start exploring fluid dynamics in your browser.
      </p>
      <Link
        to="/editor/new"
        className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
        style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)' }}
      >
        Create first simulation
      </Link>
    </div>
  )
}