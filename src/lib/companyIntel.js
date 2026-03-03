/**
 * Company intel (heuristic only). No external APIs or scraping.
 * Industry guess from keywords; size from known-company list or default Startup.
 */

const ENTERPRISE_NAMES = [
  'amazon', 'infosys', 'tcs', 'tata consultancy', 'wipro', 'microsoft', 'google',
  'meta', 'facebook', 'apple', 'accenture', 'capgemini', 'cognizant', 'ibm',
  'oracle', 'salesforce', 'adobe', 'netflix', 'spotify', 'uber', 'paypal',
  'goldman sachs', 'morgan stanley', 'jpmorgan', 'deloitte', 'ey ', 'kpmg', 'pwc',
  'hcl', 'tech mahindra', 'ltimindtree', 'lti ', 'mindtree', 'cipla', 'tata motors',
]

const MID_SIZE_HINTS = ['scale', 'growth-stage', 'series b', 'series c', 'mid-size']

const INDUSTRY_KEYWORDS = [
  { keywords: ['finance', 'banking', 'investment', 'insurance'], industry: 'Financial Services' },
  { keywords: ['health', 'pharma', 'medical', 'biotech'], industry: 'Healthcare & Life Sciences' },
  { keywords: ['retail', 'ecommerce', 'e-commerce', 'marketplace'], industry: 'Retail & E‑commerce' },
  { keywords: ['education', 'edtech', 'learning'], industry: 'Education & EdTech' },
  { keywords: ['travel', 'hospitality', 'booking'], industry: 'Travel & Hospitality' },
  { keywords: ['automotive', 'auto', 'vehicle'], industry: 'Automotive' },
  { keywords: ['telecom', 'communication'], industry: 'Telecom' },
]

const DEFAULT_INDUSTRY = 'Technology Services'

function normalize(s) {
  return (s || '').toLowerCase().trim()
}

export function getCompanyIntel(companyName, jdText = '') {
  const name = (companyName || '').trim()
  if (!name) return null

  const combined = `${normalize(name)} ${normalize(jdText).slice(0, 1500)}`

  // Size: known list → Enterprise; mid hints → Mid-size; else Startup
  let size = 'startup'
  let sizeLabel = 'Startup (<200)'
  const nameOnly = normalize(name)
  if (ENTERPRISE_NAMES.some((n) => nameOnly.includes(n) || nameOnly.replace(/\s/g, '').includes(n.replace(/\s/g, '')))) {
    size = 'enterprise'
    sizeLabel = 'Enterprise (2000+)'
  } else if (MID_SIZE_HINTS.some((h) => combined.includes(h))) {
    size = 'mid'
    sizeLabel = 'Mid-size (200–2000)'
  }

  // Industry: first keyword match in company + JD snippet
  let industry = DEFAULT_INDUSTRY
  for (const { keywords, industry: ind } of INDUSTRY_KEYWORDS) {
    if (keywords.some((k) => combined.includes(k))) {
      industry = ind
      break
    }
  }

  // Typical Hiring Focus (template by size)
  let typicalHiringFocus = ''
  if (size === 'enterprise') {
    typicalHiringFocus = 'Structured DSA and core CS fundamentals; standardized online tests and technical rounds; emphasis on scalability and system design.'
  } else if (size === 'mid') {
    typicalHiringFocus = 'Balance of problem-solving and hands-on stack; may include take-home or live coding; team fit and ownership matter.'
  } else {
    typicalHiringFocus = 'Practical problem-solving and stack depth; fewer formal rounds; culture fit and ability to ship quickly.'
  }

  return {
    name,
    industry,
    size,
    sizeLabel,
    typicalHiringFocus,
  }
}
