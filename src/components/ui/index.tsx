import clsx from 'clsx'

export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={clsx('bg-surface border border-border p-4 md:p-5', className)}>
      {children}
    </div>
  )
}

export function KpiCard({
  label, value, sub, color = 'green'
}: {
  label: string; value: string | number; sub?: string
  color?: 'green' | 'orange' | 'blue' | 'red'
}) {
  const colors = {
    green:  { bar: 'bg-accent',  text: 'text-accent' },
    orange: { bar: 'bg-accent2', text: 'text-accent2' },
    blue:   { bar: 'bg-accent3', text: 'text-accent3' },
    red:    { bar: 'bg-danger',  text: 'text-danger' },
  }
  const c = colors[color]
  return (
    <div className="bg-surface border border-border p-4 relative overflow-hidden hover:bg-surface2 transition-colors">
      <div className={clsx('absolute left-0 top-0 w-0.5 h-full', c.bar)} />
      <div className="pl-3">
        <div className="font-mono text-[10px] text-muted uppercase tracking-widest mb-2">{label}</div>
        <div className={clsx('font-display text-4xl md:text-5xl leading-none mb-1', c.text)}>{value}</div>
        {sub && <div className="font-mono text-[10px] text-muted">{sub}</div>}
      </div>
    </div>
  )
}

export function SectionHeader({
  title, tag, tagColor = 'green'
}: {
  title: string; tag?: string; tagColor?: 'green' | 'orange' | 'blue' | 'red'
}) {
  const tagColors = {
    green:  'text-accent border-accent',
    orange: 'text-accent2 border-accent2',
    blue:   'text-accent3 border-accent3',
    red:    'text-danger border-danger',
  }
  return (
    <div className="flex items-center gap-3 mb-4">
      <h2 className="font-display text-xl md:text-2xl tracking-widest text-text">{title}</h2>
      {tag && (
        <span className={clsx('font-mono text-[10px] px-2 py-0.5 border uppercase tracking-widest', tagColors[tagColor])}>
          {tag}
        </span>
      )}
    </div>
  )
}

export function Badge({ label, color }: { label: string; color: 'green' | 'orange' | 'red' | 'gray' }) {
  const colors = {
    green:  'text-accent border-accent bg-accent/10',
    orange: 'text-accent2 border-accent2 bg-accent2/10',
    red:    'text-danger border-danger bg-danger/10',
    gray:   'text-muted border-border',
  }
  return (
    <span className={clsx('font-mono text-[9px] px-2 py-0.5 border uppercase tracking-wide', colors[color])}>
      {label}
    </span>
  )
}

export function ProgressBar({ value, color = 'green', showLabel = true }: {
  value: number; color?: 'green' | 'orange' | 'red'; showLabel?: boolean
}) {
  const colors = { green: 'bg-accent', orange: 'bg-accent2', red: 'bg-danger' }
  const barColor = value >= 80 ? 'green' : value >= 50 ? 'orange' : 'red'
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 bg-border h-1">
        <div
          className={clsx('h-full transition-all duration-1000', colors[barColor])}
          style={{ width: `${Math.min(value, 100)}%` }}
        />
      </div>
      {showLabel && (
        <span className="font-mono text-[10px] text-muted w-8 text-right">{value}%</span>
      )}
    </div>
  )
}

export function PageHeader({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="border-b border-border px-4 md:px-6 py-4 md:py-6">
      <div className="font-mono text-[10px] text-accent uppercase tracking-widest mb-1">
        MA21922 — ENKA Luzhniki
      </div>
      <h1 className="font-display text-3xl md:text-5xl tracking-wider text-text">{title}</h1>
      {sub && <p className="font-mono text-xs text-muted mt-1">{sub}</p>}
    </div>
  )
}

export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center p-12">
      <div className="w-8 h-8 border-2 border-border border-t-accent rounded-full animate-spin" />
    </div>
  )
}

export function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="font-mono text-xs text-danger border border-danger/30 bg-danger/10 p-4">
      ⚠ {message}
    </div>
  )
}
