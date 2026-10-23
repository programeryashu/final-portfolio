import { useState, type FormEvent } from 'react'
import { Reveal } from './Reveal'
import { Magnetic } from './Magnetic'
import { site } from '../data/site'

/**
 * GOT AN IDEA? LET'S BUILD SOMETHING.
 * Terminal-flavored contact: the "connect" readout lists real socials.
 * The form POSTs to Web3Forms (serverless form-to-email) so messages go
 * straight to site.email — no backend of ours. The access key is a
 * public alias by design; VITE_WEB3FORMS_ACCESS_KEY still overrides it
 * at build time. With no key at all it falls back to composing a
 * mailto: draft — no backend, no fake sends.
 */
const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit'
const accessKey: string =
  import.meta.env.VITE_WEB3FORMS_ACCESS_KEY || 'ad7e353b-c67d-4672-bba2-7a214d2cbed5'

type Status = 'idle' | 'sending' | 'sent' | 'error'

export function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState<Status>('idle')

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (status === 'sending') return

    if (!accessKey) {
      // No key configured — hand off to the visitor's mail client.
      const subject = encodeURIComponent(`Portfolio contact — ${form.name || 'someone curious'}`)
      const body = encodeURIComponent(`${form.message}\n\n— ${form.name}\n${form.email}`)
      window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`
      setStatus('sent')
      return
    }

    setStatus('sending')
    try {
      const res = await fetch(WEB3FORMS_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: accessKey,
          subject: `Portfolio contact — ${form.name || 'someone curious'}`,
          from_name: 'Yash Bharti portfolio',
          name: form.name,
          email: form.email,
          replyto: form.email,
          message: form.message,
        }),
      })
      const result = (await res.json()) as { success?: boolean }
      if (res.ok && result.success) {
        setStatus('sent')
        setForm({ name: '', email: '', message: '' })
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <section id="contact" className="section contact" aria-label="Contact">
      <div className="container">
        <Reveal>
          <p className="kicker">07 — contact</p>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="display contact__title">
            GOT AN IDEA?
            <br />
            <em>LET'S BUILD SOMETHING.</em>
          </h2>
        </Reveal>
        <Reveal delay={140}>
          <p className="contact__sub">
            Have a project, collaboration, hackathon idea — or simply want to talk tech?
          </p>
        </Reveal>

        <div className="contact__grid">
          {/* terminal readout */}
          <Reveal delay={180}>
            <div className="term" aria-label="Contact details">
              <div className="term__bar">
                <span className="term__dot" />
                <span className="term__dot" />
                <span className="term__dot" />
                <span className="term__title">yash@lab: ~/connect</span>
              </div>
              <div className="term__body">
                <p>
                  <span className="term__prompt">$</span> connect --with-yash
                </p>
                <p className="term__out">
                  STATUS: <span className="term__ok">ONLINE</span>
                </p>
                <ul className="term__links">
                  {site.socials.map((s) => (
                    <li key={s.label}>
                      <span className="term__prompt">↳</span>{' '}
                      <a href={s.href} target="_blank" rel="noreferrer" data-cursor="open">
                        {s.label} ↗
                      </a>
                    </li>
                  ))}
                  <li>
                    <span className="term__prompt">↳</span>{' '}
                    <a href={`mailto:${site.email}`} data-cursor="open">
                      Email ↗
                    </a>
                  </li>
                </ul>
                <p className="term__note note">// form messages land straight in my inbox</p>
                <span className="term__caret" aria-hidden />
              </div>
            </div>
          </Reveal>

          {/* form */}
          <Reveal delay={240}>
            <form className="contact__form" onSubmit={submit}>
              <label>
                <span className="contact__label">NAME</span>
                <input
                  required
                  name="name"
                  autoComplete="name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="who's building?"
                />
              </label>
              <label>
                <span className="contact__label">EMAIL</span>
                <input
                  required
                  type="email"
                  name="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="where can I reply?"
                />
              </label>
              <label>
                <span className="contact__label">MESSAGE</span>
                <textarea
                  required
                  name="message"
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="the idea, the hackathon, the question…"
                />
              </label>
              <Magnetic>
                <button type="submit" className="btn btn--solid" disabled={status === 'sending'}>
                  {status === 'sending' ? 'SENDING…' : 'SEND MESSAGE →'}
                </button>
              </Magnetic>
              {status === 'sent' && (
                <p className="note note--accent" role="status">
                  {accessKey
                    ? "sent — I'll reply to your email shortly"
                    : 'opening your mail client — nothing was sent behind your back'}
                </p>
              )}
              {status === 'error' && (
                <p className="note note--accent" role="status">
                  couldn't reach the mail relay — email me directly at{' '}
                  <a href={`mailto:${site.email}`}>{site.email}</a>
                </p>
              )}
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
