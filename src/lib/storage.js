/**
 * Persist analysis history in localStorage. No external APIs.
 * Entries are validated and normalized; corrupt entries are skipped.
 */

import { normalizeEntry, validateEntry } from './entrySchema.js'

const STORAGE_KEY = 'placement-readiness-history'

/**
 * Returns { list: normalized valid entries, skippedCount: number of corrupt entries skipped }.
 */
export function getHistory() {
  let list = []
  let skippedCount = 0
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { list: [], skippedCount: 0 }
    const parsed = JSON.parse(raw)
    const arr = Array.isArray(parsed) ? parsed : []
    for (const e of arr) {
      try {
        const normalized = normalizeEntry(e)
        if (normalized && validateEntry(normalized)) {
          list.push(normalized)
        } else {
          skippedCount++
        }
      } catch {
        skippedCount++
      }
    }
  } catch {
    list = []
  }
  return { list, skippedCount }
}

/** For backward compatibility: raw list only (valid entries). */
export function getHistoryList() {
  return getHistory().list
}

export function saveEntry(entry) {
  const { list } = getHistory()
  const normalized = normalizeEntry(entry)
  if (!normalized || !validateEntry(normalized)) return null
  const withId = { ...normalized, id: normalized.id || `id-${Date.now()}` }
  list.unshift(withId)
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
    return withId.id
  } catch {
    return null
  }
}

export function getEntryById(id) {
  const { list } = getHistory()
  const entry = list.find((e) => e.id === id) || null
  return entry ? normalizeEntry(entry) : null
}

export function getLatestEntry() {
  const { list } = getHistory()
  const first = list[0] || null
  return first ? normalizeEntry(first) : null
}

/**
 * Update an existing history entry by id. Merges updates.
 * When updating skillConfidenceMap, caller should also pass finalScore and updatedAt.
 */
export function updateEntry(id, updates) {
  const { list } = getHistory()
  const index = list.findIndex((e) => e.id === id)
  if (index === -1) return false
  const merged = { ...list[index], ...updates }
  const normalized = normalizeEntry(merged)
  if (!normalized || !validateEntry(normalized)) return false
  list[index] = normalized
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
    return true
  } catch {
    return false
  }
}
