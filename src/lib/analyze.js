/**
 * Run full analysis: extract skills, checklist, plan, questions, score.
 * No external APIs.
 */

import { extractSkills } from './skillExtraction.js'
import { getChecklist } from './checklistGenerator.js'
import { get7DayPlan } from './planGenerator.js'
import { getQuestions } from './questionsGenerator.js'
import { getReadinessScore } from './readinessScore.js'
import { getCompanyIntel } from './companyIntel.js'
import { getRoundMapping } from './roundMapping.js'

export function runAnalysis({ company = '', role = '', jdText = '' }) {
  const extractedSkills = extractSkills(jdText)
  const categoryCount = extractedSkills.categoryKeys.length
  const readinessScore = getReadinessScore({
    company,
    role,
    jdText,
    categoryCount: extractedSkills.isGeneralFresher ? 0 : categoryCount,
  })

  const companyName = (company || '').trim()
  const companyIntel = companyName ? getCompanyIntel(companyName, jdText) : null
  const roundMapping = companyIntel
    ? getRoundMapping(companyIntel.size, extractedSkills)
    : null

  return {
    extractedSkills,
    checklist: getChecklist(extractedSkills),
    plan: get7DayPlan(extractedSkills),
    questions: getQuestions(extractedSkills),
    readinessScore,
    companyIntel,
    roundMapping,
  }
}
