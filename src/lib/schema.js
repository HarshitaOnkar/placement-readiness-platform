/**
 * Standard analysis entry schema, validation, and migration.
 * All saved entries conform to this shape.
 */

export const DEFAULT_OTHER_SKILLS = [
  'Communication',
  'Problem solving',
  'Basic coding',
  'Projects',
];

const EMPTY_SKILLS = {
  coreCS: [],
  languages: [],
  web: [],
  data: [],
  cloud: [],
  testing: [],
  other: [],
};

/**
 * Normalize extractedSkills from byCategory/categoryNames to standard keys.
 * When no skills detected (general fresher), other = DEFAULT_OTHER_SKILLS.
 */
export function normalizeExtractedSkills(extractedSkills) {
  if (!extractedSkills) return { ...EMPTY_SKILLS, other: [...DEFAULT_OTHER_SKILLS] };
  const byCategory = extractedSkills.byCategory || {};
  const isGeneralFresher = extractedSkills.isGeneralFresher === true;
  const other = isGeneralFresher
    ? [...DEFAULT_OTHER_SKILLS]
    : (byCategory['General'] || []).slice();

  return {
    coreCS: byCategory['Core CS'] || [],
    languages: byCategory['Languages'] || [],
    web: byCategory['Web'] || [],
    data: byCategory['Data'] || [],
    cloud: byCategory['Cloud/DevOps'] || [],
    testing: byCategory['Testing'] || [],
    other: other.length ? other : [...DEFAULT_OTHER_SKILLS],
  };
}

/**
 * Convert normalized extractedSkills back to byCategory for UI (Results, export).
 */
export function getDisplaySkills(extractedSkills) {
  if (!extractedSkills || typeof extractedSkills !== 'object') return {};
  const norm = 'coreCS' in extractedSkills
    ? extractedSkills
    : normalizeExtractedSkills(extractedSkills);
  return {
    'Core CS': norm.coreCS || [],
    'Languages': norm.languages || [],
    'Web': norm.web || [],
    'Data': norm.data || [],
    'Cloud/DevOps': norm.cloud || [],
    'Testing': norm.testing || [],
    'General': norm.other || [],
  };
}

/**
 * Flatten all skill strings from normalized extractedSkills for iteration.
 */
export function getAllSkillsFromNormalized(extractedSkills) {
  const norm = extractedSkills && 'coreCS' in extractedSkills
    ? extractedSkills
    : normalizeExtractedSkills(extractedSkills);
  return [
    ...(norm.coreCS || []),
    ...(norm.languages || []),
    ...(norm.web || []),
    ...(norm.data || []),
    ...(norm.cloud || []),
    ...(norm.testing || []),
    ...(norm.other || []),
  ];
}

function normalizeRoundMapping(roundMapping) {
  if (!Array.isArray(roundMapping)) return [];
  return roundMapping.map((r) => ({
    roundTitle:r.roundTitle ?? (`${r.round || ''}: ${r.title || ''}`.trim() || 'Round'),
    focusAreas: Array.isArray(r.focusAreas) ? r.focusAreas : [],
    whyItMatters: r.whyItMatters ?? r.whyMatters ?? '',
  }));
}

function normalizeChecklist(checklist) {
  if (!Array.isArray(checklist)) return [];
  return checklist.map((c) => ({
    roundTitle: c.roundTitle ?? c.round ?? '',
    items: Array.isArray(c.items) ? c.items : [],
  }));
}

function normalizePlan7Days(plan) {
  if (!Array.isArray(plan)) return [];
  return plan.map((p) => ({
    day: p.day ?? '',
    focus: p.focus ?? p.day ?? '',
    tasks: Array.isArray(p.tasks) ? p.tasks : [],
  }));
}

/**
 * Build standard entry from runAnalysis result (no id, createdAt yet).
 */
export function normalizeAnalysisToEntry(result) {
  if (!result || typeof result !== 'object') return null;
  const now = new Date().toISOString();
  const extractedSkills = normalizeExtractedSkills(result.extractedSkills);
  const allSkills = getAllSkillsFromNormalized(extractedSkills);
  const baseScore = typeof result.baseScore === 'number'
    ? result.baseScore
    : (typeof result.readinessScore === 'number' ? result.readinessScore : 0);
  const skillConfidenceMap = result.skillConfidenceMap && typeof result.skillConfidenceMap === 'object'
    ? result.skillConfidenceMap
    : {};
  const finalScore = typeof result.finalScore === 'number'
    ? result.finalScore
    : baseScore;

  return {
    company: typeof result.company === 'string' ? result.company : '',
    role: typeof result.role === 'string' ? result.role : '',
    jdText: typeof result.jdText === 'string' ? result.jdText : '',
    extractedSkills,
    roundMapping: normalizeRoundMapping(result.roundMapping),
    checklist: normalizeChecklist(result.checklist),
    plan7Days: normalizePlan7Days(result.plan7Days ?? result.plan),
    questions: Array.isArray(result.questions) ? result.questions : [],
    baseScore,
    skillConfidenceMap,
    finalScore,
    updatedAt: result.updatedAt ?? now,
    companyIntel: result.companyIntel ?? undefined,
  };
}

/**
 * Validate required fields and types. Returns true if entry is valid.
 */
export function validateEntry(entry) {
  if (!entry || typeof entry !== 'object') return false;
  if (typeof entry.id !== 'string' || !entry.id) return false;
  if (typeof entry.createdAt !== 'string') return false;
  if (typeof entry.company !== 'string') return false;
  if (typeof entry.role !== 'string') return false;
  if (typeof entry.jdText !== 'string') return false;
  const es = entry.extractedSkills;
  if (!es || typeof es !== 'object') return false;
  const keys = ['coreCS', 'languages', 'web', 'data', 'cloud', 'testing', 'other'];
  for (const k of keys) {
    if (!Array.isArray(es[k])) return false;
  }
  if (!Array.isArray(entry.roundMapping)) return false;
  if (!Array.isArray(entry.checklist)) return false;
  if (!Array.isArray(entry.plan7Days)) return false;
  if (!Array.isArray(entry.questions)) return false;
  if (typeof entry.baseScore !== 'number') return false;
  if (typeof entry.skillConfidenceMap !== 'object' || entry.skillConfidenceMap === null) return false;
  if (typeof entry.finalScore !== 'number') return false;
  if (typeof entry.updatedAt !== 'string') return false;
  return true;
}

/**
 * Migrate old entry to standard schema. Returns normalized entry or null if corrupted.
 */
export function migrateEntry(entry) {
  if (!entry || typeof entry !== 'object') return null;
  try {
    if (validateEntry(entry)) return entry;

    const now = new Date().toISOString();
    const extractedSkills = normalizeExtractedSkills(entry.extractedSkills);
    const baseScore = typeof entry.baseScore === 'number'
      ? entry.baseScore
      : (typeof entry.readinessScore === 'number' ? entry.readinessScore : 0);
    const skillConfidenceMap = entry.skillConfidenceMap && typeof entry.skillConfidenceMap === 'object'
      ? entry.skillConfidenceMap
      : {};
    const allSkills = getAllSkillsFromNormalized(extractedSkills);
    const finalScore = typeof entry.finalScore === 'number'
      ? entry.finalScore
      : baseScore;

    return {
      id: entry.id,
      createdAt: entry.createdAt,
      company: typeof entry.company === 'string' ? entry.company : '',
      role: typeof entry.role === 'string' ? entry.role : '',
      jdText: typeof entry.jdText === 'string' ? entry.jdText : '',
      extractedSkills,
      roundMapping: normalizeRoundMapping(entry.roundMapping),
      checklist: normalizeChecklist(entry.checklist),
      plan7Days: normalizePlan7Days(entry.plan7Days ?? entry.plan),
      questions: Array.isArray(entry.questions) ? entry.questions : [],
      baseScore,
      skillConfidenceMap,
      finalScore,
      updatedAt: entry.updatedAt ?? now,
      companyIntel: entry.companyIntel ?? undefined,
    };
  } catch {
    return null;
  }
}
