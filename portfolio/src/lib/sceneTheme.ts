/**
 * Scene theming: map the CSS design tokens to the small set of colors
 * the 3D scenes use. Scenes read this once per theme change via
 * useSceneTheme() — three.js materials don't consume CSS variables.
 */
import { useEffect, useState } from 'react'

export interface ScenePalette {
  dark: boolean
  peach: string
  /** body/geometry of the physical objects */
  shell: string
  /** darker slab / desk */
  slab: string
  /** key/keyboard detail */
  detail: string
  /** dimmed / secondary geometry */
  dim: string
  /** text lines drawn on screens */
  screenLines: string
  /** label text (constellation) */
  ink: string
  /** ambient light strength */
  ambient: number
}

const DARK: ScenePalette = {
  dark: true,
  peach: '#f8e7dd',
  shell: '#1a1918',
  slab: '#131211',
  detail: '#242220',
  dim: '#6b625a',
  screenLines: '#080808',
  ink: '#ede8e4',
  ambient: 0.22,
}

const LIGHT: ScenePalette = {
  dark: false,
  peach: '#c98a63', // match --peach in the light theme
  shell: '#d9d1c6',
  slab: '#cbc2b5',
  detail: '#b8ae9f',
  dim: '#b0a598',
  screenLines: '#ffffff',
  ink: '#26221e',
  ambient: 0.85, // paper world: more fill light
}

function read(): ScenePalette {
  return document.documentElement.getAttribute('data-theme') === 'light' ? LIGHT : DARK
}

export function useSceneTheme(): ScenePalette {
  const [pal, setPal] = useState<ScenePalette>(() => read())

  useEffect(() => {
    const ob = new MutationObserver(() => setPal(read()))
    ob.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    return () => ob.disconnect()
  }, [])

  return pal
}
