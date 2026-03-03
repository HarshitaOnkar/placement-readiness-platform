import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  getTestChecklist,
  setTestChecklist,
  resetTestChecklist,
  TOTAL_TESTS,
} from '@/lib/testChecklistStorage.js'
import { CheckSquare, ArrowRight, RotateCcw } from 'lucide-react'

const TESTS = [
  {
    label: 'JD required validation works',
    hint: 'On Analyze, clear the JD and click Analyze. You should see an error and submit should not run.',
  },
  {
    label: 'Short JD warning shows for <200 chars',
    hint: 'Paste fewer than 200 characters in the JD field. The amber warning should appear below the textarea.',
  },
  {
    label: 'Skills extraction groups correctly',
    hint: 'Paste a JD with React, DSA, SQL. Run analysis. On Results, skills should appear grouped by category (e.g. Web, Core CS, Data).',
  },
  {
    label: 'Round mapping changes based on company + skills',
    hint: 'Analyze with company "Amazon" and DSA in JD → 4-round flow. With "Startup Co" and React → 3-round flow.',
  },
  {
    label: 'Score calculation is deterministic',
    hint: 'Run the same JD + company + role twice. Base score on Results should be the same both times.',
  },
  {
    label: 'Skill toggles update score live',
    hint: 'On Results, toggle a skill from "Need practice" to "I know this". The readiness score should increase by 2 immediately.',
  },
  {
    label: 'Changes persist after refresh',
    hint: 'Toggle a few skills on Results, then refresh the page or reopen from History. Toggles and score should be unchanged.',
  },
  {
    label: 'History saves and loads correctly',
    hint: 'Run an analysis, open History. Entry appears with date, company, role, score. Click it → full Results. Refresh → entry still there.',
  },
  {
    label: 'Export buttons copy the correct content',
    hint: 'On Results, click "Copy 7-day plan" then paste elsewhere. Content should match the 7-day plan section.',
  },
  {
    label: 'No console errors on core pages',
    hint: 'Open Dashboard, Analyze, Results, History. Check browser DevTools Console for errors. There should be none.',
  },
]

export default function TestChecklist() {
  const [checks, setChecks] = useState(() => getTestChecklist())

  useEffect(() => {
    setTestChecklist(checks)
  }, [checks])

  const handleToggle = (index) => {
    setChecks((prev) => {
      const next = [...prev]
      next[index] = !next[index]
      return next
    })
  }

  const handleReset = () => {
    resetTestChecklist()
    setChecks(getTestChecklist())
  }

  const passed = checks.filter(Boolean).length
  const allPassed = passed === TOTAL_TESTS

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-6 py-10">
        <div className="mb-6">
          <Link
            to="/dashboard"
            className="text-sm font-medium text-primary hover:underline"
          >
            ← Back to Dashboard
          </Link>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-primary" />
              Test checklist
            </CardTitle>
            <CardDescription>
              Complete all tests before shipping. Checklist is stored in this browser.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-lg font-semibold text-gray-900">
              Tests passed: {passed} / {TOTAL_TESTS}
            </p>
            {!allPassed && (
              <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                Fix issues before shipping.
              </p>
            )}
            <div className="flex gap-3">
              <Link
                to="/prp/08-ship"
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${
                  allPassed
                    ? 'bg-primary text-white hover:bg-primary-hover'
                    : 'border border-gray-300 bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                Go to Ship <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <RotateCcw className="w-4 h-4" /> Reset checklist
              </button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tests</CardTitle>
            <CardDescription>Check each item after verifying the behavior.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {TESTS.map((test, index) => (
                <li key={index} className="flex gap-3">
                  <input
                    type="checkbox"
                    id={`test-${index}`}
                    checked={checks[index] ?? false}
                    onChange={() => handleToggle(index)}
                    className="mt-1 w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <div className="flex-1 min-w-0">
                    <label
                      htmlFor={`test-${index}`}
                      className="font-medium text-gray-900 cursor-pointer"
                    >
                      {test.label}
                    </label>
                    {test.hint && (
                      <p className="text-sm text-gray-500 mt-1">How to test: {test.hint}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}