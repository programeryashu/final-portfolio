import { site } from '../data/site'

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div>
          <p className="footer__name">YASH BHARTI</p>
          <p className="footer__role">AI/ML • DEVELOPMENT • EXPERIMENTATION</p>
        </div>

        <div className="footer__socials">
          {site.socials.map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noreferrer" data-cursor="open">
              {s.label} ↗
            </a>
          ))}
        </div>

        <div className="footer__meta">
          <p className="note">Built with curiosity + code.</p>
          <p className="footer__copy">© 2026 Yash Bharti</p>
        </div>
      </div>
    </footer>
  )
}
