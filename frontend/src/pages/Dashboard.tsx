import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import { projectsApi, type Project } from '../api/projects'

const statusColors: Record<string, string> = {
  completed: 'bg-green-500/20 text-green-400',
  done:      'bg-green-500/20 text-green-400',
  running:   'bg-blue-500/20 text-blue-400',
  failed:    'bg-red-500/20 text-red-400',
  error:     'bg-red-500/20 text-red-400',
  idle:      'bg-white/10 text-white/40',
}

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    projectsApi.list()
      .then(res => setProjects(res.data))
      .catch(() => setError('Could not connect to backend'))
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault()
    await projectsApi.delete(id)
    setProjects(prev => prev.filter(p => p.id !== id))
  }

  return (
    <div className="min-h-screen" style={{ background: '#0a0a0f' }}>
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 pt-28 pb-16">

        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">My Simulations</h1>
            <p className="text-white/40 text-sm">
              {loading ? 'Loading...' : `${projects.length} project${projects.length !== 1 ? 's' : ''}`}
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

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 rounded-xl border border-red-500/20 bg-red-500/5 text-red-400 text-sm">
            {error} — make sure the backend is running on port 8000
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-32">
            <div className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && projects.length === 0 && <EmptyState />}

        {/* Project grid */}
        {!loading && projects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map(p => (
              <ProjectCard key={p.id} project={p} onDelete={handleDelete} />
            ))}
            <NewProjectCard />
          </div>
        )}
      </div>
    </div>
  )
}

function ProjectCard({
  project,
  onDelete,
}: {
  project: Project
  onDelete: (id: string, e: React.MouseEvent) => void
}) {
  const icon = project.geometry === 'Airfoil' ? '✈' : project.geometry === 'Channel' ? '⟹' : '◈'
  const timeAgo = project.updated_at
    ? new Date(project.updated_at).toLocaleDateString()
    : 'Just created'

  return (
    <Link
      to={`/editor/${project.id}`}
      className="group relative p-6 rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-200 flex flex-col gap-4"
      style={{ background: 'rgba(255,255,255,0.02)' }}
    >
      {/* Delete button */}
      <button
        onClick={e => onDelete(project.id, e)}
        className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 w-7 h-7 rounded-lg flex items-center justify-center text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-all"
      >
        <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="1" y1="1" x2="11" y2="11" />
          <line x1="11" y1="1" x2="1" y2="11" />
        </svg>
      </button>

      <div className="flex items-start justify-between">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
          style={{ background: 'rgba(59,130,246,0.15)' }}
        >
          {icon}
        </div>
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColors[project.status] ?? 'bg-white/10 text-white/40'}`}>
          {project.status}
        </span>
      </div>

      <div>
        <h3 className="text-white font-semibold text-base mb-1 group-hover:text-blue-400 transition-colors">
          {project.name}
        </h3>
        <p className="text-white/40 text-xs">{project.geometry} · {timeAgo}</p>
      </div>

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
          <p className="text-white/20 text-xs">No results yet</p>
        </div>
      )}
    </Link>
  )
}

function NewProjectCard() {
  return (
    <Link
      to="/editor/new"
      className="group p-6 rounded-2xl border border-dashed border-white/15 hover:border-blue-500/40 transition-all duration-200 flex flex-col items-center justify-center gap-3 min-h-48"
      style={{ background: 'rgba(255,255,255,0.01)' }}
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform"
        style={{ background: 'rgba(59,130,246,0.1)' }}
      >
        <svg width="20" height="20" fill="none" stroke="#3b82f6" strokeWidth="2">
          <line x1="10" y1="3" x2="10" y2="17" />
          <line x1="3" y1="10" x2="17" y2="10" />
        </svg>
      </div>
      <p className="text-white/40 text-sm group-hover:text-white/60 transition-colors">New simulation</p>
    </Link>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-32 text-center">
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
        style={{ background: 'rgba(59,130,246,0.1)' }}>
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