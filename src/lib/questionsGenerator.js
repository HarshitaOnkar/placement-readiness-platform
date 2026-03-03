/**
 * Generate 10 likely interview questions from detected skills.
 */

import { SKILL_CATEGORIES } from './skillKeywords.js'

const QUESTION_TEMPLATES = {
  coreCS: [
    'How would you optimize search in sorted data? Discuss time complexity.',
    'Explain OOP pillars with examples (encapsulation, inheritance, polymorphism).',
    'Explain DBMS indexing: when it helps and trade-offs.',
    'Compare process vs thread. How does the OS schedule them?',
    'Explain TCP vs UDP. When would you use each?',
  ],
  languages: [
    'Explain pass-by-value vs pass-by-reference in your primary language.',
    'How do you handle concurrency (e.g., threads, async) in your stack?',
    'Describe memory management (GC, references) in your language.',
  ],
  web: [
    'Explain state management options in React (local, context, Redux).',
    'How does the virtual DOM work? When would you optimize re-renders?',
    'REST vs GraphQL: when would you choose each?',
    'Explain authentication (e.g., JWT) and how you would secure an API.',
  ],
  data: [
    'Explain indexing and when it helps. When can it hurt?',
    'How would you design a schema for [e.g., user + orders]?',
    'SQL vs NoSQL: when to use which?',
    'How would you scale read/write for a high-traffic database?',
  ],
  cloudDevOps: [
    'Explain Docker vs VMs. When would you use Kubernetes?',
    'How would you set up CI/CD for a typical web app?',
    'Describe a time you debugged a production issue (logging, monitoring).',
  ],
  testing: [
    'How do you approach unit vs integration testing?',
    'Describe your experience with [Selenium/Cypress/JUnit] and a test you wrote.',
  ],
  general: [
    'Tell me about a challenging bug you fixed.',
    'Describe a project you are proud of and your role in it.',
    'How do you stay updated with new technologies?',
  ],
}

export function getQuestions(extractedSkills) {
  const { categoryKeys, isGeneralFresher } = extractedSkills
  const questions = []
  const used = new Set()

  function addFrom(catKey) {
    const pool = QUESTION_TEMPLATES[catKey] || QUESTION_TEMPLATES.general
    for (const q of pool) {
      if (questions.length >= 10) return
      if (!used.has(q)) {
        used.add(q)
        questions.push(q)
      }
    }
  }

  if (isGeneralFresher) {
    addFrom('general')
    return questions.slice(0, 10)
  }

  for (const key of categoryKeys) {
    addFrom(key)
  }
  while (questions.length < 10) {
    addFrom('general')
  }

  return questions.slice(0, 10)
}
