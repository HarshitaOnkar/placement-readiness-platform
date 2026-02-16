/**
 * Skill categories and keywords for JD parsing (case-insensitive).
 * Longer keywords (e.g. C++, C#, Next.js) are matched before shorter ones (C) to avoid false hits.
 * If JD includes none, show "General fresher stack".
 */

export const SKILL_CATEGORIES = {
  'Core CS': ['DSA', 'OOP', 'DBMS', 'OS', 'Networks'],
  'Languages': ['TypeScript', 'JavaScript', 'C++', 'C#', 'Java', 'Python', 'Go', 'C'],
  'Web': ['Next.js', 'Node.js', 'Express', 'GraphQL', 'React', 'REST'],
  'Data': ['MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'SQL'],
  'Cloud/DevOps': ['Kubernetes', 'Docker', 'CI/CD', 'AWS', 'Azure', 'GCP', 'Linux'],
  'Testing': ['Selenium', 'Cypress', 'Playwright', 'JUnit', 'PyTest'],
};

/** C must match as whole word only; and we skip C if C++ or C# appears in the JD */
function matchKeyword(textLower, keyword) {
  const kwLower = keyword.toLowerCase();
  if (kwLower === 'c') {
    if (textLower.includes('c++') || textLower.includes('c#')) return false;
    return new RegExp('\\b' + kwLower + '\\b').test(textLower);
  }
  return textLower.includes(kwLower);
}

/**
 * @param {string} jdText
 * @returns {{ byCategory: Record<string, string[]>, categoryNames: string[], isGeneralFresher: boolean }}
 */
export function extractSkills(jdText) {
  const text = (jdText || '').trim();
  const textLower = text.toLowerCase();
  const byCategory = {};
  const categoryNames = [];

  for (const [category, keywords] of Object.entries(SKILL_CATEGORIES)) {
    const found = [];
    for (const kw of keywords) {
      if (matchKeyword(textLower, kw)) {
        const display = kw.charAt(0).toUpperCase() + kw.slice(1);
        if (!found.includes(display)) found.push(display);
      }
    }
    if (found.length) {
      byCategory[category] = found;
      categoryNames.push(category);
    }
  }

  const isGeneralFresher = categoryNames.length === 0;
  if (isGeneralFresher) {
    byCategory['General'] = ['General fresher stack'];
    categoryNames.push('General');
  }

  return { byCategory, categoryNames, isGeneralFresher };
}
