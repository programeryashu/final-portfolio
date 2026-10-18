import { useState } from 'react'
import { Reveal } from './Reveal'
import { ProjectViewer } from './ProjectViewer'
import { ProjectThumb } from './ProjectThumb'
import { projects, type Project } from '../data/projects'

/**
 * Projects: no identical cards. An editorial index — big rows, big
 * numbers, staggered offsets, margin notes — that opens a full
 * project viewer on click. Thumbnails are hand-drawn SVG design
 * mocks from src/assets/; the generated fallback still exists for
 * future data-only projects.
 */
export function Projects() {
  const [openId, setOpenId] = useState<string | null>(null)
  const open = projects.find((p) => p.id === openId) ?? null

  return (
    <section id="work" className="section projects" aria-label="Selected work">
      <div className="container">
        <Reveal>
          <p className="kicker">02 — selected work</p>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="display projects__title">
            SELECTED <em>work</em>
          </h2>
        </Reveal>
        <Reveal delay={140}>
          <p className="projects__sub note">Things I've built, broken, rebuilt and learned from.</p>
        </Reveal>

        <div className="projects__list">
          {projects.map((p, i) => (
            <ProjectRow
              key={p.id}
              project={p}
              flip={i % 2 === 1}
              onOpen={() => setOpenId(p.id)}
            />
          ))}
        </div>
      </div>

      {open && <ProjectViewer project={open} onClose={() => setOpenId(null)} />}
    </section>
  )
}

function ProjectRow({
  project,
  flip,
  onOpen,
}: {
  project: Project
  flip: boolean
  onOpen: () => void
}) {
  return (
    <Reveal>
      <button
        className={`project-row ${flip ? 'project-row--flip' : ''}`}
        onClick={onOpen}
        data-cursor="view"
        aria-haspopup="dialog"
      >
        <span className="project-row__num" aria-hidden>
          {project.number}
        </span>

        <span className="project-row__media" aria-hidden>
          <ProjectThumb project={project} />
        </span>

        <span className="project-row__body">
          <span className="project-row__cat">{project.category}</span>
          <span className="project-row__name">{project.title}</span>
          <span className="project-row__tag">{project.tagline}</span>
          <span className="project-row__tech">
            {project.tech.slice(0, 4).map((t) => (
              <span key={t} className="chip">
                {t}
              </span>
            ))}
            {project.tech.length > 4 && <span className="chip chip--more">+{project.tech.length - 4}</span>}
          </span>
          {project.marginNote && <span className="note note--accent project-row__note">↳ {project.marginNote}</span>}
        </span>

        <span className="project-row__arrow" aria-hidden>
          →
        </span>
      </button>
    </Reveal>
  )
}
