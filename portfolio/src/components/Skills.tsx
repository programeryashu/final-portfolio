import { useState, lazy, Suspense } from 'react'
import { Reveal } from './Reveal'
import { skillCategories, type SkillItem } from '../data/skills'
import { useDeviceCapability } from '../hooks/useDeviceCapability'

const TechConstellation = lazy(() => import('./three/TechConstellation'))

/**
 * MY TOOLBOX — no bars, no percentages. A 3D constellation of
 * technologies (high tier) plus an always-present accessible index;
 * hovering a node (or a list item) shows where the tech was actually
 * used.
 */
export function Skills() {
  const tier = useDeviceCapability()
  const [hovered, setHovered] = useState<SkillItem | null>(null)

  return (
    <section id="skills" className="section skills" aria-label="My toolbox">
      <div className="container">
        <Reveal>
          <p className="kicker">03 — toolbox</p>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="display skills__title">
            MY <em>toolbox</em>
          </h2>
        </Reveal>
        <Reveal delay={140}>
          <p className="projects__sub note">No percentages. Tools earn their place by being used.</p>
        </Reveal>
      </div>

      <div className="skills__stage">
        {tier === 'high' && (
          <Suspense fallback={null}>
            <TechConstellation onHover={setHovered} />
          </Suspense>
        )}

        {/* hover readout — driven by 3D nodes or the list below */}
        <div className="skills__readout" role="status" aria-live="polite">
          {hovered ? (
            <>
              <p className="skills__readout-name">{hovered.name}</p>
              <p className="skills__readout-use">{hovered.usedIn}</p>
            </>
          ) : (
            <p className="note">hover a node {tier === 'high' ? 'in the constellation' : 'below'} to see where it's been used</p>
          )}
        </div>

        {/* accessible index — also drives the readout */}
        <div className="container skills__grid">
          {skillCategories.map((cat, ci) => (
            <Reveal key={cat.id} delay={ci * 70}>
              <div className="skills__cat">
                <h3 className="skills__cat-label">{cat.label}</h3>
                <ul>
                  {cat.items.map((item) => (
                    <li
                      key={item.name}
                      tabIndex={0}
                      onFocus={() => setHovered(item)}
                      onBlur={() => setHovered(null)}
                      onMouseEnter={() => setHovered(item)}
                      onMouseLeave={() => setHovered(null)}
                    >
                      {item.name}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
