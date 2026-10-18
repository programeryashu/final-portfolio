import { Magnetic } from './Magnetic'
import { scrollToSection } from '../lib/lenis'
import { site } from '../data/site'
import type { ReactNode } from 'react'

/**
 * Hero: identity first. Text left, machine right (desktop), 3D scene
 * passed in as children so it stays code-split and skippable.
 */
export function Hero({ children }: { children?: ReactNode }) {
  const [l1, l2, l3] = site.heroLines

  return (
    <section id="top" className="hero" aria-label="Introduction">
      {children}

      <div className="container hero__content">
        <p className="kicker hero__kicker">yash bharti — portfolio</p>

        <h1 className="display hero__title">
          <span className="hero__line">{l1}</span>
          <span className="hero__line">{l2}</span>
          <span className="hero__line hero__line--accent">{l3}</span>
        </h1>

        <p className="hero__support">{site.heroSupport}</p>

        <div className="hero__ctas">
          <Magnetic>
            <button className="btn btn--solid" onClick={() => scrollToSection('work')}>
              VIEW MY WORK
            </button>
          </Magnetic>
          <Magnetic>
            <button className="btn btn--ghost" onClick={() => scrollToSection('contact')}>
              LET'S CONNECT
            </button>
          </Magnetic>
        </div>
      </div>

      <div className="hero__scroll" aria-hidden>
        <span>SCROLL TO EXPLORE ↓</span>
      </div>
    </section>
  )
}
