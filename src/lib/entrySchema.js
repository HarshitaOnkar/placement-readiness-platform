/**
 * Strict analysis entry schema, validation, and normalization.
 * All history entries are normalized to this shape.
 */

export const DEFAULT_OTHER_SKILLS = [
  'Communication',
  'Problem solving',
  'Basic coding',
  'Projects',
]

const CATEGORY_KEYS = ['coreCS', 'languages', 'web', 'data', 'cloud', 'testing', 'other']

function ensureStringArray(val) {
  if (Array.isArray(val)) return val.filter((x) => typeof x === 'string')
  return []
}

function ensureNumber(val, fallback = 0) {
  const n = Number(val)
  return Number.isFinite(n) ? n : fallback
}

/** Canonical extractedSkills from raw (analyze) or legacy byCategory/raw. */
export function toCanonicalExtractedSkills(extractedSkills, isGeneralFresher = false) {
  const raw = extractedSkills?.raw || {}
  const byCategory = extractedSkills?.byCategory || []
  const result = {
    coreCS: ensureStringArray(raw.coreCS),
    languages: ensureStringArray(raw.languages),
    web: ensureStringArray(raw.web),
    data: ensureStringArray(raw.data),
    cloud: ensureStringArray(raw.cloudDevOps || raw.cloud),
    testing: ensureStringArray(raw.testing),
    other: ensureStringArray(raw.other),
  }
  if (isGeneralFresher || (CATEGORY_KEYS.every((k) => result[k].length === 0) && result.other.length === 0)) {
    result.other = [...DEFAULT_OTHER_SKILLS]
  }
  return result
}

/** All skill strings from canonical extractedSkills (for toggles, weak list). */
export function getAllSkillStrings(canonical) {
  if (!canonical || typeof canonical !== 'object') return []
  return CATEGORY_KEYS.flatMap((k) => canonical[k] || [])
}

/** Legacy byCategory for UI (Key skills extracted). */
export function extractedSkillsToByCategory(canonical) {
  const labels = {
    coreCS: 'Core CS',
    languages: 'Languages',
    web: 'Web',
    data: 'Data',
    cloud: 'Cloud / DevOps',
    testing: 'Testing',
    other: 'Other',
  }
  return CATEGORY_KEYS.filter((k) => canonical[k]?.length).map((category) => ({
    category: labels[category],
    skills: canonical[category],
  }))
}

/** Canonical roundMapping: [{ round, roundTitle, focusAreas[], whyItMatters }]. */
export function toCanonicalRoundMapping(roundMapping) {
  if (!Array.isArray(roundMapping)) return []
  return roundMapping.map((r, i) => ({
    round: typeof r.round === 'number' ? r.round : i + 1,
    roundTitle: r.roundTitle ?? r.title ?? '',
    focusAreas: Array.isArray(r.focusAreas) ? r.focusAreas : (r.description ? [r.description] : []),
    whyItMatters: r.whyItMatters ?? r.whyMatters ?? '',
  }))
}

/** Canonical checklist: [{ roundTitle, items[] }]. */
export function toCanonicalChecklist(checklist) {
  if (!Array.isArray(checklist)) return []
  return checklist.map((c) => ({
    roundTitle: c.roundTitle ?? c.title ?? '',
    items: ensureStringArray(c.items),
  }))
}

/** Canonical plan7Days: [{ day, focus, tasks[] }]. */
export function toCanonicalPlan(plan) {
  if (!Array.isArray(plan)) return []
  return plan.map((p) => ({
    day: p.day ?? '',
    focus: typeof p.focus === 'string' ? p.focus : (p.tasks?.[0] ?? ''),
    tasks: ensureStringArray(p.tasks),
  }))
}

/** Validate entry has required fields and types. */
export function validateEntry(entry) {
  if (!entry || typeof entry !== 'object') return false
  if (!entry.id || typeof entry.id !== 'string') return false
  if (typeof entry.jdText !== 'string') return false
  const skills = entry.extractedSkills
  if (!skills || typeof skills !== 'object') return false
  for (const k of CATEGORY_KEYS) {
    if (!Array.isArray(skills[k])) return false
  }
  if (!Array.isArray(entry.checklist)) return false
  if (!Array.isArray(entry.plan7Days) && !Array.isArray(entry.plan)) return false
  if (!Array.isArray(entry.questions)) return false
  const base = ensureNumber(entry.baseScore, entry.readinessScore)
  if (base < 0 || base > 100) return false
  return true
}

/** Build canonical entry from runAnalysis result (for new analyses). */
export function buildEntryFromAnalysis(result, company, role, jdText) {
  const companyName = (company || '').trim()
  const roleName = (role || '').trim()
  const jd = (jdText || '').trim()
  const now = new Date().toISOString()
  const extractedSkills = toCanonicalExtractedSkills(
    result.extractedSkills,
    result.extractedSkills?.isGeneralFresher
  )
  const roundMapping = toCanonicalRoundMapping(result.roundMapping)
  const checklist = toCanonicalChecklist(result.checklist)
  const plan7Days = toCanonicalPlan(result.plan)
  const baseScore = Math.min(100, Math.max(0, Number(result.readinessScore) || 0))

  return {
    id: `id-${Date.now()}`,
    createdAt: now,
    company: companyName,
    role: roleName,
    jdText: jd,
    extractedSkills,
    roundMapping,
    checklist,
    plan7Days,
    questions: ensureStringArray(result.questions),
    baseScore,
    skillConfidenceMap: {},
    finalScore: baseScore,
    updatedAt: now,
    companyIntel: result.companyIntel ?? null,
  }
}

/** Normalize any entry (legacy or canonical) to strict schema. */
export function normalizeEntry(entry) {
  if (!entry || typeof entry !== 'object') return null
  const rawSkills = entry.extractedSkills || {}
  const isGeneralFresher = rawSkills.isGeneralFresher ?? (rawSkills.categoryKeys?.length === 0 && !rawSkills.raw?.coreCS?.length)
  const extractedSkills = toCanonicalExtractedSkills(rawSkills, isGeneralFresher)
  const roundMapping = toCanonicalRoundMapping(entry.roundMapping)
  const checklist = toCanonicalChecklist(entry.checklist)
  const plan7Days = toCanonicalPlan(entry.plan7Days ?? entry.plan)
  const questions = ensureStringArray(entry.questions)
  const baseScore = ensureNumber(entry.baseScore, entry.readinessScore)
  const skillConfidenceMap = entry.skillConfidenceMap && typeof entry.skillConfidenceMap === 'object'
    ? entry.skillConfidenceMap
    : {}
  const finalScore = ensureNumber(entry.finalScore, baseScore)

  return {
    id: String(entry.id ?? ''),
    createdAt: typeof entry.createdAt === 'string' ? entry.createdAt : new Date().toISOString(),
    company: typeof entry.company === 'string' ? entry.company : '',
    role: typeof entry.role === 'string' ? entry.role : '',
    jdText: String(entry.jdText ?? ''),
    extractedSkills,
    roundMapping,
    checklist,
    plan7Days,
    questions,
    baseScore,
    skillConfidenceMap,
    finalScore,
    updatedAt: typeof entry.updatedAt === 'string' ? entry.updatedAt : entry.createdAt ?? new Date().toISOString(),
    companyIntel: entry.companyIntel ?? null,
  }
}
