import { useEffect, useRef } from 'react'
import { lockScroll } from '../lib/lenis'
import { ProjectThumb } from './ProjectThumb'
import type { Project } from '../data/projects'

/**
 * ProjectViewer: full-screen detail overlay. Reads like a build log:
 * the idea, the problem, what I built, what was difficult, what I
 * learned. Esc closes; scroll is locked underneath.
 */
export function ProjectViewer({ project, onClose }: { project: Project; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    lockScroll(true)
    closeRef.current?.focus()

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      lockScroll(false)
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  return (
    <div className="viewer" role="dialog" aria-modal="true" aria-label={`${project.title} — project details`}>
      <button className="viewer__backdrop" onClick={onClose} aria-label="Close project details" />

      <div className="viewer__panel">
        <button ref={closeRef} className="viewer__close" onClick={onClose}>
          CLOSE ✕
        </button>

        <header className="viewer__head">
          <p className="kicker">project {project.number} — {project.category}</p>
          <h3 className="display viewer__title">{project.title}</h3>
          <p className="viewer__desc">{project.description}</p>
          {project.viewer.note && <p className="note note--accent">↳ {project.viewer.note}</p>}
        </header>

        <div className="viewer__media">
          <ProjectThumb project={project} />
        </div>

        <div className="viewer__grid">
          <ViewerBlock n="01" title="THE IDEA" body={project.viewer.idea} />
          <ViewerBlock n="02" title="THE PROBLEM" body={project.viewer.problem} />
          <ViewerBlock n="03" title="WHAT I BUILT" body={project.viewer.built} />
          <ViewerBlock n="04" title="WHAT WAS DIFFICULT" body={project.viewer.difficult} />
          <ViewerBlock n="05" title="WHAT I LEARNED" body={project.viewer.learned} wide />
        </div>

        <section className="viewer__tech" aria-label="Technologies used">
          <h4 className="viewer__label">TECHNOLOGY</h4>
          <div className="viewer__chips">
            {project.tech.map((t) => (
              <span key={t} className="chip">
                {t}
              </span>
            ))}
          </div>
        </section>

        {project.certificate && (
          <section className="viewer__cert">
            <h4 className="viewer__label">CERTIFICATE</h4>
            <a
              className="viewer__link"
              href={project.certificate}
              target="_blank"
              rel="noopener"
              data-cursor="open"
            >
              Open certificate PDF ↗
            </a>
          </section>
        )}

        <footer className="viewer__links">
          <h4 className="viewer__label">LINKS</h4>
          <div className="viewer__linklist">
            {project.links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                target={l.external ? '_blank' : undefined}
                rel={l.external ? 'noreferrer' : undefined}
                className="viewer__link"
                data-cursor="open"
                onClick={l.href === '#' ? (e) => e.preventDefault() : undefined}
              >
                {l.label} {l.external ? '↗' : '→'}
                {l.href === '#' && <span className="viewer__pending"> (link pending)</span>}
              </a>
            ))}
          </div>
        </footer>
      </div>
    </div>
  )
}

function ViewerBlock({ n, title, body, wide }: { n: string; title: string; body: string; wide?: boolean }) {
  return (
    <div className={`viewer__block ${wide ? 'viewer__block--wide' : ''}`}>
      <span className="viewer__blocknum" aria-hidden>
        {n}
      </span>
      <h4 className="viewer__label">{title}</h4>
      <p>{body}</p>
    </div>
  )
}
