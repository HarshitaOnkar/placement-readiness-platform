/**
 * Built-in test checklist for Placement Readiness Platform.
 * Persisted in localStorage. All 10 must be checked to unlock /prp/08-ship.
 */

const STORAGE_KEY = 'placement_prep_test_checklist';

const TEST_IDS = [
  'jd-required',
  'short-jd-warning',
  'skills-extraction',
  'round-mapping',
  'score-deterministic',
  'toggles-live',
  'persist-refresh',
  'history-saves',
  'export-copy',
  'no-console-errors',
];

export const TEST_ITEMS = [
  { id: 'jd-required', label: 'JD required validation works', hint: 'Submit with empty JD; button should be disabled.' },
  { id: 'short-jd-warning', label: 'Short JD warning shows for <200 chars', hint: 'Paste fewer than 200 characters in JD; a calm warning should appear below the field.' },
  { id: 'skills-extraction', label: 'Skills extraction groups correctly', hint: 'Run analysis with the sample JD; Results should show skills grouped by category (Core CS, Languages, Web, etc.).' },
  { id: 'round-mapping', label: 'Round mapping changes based on company + skills', hint: 'Analyze with Infosys + DSA vs unknown company + React; round titles and count should differ.' },
  { id: 'score-deterministic', label: 'Score calculation is deterministic', hint: 'Same JD, company, and role give the same base score every time.' },
  { id: 'toggles-live', label: 'Skill toggles update score live', hint: 'On Results, toggle I know / Need practice; the score and circle should update immediately.' },
  { id: 'persist-refresh', label: 'Changes persist after refresh', hint: 'Toggle some skills on Results, then refresh the page; same toggles and score should appear.' },
  { id: 'history-saves', label: 'History saves and loads correctly', hint: 'Run an analysis, open History; the entry should appear. Click it to open Results.' },
  { id: 'export-copy', label: 'Export buttons copy the correct content', hint: 'Click Copy 7-day plan, Copy round checklist, or Copy 10 questions; paste in a text editor to verify content.' },
  { id: 'no-console-errors', label: 'No console errors on core pages', hint: 'Open /, /dashboard, /dashboard/analyze, /dashboard/results, /dashboard/history; Console should show no errors.' },
];

function getStored() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return typeof parsed === 'object' && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
}

function setStored(obj) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
  } catch (_) {}
}

/**
 * @returns {{ [id: string]: boolean }}
 */
export function getChecklist() {
  const stored = getStored();
  const out = {};
  for (const id of TEST_IDS) {
    out[id] = stored[id] === true;
  }
  return out;
}

/**
 * @param {string} id
 * @param {boolean} checked
 */
export function setChecklistItem(id, checked) {
  const stored = getStored();
  if (!TEST_IDS.includes(id)) return;
  stored[id] = checked === true;
  setStored(stored);
}

/**
 * @returns {boolean} true if all 10 items are checked
 */
export function isChecklistComplete() {
  const checklist = getChecklist();
  return TEST_IDS.every((id) => checklist[id] === true);
}

/**
 * Clear all checklist checkboxes.
 */
export function resetChecklist() {
  setStored({});
}
