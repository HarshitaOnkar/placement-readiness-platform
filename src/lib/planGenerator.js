/**
 * 7-day preparation plan adapted to detected skills.
 */

export function get7DayPlan(extractedSkills) {
  const { raw, isGeneralFresher } = extractedSkills
  const hasDSA = !!raw.coreCS?.length
  const hasWeb = !!raw.web?.length
  const hasData = !!raw.data?.length
  const hasCloud = !!raw.cloudDevOps?.length

  const day1_2 = [
    'Day 1–2: Basics + core CS',
    'Revise core CS: OOP, DBMS, OS, Networks (as per JD).',
    'Brush up aptitude: quant, logical reasoning, verbal.',
    hasDSA ? 'Start DSA: arrays, strings, two-pointer.' : 'Start basic programming and problem-solving.',
  ].filter(Boolean)

  const day3_4 = [
    'Day 3–4: DSA + coding practice',
    'Practice 5–8 DSA problems (arrays, trees, graphs).',
    'Focus on time/space complexity and edge cases.',
    hasData ? 'Revise SQL: joins, indexing, simple optimization.' : null,
  ].filter(Boolean)

  const day5 = [
    'Day 5: Project + resume alignment',
    'Map your projects to JD keywords.',
    'Prepare 2–3 project stories (problem, solution, impact).',
    hasWeb ? 'Revise frontend concepts (components, state, APIs).' : null,
    hasCloud ? 'Prepare cloud/DevOps examples from projects.' : null,
  ].filter(Boolean)

  const day6 = [
    'Day 6: Mock interview questions',
    'Practice speaking through solutions (think aloud).',
    'Prepare 10 likely questions from your stack (see generated list).',
    'Do one mock with a friend or timer.',
  ]

  const day7 = [
    'Day 7: Revision + weak areas',
    'Revise weak topics identified during the week.',
    'Quick pass on aptitude and core CS.',
    'Rest and stay calm before the interview.',
  ]

  return [
    { day: 'Day 1–2', tasks: day1_2 },
    { day: 'Day 3–4', tasks: day3_4 },
    { day: 'Day 5', tasks: day5 },
    { day: 'Day 6', tasks: day6 },
    { day: 'Day 7', tasks: day7 },
  ]
}
