'use client'

import { useEffect, useRef } from 'react'

export interface SwipeGestureOptions {
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  /** Minimum horizontal displacement in px to recognize a swipe. Default: 60 */
  threshold?: number
  /** Minimum horizontal-to-vertical ratio. Default: 1.5 */
  aspectRatioGuard?: number
}

/**
 * Attaches pointer-event-based horizontal swipe detection to the given ref.
 * Suppressed automatically on `pointer: fine` devices (mouse/trackpad).
 */
export function useSwipeGesture<T extends HTMLElement>(
  ref: React.RefObject<T | null>,
  options: SwipeGestureOptions,
) {
  const optionsRef = useRef(options)
  optionsRef.current = options

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Only activate on coarse-pointer (touch) devices
    if (window.matchMedia('(pointer: fine)').matches) return

    let startX = 0
    let startY = 0
    let tracking = false

    function onPointerDown(e: PointerEvent) {
      startX = e.clientX
      startY = e.clientY
      tracking = true
      try {
        el!.setPointerCapture(e.pointerId)
      } catch {
        // setPointerCapture may fail on some browsers — safe to ignore
      }
    }

    function onPointerUp(e: PointerEvent) {
      if (!tracking) return
      tracking = false

      const dx = e.clientX - startX
      const dy = e.clientY - startY
      const absDx = Math.abs(dx)
      const absDy = Math.abs(dy)
      const { threshold = 60, aspectRatioGuard = 1.5, onSwipeLeft, onSwipeRight } = optionsRef.current

      if (absDx >= threshold && absDx > absDy * aspectRatioGuard) {
        if (dx < 0) {
          onSwipeLeft?.()
        } else {
          onSwipeRight?.()
        }
      }
    }

    function onPointerCancel() {
      tracking = false
    }

    el.addEventListener('pointerdown', onPointerDown)
    el.addEventListener('pointerup', onPointerUp)
    el.addEventListener('pointercancel', onPointerCancel)

    return () => {
      el.removeEventListener('pointerdown', onPointerDown)
      el.removeEventListener('pointerup', onPointerUp)
      el.removeEventListener('pointercancel', onPointerCancel)
    }
  }, [ref])
}
