'use client'

import { motion, useReducedMotion } from 'motion/react'
import { cn } from '@/lib/utils'

interface ProgressRingProps {
  /** 0..1 */
  value: number
  size?: number
  strokeWidth?: number
  className?: string
  trackClassName?: string
  ringClassName?: string
  label?: React.ReactNode
}

export function ProgressRing({
  value,
  size = 180,
  strokeWidth = 12,
  className,
  trackClassName = 'text-[var(--surface-3)]',
  ringClassName = 'text-[var(--accent)]',
  label,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const clamped = Math.max(0, Math.min(1, value))
  const reduceMotion = useReducedMotion()

  return (
    <div
      className={cn('relative inline-grid place-items-center', className)}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
        aria-hidden
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className={trackClassName}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className={ringClassName}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{
            strokeDashoffset: circumference * (1 - clamped),
          }}
          transition={
            reduceMotion
              ? { duration: 0 }
              : { duration: 1.2, ease: [0.22, 1, 0.36, 1] }
          }
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center">{label}</div>
    </div>
  )
}
