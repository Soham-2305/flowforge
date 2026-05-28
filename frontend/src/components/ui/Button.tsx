interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md'
  disabled?: boolean
  className?: string
  type?: 'button' | 'submit'
}

export default function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  type = 'button',
}: ButtonProps) {
  const base = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed'

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
  }

  const variants = {
    primary: 'text-white hover:opacity-90',
    secondary: 'bg-white/8 text-white/80 hover:bg-white/12 hover:text-white border border-white/10',
    ghost: 'text-white/50 hover:text-white hover:bg-white/8',
    danger: 'bg-red-500/20 text-red-400 hover:bg-red-500/30',
  }

  const primaryStyle = variant === 'primary'
    ? { background: 'linear-gradient(135deg, #3b82f6, #6366f1)' }
    : {}

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={primaryStyle}
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  )
}