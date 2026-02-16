import { useSearchParams } from 'react-router-dom';
import { useMemo, useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from '../../components/ui/ShadcnCard';
import { getEntryById, getLatestId, updateEntry } from '../../lib/history';
import { getCompanyIntel, getRoundMapping } from '../../lib/companyIntel';
import { getDisplaySkills, getAllSkillsFromNormalized } from '../../lib/schema';

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleDateString(undefined, { dateStyle: 'medium' });
  } catch {
    return iso;
  }
}

/** Live score: base + 2 per "know", -2 per "practice". Bounds 0–100. */
function computeLiveScore(baseScore, skillConfidenceMap, allSkills) {
  let knowCount = 0;
  let practiceCount = 0;
  for (const skill of allSkills) {
    const c = skillConfidenceMap[skill];
    if (c === 'know') knowCount++;
    else practiceCount++;
  }
  const score = baseScore + 2 * knowCount - 2 * practiceCount;
  return Math.min(100, Math.max(0, Math.round(score)));
}


function formatPlanAsText(plan) {
  const list = plan ?? [];
  if (!list.length) return '';
  return list
    .map((block) => `${block.day || block.focus || ''}\n${(block.tasks || []).map((t) => `  • ${t}`).join('\n')}`)
    .join('\n\n');
}

function formatChecklistAsText(checklist) {
  const list = checklist ?? [];
  if (!list.length) return '';
  return list
    .map((block) => `${block.roundTitle ?? block.round ?? ''}\n${(block.items || []).map((i) => `  • ${i}`).join('\n')}`)
    .join('\n\n');
}

function formatQuestionsAsText(questions) {
  if (!questions || !questions.length) return '';
  return questions.map((q, i) => `${i + 1}. ${q}`).join('\n');
}

function buildFullTxt(entry) {
  const { company, role, createdAt, extractedSkills, checklist, plan, plan7Days, questions, companyIntel, roundMapping } = entry;
  const byCategory = getDisplaySkills(extractedSkills);
  const planList = plan7Days ?? plan ?? [];
  const lines = [
    'Placement Readiness — Analysis',
    company || role ? [company, role].filter(Boolean).join(' · ') : 'Job description analysis',
    `Generated: ${formatDate(createdAt)}`,
    '',
  ];
  if (companyIntel) {
    lines.push(
      '--- Company intel ---',
      `Company: ${companyIntel.companyName}`,
      `Industry: ${companyIntel.industry}`,
      `Size: ${companyIntel.sizeCategory?.label ?? '—'}`,
      `Typical hiring focus: ${companyIntel.typicalHiringFocus}`,
      '',
      '--- Round mapping ---',
    );
    (roundMapping || []).forEach((s) => {
      const title = s.roundTitle ?? `${s.round || ''} ${s.title || ''}`.trim();
      const why = s.whyItMatters ?? s.whyMatters ?? '';
      lines.push(title, `  ${why}`);
    });
    lines.push('');
  }
  lines.push(
    '--- Key skills extracted ---',
    ...Object.entries(byCategory).flatMap(([cat, skills]) => [
      cat,
      ...(skills || []).map((s) => `  ${s}`),
    ]),
    '',
    '--- Round-wise preparation checklist ---',
    formatChecklistAsText(checklist),
    '',
    '--- 7-day plan ---',
    formatPlanAsText(planList),
    '',
    '--- 10 likely interview questions ---',
    formatQuestionsAsText(questions),
  );
  return lines.join('\n');
}

export default function ResultsPage() {
  const [searchParams] = useSearchParams();
  const idFromUrl = searchParams.get('id');
  const id = idFromUrl || getLatestId();
  const entry = useMemo(() => (id ? getEntryById(id) : null), [id]);

  const byCategory = useMemo(() => getDisplaySkills(entry?.extractedSkills), [entry?.extractedSkills]);
  const allSkills = useMemo(() => getAllSkillsFromNormalized(entry?.extractedSkills), [entry?.extractedSkills]);
  const baseScore = entry?.baseScore ?? entry?.readinessScore ?? 0;

  const [skillConfidenceMap, setSkillConfidenceMap] = useState(() => entry?.skillConfidenceMap ?? {});

  useEffect(() => {
    if (entry?.id) setSkillConfidenceMap(entry.skillConfidenceMap ?? {});
  }, [entry?.id]);

  const handleSetConfidence = useCallback(
    (skill, value) => {
      const next = { ...skillConfidenceMap, [skill]: value };
      setSkillConfidenceMap(next);
      if (entry?.id) {
        const newFinalScore = computeLiveScore(baseScore, next, allSkills);
        updateEntry(entry.id, {
          skillConfidenceMap: next,
          finalScore: newFinalScore,
          updatedAt: new Date().toISOString(),
        });
      }
    },
    [entry?.id, skillConfidenceMap, baseScore, allSkills]
  );

  const liveScore = useMemo(
    () => computeLiveScore(baseScore, skillConfidenceMap, allSkills),
    [baseScore, skillConfidenceMap, allSkills]
  );

  const circumference = 2 * Math.PI * 45;
  const strokeDashOffset = circumference - (liveScore / 100) * circumference;

  const practiceSkills = useMemo(
    () => allSkills.filter((s) => skillConfidenceMap[s] !== 'know'),
    [allSkills, skillConfidenceMap]
  );
  const top3Weak = practiceSkills.slice(0, 3);

  const companyIntel = useMemo(() => {
    if (entry?.companyIntel) return entry.companyIntel;
    if (entry?.company?.trim()) return getCompanyIntel(entry.company, entry.jdText);
    return null;
  }, [entry?.companyIntel, entry?.company, entry?.jdText]);

  const roundMapping = useMemo(() => {
    if (entry?.roundMapping?.length) return entry.roundMapping;
    return getRoundMapping(companyIntel, entry?.extractedSkills ?? {});
  }, [entry?.roundMapping, entry?.extractedSkills, companyIntel]);

  useEffect(() => {
    if (!entry?.id || !entry.company?.trim()) return;
    const hasIntel = entry.companyIntel != null && entry.roundMapping != null;
    if (hasIntel) return;
    const intel = getCompanyIntel(entry.company, entry.jdText);
    const skillsForMapping = entry.extractedSkills && 'byCategory' in entry.extractedSkills
      ? entry.extractedSkills
      : { byCategory: getDisplaySkills(entry.extractedSkills) };
    const mapping = getRoundMapping(intel, skillsForMapping);
    updateEntry(entry.id, { companyIntel: intel ?? undefined, roundMapping: mapping });
  }, [entry?.id, entry?.company, entry?.jdText, entry?.extractedSkills, entry?.companyIntel, entry?.roundMapping]);

  const copyToClipboard = useCallback(async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      return false;
    }
  }, []);

  const [copyFeedback, setCopyFeedback] = useState('');
  const showCopyFeedback = (label) => {
    setCopyFeedback(label);
    setTimeout(() => setCopyFeedback(''), 2000);
  };

  const handleCopyPlan = useCallback(() => {
    const text = formatPlanAsText(entry?.plan7Days ?? entry?.plan);
    copyToClipboard(text).then((ok) => ok && showCopyFeedback('7-day plan'));
  }, [entry?.plan7Days, entry?.plan, copyToClipboard]);

  const handleCopyChecklist = useCallback(() => {
    const text = formatChecklistAsText(entry?.checklist);
    copyToClipboard(text).then((ok) => ok && showCopyFeedback('Checklist'));
  }, [entry?.checklist, copyToClipboard]);

  const handleCopyQuestions = useCallback(() => {
    const text = formatQuestionsAsText(entry?.questions);
    copyToClipboard(text).then((ok) => ok && showCopyFeedback('10 questions'));
  }, [entry?.questions, copyToClipboard]);

  const handleDownloadTxt = useCallback(() => {
    if (!entry) return;
    const blob = new Blob([buildFullTxt(entry)], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `placement-readiness-${entry.company || 'analysis'}-${entry.id.slice(0, 12)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }, [entry]);

  if (!entry) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-slate-900">Results</h2>
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-slate-600">No analysis found. Run one from the Analyze page first.</p>
            <Link
              to="/dashboard/analyze"
              className="mt-4 inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
            >
              Go to Analyze
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { company, role, createdAt, extractedSkills, checklist, plan, plan7Days, questions } = entry;
  const checklistList = checklist ?? [];
  const planList = plan7Days ?? plan ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Analysis result</h2>
          <p className="mt-1 text-slate-600">
            {company || role ? [company, role].filter(Boolean).join(' · ') : 'Job description analysis'} — {formatDate(createdAt)}
          </p>
        </div>
        <Link
          to="/dashboard/history"
          className="text-sm font-medium text-primary hover:underline"
        >
          View history
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Readiness score</CardTitle>
            <CardDescription>Base from analysis; updates with your skill self-assessment.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="relative w-40 h-40">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" className="text-slate-200" />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeLinecap="round"
                  className="text-primary"
                  style={{ strokeDasharray: circumference, strokeDashOffset }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-slate-900">{liveScore}/100</span>
                <span className="text-sm text-slate-500 mt-0.5">Readiness score</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Key skills extracted</CardTitle>
            <CardDescription>Toggle per skill. Your choices are saved to this analysis.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(byCategory).filter(([, skills]) => (skills || []).length > 0).map(([category, skills]) => (
                <div key={category}>
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">{category}</span>
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    {(skills || []).map((skill) => {
                      const confidence = skillConfidenceMap[skill] ?? 'practice';
                      return (
                        <div
                          key={skill}
                          className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-slate-50/80 overflow-hidden"
                        >
                          <span className="px-2 py-0.5 text-sm font-medium text-slate-800">{skill}</span>
                          <span className="flex border-l border-slate-200">
                            <button
                              type="button"
                              onClick={() => handleSetConfidence(skill, 'know')}
                              className={`px-1.5 py-0.5 text-xs font-medium transition-colors ${
                                confidence === 'know'
                                  ? 'bg-primary text-primary-foreground'
                                  : 'text-slate-500 hover:bg-slate-200'
                              }`}
                            >
                              I know
                            </button>
                            <button
                              type="button"
                              onClick={() => handleSetConfidence(skill, 'practice')}
                              className={`px-1.5 py-0.5 text-xs font-medium transition-colors ${
                                confidence === 'practice'
                                  ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                  : 'text-slate-500 hover:bg-slate-200'
                              }`}
                            >
                              Need practice
                            </button>
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {companyIntel && (
        <>
          <p className="text-xs text-slate-500 italic">Demo Mode: Company intel generated heuristically.</p>
          <Card>
            <CardHeader>
              <CardTitle>Company intel</CardTitle>
              <CardDescription>Inferred from company name and JD (no external data).</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-500 block">Company</span>
                  <span className="font-medium text-slate-900">{companyIntel.companyName}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Industry</span>
                  <span className="font-medium text-slate-900">{companyIntel.industry}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Estimated size</span>
                  <span className="font-medium text-slate-900">{companyIntel.sizeCategory?.label ?? '—'}</span>
                </div>
              </div>
              <div>
                <span className="text-slate-500 block text-sm mb-1">Typical hiring focus</span>
                <p className="text-slate-700 text-sm">{companyIntel.typicalHiringFocus}</p>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {roundMapping?.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Round mapping</CardTitle>
            <CardDescription>Expected interview flow based on company size and detected skills.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative flex flex-col">
              {(roundMapping || []).map((step, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="flex flex-col items-center shrink-0">
                    <div className="w-8 h-8 rounded-full border-2 border-primary bg-white flex items-center justify-center text-xs font-semibold text-primary z-[1]">
                      {idx + 1}
                    </div>
                    {idx < roundMapping.length - 1 && (
                      <div className="w-0.5 flex-1 min-h-[2rem] bg-slate-200 mt-1 mb-1" aria-hidden />
                    )}
                  </div>
                  <div className="flex-1 min-w-0 pb-6 last:pb-0 pt-0.5">
                    <h4 className="font-semibold text-slate-900">{step.roundTitle ?? `${step.round ?? ''}: ${step.title ?? ''}`.trim()}</h4>
                    <p className="text-sm text-slate-600 mt-1">{step.whyItMatters ?? step.whyMatters ?? ''}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Export</CardTitle>
          <CardDescription>Copy sections or download everything as a single file.</CardDescription>
        </CardHeader>
        <CardContent id="export" className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleCopyPlan}
            className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Copy 7-day plan
          </button>
          <button
            type="button"
            onClick={handleCopyChecklist}
            className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Copy round checklist
          </button>
          <button
            type="button"
            onClick={handleCopyQuestions}
            className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Copy 10 questions
          </button>
          <button
            type="button"
            onClick={handleDownloadTxt}
            className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Download as TXT
          </button>
          {copyFeedback && (
            <span className="inline-flex items-center text-sm text-slate-500 ml-2">Copied: {copyFeedback}</span>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Round-wise preparation checklist</CardTitle>
          <CardDescription>5–8 items per round based on detected skills.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {checklistList.map((block, idx) => (
              <div key={block.roundTitle ?? block.round ?? idx}>
                <h4 className="font-semibold text-slate-900 mb-2">{block.roundTitle ?? block.round}</h4>
                <ul className="list-disc list-inside space-y-1 text-slate-600 text-sm">
                  {(block.items || []).map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card id="7-day-plan">
        <CardHeader>
          <CardTitle>7-day plan</CardTitle>
          <CardDescription>Adapted to detected skills (e.g. React → frontend revision).</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {planList.map((block, idx) => (
              <div key={block.day ?? idx}>
                <h4 className="font-semibold text-slate-900 mb-2">{block.focus ?? block.day}</h4>
                <ul className="list-disc list-inside space-y-1 text-slate-600 text-sm">
                  {(block.tasks || []).map((task, i) => (
                    <li key={i}>{task}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>10 likely interview questions</CardTitle>
          <CardDescription>Based on detected skills (e.g. SQL → indexing; React → state management).</CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2 text-slate-700">
            {(questions || []).map((q, i) => (
              <li key={i} className="pl-1">{q}</li>
            ))}
          </ol>
        </CardContent>
      </Card>

      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="text-slate-900">Action next</CardTitle>
          <CardDescription>Focus on these to improve your readiness.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {top3Weak.length > 0 ? (
            <>
              <p className="text-sm text-slate-700">
                <span className="font-medium text-slate-900">Top weak skills (need practice):</span>{' '}
                {top3Weak.join(', ')}
              </p>
              <p className="text-sm text-slate-600">
                Suggested next step: <span className="font-medium text-slate-900">Start Day 1 plan now.</span>
              </p>
              <CardFooter className="p-0 pt-2">
                <a
                  href="#7-day-plan"
                  className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('7-day-plan')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Start Day 1 plan now
                </a>
              </CardFooter>
            </>
          ) : (
            <p className="text-sm text-slate-600">All listed skills marked as known. Keep revising and run a mock when ready.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
