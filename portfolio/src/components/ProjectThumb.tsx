import type { Project } from '../data/projects'

/**
 * Project thumbnail — renders the project's design-mock image when
 * project.image is set, otherwise a generated placeholder so layouts
 * never break for future data-only projects.
 */
export function ProjectThumb({ project }: { project: Project }) {
  if (project.image) {
    return <img src={project.image} alt={project.title + ' — interface design mock'} loading="lazy" decoding="async" />
  }
  const initials = project.title
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 3)
    .toUpperCase()
  return (
    <span className={`thumb thumb--${project.id}`}>
      <span className="thumb__grid" aria-hidden />
      <span className="thumb__initials">{initials}</span>
      <span className="thumb__label">design mock pending — the code is real</span>
    </span>
  )
}
