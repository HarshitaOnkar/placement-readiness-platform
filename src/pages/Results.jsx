import { useSearchParams } from 'react-router-dom'
import { useEffect, useState, useCallback } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { getEntryById, getLatestEntry, updateEntry } from '@/lib/storage'
import { Link } from 'react-router-dom'
import {
  ArrowLeft,
  Tag,
  ListChecks,
  Calendar,
  MessageCircle,
  Copy,
  Download,
  Target,
  Building2,
  MapPin,
} from 'lucide-react'
import { computeLiveScore } from '@/lib/readinessScore.js'
import {
  getAllSkillStrings,
  extractedSkillsToByCategory,
} from '@/lib/entrySchema.js'

const DEFAULT_CONFIDENCE = 'practice'

function buildConfidenceMap(entry) {
  const map = { ...(entry.skillConfidenceMap || {}) }
  getAllSkillStrings(entry.extractedSkills).forEach((skill) => {
    if (map[skill] !== 'know' && map[skill] !== 'practice') map[skill] = DEFAULT_CONFIDENCE
  })
  return map
}

function formatPlanAsText(plan7Days) {
  if (!plan7Days?.length) return ''
  return plan7Days
    .map(
      (block) =>
        `${block.day}\n${(block.tasks || []).map((t) => `  • ${t}`).join('\n')}`
    )
    .join('\n\n')
}

function formatChecklistAsText(checklist) {
  if (!checklist?.length) return ''
  return checklist
    .map(
      (round) =>
        `${round.roundTitle || round.title || ''}\n${(round.items || []).map((i) => `  • ${i}`).join('\n')}`
    )
    .join('\n\n')
}

function formatQuestionsAsText(questions) {
  if (!questions?.length) return ''
  return questions.map((q, i) => `${i + 1}. ${q}`).join('\n')
}

export default function Results() {
  const [searchParams] = useSearchParams()
  const id = searchParams.get('id')
  const [entry, setEntry] = useState(null)
  const [skillConfidenceMap, setSkillConfidenceMap] = useState({})
  const [notFound, setNotFound] = useState(false)
  const [copyFeedback, setCopyFeedback] = useState(null)

  useEffect(() => {
    const resolved = id ? getEntryById(id) : getLatestEntry()
    if (resolved) {
      setEntry(resolved)
      setSkillConfidenceMap(buildConfidenceMap(resolved))
    } else setNotFound(true)
  }, [id])

  const persistConfidence = useCallback(
    (newMap) => {
      if (!entry?.id) return
      const baseScore = entry.baseScore ?? entry.readinessScore ?? 0
      const finalScore = computeLiveScore(baseScore, newMap)
      updateEntry(entry.id, {
        skillConfidenceMap: newMap,
        finalScore,
        updatedAt: new Date().toISOString(),
      })
    },
    [entry?.id, entry?.baseScore, entry?.readinessScore]
  )

  const toggleSkill = useCallback(
    (skill) => {
      setSkillConfidenceMap((prev) => {
        const current = prev[skill] || DEFAULT_CONFIDENCE
        const next = current === 'know' ? 'practice' : 'know'
        const newMap = { ...prev, [skill]: next }
        persistConfidence(newMap)
        return newMap
      })
    },
    [persistConfidence]
  )

  const copyToClipboard = useCallback(async (text, label) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopyFeedback(label)
      setTimeout(() => setCopyFeedback(null), 2000)
    } catch {
      setCopyFeedback('Copy failed')
    }
  }, [])

  const downloadTxt = useCallback(() => {
    if (!entry) return
    const { company: c, role: r, checklist: cl, questions: q } = entry
    const planData = entry.plan7Days ?? entry.plan ?? []
    const liveScore = computeLiveScore(entry.baseScore ?? entry.readinessScore, skillConfidenceMap)
    const sections = [
      `Placement Readiness — ${c || '—'} · ${r || '—'}`,
      `Readiness score: ${liveScore}/100`,
      '',
      '--- Round-wise checklist ---',
      formatChecklistAsText(cl),
      '',
      '--- 7-day plan ---',
      formatPlanAsText(planData),
      '',
      '--- 10 likely interview questions ---',
      formatQuestionsAsText(q),
    ]
    const blob = new Blob([sections.join('\n\n')], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `readiness-${entry.id}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }, [entry, skillConfidenceMap])

  if (notFound) {
    return (
      <div className="space-y-4">
        <Link
          to="/dashboard/analyze"
          className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Analyze
        </Link>
        <Card>
          <CardContent className="py-12 text-center text-gray-500">
            No analysis found. Run an analysis from the Analyze page first, or pick an entry from History.
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!entry) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-gray-500">Loading…</p>
      </div>
    )
  }

  const {
    company,
    role,
    createdAt,
    extractedSkills,
    checklist,
    plan7Days,
    plan,
    questions,
    baseScore,
    readinessScore: legacyReadinessScore,
    companyIntel,
    roundMapping,
  } = entry

  const baseReadinessScore = baseScore ?? legacyReadinessScore ?? 0
  const liveScore = computeLiveScore(baseReadinessScore, skillConfidenceMap)
  const dateStr = createdAt ? new Date(createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' }) : ''
  const skillsByCategory = extractedSkillsToByCategory(extractedSkills)
  const allSkills = getAllSkillStrings(extractedSkills)
  const weakSkills = allSkills
    .filter((s) => (skillConfidenceMap[s] || DEFAULT_CONFIDENCE) === 'practice')
    .slice(0, 3)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <Link
          to="/dashboard/analyze"
          className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Analyze
        </Link>
        <div className="text-sm text-gray-500">
          {company && <span>{company}</span>}
          {role && <span className="ml-2">· {role}</span>}
          {dateStr && <span className="ml-2">· {dateStr}</span>}
        </div>
      </div>

      {/* Readiness score (live) */}
      <Card>
        <CardHeader>
          <CardTitle>Readiness score</CardTitle>
          <CardDescription>
            Base score from JD. +2 per skill you know, −2 per &quot;Need practice.&quot; Updates as you toggle.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-primary">{liveScore}</span>
            <span className="text-gray-500">/ 100</span>
          </div>
        </CardContent>
      </Card>

      {/* Company Intel — only when company provided */}
      {companyIntel && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-primary" />
              Company intel
            </CardTitle>
            <CardDescription>
              Heuristic estimate from company name and JD. Not from external sources.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Company</p>
              <p className="text-gray-900 font-medium">{companyIntel.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Industry</p>
              <p className="text-gray-900">{companyIntel.industry}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Estimated size</p>
              <p className="text-gray-900">{companyIntel.sizeLabel}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Typical hiring focus</p>
              <p className="text-sm text-gray-700 leading-relaxed">{companyIntel.typicalHiringFocus}</p>
            </div>
            <p className="text-xs text-gray-500 pt-2 border-t border-gray-200">
              Demo mode: Company intel generated heuristically.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Round mapping — when company intel exists */}
      {roundMapping && roundMapping.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Round mapping
            </CardTitle>
            <CardDescription>
              Likely round flow based on company size and detected skills.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              {roundMapping.map((r, i) => (
                <div key={r.roundTitle || i} className="flex gap-4 pb-6 last:pb-0">
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-medium">
                      {r.round ?? i + 1}
                    </div>
                    {i < roundMapping.length - 1 && (
                      <div className="w-0.5 flex-1 min-h-[1rem] bg-gray-200 mt-2" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0 pt-0.5">
                    <h4 className="font-medium text-gray-900">{r.roundTitle ?? r.title}</h4>
                    <p className="text-sm text-gray-600 mt-0.5">
                      {(r.focusAreas && r.focusAreas[0]) || r.description || ''}
                    </p>
                    <p className="text-xs text-gray-500 mt-2 italic">
                      Why this round matters: {r.whyItMatters ?? r.whyMatters}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Key skills extracted — interactive toggles */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tag className="w-5 h-5 text-primary" />
            Key skills extracted
          </CardTitle>
          <CardDescription>
            Mark &quot;I know this&quot; or &quot;Need practice&quot;. Score updates in real time; choices are saved.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {skillsByCategory?.map((group) => (
              <div key={group.category} className="w-full space-y-2">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide block">
                  {group.category}
                </span>
                <div className="flex flex-wrap gap-3">
                  {group.skills?.map((s) => {
                    if (s === 'General fresher stack' || !s) {
                      return (
                        <span
                          key={s}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-primary/10 text-primary text-sm"
                        >
                          {s}
                        </span>
                      )
                    }
                    const confidence = skillConfidenceMap[s] || DEFAULT_CONFIDENCE
                    const isKnow = confidence === 'know'
                    return (
                      <div
                        key={s}
                        className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 p-1"
                      >
                        <span className="text-sm font-medium text-gray-800 px-2">{s}</span>
                        <button
                          type="button"
                          role="switch"
                          aria-checked={isKnow}
                          aria-label={`Toggle ${s} between I know this and Need practice`}
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            toggleSkill(s)
                          }}
                          className="inline-flex rounded-md border border-gray-300 bg-white shadow-sm transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1"
                        >
                          <span
                            className={`px-2.5 py-1 text-xs rounded border ${
                              !isKnow
                                ? 'bg-primary text-white border-primary'
                                : 'bg-white text-gray-600 border-gray-300'
                            }`}
                          >
                            Need practice
                          </span>
                          <span
                            className={`px-2.5 py-1 text-xs rounded border ${
                              isKnow
                                ? 'bg-primary text-white border-primary'
                                : 'bg-white text-gray-600 border-gray-300'
                            }`}
                          >
                            I know this
                          </span>
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Round-wise checklist */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ListChecks className="w-5 h-5 text-primary" />
            Round-wise preparation checklist
          </CardTitle>
          <CardDescription>Template-based items adapted to detected skills.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {checklist?.map((round, idx) => (
            <div key={round.roundTitle || round.title || idx}>
              <h4 className="font-medium text-gray-900 mb-2">{round.roundTitle || round.title}</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                {round.items?.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 7-day plan */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            7-day plan
          </CardTitle>
          <CardDescription>Adapted to detected skills.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {(plan7Days ?? plan)?.map((block) => (
            <div key={block.day}>
              <h4 className="font-medium text-gray-900 mb-2">{block.day}</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                {block.tasks?.map((task, i) => (
                  <li key={i}>{task}</li>
                ))}
              </ul>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 10 likely questions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-primary" />
            10 likely interview questions
          </CardTitle>
          <CardDescription>Based on detected skills.</CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
            {questions?.map((q, i) => (
              <li key={i}>{q}</li>
            ))}
          </ol>
        </CardContent>
      </Card>

      {/* Export tools */}
      <Card>
        <CardHeader>
          <CardTitle>Export</CardTitle>
          <CardDescription>Copy sections or download everything as a single file.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => copyToClipboard(formatPlanAsText(plan7Days ?? plan), '7-day plan')}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Copy className="w-4 h-4" /> Copy 7-day plan
          </button>
          <button
            type="button"
            onClick={() => copyToClipboard(formatChecklistAsText(checklist), 'Checklist')}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Copy className="w-4 h-4" /> Copy round checklist
          </button>
          <button
            type="button"
            onClick={() => copyToClipboard(formatQuestionsAsText(questions), '10 questions')}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Copy className="w-4 h-4" /> Copy 10 questions
          </button>
          <button
            type="button"
            onClick={downloadTxt}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-primary bg-primary text-white text-sm font-medium hover:bg-primary-hover transition-colors"
          >
            <Download className="w-4 h-4" /> Download as TXT
          </button>
          {copyFeedback && (
            <span className="text-sm text-primary ml-2 self-center">Copied: {copyFeedback}</span>
          )}
        </CardContent>
      </Card>

      {/* Action Next */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <Target className="w-5 h-5 text-primary" />
            Action next
          </CardTitle>
          <CardDescription>Focus on these first.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {weakSkills.length > 0 ? (
            <>
              <p className="text-sm font-medium text-gray-700">Top weak areas (Need practice):</p>
              <ul className="list-disc list-inside text-sm text-gray-600">
                {weakSkills.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
              <p className="text-sm text-gray-700 pt-1">
                <span className="font-medium">Suggested next step:</span> Start Day 1 plan now.
              </p>
            </>
          ) : (
            <p className="text-sm text-gray-700">
              All listed skills are marked &quot;I know this.&quot; Suggested next step: Start Day 1 plan now.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
