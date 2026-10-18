/**
 * Real content only. If something isn't known, it stays an obvious
 * placeholder — never invented. Add new projects by appending here;
 * the UI is fully data-driven.
 *
 * Images: hand-drawn SVG design mocks of each project's interface —
 * stylised, labeled as mocks on the artwork itself. Swap in real
 * screenshots by replacing the import (path + alt implied by project).
 *
 * Certificates: real PDFs uploaded with the portfolio live in
 * /public/certs/ and are referenced here by their public URL.
 */
import sentinelidImg from '../assets/project-sentinelid.svg'
import agriconnectImg from '../assets/project-agriconnect.svg'
import bookstoreImg from '../assets/project-bookstore.svg'
import farawayImg from '../assets/project-faraway-2026.svg'
import azislyCertImg from '../assets/project-azisly-certificate.svg'
import azislyLoaImg from '../assets/project-azisly-loa.svg'
import ibmSkillsbuildImg from '../assets/project-ibm-completion.svg'
import ibmSkillsbuildBookstoreImg from '../assets/project-ibm-completion-bookstore.svg'
import decodeSihImg from '../assets/project-decode-sih.svg'

export interface ProjectLink {
  label: string
  href: string
  /** placeholder hrefs are '#' and should be swapped for real URLs */
  external: boolean
}

export interface Project {
  id: string
  number: string
  title: string
  category: string
  /** one-liner shown in the list */
  tagline: string
  description: string
  tech: string[]
  /** path in /public; null shows the generated placeholder */
  image: string | null
  /** real certificate PDF hosted in /public/certs (null = not held) */
  certificate?: string | null
  links: ProjectLink[]
  viewer: {
    idea: string
    problem: string
    built: string
    difficult: string
    learned: string
    /** small personal annotation shown in the viewer */
    note?: string
  }
  /** little margin notes beside the list item */
  marginNote?: string
}

export interface Certificate {
  id: string
  /** the project this certificate belongs to; absent when the project is no longer listed */
  projectId?: string
  number: string
  kind: 'participation' | 'letter-of-appreciation' | 'completion'
  title: string
  issued: string
  issuer: string
  cfNo: string
  /** real certificate PDF hosted in /public/certs (null = not held) */
  certificate?: string | null
  /** thumb / artwork shown in the certifications grid, from src/assets/ */
  image: string | null
}

export const projects: Project[] = [
  {
    id: 'sentinelid',
    number: '01',
    title: 'SentinelID',
    category: 'Computer Vision / AI / Attendance',
    tagline: 'Face-recognition attendance that runs in real time.',
    description:
      'AI-powered face recognition attendance system using real-time computer vision. Point a camera at a room, and the system marks people present — no queues, no card-swiping, no "bro I was there".',
    tech: ['Python', 'OpenCV', 'Flask', 'MySQL', 'Computer Vision', 'Machine Learning'],
    image: sentinelidImg,
    marginNote: 'this one took longer than expected',
    links: [
      { label: 'GitHub', href: '#', external: true },
      { label: 'Live demo', href: '#', external: true },
      { label: 'Architecture', href: '#', external: false },
    ],
    viewer: {
      idea:
        'Attendance systems are boring, fakeable and slow. I wanted to see if a laptop camera could do the job honestly — recognize faces in real time and keep a proper record without anyone lining up.',
      problem:
        'Manual attendance gets skipped, faked or forgotten. Existing biometric systems are expensive. The gap: something accurate, cheap and automatic that a normal institute could actually run.',
      built:
        'A Python + OpenCV pipeline that detects faces, computes embeddings, matches them against enrolled students and writes attendance to MySQL through a Flask backend. Enrollment, live recognition and record viewing all run through a simple web UI.',
      difficult:
        'Lighting. Real-world recognition is nothing like the demos — shadows, motion blur and low light all break naive matching. Tuning thresholds so it recognizes people without letting impostors through was the real work.',
      learned:
        'Computer vision is 20% the model and 80% everything around it: capture conditions, preprocessing, thresholds, and what you do when a prediction is only 61% confident.',
      note: 'This broke three times. Worth it.',
    },
  },
  {
    id: 'agriconnect',
    number: '02',
    title: 'AgriConnect',
    category: 'AgriTech / AI / Web',
    tagline: 'Fewer middlemen between farmers and consumers.',
    description:
      'A platform designed to reduce unnecessary intermediaries between farmers and consumers — built as a major hackathon project under real time pressure.',
    tech: ['React', 'Tailwind CSS', 'AI/ML', 'Data Analysis'],
    image: agriconnectImg,
    certificate: 'https://yashbharti.in/certs/Azisly%20Impact%20Sprint%20And%2030%20Hours%20Course%20Completion%20Certificate%20Yash%20bharti%20.pdf',
    links: [
      { label: 'GitHub', href: '#', external: true },
      { label: 'Live demo', href: '#', external: true },
    ],
    viewer: {
      idea:
        'Every hand a crop passes through adds cost the farmer never sees. What if a farmer could list produce directly, with pricing context to back it up?',
      problem:
        'Farmers often receive a small fraction of the final retail price because of layers of intermediaries — and they have no visibility into market demand.',
      built:
        'A React + Tailwind marketplace interface with AI/ML-assisted data analysis on the backend: price and demand context to help farmers list smarter. Built end-to-end during a hackathon sprint with a team.',
      difficult:
        'Scope. Hackathon ideas are always three products wide and one evening deep. Deciding what to cut — fast — mattered more than anything technical.',
      learned:
        'A demo that tells one clear story beats a half-finished platform that tells five. Also: design the empty states before the judges look at them.',
    },
  },
  {
    id: 'bookstore',
    number: '03',
    title: 'Online Bookstore',
    category: 'Full Stack Development',
    tagline: 'Multi-user bookstore, built the classic way.',
    description:
      'A multi-user online bookstore application — the project where the fundamentals got drilled in: auth, sessions, cart logic, relational data.',
    tech: ['Flask', 'MySQL', 'HTML', 'CSS', 'JavaScript'],
    image: bookstoreImg,
    certificate: 'https://yashbharti.in/certs/Azisly%20Impact%20Sprint%20And%2030%20Hours%20Course%20Completion%20Certificate%20Yash%20bharti%20.pdf',
    links: [{ label: 'GitHub', href: '#', external: true }],
    viewer: {
      idea:
        'Before the fancy stuff, I wanted one project that does the boring parts properly: accounts, sessions, inventory, orders — a full vertical slice of a real web app.',
      problem:
        'Tutorials show you fragments. I wanted the whole loop: a user registers, browses, buys, and the data model behind it stays sane.',
      built:
        'A Flask app with MySQL: user auth, book catalog with search, cart and checkout flows, and separate roles for admin and customers. Plain HTML/CSS/JS on the front.',
      difficult:
        'Schema design. Getting users, books, orders and line items modeled right the first time — and then migrating when I got it wrong — taught me more than any ORM lecture.',
      learned:
        'Relational thinking pays for itself. Also, sessions are deceptively easy to break.',
    },
  },
  {
    id: 'faraway-2026',
    number: '04',
    title: 'FAR AWAY 2026',
    category: 'Hackathon',
    tagline: 'International hackathon — Round 2 selected.',
    description:
      'Participation certificate for Round 1 (MVP Submission) and Round 2 of FAR AWAY 2026, an international hackathon organised by Zuup.',
    tech: ['Hackathon Engineering'],
    certificate: 'https://yashbharti.in/certs/FAR%20AWAY%202026%20-%20Certificate%20-%20Yash%20Bharti_260830131105.pdf',
    image: null,
    links: [{ label: 'FAR AWAY 2026', href: 'https://faraway.dev', external: true }],
    viewer: {
      idea: 'A step closer to the journey to Japan.',
      problem: 'Early-stage teams need room to ship without the noise.',
      built: 'A sprint process that took a small team from idea to a jury-selected second round.',
      difficult: 'Keeping the scope honest when the prize and the prestige are both talking.',
      learned: 'Direction beats polish. A clear story survives the deadline.',
    },
  },
]

export const certificates: Certificate[] = [
  {
    id: 'faraway-2026',
    projectId: 'faraway-2026',
    number: '01',
    kind: 'participation',
    title: 'FAR AWAY 2026 — participation certificate',
    issued: 'August 2026',
    issuer: 'Far Away · organised by Zuup',
    cfNo: 'FA26-U7N1XJ96-03',
    certificate: 'https://yashbharti.in/certs/FAR%20AWAY%202026%20-%20Certificate%20-%20Yash%20Bharti_260830131105.pdf',
    image: farawayImg,
  },
  {
    id: 'azisly',
    projectId: 'agriconnect',
    number: '02',
    kind: 'participation',
    title: 'Azisly Impact Sprint — 15-day live project + 30 hours course certificate',
    issued: 'September 10, 2026',
    issuer: 'Azisly · Certified AI — Corporate Ready',
    cfNo: 'AZTL-15261271',
    certificate: 'https://yashbharti.in/certs/15-Day%20Live%20Project%20%E2%80%93%20Impact%20Sprint%20&%2030%20Hours%20Course%20Completion-Yash%20Bharti.pdf',
    image: azislyCertImg,
  },
  {
    id: 'azisly-loa',
    projectId: 'agriconnect',
    number: '02',
    kind: 'letter-of-appreciation',
    title: 'Azisly Impact Sprint — letter of appreciation (top 10% performers)',
    issued: 'September 05, 2026',
    issuer: 'Azisly · Prasun Choudhary, Founder',
    cfNo: 'AZTL-15261031',
    certificate: 'https://yashbharti.in/certs/LOA-Azisly%20Impact%20Sprint%2015-Day%20AI%20Live%20Project%20&%2030%20Hours%20Course%20-Yash%20Bharti.pdf',
    image: azislyLoaImg,
  },
  {
    id: 'ibm-skillsbuild',
    number: '03',
    kind: 'completion',
    title: 'IBM SkillsBuild — completion certificate (AI in Practice)',
    issued: 'September 06, 2025',
    issuer: 'IBM SkillsBuild · IBM Learning Patterns system of record',
    cfNo: 'ILB-ZKVJNXVZKMZXEWGN',
    certificate: 'https://yashbharti.in/certs/Completion%20Certificate%20_%20SkillsBuild%20%2811%29.pdf',
    image: ibmSkillsbuildImg,
  },
  {
    id: 'ibm-skillsbuild-bookstore',
    projectId: 'bookstore',
    number: '03',
    kind: 'completion',
    title: 'IBM SkillsBuild — completion certificate (AI in Practice)',
    issued: 'September 06, 2025',
    issuer: 'IBM SkillsBuild · IBM Learning Patterns system of record',
    cfNo: 'ILB-ZKVJNXVZKMZXEWGN',
    certificate: 'https://yashbharti.in/certs/Azisly%20Impact%20Sprint%20And%2030%20Hours%20Course%20Completion%20Certificate%20Yash%20bharti%20.pdf',
    image: ibmSkillsbuildBookstoreImg,
  },
  {
    id: 'decode-sih',
    number: '04',
    kind: 'participation',
    title: 'DECODE SIH 2026 — participation certificate',
    issued: '2026',
    issuer: 'DECODE SIH 2026 · organised by OSCode',
    cfNo: 'N/A',
    certificate: null,
    image: decodeSihImg,
  },
]
