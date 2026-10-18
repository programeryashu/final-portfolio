import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react'

/**
 * Magnetic hover: element leans toward the cursor while hovered,
 * springs back on leave. Desktop pointers only; no-op with reduced
 * motion.
 */
interface MagneticProps {
  children: ReactNode
  strength?: number
  className?: string
  style?: CSSProperties
}

export function Magnetic({ children, strength = 0.28, className = '', style }: MagneticProps) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(pointer: coarse)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect()
      const x = e.clientX - (r.left + r.width / 2)
      const y = e.clientY - (r.top + r.height / 2)
      el.style.transform = `translate(${x * strength}px, ${y * strength}px)`
    }
    const onLeave = () => {
      el.style.transform = ''
    }

    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
    return () => {
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
    }
  }, [strength])

  return (
    <span
      ref={ref}
      className={className}
      style={{ display: 'inline-block', transition: 'transform 0.35s var(--ease-out)', ...style }}
    >
      {children}
    </span>
  )
}
