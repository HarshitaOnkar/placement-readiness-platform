/**
 * Heuristic skill extraction from JD text (case-insensitive).
 * No external APIs. Returns grouped skills or "General fresher stack" if none.
 */

import { SKILL_CATEGORIES, CATEGORY_KEYS } from './skillKeywords.js'

export function extractSkills(jdText) {
  if (!jdText || typeof jdText !== 'string') {
    return {
      byCategory: [],
      categoryKeys: [],
      isGeneralFresher: true,
      raw: {},
    }
  }

  const text = jdText.trim()
  const lower = text.toLowerCase()
  const raw = {}
  const byCategory = []

  for (const key of CATEGORY_KEYS) {
    const { label, keywords } = SKILL_CATEGORIES[key]
    const found = []
    for (const kw of keywords) {
      let regex
      if (kw === 'C') {
        regex = /\bc(?![\+#])/i
      } else {
        regex = new RegExp(`\\b${escapeRegExp(kw)}\\b`, 'gi')
      }
      if (regex.test(lower)) found.push(kw)
    }
    if (found.length) {
      raw[key] = [...new Set(found)]
      byCategory.push({ category: label, skills: raw[key] })
    }
  }

  const categoryKeys = Object.keys(raw)
  const isGeneralFresher = categoryKeys.length === 0

  if (isGeneralFresher) {
    byCategory.push({
      category: 'General',
      skills: ['General fresher stack'],
    })
  }

  return {
    byCategory,
    categoryKeys,
    isGeneralFresher,
    raw,
  }
}

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
