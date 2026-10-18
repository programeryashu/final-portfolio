import { Reveal } from './Reveal'
import { Magnetic } from './Magnetic'
import { achievements } from '../data/achievements'

/**
 * BUILT UNDER PRESSURE — hackathons & competitions as physical
 * badges: slightly rotated, pinned, stamped with the honest result.
 * No invented dates or rankings.
 */
export function Hackathons() {
  return (
    <section id="hackathons" className="section hackathons" aria-label="Hackathons and competitions">
      <div className="container">
        <Reveal>
          <p className="kicker">04 — under pressure</p>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="display hackathons__title">
            BUILT UNDER <em>pressure.</em>
          </h2>
        </Reveal>
        <Reveal delay={140}>
          <p className="projects__sub note">Some of the best learning happens when there's a deadline.</p>
        </Reveal>

        <div className="badges">
          {achievements.map((a, i) => (
            <Reveal key={a.id} delay={i * 60}>
              <Magnetic strength={0.16}>
                <article className={`badge badge--${a.status}`} style={{ '--tilt': `${(i % 3) - 1}deg` } as React.CSSProperties}>
                  <span className="badge__pin" aria-hidden />
                  <p className="badge__title">{a.title}</p>
                  <p className="badge__result">{a.result}</p>
                  {a.detail && <p className="badge__detail">{a.detail}</p>}
                  <span className="badge__stamp" aria-hidden>
                    {a.status === 'selected' ? 'SELECTED' : a.status === 'participated' ? 'PARTICIPATED' : 'SHIPPED'}
                  </span>
                </article>
              </Magnetic>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
