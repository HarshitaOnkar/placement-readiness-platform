/**
 * Round-wise preparation checklist (5–8 items per round) from detected skills.
 */

import { SKILL_CATEGORIES } from './skillKeywords.js'

const ROUND_BASE = {
  round1: {
    title: 'Round 1: Aptitude / Basics',
    base: [
      'Revise quantitative aptitude (percentages, ratios, time-speed-distance).',
      'Practice logical reasoning and pattern recognition.',
      'Brush up verbal ability and reading comprehension.',
      'Time yourself on sample aptitude tests.',
      'Review basic grammar and error correction.',
    ],
    extra: {
      coreCS: 'Include basic CS fundamentals (binary, number systems).',
      languages: 'Review syntax and common constructs of mentioned languages.',
    },
  },
  round2: {
    title: 'Round 2: DSA + Core CS',
    base: [
      'Revise arrays, strings, and two-pointer techniques.',
      'Practice linked lists, stacks, and queues.',
      'Cover trees (BST, traversals) and graphs (BFS/DFS).',
      'Review sorting and searching algorithms.',
      'Prepare time/space complexity for common patterns.',
    ],
    extra: {
      coreCS: 'Revise DBMS (normalization, ACID), OS (scheduling, memory), Networks (TCP/IP, HTTP).',
      data: 'Prepare SQL queries (joins, subqueries, indexing).',
    },
  },
  round3: {
    title: 'Round 3: Tech interview (projects + stack)',
    base: [
      'Prepare 2–3 project descriptions (problem, your role, tech stack).',
      'Align resume bullet points with JD requirements.',
      'Prepare STAR-style answers for behavioral questions.',
      'Review system design basics (scalability, load balancing).',
    ],
    extra: {
      web: 'Revise React/Vue concepts, REST/GraphQL, state management.',
      languages: 'Prepare language-specific best practices and OOP.',
      data: 'Prepare database design and query optimization examples.',
      cloudDevOps: 'Revise Docker, CI/CD, and cloud basics (AWS/GCP/Azure).',
      testing: 'Prepare testing strategies and tool experience.',
    },
  },
  round4: {
    title: 'Round 4: Managerial / HR',
    base: [
      'Prepare self-introduction (1–2 min).',
      'Why this company? Why this role?',
      'Strengths and weaknesses with examples.',
      'Past teamwork and conflict resolution examples.',
      'Salary expectations and joining timeline.',
      'Questions to ask the interviewer.',
    ],
    extra: {},
  },
}

export function getChecklist(extractedSkills) {
  const { raw, categoryKeys } = extractedSkills
  const rounds = []

  for (const [roundKey, config] of Object.entries(ROUND_BASE)) {
    const items = [...config.base]
    for (const [cat, extraItem] of Object.entries(config.extra)) {
      if (raw[cat] && raw[cat].length && extraItem) items.push(extraItem)
    }
    rounds.push({
      title: config.title,
      items: items.slice(0, 8),
    })
  }

  return rounds
}
