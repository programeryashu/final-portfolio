import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react'

/**
 * Reveal-on-scroll wrapper. Adds .is-visible once, then stops observing.
 * CSS handles the actual animation (and the reduced-motion fallback).
 */
interface RevealProps {
  children: ReactNode
  className?: string
  /** stagger delay in ms */
  delay?: number
  style?: CSSProperties
  id?: string
}

export function Reveal({ children, className = '', delay = 0, style, id }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('is-visible')
          io.disconnect()
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      id={id}
      className={`reveal ${className}`}
      style={{ ...style, '--reveal-delay': `${delay}ms` } as CSSProperties}
    >
      {children}
    </div>
  )
}
