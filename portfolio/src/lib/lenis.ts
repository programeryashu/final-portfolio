import Lenis from 'lenis'

/**
 * Smooth-scroll singleton. Skipped entirely when the user prefers
 * reduced motion — native scrolling is the respectful default there.
 */
let lenis: Lenis | null = null
let rafId = 0

export function initSmoothScroll(): Lenis | null {
  if (lenis) return lenis
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return null

  lenis = new Lenis({ lerp: 0.1 })

  const raf = (time: number) => {
    lenis?.raf(time)
    rafId = requestAnimationFrame(raf)
  }
  rafId = requestAnimationFrame(raf)
  return lenis
}

export function destroySmoothScroll() {
  cancelAnimationFrame(rafId)
  lenis?.destroy()
  lenis = null
}

export function scrollToTop() {
  if (lenis) {
    lenis.scrollTo(0, { duration: 1.4 })
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

/** Lock/unlock page scroll (used by the project viewer overlay). */
export function lockScroll(lock: boolean) {
  if (lenis) {
    if (lock) lenis.stop()
    else lenis.start()
  }
  document.body.style.overflow = lock ? 'hidden' : ''
}

export function scrollToSection(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  if (lenis) {
    lenis.scrollTo(el, { duration: 1.4 })
  } else {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}
