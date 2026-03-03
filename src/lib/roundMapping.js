/**
 * Round mapping engine (heuristic). Based on company size + detected skills.
 * No external APIs. Returns rounds with "why this round matters".
 */

function hasCategory(extractedSkills, key) {
  return extractedSkills?.raw?.[key]?.length > 0
}

function hasDSA(extractedSkills) {
  return hasCategory(extractedSkills, 'coreCS')
}

function hasWeb(extractedSkills) {
  return hasCategory(extractedSkills, 'web')
}

function hasData(extractedSkills) {
  return hasCategory(extractedSkills, 'data')
}

export function getRoundMapping(companySize, extractedSkills) {
  const size = companySize || 'startup'
  const dsa = hasDSA(extractedSkills)
  const web = hasWeb(extractedSkills)
  const data = hasData(extractedSkills)

  if (size === 'enterprise') {
    if (dsa) {
      return [
        {
          round: 1,
          title: 'Round 1: Online Test (DSA + Aptitude)',
          description: 'Coding problems, MCQs on DSA and aptitude.',
          whyMatters: 'First filter; strong performance here gets you to technical rounds.',
        },
        {
          round: 2,
          title: 'Round 2: Technical (DSA + Core CS)',
          description: 'Live coding and CS fundamentals (DBMS, OS, Networks).',
          whyMatters: 'Validates problem-solving and core knowledge under time pressure.',
        },
        {
          round: 3,
          title: 'Round 3: Tech + Projects',
          description: 'System design or project deep-dive.',
          whyMatters: 'Shows how you apply knowledge and handle scale or trade-offs.',
        },
        {
          round: 4,
          title: 'Round 4: HR',
          description: 'Behavioral fit and expectations.',
          whyMatters: 'Final check on values, motivation, and team fit.',
        },
      ]
    }
    return [
      {
        round: 1,
        title: 'Round 1: Aptitude / Screening',
        description: 'Quant, logical reasoning, and basic technical MCQs.',
        whyMatters: 'Initial screening; consistency matters more than speed.',
      },
      {
        round: 2,
        title: 'Round 2: Technical',
        description: 'Domain-specific technical discussion.',
        whyMatters: 'Core competency check for the role.',
      },
      {
        round: 3,
        title: 'Round 3: HR',
        description: 'Behavioral and fit.',
        whyMatters: 'Alignment with company culture and role expectations.',
      },
    ]
  }

  if (size === 'mid') {
    return [
      {
        round: 1,
        title: 'Round 1: Technical / Coding',
        description: dsa ? 'DSA and coding' : 'Practical problem-solving or take-home.',
        whyMatters: 'Demonstrates hands-on ability; often the main technical filter.',
      },
      {
        round: 2,
        title: 'Round 2: Deep-dive / System',
        description: web ? 'System discussion or project walkthrough' : 'Domain deep-dive.',
        whyMatters: 'Shows depth and how you think about real problems.',
      },
      {
        round: 3,
        title: 'Round 3: Team / HR',
        description: 'Culture fit and expectations.',
        whyMatters: 'Ensures mutual fit and clarity on role.',
      },
    ]
  }

  // Startup
  if (web || data) {
    return [
      {
        round: 1,
        title: 'Round 1: Practical coding',
        description: 'Live coding or short take-home in your stack.',
        whyMatters: 'Startups care most about ability to build and ship.',
      },
      {
        round: 2,
        title: 'Round 2: System / product discussion',
        description: 'How you’d design or improve a feature or system.',
        whyMatters: 'Tests product sense and trade-off thinking.',
      },
      {
        round: 3,
        title: 'Round 3: Culture fit',
        description: 'Values, motivation, and working style.',
        whyMatters: 'Small teams need strong alignment and communication.',
      },
    ]
  }

  return [
    {
      round: 1,
      title: 'Round 1: Problem-solving',
      description: 'Coding or case-based discussion.',
      whyMatters: 'Core filter for problem-solving and communication.',
    },
    {
      round: 2,
      title: 'Round 2: Fit and expectations',
      description: 'Background and role fit.',
      whyMatters: 'Mutual fit and clarity on scope.',
    },
  ]
}
