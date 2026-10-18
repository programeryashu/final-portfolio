import { Reveal } from './Reveal'
import { certificates } from '../data/projects'

/**
 * CERTIFICATIONS — the external recognition behind the work:
 * hackathon selection, top-10% letters, and platform completion
 * certificates. Sourced only from documents supplied with the
 * portfolio, never inferred or invented.
 */
export function Certifications() {
  return (
    <section id="certifications" className="section certifications" aria-label="Certifications and recognition">
      <div className="container">
        <Reveal>
          <p className="kicker">08 — recognition</p>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="display certifications__title">
            ACKNOWLEDGED <em>for the work.</em>
          </h2>
        </Reveal>
        <Reveal delay={140}>
          <p className="certifications__sub note">
            Certificates, letters of appreciation and completions — the
            external record the work actually received.
          </p>
        </Reveal>

        <div className="certifications__grid">
          {certificates.map((c, i) => (
            <Reveal key={c.id} delay={i * 70}>
              <article className={`certification certification--${c.kind}`}>
                <header className="certification__head">
                  <p className="certification__num" aria-hidden>
                    cert. {c.number}
                  </p>
                  <span className={`certification__kind chip certification__kind--${c.kind}`}>
                    {c.kind === 'participation' ? 'participation' : c.kind === 'letter-of-appreciation' ? 'letter of appreciation' : 'completion'}
                  </span>
                </header>

                <div className="certification__media">
                  {c.image && <img src={c.image} alt={c.title} loading="lazy" decoding="async" />}
                  <span className="certification__fallback">{c.title}</span>
                </div>

                <h3 className="certification__title">{c.title}</h3>

                <dl className="certification__meta">
                  <div>
                    <dt className="certification__label">ISSUED</dt>
                    <dd className="certification__value">{c.issued}</dd>
                  </div>
                  <div>
                    <dt className="certification__label">ISSUED BY</dt>
                    <dd className="certification__value">{c.issuer}</dd>
                  </div>
                  {c.cfNo && c.cfNo !== 'N/A' && (
                    <div>
                      <dt className="certification__label">REFERENCE</dt>
                      <dd className="certification__value certification__value--mono">{c.cfNo}</dd>
                    </div>
                  )}
                </dl>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
