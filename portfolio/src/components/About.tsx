import { Reveal } from './Reveal'
import { Magnetic } from './Magnetic'
import { site } from '../data/site'
import { lazy, Suspense } from 'react'

const Workspace = lazy(() => import('./three/Workspace'))

/**
 * About: conversational intro beside the 3D developer workspace.
 * On low-tier devices the 3D is replaced by a CSS terminal card so
 * the section never feels empty, just cheaper.
 */
export function About({ tier }: { tier: 'high' | 'low' }) {
  const show3d = tier === 'high'

  return (
    <section id="about" className="section about" aria-label="About me">
      <div className="container about__grid">
        <div className="about__text">
          <Reveal>
            <p className="kicker">01 — about</p>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="display about__title">
              A LITTLE<br />
              <em>about me.</em>
            </h2>
          </Reveal>

          <Reveal delay={140}>
            <p className="about__para">
              I'm Yash — an AI &amp; ML student who likes turning <em className="note">"what if?"</em> ideas into things
              that actually work. I experiment with artificial intelligence, computer vision, web
              development, automation — whatever's interesting this week.
            </p>
          </Reveal>
          <Reveal delay={200}>
            <p className="about__para">
              Some projects start as serious ideas. Others start because I simply wanted to know if I
              could build them. That second category usually teaches me more.
            </p>
          </Reveal>
          <Reveal delay={260}>
            <p className="about__para">
              Experimenting, breaking things, fixing them, learning something new on the way — that
              loop is the part of technology I enjoy most.
            </p>
          </Reveal>

          <Reveal delay={320}>
            <div className="about__meta">
              <p className="note note--accent">currently building → AI agents &amp; vision experiments</p>
              <p className="note">{site.positioning}</p>
            </div>
          </Reveal>

          <Reveal delay={380}>
            <Magnetic>
              <a
                className="btn btn--ghost about__github"
                href={site.socials[0].href}
                target="_blank"
                rel="noreferrer"
                data-cursor="open"
              >
                GITHUB — @programeryashu
              </a>
            </Magnetic>
          </Reveal>
        </div>

        <div className="about__visual">
          {show3d ? (
            <Suspense fallback={null}>
              <Workspace />
            </Suspense>
          ) : (
            <>
              <FallbackTerminal />
              <WorkspacePhoto />
            </>
          )}
        </div>
      </div>
    </section>
  )
}

/** CSS-only terminal shown when 3D is skipped. */
function FallbackTerminal() {
  return (
    <div className="term term--static" aria-hidden>
      <div className="term__bar">
        <span className="term__dot" />
        <span className="term__dot" />
        <span className="term__dot" />
        <span className="term__title">yash@lab: ~</span>
      </div>
      <div className="term__body">
        <p><span className="term__prompt">$</span> whoami</p>
        <p className="term__out">ai-ml-student — builder — experimenter</p>
        <p><span className="term__prompt">$</span> ls ./current-focus</p>
        <p className="term__out">computer-vision  llm-agents  web</p>
        <p><span className="term__prompt">$</span> status --now</p>
        <p className="term__out term__out--accent">experimenting…</p>
        <span className="term__caret" />
      </div>
    </div>
  )
}

/** Workspace photo shown beneath the terminal when 3D is skipped */
function WorkspacePhoto() {
  return (
    <img
      src="/certs/Yash_Workspace_Setup.jpg"
      alt="Home office setup: light beige desk with black ergonomic chair, dual monitors, potted plant, and peacock feathers against botanical wallpaper. Laptop screen shows a dark-themed coding interface. The chair features a MATRIX-branded headrest."
      className="about__workspace-photo"
      loading="lazy"
    />
  )
}
