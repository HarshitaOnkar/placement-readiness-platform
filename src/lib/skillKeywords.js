/**
 * JD skill keywords by category (case-insensitive match).
 * Used for heuristic extraction only — no external APIs.
 */

export const SKILL_CATEGORIES = {
  coreCS: {
    label: 'Core CS',
    keywords: ['DSA', 'OOP', 'DBMS', 'OS', 'Networks', 'Data Structures', 'Algorithms', 'Computer Networks', 'Operating System'],
  },
  languages: {
    label: 'Languages',
    keywords: ['Java', 'Python', 'JavaScript', 'TypeScript', 'C', 'C#', 'C++', 'Go', 'Golang', 'Ruby', 'Kotlin', 'Swift'],
  },
  web: {
    label: 'Web',
    keywords: ['React', 'Next.js', 'Node.js', 'Express', 'REST', 'GraphQL', 'Angular', 'Vue', 'HTML', 'CSS'],
  },
  data: {
    label: 'Data',
    keywords: ['SQL', 'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'NoSQL', 'Database'],
  },
  cloudDevOps: {
    label: 'Cloud / DevOps',
    keywords: ['AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'CI/CD', 'Linux', 'DevOps', 'K8s'],
  },
  testing: {
    label: 'Testing',
    keywords: ['Selenium', 'Cypress', 'Playwright', 'JUnit', 'PyTest', 'Jest', 'Testing'],
  },
}

export const CATEGORY_KEYS = Object.keys(SKILL_CATEGORIES)
