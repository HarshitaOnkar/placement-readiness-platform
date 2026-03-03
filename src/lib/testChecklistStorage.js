/**
 * Test checklist for PRP. Persisted in localStorage.
 * 10 items; all must be checked to unlock ship.
 */

const STORAGE_KEY = 'prp-test-checklist'
const TOTAL_TESTS = 10

function defaultChecks() {
  return Array.from({ length: TOTAL_TESTS }, () => false)
}

export function getTestChecklist() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultChecks()
    const arr = JSON.parse(raw)
    if (!Array.isArray(arr) || arr.length !== TOTAL_TESTS) return defaultChecks()
    return arr.map((v) => Boolean(v))
  } catch {
    return defaultChecks()
  }
}

export function setTestChecklist(checks) {
  if (!Array.isArray(checks) || checks.length !== TOTAL_TESTS) return false
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(checks))
    return true
  } catch {
    return false
  }
}

export function setTestChecked(index, checked) {
  const checks = getTestChecklist()
  if (index < 0 || index >= TOTAL_TESTS) return false
  checks[index] = Boolean(checked)
  return setTestChecklist(checks)
}

export function allTestsPassed() {
  const checks = getTestChecklist()
  return checks.length === TOTAL_TESTS && checks.every(Boolean)
}

export function resetTestChecklist() {
  return setTestChecklist(defaultChecks())
}

export { TOTAL_TESTS }
