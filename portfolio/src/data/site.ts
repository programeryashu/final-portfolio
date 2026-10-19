/** Single place to edit identity + links. No email is invented here. */

export const site = {
  name: 'Yash Bharti',
  role: 'AI/ML Student • Developer • Builder • Experimenter',
  positioning: 'Building things with AI, code and curiosity.',
  heroLines: ['I BUILD THINGS', 'WITH CODE, AI', '& CURIOSITY.'],
  heroSupport:
    'AI/ML student, developer and experimental builder exploring ideas that turn into real products.',

  /**
   * Real contact address (VITE_CONTACT_EMAIL still overrides at build
   * time). Used by the contact form, the mailto fallback and the
   * terminal readout.
   */
  email: import.meta.env.VITE_CONTACT_EMAIL ?? 'yashb4092@gmail.com',

  socials: [
    { label: 'GitHub', href: 'https://github.com/programeryashu' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/yash-bharti-354aa4384' },
    { label: 'Instagram', href: 'https://www.instagram.com/yash_bharti2007' },
    { label: 'WhatsApp', href: 'https://wa.me/9625017921' },
  ],

  /** low-effort to update, per spec */
  currentlyExploring: [
    'AI Agents',
    'LLMs',
    'Computer Vision',
    'Local AI',
    'Full Stack Development',
    '3D Web Experiences',
    'Knowledge Systems',
  ],
}

export interface LabExperiment {
  id: string
  title: string
  /** EXPERIMENTING / BUILDING / LEARNING — never a percentage */
  status: 'EXPERIMENTING' | 'BUILDING' | 'LEARNING'
  detail: string
  note?: string
}

export const labExperiments: LabExperiment[] = [
  {
    id: 'agents',
    title: 'AI Agents',
    status: 'EXPERIMENTING',
    detail: 'Agent workflows, local models and AI-assisted development. Currently mapping where agents actually help versus where they just add ceremony.',
    note: 'currently figuring this out',
  },
  {
    id: 'cv',
    title: 'Computer Vision',
    status: 'BUILDING',
    detail: 'Recognition, detection and real-world vision systems — SentinelID grew out of this and it keeps pulling me back.',
  },
  {
    id: 'knowledge',
    title: 'Knowledge Systems',
    status: 'EXPERIMENTING',
    detail: 'Structured datasets and AI-assisted retrieval. One experiment opened a rabbit hole I have not closed yet.',
    note: 'still experimenting',
  },
  {
    id: 'web',
    title: 'Web Experiments',
    status: 'BUILDING',
    detail: 'Interfaces, prototypes and interactive experiences — including the 3D scenes on this very page.',
    note: 'yes, the cursor is custom',
  },
]
