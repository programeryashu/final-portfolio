import { useEffect, useState } from 'react'

export type DeviceTier = 'high' | 'low'

/**
 * Rough device capability tier used to scale 3D: touch-first devices,
 * small screens and modest hardware get fewer particles and simpler
 * scenes. Deterministic per viewport; re-checks on resize.
 */
function detect(): DeviceTier {
  if (typeof window === 'undefined') return 'low'
  // touch-first or small screens: simplify (spec: proper mobile experience,
  // not a shrunken desktop)
  if (window.matchMedia('(pointer: coarse)').matches) return 'low'
  if (window.innerWidth < 820) return 'low'
  // genuinely weak hardware only — 4 cores is a normal mid-range laptop
  // and the spec requires the 3D to stay usable there (reduced counts)
  const cores = navigator.hardwareConcurrency ?? 4
  if (cores <= 2) return 'low'
  const nav = navigator as Navigator & { deviceMemory?: number }
  if (nav.deviceMemory !== undefined && nav.deviceMemory <= 2) return 'low'
  return 'high'
}

export function useDeviceCapability(): DeviceTier {
  const [tier, setTier] = useState<DeviceTier>(detect)

  useEffect(() => {
    const onResize = () => setTier(detect())
    window.addEventListener('resize', onResize, { passive: true })
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return tier
}
