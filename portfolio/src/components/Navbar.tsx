import { useEffect, useState } from 'react'
import { scrollToSection, scrollToTop } from '../lib/lenis'
import { site } from '../data/site'
import { useTheme } from '../hooks/useTheme'

const SECTIONS = [
  { id: 'about', label: 'About' },
  { id: 'work', label: 'Work' },
  { id: 'skills', label: 'Skills' },
  { id: 'lab', label: 'Lab' },
  { id: 'journey', label: 'Journey' },
  { id: 'contact', label: 'Contact' },
]

/**
 * Minimal fixed nav. Left: name. Right: section links that highlight
 * based on the section currently in view. Mobile: compact menu overlay.
 */
export function Navbar() {
  const [active, setActive] = useState('')
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { theme, toggle } = useTheme()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id)
        }
      },
      { rootMargin: '-35% 0px -55% 0px' },
    )
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) io.observe(el)
    })
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    if (open) {
      setOpen(false)
      setTimeout(() => scrollToSection(id), 250)
    } else {
      scrollToSection(id)
    }
  }

  return (
    <header className={`nav ${scrolled ? 'nav--scrolled' : ''} ${open ? 'nav--menu-open' : ''}`}>
      <div className="nav__inner container">
        <a
          href="#top"
          className="nav__name"
          data-cursor="open"
          onClick={(e) => {
            e.preventDefault()
            scrollToTop()
          }}
          aria-label="Yash Bharti — back to top"
        >
          YASH BHARTI<span className="nav__cursor-blink">_</span>
        </a>

        <nav className="nav__links" aria-label="Primary">
          {SECTIONS.map(({ id, label }) => (
            <a
              key={id}
              href={`#${id}`}
              onClick={go(id)}
              className={`nav__link ${active === id ? 'nav__link--active' : ''}`}
              aria-current={active === id ? 'true' : undefined}
            >
              {label}
            </a>
          ))}

          <button
            className="theme-toggle"
            onClick={toggle}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
            data-cursor="open"
          >
            <span className="theme-toggle__icon" aria-hidden>
              {theme === 'dark' ? '☀' : '☾'}
            </span>
          </button>
        </nav>

        <button
          className={`nav__burger ${open ? 'nav__burger--open' : ''}`}
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          <span />
          <span />
        </button>
      </div>

      <div id="mobile-menu" className={`nav__overlay ${open ? 'nav__overlay--open' : ''}`}>
        <nav aria-label="Mobile">
          {SECTIONS.map(({ id, label }, i) => (
            <a
              key={id}
              href={`#${id}`}
              onClick={go(id)}
              className="nav__overlay-link"
              style={{ transitionDelay: open ? `${80 + i * 45}ms` : '0ms' }}
            >
              <span className="nav__overlay-num">0{i + 1}</span> {label}
            </a>
          ))}
        </nav>
        <button className="theme-toggle theme-toggle--overlay" onClick={toggle} data-cursor="open">
          {theme === 'dark' ? '☀ LIGHT MODE' : '☾ DARK MODE'}
        </button>
        <div className="nav__overlay-foot">
          {site.socials.map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noreferrer" data-cursor="open">
              {s.label} ↗
            </a>
          ))}
        </div>
      </div>
    </header>
  )
}
