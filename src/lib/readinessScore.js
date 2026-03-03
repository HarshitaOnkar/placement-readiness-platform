/**
 * Readiness score 0–100:
 * Start 35, +5 per category (max 30), +10 company, +10 role, +10 JD length > 800. Cap 100.
 */

const BASE_SCORE = 35
const PER_CATEGORY = 5
const MAX_CATEGORY_BONUS = 30
const COMPANY_BONUS = 10
const ROLE_BONUS = 10
const JD_LENGTH_BONUS = 10
const JD_LENGTH_THRESHOLD = 800

export function getReadinessScore({ company, role, jdText, categoryCount }) {
  let score = BASE_SCORE
  score += Math.min(categoryCount * PER_CATEGORY, MAX_CATEGORY_BONUS)
  if (company && String(company).trim()) score += COMPANY_BONUS
  if (role && String(role).trim()) score += ROLE_BONUS
  if (jdText && String(jdText).trim().length > JD_LENGTH_THRESHOLD) score += JD_LENGTH_BONUS
  return Math.min(100, Math.max(0, score))
}

/** Live score from base + skill confidence: +2 per "know", −2 per "practice". Used on Results and History. */
export function computeLiveScore(baseScore, skillConfidenceMap) {
  let knowCount = 0
  let practiceCount = 0
  Object.values(skillConfidenceMap || {}).forEach((v) => {
    if (v === 'know') knowCount++
    else practiceCount++
  })
  const delta = 2 * knowCount - 2 * practiceCount
  return Math.min(100, Math.max(0, (baseScore || 0) + delta))
}
