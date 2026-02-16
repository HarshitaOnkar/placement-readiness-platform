/**
 * Company Intel + Round Mapping (heuristic, no scraping).
 * Demo mode: inferred from company name and JD keywords.
 */

const ENTERPRISE_NAMES = [
  'amazon', 'infosys', 'tcs', 'tata consultancy', 'wipro', 'accenture', 'microsoft', 'google',
  'capgemini', 'cognizant', 'hcl', 'ibm', 'oracle', 'tata motors', 'tata steel', 'tech mahindra',
  'larsen', 'l&t', 'reliance', 'tcs', 'dell', 'hp', 'cisco', 'salesforce', 'adobe', 'sap',
  'intel', 'nvidia', 'qualcomm', 'goldman sachs', 'morgan stanley', 'jpmorgan', 'barclays',
];

function normalizeCompany(name) {
  return (name || '').trim().toLowerCase();
}

function isEnterprise(companyName) {
  const n = normalizeCompany(companyName);
  if (!n) return false;
  return ENTERPRISE_NAMES.some((ent) => n.includes(ent) || ent.includes(n));
}

/**
 * Infer industry from JD or company name. Default: Technology Services.
 */
function inferIndustry(companyName, jdText) {
  const text = `${(companyName || '')} ${(jdText || '')}`.toLowerCase();
  if (/\b(finance|banking|investment|trading)\b/.test(text)) return 'Financial Services';
  if (/\b(retail|ecommerce|e-commerce)\b/.test(text)) return 'Retail';
  if (/\b(healthcare|health|medical|pharma)\b/.test(text)) return 'Healthcare';
  if (/\b(manufacturing|automotive|logistics)\b/.test(text)) return 'Manufacturing & Logistics';
  return 'Technology Services';
}

/**
 * Size: Startup (<200), Mid-size (200–2000), Enterprise (2000+).
 * Known list → Enterprise. Unknown → Startup.
 */
function getSizeCategory(companyName) {
  if (!companyName || !String(companyName).trim()) return null;
  if (isEnterprise(companyName)) return { label: 'Enterprise (2000+)', value: 'enterprise' };
  return { label: 'Startup (<200)', value: 'startup' };
}

/**
 * Typical Hiring Focus (template text by size).
 */
function getTypicalHiringFocus(sizeValue) {
  if (sizeValue === 'enterprise') {
    return 'Structured DSA and core CS fundamentals; standardized online tests and technical rounds.';
  }
  if (sizeValue === 'startup') {
    return 'Practical problem-solving and stack depth; system design and culture fit.';
  }
  return 'Mix of fundamentals and practical coding; technical and behavioral rounds.';
}

/**
 * @param {string} companyName
 * @param {string} jdText
 * @returns {{ companyName: string, industry: string, sizeCategory: { label: string, value: string }, typicalHiringFocus: string } | null }
 */
export function getCompanyIntel(companyName, jdText) {
  const name = (companyName || '').trim();
  if (!name) return null;

  const sizeCategory = getSizeCategory(name);
  if (!sizeCategory) return null;

  return {
    companyName: name,
    industry: inferIndustry(name, jdText),
    sizeCategory,
    typicalHiringFocus: getTypicalHiringFocus(sizeCategory.value),
  };
}

const ROUND_WHY = {
  onlineTest: 'Filters for basic aptitude and coding speed; often elimination round.',
  technicalDsa: 'Deep dive into data structures and algorithms; expect live coding.',
  techProjects: 'Validates real-world experience and how you apply your stack.',
  hr: 'Assesses fit, motivation, and communication; be ready with STAR examples.',
  practicalCoding: 'Tests hands-on coding and problem-solving in your stack.',
  systemDiscussion: 'Evaluates design thinking and trade-offs.',
  cultureFit: 'Checks alignment with values and team dynamics.',
};

/**
 * Round mapping based on company size and detected skills.
 * @param {{ sizeCategory: { value: string } } | null} companyIntel
 * @param {{ byCategory: Record<string, string[]>, categoryNames: string[] }} extractedSkills
 * @returns {{ round: string, title: string, whyMatters: string }[]}
 */
export function getRoundMapping(companyIntel, extractedSkills) {
  const size = companyIntel?.sizeCategory?.value ?? 'startup';
  const byCategory = extractedSkills?.byCategory ?? {};
  const has = (cat) => (byCategory[cat]?.length ?? 0) > 0;
  const hasDsaOrCore = has('Core CS');
  const hasWeb = has('Web');

  if (size === 'enterprise' && hasDsaOrCore) {
    return [
      { round: 'Round 1', title: 'Online Test (DSA + Aptitude)', whyMatters: ROUND_WHY.onlineTest },
      { round: 'Round 2', title: 'Technical (DSA + Core CS)', whyMatters: ROUND_WHY.technicalDsa },
      { round: 'Round 3', title: 'Tech + Projects', whyMatters: ROUND_WHY.techProjects },
      { round: 'Round 4', title: 'HR', whyMatters: ROUND_WHY.hr },
    ];
  }

  if (size === 'enterprise') {
    return [
      { round: 'Round 1', title: 'Online Test (Aptitude + Basics)', whyMatters: ROUND_WHY.onlineTest },
      { round: 'Round 2', title: 'Technical (Stack + Fundamentals)', whyMatters: ROUND_WHY.technicalDsa },
      { round: 'Round 3', title: 'Tech + Projects', whyMatters: ROUND_WHY.techProjects },
      { round: 'Round 4', title: 'HR', whyMatters: ROUND_WHY.hr },
    ];
  }

  if (size === 'startup' && hasWeb) {
    return [
      { round: 'Round 1', title: 'Practical coding', whyMatters: ROUND_WHY.practicalCoding },
      { round: 'Round 2', title: 'System discussion', whyMatters: ROUND_WHY.systemDiscussion },
      { round: 'Round 3', title: 'Culture fit', whyMatters: ROUND_WHY.cultureFit },
    ];
  }

  if (size === 'startup') {
    return [
      { round: 'Round 1', title: 'Coding / Problem-solving', whyMatters: ROUND_WHY.practicalCoding },
      { round: 'Round 2', title: 'Technical deep dive', whyMatters: ROUND_WHY.technicalDsa },
      { round: 'Round 3', title: 'Culture fit', whyMatters: ROUND_WHY.cultureFit },
    ];
  }

  return [
    { round: 'Round 1', title: 'Screening (Aptitude / Coding)', whyMatters: ROUND_WHY.onlineTest },
    { round: 'Round 2', title: 'Technical', whyMatters: ROUND_WHY.technicalDsa },
    { round: 'Round 3', title: 'HR / Fit', whyMatters: ROUND_WHY.hr },
  ];
}
