import { Link } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'

const features = [
  {
    icon: '⚡',
    title: 'Runs in the browser',
    desc: 'No installation, no Linux, no terminal. Open a URL and start simulating on any OS.',
  },
  {
    icon: '🧠',
    title: 'AI design assistant',
    desc: 'Upload your geometry and the ML model instantly tells you where drag is coming from and how to fix it.',
  },
  {
    icon: '📐',
    title: 'Visual mesh editor',
    desc: 'Sketch geometry, assign boundary conditions, and preview the mesh — all with mouse clicks.',
  },
  {
    icon: '📡',
    title: 'Live solver feedback',
    desc: 'Residual plots and velocity fields update in real time as the solver iterates.',
  },
  {
    icon: '🔁',
    title: 'Gets smarter over time',
    desc: 'Every simulation trains the surrogate model. More users means better AI predictions for everyone.',
  },
  {
    icon: '🔓',
    title: 'MIT licensed',
    desc: 'Fully open-source. Download it, fork it, build on it. No paywalls, no sign-up required.',
  },
]

const stats = [
  { value: '2D', label: 'Navier-Stokes solver' },
  { value: 'ML', label: 'AI design feedback' },
  { value: '0', label: 'Installation required' },
  { value: 'MIT', label: 'Open source license' },
]

export default function Landing() {
  return (
    <div className="min-h-screen" style={{ background: '#0a0a0f' }}>
      <Navbar />

      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center min-h-screen text-center px-6 pt-16 overflow-hidden">

        {/* Background grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(rgba(59,130,246,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.03) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        {/* Glow */}
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />

        {/* Badge */}
        <div
          className="relative flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/30 mb-6"
          style={{ background: 'rgba(59,130,246,0.08)' }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
          <span className="text-blue-400 text-xs font-medium tracking-wide">
            India's first open-source CFD platform
          </span>
        </div>

        {/* Heading */}
        <h1 className="relative text-5xl md:text-7xl font-bold tracking-tight text-white leading-tight max-w-4xl mb-6">
          Simulate fluid dynamics.{' '}
          <span
            style={{
              background: 'linear-gradient(135deg, #3b82f6, #6366f1, #8b5cf6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            In your browser.
          </span>
        </h1>

        {/* Subheading */}
        <p className="relative text-lg md:text-xl text-white/50 max-w-2xl mb-10 leading-relaxed">
          FlowForge is a free, open-source CFD tool with a modern web interface,
          an AI design assistant that tells you exactly what to fix, and a solver
          that runs without any installation.
        </p>

        {/* CTA buttons */}
        <div className="relative flex flex-col sm:flex-row items-center gap-4 mb-16">
          <Link
            to="/dashboard"
            className="px-8 py-3.5 rounded-xl text-sm font-semibold text-white transition-all duration-150 hover:opacity-90"
            style={{
              background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
              boxShadow: '0 0 30px rgba(99,102,241,0.3)',
            }}
          >
            Start simulating - free forever
          </Link>
          <a  
            href="https://github.com/Soham-2305/flowforge"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3.5 rounded-xl text-sm font-medium text-white/70 border border-white/10 hover:border-white/20 hover:text-white transition-all duration-150 hover:bg-white/5"
          >
            View on GitHub
          </a>
        </div>

        {/* Stats */}
        <div className="relative flex flex-wrap justify-center gap-8 mb-20">
          {stats.map(stat => (
            <div key={stat.label} className="flex flex-col items-center gap-1">
              <span className="text-2xl font-bold text-white">{stat.value}</span>
              <span className="text-xs text-white/40">{stat.label}</span>
            </div>
          ))}
        </div>

        {/* Browser mockup */}
        <div
          className="relative w-full max-w-4xl rounded-2xl border border-white/10 overflow-hidden"
          style={{
            background: 'rgba(255,255,255,0.03)',
            boxShadow: '0 0 80px rgba(99,102,241,0.15)',
          }}
        >
          <div
            className="flex items-center gap-2 px-4 py-3 border-b border-white/10"
            style={{ background: 'rgba(255,255,255,0.03)' }}
          >
            <div className="w-3 h-3 rounded-full bg-red-500/60" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
            <div className="w-3 h-3 rounded-full bg-green-500/60" />
            <div
              className="flex-1 mx-4 px-3 py-1 rounded-md text-xs text-white/30 border border-white/10 text-center"
              style={{ background: 'rgba(255,255,255,0.03)' }}
            >
              app.flowforge.dev/editor/airfoil-demo
            </div>
          </div>
          <div
            className="h-72 md:h-96 flex items-center justify-center"
            style={{ background: 'rgba(10,10,20,0.8)' }}
          >
            <div className="flex flex-col items-center gap-3 text-white/20">
              <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1">
                <rect x="4" y="4" width="40" height="40" rx="4" />
                <path d="M14 24 Q24 10 34 24 Q24 38 14 24Z" />
                <circle cx="24" cy="24" r="3" />
              </svg>
              <span className="text-sm">CFD editor preview — coming soon</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Everything OpenFOAM isn't
          </h2>
          <p className="text-white/40 text-lg max-w-xl mx-auto">
            Built from scratch to be the CFD tool we always wished existed.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map(f => (
            <div
              key={f.title}
              className="p-6 rounded-2xl border border-white/8 hover:border-white/15 transition-all duration-200"
              style={{ background: 'rgba(255,255,255,0.02)' }}
            >
              <div className="text-2xl mb-3">{f.icon}</div>
              <h3 className="text-white font-semibold mb-2">{f.title}</h3>
              <p className="text-white/40 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-6 py-24 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Ready to simulate?
        </h2>
        <p className="text-white/40 mb-8">
          Free forever. Open source. No account needed to get started.
        </p>
        <Link
          to="/dashboard"
          className="inline-block px-8 py-3.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
          style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)' }}
        >
          Launch FlowForge
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/8 px-6 py-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded-md flex items-center justify-center text-white font-bold text-xs"
              style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)' }}
            >
              FF
            </div>
            <span className="text-white/40 text-sm">FlowForge — Open-source CFD platform</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-white/30">
            <a  
              href="https://github.com/Soham-2305/flowforge"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white/60 transition-colors"
            >
              GitHub
            </a>
            <span>MIT License</span>
            <span>Built by Soham Sawant</span>
          </div>
        </div>
      </footer>
    </div>
  )
}