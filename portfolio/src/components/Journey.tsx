import { useEffect, useRef, useState } from 'react'
import { Reveal } from './Reveal'
import { journey } from '../data/journey'

/**
 * THE JOURNEY SO FAR — vertical timeline. A peach progress line draws
 * itself as you scroll; year nodes light up when reached. Facts only,
 * straight from data/journey.ts.
 */
export function Journey() {
  const listRef = useRef<HTMLOListElement>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const list = listRef.current
    if (!list) return

    const onScroll = () => {
      const r = list.getBoundingClientRect()
      const vh = window.innerHeight
      // 0 when the list top reaches 80% of viewport, 1 when its bottom hits 40%
      const total = r.height + vh * 0.4
      const done = Math.min(1, Math.max(0, (vh * 0.8 - r.top) / total))
      setProgress(done)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section id="journey" className="section journey" aria-label="The journey so far">
      <div className="container">
        <Reveal>
          <p className="kicker">06 — journey</p>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="display journey__title">
            THE JOURNEY <em>so far.</em>
          </h2>
        </Reveal>

        <ol className="timeline" ref={listRef}>
          <span className="timeline__track" aria-hidden />
          <span
            className="timeline__fill"
            style={{ transform: `scaleY(${progress})` }}
            aria-hidden
          />
          {journey.map((entry, i) => (
            <Reveal key={entry.year} delay={i * 60}>
              <li className="timeline__item">
                <span className="timeline__dot" aria-hidden />
                <span className="timeline__year">{entry.year}</span>
                <div className="timeline__body">
                  <h3>{entry.title}</h3>
                  <p>{entry.detail}</p>
                </div>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}
