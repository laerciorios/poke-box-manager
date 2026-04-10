'use client'

interface BoxSummaryProps {
  complete: number
  partial: number
  empty: number
  labelComplete: string
  labelPartial: string
  labelEmpty: string
}

export function BoxSummary({
  complete,
  partial,
  empty,
  labelComplete,
  labelPartial,
  labelEmpty,
}: BoxSummaryProps) {
  const items = [
    { label: labelComplete, value: complete, color: 'bg-green-500/15 text-green-600 dark:text-green-400 ring-green-500/30' },
    { label: labelPartial, value: partial, color: 'bg-yellow-400/15 text-yellow-600 dark:text-yellow-400 ring-yellow-400/30' },
    { label: labelEmpty, value: empty, color: 'bg-red-400/15 text-red-600 dark:text-red-400 ring-red-400/30' },
  ]

  return (
    <div className="grid grid-cols-3 gap-3">
      {items.map(({ label, value, color }) => (
        <div
          key={label}
          className={`flex flex-col items-center justify-center rounded-xl p-3 ring-1 ${color}`}
        >
          <span className="text-2xl font-bold tabular-nums">{value}</span>
          <span className="text-xs font-medium mt-0.5 text-center leading-tight">{label}</span>
        </div>
      ))}
    </div>
  )
}
