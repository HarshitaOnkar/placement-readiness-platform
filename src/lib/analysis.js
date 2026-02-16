import { extractSkills } from './skillCategories';
import { getCompanyIntel, getRoundMapping } from './companyIntel';

const CATEGORY_NAMES = [
  'Core CS',
  'Languages',
  'Web',
  'Data',
  'Cloud/DevOps',
  'Testing',
];

/**
 * Readiness score 0–100.
 * Start 35, +5 per detected category (max 30), +10 company, +10 role, +10 JD length > 800. Cap 100.
 */
export function computeReadinessScore(company, role, jdText, categoryNames) {
  let score = 35;
  const detectedCategories = categoryNames.filter((c) => c !== 'General');
  score += Math.min(detectedCategories.length * 5, 30);
  if (company && String(company).trim()) score += 10;
  if (role && String(role).trim()) score += 10;
  if (jdText && String(jdText).trim().length > 800) score += 10;
  return Math.min(100, Math.max(0, score));
}

/**
 * Round-wise checklist. 5–8 items per round based on detected skills.
 */
export function buildChecklist(extractedSkills) {
  const { byCategory, isGeneralFresher } = extractedSkills;
  const has = (cat) => byCategory[cat]?.length > 0;
  const tags = (cat) => byCategory[cat] || [];

  const round1 = [
    'Revise quantitative aptitude: ratios, percentages, time-speed-distance.',
    'Practice logical reasoning and pattern-based questions.',
    'Review basic CS fundamentals: computer architecture, number systems.',
    'Take at least one timed aptitude mock test.',
    'Brush up verbal ability if the role requires communication.',
  ];
  if (has('Core CS')) {
    round1.push('Revise OS basics: processes, threads, scheduling.');
    round1.push('Revise DBMS basics: normalization, ACID.');
  }
  if (has('Languages')) round1.push(`Review ${tags('Languages')[0]} syntax and common APIs.`);
  const r1 = round1.slice(0, 8);

  const round2 = [
    'Practice array and string problems (2–3 daily).',
    'Revise key data structures: arrays, linked lists, trees, graphs.',
    'Practice hash map and two-pointer patterns.',
  ];
  if (has('Core CS')) {
    round2.push('Revise OOP concepts: encapsulation, inheritance, polymorphism.');
    round2.push('Prepare short notes on OS: deadlock, memory management.');
    round2.push('Revise networking: TCP/IP, HTTP, status codes.');
  }
  round2.push('Do at least 2 medium LeetCode (or equivalent) problems.');
  if (has('Core CS')) round2.push('Revise time/space complexity for common algorithms.');
  const r2 = round2.slice(0, 8);

  const round3 = [
    'List 2–3 projects with tech stack and your role.',
    'Prepare 2–3 min project summary (problem, solution, impact).',
  ];
  if (has('Web')) {
    round3.push(`Prepare to explain ${tags('Web').join(' / ')} choices in your projects.`);
    round3.push('Revise REST/API design and status codes.');
  }
  if (has('Data')) round3.push(`Prepare to explain DB design and ${tags('Data').join(', ')} usage.`);
  if (has('Languages')) round3.push(`Be ready to write small ${tags('Languages')[0]} snippets on a shared editor.`);
  if (has('Cloud/DevOps')) round3.push(`Prepare to discuss deployment (${tags('Cloud/DevOps').slice(0, 2).join(', ')}) if relevant.`);
  round3.push('Prepare questions to ask the interviewer about the role.');
  const r3 = round3.slice(0, 8);

  const round4 = [
    'Prepare self-introduction (1–2 min).',
    'Prepare STAR examples for teamwork, conflict, deadline.',
    'Know why you want this company and this role.',
    'Prepare “strengths and weaknesses” with honest, brief answers.',
    'Prepare 2–3 questions about team, growth, and culture.',
  ];
  if (!isGeneralFresher) round4.push('Align your story with the JD skills and company values.');
  const r4 = round4.slice(0, 8);

  return [
    { round: 'Round 1: Aptitude / Basics', items: r1 },
    { round: 'Round 2: DSA + Core CS', items: r2 },
    { round: 'Round 3: Tech interview (projects + stack)', items: r3 },
    { round: 'Round 4: Managerial / HR', items: r4 },
  ];
}

/**
 * 7-day plan. Adapted to detected skills (e.g. React → frontend revision).
 */
export function build7DayPlan(extractedSkills) {
  const { byCategory, isGeneralFresher } = extractedSkills;
  const has = (cat) => byCategory[cat]?.length > 0;
  const tags = (cat) => byCategory[cat] || [];

  const day1 = [
    'Revise core CS: OS (processes, threads), DBMS (normalization, SQL basics).',
    'Brush up aptitude: percentages, ratios, simple reasoning.',
  ];
  if (has('Core CS')) day1.push('Revise Networks: TCP/IP, HTTP basics.');
  const d1 = day1;

  const day2 = [
    'Continue core CS: data structures (array, linked list, stack, queue).',
    'Practice 2–3 basic coding problems (arrays/strings).',
  ];
  if (has('Languages')) day2.push(`Quick ${tags('Languages')[0]} syntax and stdlib recap.`);
  const d2 = day2;

  const day3 = [
    'DSA focus: trees and graphs (traversals, BFS/DFS).',
    'Solve 2 medium-level problems (tree/graph).',
  ];
  const d3 = day3;

  const day4 = [
    'DSA: dynamic programming and greedy (classic problems).',
    'Coding practice: 2 problems under time limit.',
  ];
  const d4 = day4;

  const day5 = [
    'Document 2 projects: tech stack, your role, outcomes.',
    'Align resume bullets with JD keywords.',
  ];
  if (has('Web')) day5.push(`Frontend revision: ${tags('Web').join(', ')} — key concepts.`);
  if (has('Data')) day5.push(`DB design and ${tags('Data').join(', ')} usage in projects.`);
  const d5 = day5;

  const day6 = [
    'Practice mock interview: introduce yourself, explain one project.',
    'Prepare 5–10 likely tech questions from your stack.',
  ];
  if (has('Core CS')) day6.push('Prepare OS/DBMS/Networks short answers.');
  const d6 = day6;

  const day7 = [
    'Revision: weak areas from the week.',
    'Light practice: 1–2 easy problems to stay sharp.',
    'Rest and prepare mentally for the interview.',
  ];
  const d7 = day7;

  return [
    { day: 'Day 1–2: Basics + core CS', tasks: d1.concat(d2) },
    { day: 'Day 3–4: DSA + coding practice', tasks: d3.concat(d4) },
    { day: 'Day 5: Project + resume alignment', tasks: d5 },
    { day: 'Day 6: Mock interview questions', tasks: d6 },
    { day: 'Day 7: Revision + weak areas', tasks: d7 },
  ];
}

/**
 * 10 likely interview questions based on detected skills.
 */
export function buildQuestions(extractedSkills) {
  const { byCategory } = extractedSkills;
  const has = (cat) => byCategory[cat]?.length > 0;
  const tags = (cat) => byCategory[cat] || [];
  const questions = [];

  if (has('Data') && tags('Data').some((s) => /sql/i.test(s))) {
    questions.push('Explain indexing and when it helps.');
  }
  if (has('Web') && tags('Web').some((s) => /react/i.test(s))) {
    questions.push('Explain state management options.');
  }
  if (has('Core CS')) {
    questions.push('How would you optimize search in sorted data?');
  }
  if (has('Core CS')) {
    questions.push('Explain the difference between process and thread.');
    questions.push('What is normalization? Why is it used in DBMS?');
  }
  if (has('Web')) {
    questions.push('Explain REST principles and when you would use PUT vs PATCH.');
  }
  if (has('Languages') && tags('Languages').some((s) => /java|python/i.test(s))) {
    questions.push('Explain inheritance and polymorphism with a short code example.');
  }
  if (has('Cloud/DevOps')) {
    questions.push('What is the difference between Docker and Kubernetes? When use which?');
  }
  if (has('Data') && tags('Data').some((s) => /mongo|nosql/i.test(s))) {
    questions.push('When would you choose a NoSQL database over a relational one?');
  }
  if (has('Testing')) {
    questions.push('How do you approach writing tests for a new feature?');
  }
  if (has('Web') && tags('Web').some((s) => /node/i.test(s))) {
    questions.push('Explain the event loop in Node.js and how it handles async I/O.');
  }

  const generic = [
    'Tell me about a challenging bug you fixed and how you approached it.',
    'Describe a project where you had to learn a new technology quickly.',
    'How do you handle disagreements with a teammate on technical decisions?',
  ];

  while (questions.length < 10) {
    const pick = generic[questions.length % generic.length];
    if (!questions.includes(pick)) questions.push(pick);
    else questions.push(generic[2]);
  }
  return questions.slice(0, 10);
}

/**
 * Run full analysis. Returns object ready to save as history entry (id and createdAt added by caller).
 * Includes companyIntel and roundMapping when company is provided.
 */
export function runAnalysis(company, role, jdText) {
  const extractedSkills = extractSkills(jdText);
  const { categoryNames } = extractedSkills;
  const readinessScore = computeReadinessScore(company, role, jdText, categoryNames);
  const checklist = buildChecklist(extractedSkills);
  const plan = build7DayPlan(extractedSkills);
  const questions = buildQuestions(extractedSkills);

  const companyName = (company || '').trim();
  const companyIntel = getCompanyIntel(companyName, jdText) ?? undefined;
  const roundMapping = getRoundMapping(companyIntel, extractedSkills);

  return {
    company: companyName,
    role: (role || '').trim(),
    jdText: (jdText || '').trim(),
    extractedSkills,
    checklist,
    plan,
    questions,
    readinessScore,
    companyIntel,
    roundMapping,
  };
}
