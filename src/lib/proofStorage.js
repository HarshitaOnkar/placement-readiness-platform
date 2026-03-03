/**
 * Proof + Final submission. Persisted in localStorage under prp_final_submission.
 * Shipped = all 8 steps + all 10 tests + all 3 links valid.
 */

import { allTestsPassed } from './testChecklistStorage.js'

const STORAGE_KEY = 'prp_final_submission'
const TOTAL_STEPS = 8

const DEFAULT = {
  stepCompleted: Array.from({ length: TOTAL_STEPS }, () => false),
  lovableProjectLink: '',
  githubRepoLink: '',
  deployedUrl: '',
}

export function isValidUrl(s) {
  if (typeof s !== 'string' || !s.trim()) return false
  try {
    const u = new URL(s.trim())
    return u.protocol === 'http:' || u.protocol === 'https:'
  } catch {
    return false
  }
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...DEFAULT, stepCompleted: [...DEFAULT.stepCompleted] }
    const parsed = JSON.parse(raw)
    const stepCompleted = Array.isArray(parsed.stepCompleted)
      ? parsed.stepCompleted.slice(0, TOTAL_STEPS).map(Boolean)
      : [...DEFAULT.stepCompleted]
    while (stepCompleted.length < TOTAL_STEPS) stepCompleted.push(false)
    return {
      stepCompleted,
      lovableProjectLink: String(parsed.lovableProjectLink ?? '').trim(),
      githubRepoLink: String(parsed.githubRepoLink ?? '').trim(),
      deployedUrl: String(parsed.deployedUrl ?? '').trim(),
    }
  } catch {
    return { ...DEFAULT, stepCompleted: [...DEFAULT.stepCompleted] }
  }
}

function save(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    return true
  } catch {
    return false
  }
}

export function getProofSubmission() {
  return load()
}

export function setProofSubmission(data) {
  const next = load()
  if (data.stepCompleted != null && Array.isArray(data.stepCompleted)) {
    next.stepCompleted = data.stepCompleted.slice(0, TOTAL_STEPS).map(Boolean)
    while (next.stepCompleted.length < TOTAL_STEPS) next.stepCompleted.push(false)
  }
  if (typeof data.lovableProjectLink === 'string') next.lovableProjectLink = data.lovableProjectLink.trim()
  if (typeof data.githubRepoLink === 'string') next.githubRepoLink = data.githubRepoLink.trim()
  if (typeof data.deployedUrl === 'string') next.deployedUrl = data.deployedUrl.trim()
  return save(next)
}

export function setStepCompleted(index, completed) {
  const data = load()
  if (index < 0 || index >= TOTAL_STEPS) return false
  data.stepCompleted[index] = Boolean(completed)
  return save(data)
}

export function setLink(key, value) {
  const data = load()
  if (key === 'lovableProjectLink') data.lovableProjectLink = String(value ?? '').trim()
  else if (key === 'githubRepoLink') data.githubRepoLink = String(value ?? '').trim()
  else if (key === 'deployedUrl') data.deployedUrl = String(value ?? '').trim()
  else return false
  return save(data)
}

export function allStepsComplete() {
  const data = load()
  return data.stepCompleted.length >= TOTAL_STEPS && data.stepCompleted.every(Boolean)
}

export function allLinksProvided() {
  const data = load()
  return (
    isValidUrl(data.lovableProjectLink) &&
    isValidUrl(data.githubRepoLink) &&
    isValidUrl(data.deployedUrl)
  )
}

/** Shipped only when: 8 steps + 10 tests + 3 valid links. Does not bypass checklist. */
export function isShipped() {
  return allStepsComplete() && allTestsPassed() && allLinksProvided()
}

export { TOTAL_STEPS }
