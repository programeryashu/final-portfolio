export interface SkillCategory {
  id: string
  label: string
  items: SkillItem[]
}

export interface SkillItem {
  name: string
  /** where it has actually been used — no percentages, no ratings */
  usedIn: string
}

export const skillCategories: SkillCategory[] = [
  {
    id: 'aiml',
    label: 'AI / ML',
    items: [
      { name: 'Python', usedIn: 'Across AI/ML experiments, computer vision and backend projects.' },
      { name: 'OpenCV', usedIn: 'SentinelID — real-time face detection and recognition pipeline.' },
      { name: 'Machine Learning', usedIn: 'Attendance recognition, price/demand analysis for AgriConnect.' },
      { name: 'Neural Networks', usedIn: 'Coursework and experiments — currently going deeper.' },
      { name: 'LLMs', usedIn: 'Retrieval experiments over curated knowledge corpora.' },
      { name: 'Prompt Engineering', usedIn: 'Daily driver: local models, agent experiments, dev workflows.' },
    ],
  },
  {
    id: 'dev',
    label: 'Development',
    items: [
      { name: 'HTML', usedIn: 'Every web project since the bookstore.' },
      { name: 'CSS', usedIn: 'Bookstore UI, AgriConnect, this portfolio.' },
      { name: 'JavaScript', usedIn: 'Game systems and interactive frontends.' },
      { name: 'TypeScript', usedIn: 'This portfolio — I like my refactors with a safety net.' },
      { name: 'React', usedIn: 'AgriConnect frontend and current full-stack experiments.' },
      { name: 'Flask', usedIn: 'SentinelID backend, bookstore, quick ML service endpoints.' },
      { name: 'Tailwind CSS', usedIn: 'AgriConnect — fast, consistent UI under hackathon pressure.' },
    ],
  },
  {
    id: 'data',
    label: 'Database / Backend',
    items: [
      { name: 'MySQL', usedIn: 'SentinelID attendance records, bookstore catalog and orders.' },
      { name: 'SQLite', usedIn: 'Local experiments and prototypes.' },
      { name: 'Supabase', usedIn: 'Structured knowledge stores in AI experiments.' },
      { name: 'Firebase', usedIn: 'Evaluated for quick auth/DB in hackathon builds.' },
    ],
  },
  {
    id: 'tools',
    label: 'Tools',
    items: [
      { name: 'Git', usedIn: 'Every project — history is a debugging tool, not a formality.' },
      { name: 'GitHub', usedIn: 'All repos and hackathon submissions.' },
      { name: 'VS Code', usedIn: 'Home base.' },
      { name: 'Azure', usedIn: 'Exploring cloud services for AI deployments.' },
      { name: 'Ollama', usedIn: 'Running local LLMs for agent and knowledge experiments.' },
    ],
  },
]
