/**
 * Hackathons & competitions. Only what actually happened —
 * no invented dates, rankings or details.
 */

export interface Achievement {
  id: string
  title: string
  /** short factual result line */
  result: string
  /** honest detail, kept minimal */
  detail?: string
  status: 'done' | 'selected' | 'participated'
}

export const achievements: Achievement[] = [
  {
    id: 'sih',
    title: 'Smart India Hackathon',
    result: 'Built SentinelUPI — SIH project work.',
    detail: 'Internal round project built for the Smart India Hackathon.',
    status: 'done',
  },
  {
    id: 'far-away',
    title: 'Far Away Hackathon',
    result: 'Selected for the second round.',
    status: 'selected',
  },
  {
    id: 'ibm-ai',
    title: 'IBM AI Hackathon',
    result: 'Participated.',
    status: 'participated',
  },
  {
    id: 'azisly',
    title: 'Azisly Code 2 Career',
    result: '15-hour live project experience.',
    detail: 'Fifteen hours, one project, built live — pressure included.',
    status: 'done',
  },
  {
    id: 'debugging',
    title: 'Debugging Competition',
    result: '1st runner-up.',
    status: 'selected',
  },
]
