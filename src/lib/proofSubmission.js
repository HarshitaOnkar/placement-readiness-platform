/**
 * Proof + submission for Placement Readiness Platform.
 * Stores 8 step completion and 3 artifact links. Shipped only when all conditions met.
 */

import { isChecklistComplete } from './testChecklist';

const STORAGE_KEY = 'prp_final_submission';
const STEPS_KEY = 'prp_proof_steps';

const STEP_IDS = ['1', '2', '3', '4', '5', '6', '7', '8'];

export const PROOF_STEPS = [
  { id: '1', label: 'Landing & Get Started' },
  { id: '2', label: 'Dashboard shell & navigation' },
  { id: '3', label: 'Analyze (JD input, validation)' },
  { id: '4', label: 'Results (skills, score, plan, questions)' },
  { id: '5', label: 'History (save & load)' },
  { id: '6', label: 'Company intel & round mapping' },
  { id: '7', label: 'Test checklist (10 items passed)' },
  { id: '8', label: 'Proof artifacts (3 links submitted)' },
];

function getStoredSubmission() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { lovableUrl: '', githubUrl: '', deployedUrl: '' };
    const parsed = JSON.parse(raw);
    return typeof parsed === 'object' && parsed !== null
      ? {
          lovableUrl: typeof parsed.lovableUrl === 'string' ? parsed.lovableUrl : '',
          githubUrl: typeof parsed.githubUrl === 'string' ? parsed.githubUrl : '',
          deployedUrl: typeof parsed.deployedUrl === 'string' ? parsed.deployedUrl : '',
        }
      : { lovableUrl: '', githubUrl: '', deployedUrl: '' };
  } catch {
    return { lovableUrl: '', githubUrl: '', deployedUrl: '' };
  }
}

function setStoredSubmission(obj) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
  } catch (_) {}
}

function getStoredSteps() {
  try {
    const raw = localStorage.getItem(STEPS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null) return {};
    const out = {};
    for (const id of STEP_IDS) {
      out[id] = parsed[id] === true;
    }
    return out;
  } catch {
    return {};
  }
}

function setStoredSteps(obj) {
  try {
    localStorage.setItem(STEPS_KEY, JSON.stringify(obj));
  } catch (_) {}
}

/**
 * Validate URL: must be non-empty and valid http(s) URL.
 */
export function validateUrl(url) {
  if (typeof url !== 'string') return false;
  const trimmed = url.trim();
  if (!trimmed) return false;
  try {
    const u = new URL(trimmed);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

export function getSubmission() {
  return getStoredSubmission();
}

export function setSubmission({ lovableUrl = '', githubUrl = '', deployedUrl = '' }) {
  setStoredSubmission({
    lovableUrl: String(lovableUrl ?? '').trim(),
    githubUrl: String(githubUrl ?? '').trim(),
    deployedUrl: String(deployedUrl ?? '').trim(),
  });
}

export function getStepCompletion() {
  const stored = getStoredSteps();
  const out = {};
  for (const id of STEP_IDS) {
    out[id] = stored[id] === true;
  }
  return out;
}

export function setStepCompletion(stepId, completed) {
  if (!STEP_IDS.includes(String(stepId))) return;
  const stored = getStoredSteps();
  stored[String(stepId)] = completed === true;
  setStoredSteps(stored);
}

/**
 * All 3 links must be valid URLs.
 */
export function hasValidProofLinks() {
  const s = getStoredSubmission();
  return validateUrl(s.lovableUrl) && validateUrl(s.githubUrl) && validateUrl(s.deployedUrl);
}

/**
 * Shipped ONLY when: all 8 steps completed + all 10 checklist passed + all 3 proof links valid.
 * Does NOT bypass checklist lock.
 */
export function isShipped() {
  const steps = getStepCompletion();
  const allStepsComplete = STEP_IDS.every((id) => steps[id] === true);
  const checklistComplete = isChecklistComplete();
  const linksValid = hasValidProofLinks();
  return allStepsComplete && checklistComplete && linksValid;
}

/**
 * Build the final submission text for copy.
 */
export function buildFinalSubmissionText() {
  const s = getStoredSubmission();
  const lines = [
    '------------------------------------------',
    'Placement Readiness Platform — Final Submission',
    '',
    `Lovable Project: ${s.lovableUrl || '(not set)'}`,
    `GitHub Repository: ${s.githubUrl || '(not set)'}`,
    `Live Deployment: ${s.deployedUrl || '(not set)'}`,
    '',
    'Core Capabilities:',
    '- JD skill extraction (deterministic)',
    '- Round mapping engine',
    '- 7-day prep plan',
    '- Interactive readiness scoring',
    '- History persistence',
    '------------------------------------------',
  ];
  return lines.join('\n');
}
