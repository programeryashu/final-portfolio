import { useEffect, lazy, Suspense } from 'react'
import { initSmoothScroll, destroySmoothScroll } from './lib/lenis'
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import { CustomCursor } from './components/CustomCursor'
import { Hero } from './components/Hero'
import { About } from './components/About'
import { Projects } from './components/Projects'
import { Skills } from './components/Skills'
import { Hackathons } from './components/Hackathons'
import { Lab } from './components/Lab'
import { Journey } from './components/Journey'
import { Contact } from './components/Contact'
import { Certifications } from './components/Certifications'
import { useDeviceCapability } from './hooks/useDeviceCapability'

// 3D scenes are code-split: the three.js bundle only loads when a
// scene actually mounts (never on low-tier devices for some scenes).
const HeroScene = lazy(() => import('./components/three/HeroScene'))

export default function App() {
  const tier = useDeviceCapability()

  useEffect(() => {
    initSmoothScroll()
    return () => destroySmoothScroll()
  }, [])

  const showHeroScene = tier === 'high'

  return (
    <>
      <CustomCursor />
      <Navbar />

      <main>
        <Hero>
          {showHeroScene && (
            <Suspense fallback={null}>
              <HeroScene tier={tier} />
            </Suspense>
          )}
        </Hero>

        <About tier={tier} />
        <Projects />
        <Skills />
        <Hackathons />
        <Lab tier={tier} />
        <Journey />
        <Certifications />
        <Contact />
      </main>

      <Footer />
    </>
  )
}
