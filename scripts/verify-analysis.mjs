/**
 * Verify JD analysis logic with a sample JD containing React, Node.js, SQL.
 * Run from project root: node scripts/verify-analysis.mjs
 */

import { runAnalysis } from '../src/lib/analyze.js'
import { saveEntry, getHistory, getEntryById } from '../src/lib/storage.js'

const SAMPLE_JD = `
We are looking for a developer with React and Node.js experience.
You will work with SQL databases and build REST APIs. Knowledge of DSA is a plus.
`

const jdWithReactNodeSql = 'This role requires React, Node.js, and SQL. Experience with PostgreSQL is preferred.'

console.log('=== Verification: JD Analysis ===\n')

// 1) React, Node.js, SQL detected and shown as tags?
const result = runAnalysis({ company: 'Verify Corp', role: 'SDE 1', jdText: jdWithReactNodeSql })
const { extractedSkills, checklist, plan, questions, readinessScore } = result

const webSkills = extractedSkills.byCategory?.find((g) => g.category === 'Web')?.skills || []
const dataSkills = extractedSkills.byCategory?.find((g) => g.category === 'Data')?.skills || []
const hasReact = webSkills.some((s) => /react/i.test(s))
const hasNode = webSkills.some((s) => /node/i.test(s))
const hasSql = dataSkills.some((s) => /sql/i.test(s))

console.log('1) React, Node.js, SQL detected as tags?')
console.log('   Web skills:', webSkills.join(', '))
console.log('   Data skills:', dataSkills.join(', '))
console.log('   React:', hasReact ? 'YES' : 'NO')
console.log('   Node.js:', hasNode ? 'YES' : 'NO')
console.log('   SQL:', hasSql ? 'YES' : 'NO')
console.log('   =>', hasReact && hasNode && hasSql ? 'PASS' : 'FAIL')
console.log('')

// 2) Skills grouped by category?
const categories = extractedSkills.byCategory?.map((g) => g.category) || []
console.log('2) Skills grouped by category (Languages, Web, Data, etc.)?')
console.log('   Categories:', categories.join(', '))
console.log('   =>', categories.length >= 2 ? 'PASS' : 'FAIL')
console.log('')

// 3) 4-round checklist?
const rounds = checklist?.length ?? 0
console.log('3) 4-round preparation checklist?')
console.log('   Rounds:', rounds, checklist?.map((r) => r.title))
console.log('   =>', rounds === 4 ? 'PASS' : 'FAIL')
console.log('')

// 4) 7-day plan?
const planBlocks = plan?.length ?? 0
console.log('4) 7-day preparation plan generated?')
console.log('   Blocks:', planBlocks, plan?.map((p) => p.day))
console.log('   =>', planBlocks >= 5 ? 'PASS' : 'FAIL')
console.log('')

// 5) 10 questions?
const qCount = questions?.length ?? 0
console.log('5) 10 likely interview questions?')
console.log('   Count:', qCount)
console.log('   =>', qCount === 10 ? 'PASS' : 'FAIL')
console.log('')

// 6) Readiness score 0-100?
const scoreOk = typeof readinessScore === 'number' && readinessScore >= 0 && readinessScore <= 100
console.log('6) Readiness score (0-100) calculated and displayed?')
console.log('   Score:', readinessScore)
console.log('   =>', scoreOk ? 'PASS' : 'FAIL')
console.log('')

// 7) Save and History (only in browser — localStorage not available in Node)
const entry = {
  id: `verify-${Date.now()}`,
  createdAt: new Date().toISOString(),
  company: 'Verify Corp',
  role: 'SDE 1',
  jdText: jdWithReactNodeSql,
  extractedSkills,
  plan,
  checklist,
  questions,
  readinessScore,
}
const hasLocalStorage = typeof localStorage !== 'undefined'
let inHistory = false
let loadOk = false
if (hasLocalStorage) {
  saveEntry(entry)
  const { list: historyList } = getHistory()
  inHistory = historyList.some((e) => e.id === entry.id)
  const loaded = getEntryById(entry.id)
  loadOk = loaded && (loaded.baseScore === entry.readinessScore || loaded.readinessScore === entry.readinessScore) && loaded.checklist?.length === 4
}
console.log('7) After analyzing, entry appears in History (date, company, role, score)?')
if (!hasLocalStorage) {
  console.log('   (Skip in Node — no localStorage. Verify in browser: Analyze → then open History.)')
  console.log('   => SKIP (verify in browser)')
} else {
  console.log('   Entry in history:', inHistory)
  console.log('   =>', inHistory ? 'PASS' : 'FAIL')
}
console.log('')

console.log('8) Click history entry — does it load full saved analysis?')
if (!hasLocalStorage) {
  console.log('   (Skip in Node. Verify in browser: click an entry in History → Results with same data.)')
  console.log('   => SKIP (verify in browser)')
} else {
  console.log('   Loaded by id:', loadOk)
  console.log('   =>', loadOk ? 'PASS' : 'FAIL')
}
console.log('')

const allPass =
  hasReact && hasNode && hasSql &&
  categories.length >= 2 &&
  rounds === 4 &&
  planBlocks >= 5 &&
  qCount === 10 &&
  scoreOk &&
  (!hasLocalStorage || (inHistory && loadOk))

console.log('=== Result:', allPass ? 'ALL CHECKS PASS' : 'SOME CHECKS FAIL', '===')
