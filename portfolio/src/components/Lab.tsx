import { Reveal } from './Reveal'
import { labExperiments, site } from '../data/site'
import { lazy, Suspense } from 'react'

const LabScene = lazy(() => import('./three/LabScene'))

/**
 * YASH'S LAB — experiments, strange ideas and things currently being
 * figured out. Status labels (EXPERIMENTING / BUILDING / LEARNING)
 * instead of fake completion. A sparse 3D scene hums in the
 * background on capable devices.
 */
export function Lab({ tier }: { tier: 'high' | 'low' }) {
  return (
    <section id="lab" className="section lab" aria-label="Yash's lab — experiments">
      {tier === 'high' && (
        <Suspense fallback={null}>
          <LabScene />
        </Suspense>
      )}

      <div className="container lab__inner">
        <Reveal>
          <p className="kicker">05 — the lab</p>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="display lab__title">
            YASH'S <em>LAB</em>
          </h2>
        </Reveal>
        <Reveal delay={140}>
          <p className="projects__sub note">Experiments, strange ideas and things I'm currently figuring out.</p>
        </Reveal>

        <div className="lab__grid">
          {labExperiments.map((exp, i) => (
            <Reveal key={exp.id} delay={i * 70}>
              <article className="lab-card">
                <div className="lab-card__head">
                  <span className={`lab-card__status lab-card__status--${exp.status.toLowerCase()}`}>
                    <span className="lab-card__pulse" aria-hidden />
                    {exp.status}
                  </span>
                  <span className="lab-card__num" aria-hidden>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
                <h3 className="lab-card__title">{exp.title}</h3>
                <p className="lab-card__detail">{exp.detail}</p>
                {exp.note && <p className="note note--accent">↳ {exp.note}</p>}
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={120}>
          <div className="lab__exploring">
            <h3 className="skills__cat-label">CURRENTLY EXPLORING</h3>
            <div className="lab__chips">
              {site.currentlyExploring.map((t) => (
                <span key={t} className="chip chip--soft">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
